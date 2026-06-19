const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');
const Exam = require('../models/Exam');
const UpdateLog = require('../models/UpdateLog');
const aiService = require('./aiExtractionService');

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const AGGREGATOR_URLS = [
  'https://www.sarkariresult.com/latestjob.php',
  'https://www.freejobalert.com/latest-notifications/',
  'https://www.freejobalert.com/ssc-recruitment/',
  'https://www.freejobalert.com/upsc-recruitment/',
  'https://www.freejobalert.com/bank-jobs/',
  'https://www.freejobalert.com/railway-jobs/',
  'https://www.freejobalert.com/state-psc/',
  'https://www.freejobalert.com/defence-jobs/',
  'https://www.freejobalert.com/teaching-jobs/',
];

async function fetchText(url) {
  try {
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      timeout: 20000,
      httpsAgent,
      decompress: true,
    });
    const $ = cheerio.load(res.data);
    $('script, style, nav, footer, header, .sidebar, .menu, .ad').remove();
    return $('body').text().replace(/\s+/g, ' ').trim().substring(0, 6000);
  } catch (err) {
    console.warn(`[DateVerify] Failed to fetch ${url}: ${err.message}`);
    return '';
  }
}

async function bulkVerifyDates() {
  if (!aiService.isAvailable()) {
    console.log('[DateVerify] Gemini AI not available — skipping date verification');
    return { updated: 0, verified: 0 };
  }

  const exams = await Exam.find({ isActive: true })
    .select('title category conductingBody lastDate importantDates vacancies dateStatus')
    .lean();

  if (exams.length === 0) return { updated: 0, verified: 0 };

  console.log(`[DateVerify] Verifying dates for ${exams.length} active exams...`);

  const texts = [];
  for (const url of AGGREGATOR_URLS) {
    const text = await fetchText(url);
    if (text) texts.push(text);
    await new Promise(r => setTimeout(r, 1500));
  }

  const aggregatorContent = texts.join('\n\n---\n\n').substring(0, 25000);

  if (aggregatorContent.length < 500) {
    console.warn('[DateVerify] Insufficient aggregator content — skipping');
    return { updated: 0, verified: 0 };
  }

  const examSummary = exams.map(e => {
    const lastDate = e.lastDate ? new Date(e.lastDate).toISOString().split('T')[0] : 'Not set';
    const dates = (e.importantDates || []).map(d => `${d.event}: ${new Date(d.date).toISOString().split('T')[0]}`).join(', ');
    return `- ${e.title} | Body: ${e.conductingBody || 'N/A'} | Last Date: ${lastDate} | Dates: ${dates || 'None'} | Vacancies: ${e.vacancies || 'N/A'} | Status: ${e.dateStatus || 'unknown'}`;
  }).join('\n');

  const prompt = `You are a government exam data verification expert for India. Your job is to cross-check exam dates in our database against the latest information from aggregator websites.

TODAY'S DATE: ${new Date().toISOString().split('T')[0]}

CURRENT EXAM DATA IN OUR DATABASE:
${examSummary}

LATEST INFORMATION FROM AGGREGATOR WEBSITES:
${aggregatorContent}

TASK: Compare our database dates with the aggregator information. For each exam where you find a CLEAR discrepancy or can confirm/update information, provide corrections.

CRITICAL RULES:
1. Only suggest changes when you are CONFIDENT the aggregator has newer/more accurate information
2. If an exam's application deadline has passed (before today), that's fine — just mark it confirmed
3. For exams not mentioned in the aggregator content, do NOT suggest changes
4. Dates must be in YYYY-MM-DD format
5. If our database date is already correct, mark it as "confirmed"
6. Vacancy numbers must be explicitly stated in the source content
7. Do NOT make up dates — only use dates explicitly found in the content

Respond ONLY with valid JSON (no markdown, no code blocks):
{
  "corrections": [
    {
      "title": "exact exam title from database",
      "lastDate": "YYYY-MM-DD or null if no change",
      "vacancies": "number or null if no change",
      "importantDates": [{"event": "Event Name", "date": "YYYY-MM-DD"}] or null if no change,
      "dateStatus": "confirmed or tentative",
      "reason": "brief reason for the change"
    }
  ]
}

If no corrections are needed, respond: {"corrections": []}`;

  try {
    const result = await aiService.getModel().generateContent(prompt);
    const responseText = result.response.text().trim();
    const jsonStr = responseText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const parsed = JSON.parse(jsonStr);
    if (!parsed.corrections || !Array.isArray(parsed.corrections)) {
      console.warn('[DateVerify] Invalid AI response structure');
      return { updated: 0, verified: 0 };
    }

    let updated = 0;
    let verified = 0;

    for (const correction of parsed.corrections) {
      const exam = exams.find(e => e.title === correction.title);
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

      if (correction.importantDates && correction.importantDates.length > 0) {
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
        updated++;

        await UpdateLog.create({
          type: 'exam_updated',
          exam: exam._id,
          details: `[AI DateVerify] ${correction.reason || 'Date verified and corrected'}`,
          changes: { correction, previous: { lastDate: exam.lastDate, vacancies: exam.vacancies, dateStatus: exam.dateStatus } },
        }).catch(() => {});

        console.log(`[DateVerify] Updated "${exam.title}": ${correction.reason}`);
      } else {
        verified++;
      }
    }

    console.log(`[DateVerify] Complete: ${updated} exams updated, ${verified} confirmed correct.`);
    return { updated, verified };
  } catch (err) {
    console.error('[DateVerify] AI verification failed:', err.message);
    return { updated: 0, verified: 0 };
  }
}

module.exports = { bulkVerifyDates };
