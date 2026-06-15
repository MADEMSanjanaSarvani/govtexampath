const axios = require('axios');
const Exam = require('../models/Exam');
const UpdateLog = require('../models/UpdateLog');
const aiService = require('./aiExtractionService');

const BATCH_SIZE = 8;

const SEARCH_URLS = [
  { query: 'SSC CGL CHSL MTS GD JE CPO 2026 last date apply notification', category: 'SSC' },
  { query: 'UPSC CSE NDA CDS CAPF 2026 application last date notification', category: 'UPSC' },
  { query: 'IBPS PO Clerk SO RRB SBI RBI 2026 last date apply notification', category: 'Banking' },
  { query: 'RRB NTPC Group D JE ALP RPF 2026 last date apply notification', category: 'Railways' },
  { query: 'CTET UGC NET KVS NVS 2026 last date apply notification', category: 'Teaching' },
  { query: 'AFCAT Indian Army Navy Air Force Agniveer 2026 last date', category: 'Defence' },
  { query: 'APPSC TSPSC KPSC TNPSC UPPSC MPPSC RPSC BPSC 2026 last date', category: 'State PSC' },
  { query: 'LIC AAO ADO NIACL SEBI NABARD 2026 last date apply', category: 'Insurance/Regulatory' },
  { query: 'NEET UG PG AIIMS ESIC 2026 last date apply notification', category: 'Healthcare' },
  { query: 'Delhi UP Bihar MP Police Constable SI 2026 last date apply', category: 'Police' },
  { query: 'ONGC NTPC BHEL SAIL IOCL Coal India Power Grid 2026 recruitment', category: 'PSU' },
  { query: 'India Post GDS MTS FCI ICAR GATE CAT CLAT 2026 last date', category: 'Misc' },
];

async function fetchSearchSnippets(query) {
  try {
    const url = `https://www.googleapis.com/customsearch/v1?key=${process.env.GEMINI_API_KEY}&cx=&q=${encodeURIComponent(query)}&num=5`;
    const res = await axios.get(url, { timeout: 10000 });
    if (res.data?.items) {
      return res.data.items.map(i => `${i.title}: ${i.snippet || ''}`).join('\n');
    }
    return '';
  } catch {
    return '';
  }
}

async function fetchAggregatorPage(url) {
  try {
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'Accept': 'text/html',
      },
      timeout: 15000,
    });
    const cheerio = require('cheerio');
    const $ = cheerio.load(res.data);
    $('script,style,nav,footer,header,.sidebar,.ad').remove();
    return $('body').text().replace(/\s+/g, ' ').trim().substring(0, 5000);
  } catch {
    return '';
  }
}

function buildPrompt(exams, webContent) {
  const today = new Date().toISOString().split('T')[0];

  const examList = exams.map(e => {
    const lastDate = e.lastDate ? new Date(e.lastDate).toISOString().split('T')[0] : 'Not set';
    const dates = (e.importantDates || [])
      .map(d => `${d.event}: ${d.date ? new Date(d.date).toISOString().split('T')[0] : '?'}`)
      .join(', ');
    return `- "${e.title}" | Category: ${e.category} | Body: ${e.conductingBody || 'N/A'} | Last Date to Apply: ${lastDate} | Vacancies: ${e.vacancies || 'N/A'} | Other Dates: ${dates || 'None'}`;
  }).join('\n');

  return `You are a government exam date verification expert for India. Today is ${today}.

EXAMS TO VERIFY:
${examList}

WEB CONTENT FROM AGGREGATOR SITES:
${webContent || 'No web content available.'}

TASK: Verify the exam dates. For each exam:
1. If you find matching information in the web content, use it to verify/correct dates
2. If no web content is available but you know the correct dates from your training data, provide them
3. For exams where you're not confident about dates, mark as "tentative"

CRITICAL RULES:
- Only provide dates you are CONFIDENT about from reliable Indian govt exam sources
- Use YYYY-MM-DD format
- If application deadline has passed, that's fine — mark it confirmed
- Do NOT fabricate dates — if unsure, mark tentative and leave dates unchanged
- Return null for fields that should not be changed

Respond ONLY with valid JSON (no markdown, no code blocks):
{
  "results": [
    {
      "title": "exact exam title from the list above",
      "lastDate": "YYYY-MM-DD or null if no change",
      "vacancies": "number string or null if no change",
      "importantDates": [{"event": "Event Name", "date": "YYYY-MM-DD"}] or null if no change,
      "dateStatus": "confirmed or tentative",
      "reason": "brief source/reason"
    }
  ]
}`;
}

async function verifyBatch(exams, webContent) {
  const model = aiService.getModel();
  if (!model) return [];

  const prompt = buildPrompt(exams, webContent);

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    const jsonStr = responseText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const parsed = JSON.parse(jsonStr);
    return parsed.results || [];
  } catch (err) {
    console.error(`[DateVerify] Batch failed: ${err.message}`);
    return [];
  }
}

async function bulkVerifyDates() {
  if (!aiService.isAvailable()) {
    console.log('[DateVerify] Gemini AI not available — skipping');
    return { updated: 0, verified: 0, errors: ['Gemini API key not configured'] };
  }

  const exams = await Exam.find()
    .select('title category conductingBody lastDate importantDates vacancies dateStatus isActive')
    .lean();

  if (exams.length === 0) return { updated: 0, verified: 0, errors: [] };

  console.log(`[DateVerify] Verifying ${exams.length} exams...`);

  // Try to fetch some web content for context
  let webContent = '';
  const contentSources = [
    'https://www.sarkariresult.com/latestjob.php',
    'https://www.freejobalert.com/latest-notifications/',
  ];
  for (const url of contentSources) {
    const text = await fetchAggregatorPage(url);
    if (text.length > 200) {
      webContent += text + '\n---\n';
    }
  }

  let totalUpdated = 0;
  let totalVerified = 0;
  const errors = [];

  for (let i = 0; i < exams.length; i += BATCH_SIZE) {
    const batch = exams.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(exams.length / BATCH_SIZE);

    console.log(`[DateVerify] Batch ${batchNum}/${totalBatches}`);

    try {
      const results = await verifyBatch(batch, webContent.substring(0, 15000));

      for (const correction of results) {
        const exam = batch.find(e => e.title === correction.title);
        if (!exam) continue;

        const update = {};
        let hasChanges = false;

        if (correction.lastDate) {
          const newDate = new Date(correction.lastDate);
          if (!isNaN(newDate.getTime())) {
            const oldDate = exam.lastDate ? new Date(exam.lastDate).toISOString().split('T')[0] : null;
            if (oldDate !== correction.lastDate) {
              update.lastDate = newDate;
              hasChanges = true;
            }
          }
        }

        if (correction.vacancies && correction.vacancies !== exam.vacancies) {
          update.vacancies = String(correction.vacancies);
          hasChanges = true;
        }

        if (correction.importantDates && Array.isArray(correction.importantDates) && correction.importantDates.length > 0) {
          const validDates = correction.importantDates
            .filter(d => d.event && d.date && !isNaN(new Date(d.date).getTime()))
            .map(d => ({ event: d.event, date: new Date(d.date) }));
          if (validDates.length > 0) {
            update.importantDates = validDates;
            hasChanges = true;
          }
        }

        if (correction.dateStatus) {
          update.dateStatus = correction.dateStatus;
          if (exam.dateStatus !== correction.dateStatus) hasChanges = true;
        }

        if (hasChanges) {
          await Exam.findByIdAndUpdate(exam._id, { $set: update });
          totalUpdated++;

          await UpdateLog.create({
            type: 'exam_updated',
            exam: exam._id,
            details: `[AI DateVerify] ${correction.reason || 'Verified'}`,
            changes: { correction, previous: { lastDate: exam.lastDate, vacancies: exam.vacancies, dateStatus: exam.dateStatus } },
          }).catch(() => {});

          console.log(`[DateVerify] Updated "${exam.title}": ${correction.reason}`);
        } else {
          totalVerified++;
        }
      }
    } catch (err) {
      errors.push(`Batch ${batchNum}: ${err.message}`);
      console.error(`[DateVerify] Batch ${batchNum} error:`, err.message);
    }

    if (i + BATCH_SIZE < exams.length) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  console.log(`[DateVerify] Done: ${totalUpdated} updated, ${totalVerified} confirmed, ${errors.length} errors`);
  return { updated: totalUpdated, verified: totalVerified, errors };
}

module.exports = { bulkVerifyDates };
