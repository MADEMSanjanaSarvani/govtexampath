const Exam = require('../models/Exam');
const UpdateLog = require('../models/UpdateLog');
const aiService = require('./aiExtractionService');

const BATCH_SIZE = 10;

function buildPrompt(exams) {
  const today = new Date().toISOString().split('T')[0];

  const examList = exams.map(e => {
    const lastDate = e.lastDate ? new Date(e.lastDate).toISOString().split('T')[0] : 'Not set';
    const dates = (e.importantDates || [])
      .map(d => `${d.event}: ${d.date ? new Date(d.date).toISOString().split('T')[0] : '?'}`)
      .join(', ');
    return `- "${e.title}" | Category: ${e.category} | Body: ${e.conductingBody || 'N/A'} | Last Date to Apply: ${lastDate} | Vacancies: ${e.vacancies || 'N/A'} | Other Dates: ${dates || 'None'}`;
  }).join('\n');

  return `You are a government exam date verification expert for India. Today is ${today}.

I need you to verify the following exam data against the LATEST official information available online. Search for each exam's official notification, application dates, and exam schedule from sources like the official conducting body website, Sarkari Result, FreeJobAlert, or any reliable source.

EXAMS TO VERIFY:
${examList}

For EACH exam, search online and verify:
1. Last Date to Apply — is our date correct? If the application window has reopened or extended, update it.
2. Exam Date — when is the next exam scheduled?
3. Vacancy count — is our number correct?
4. Any other important dates (result, admit card, answer key)

CRITICAL RULES:
- Only provide dates you find from RELIABLE sources (official websites, Sarkari Result, FreeJobAlert, Employment News)
- If you cannot find current info for an exam, set dateStatus to "tentative" and don't change dates
- Use YYYY-MM-DD format for all dates
- If the last date to apply has passed and no new cycle is announced yet, keep the old date and mark "confirmed"
- Vacancy numbers must come from official notifications only
- Do NOT fabricate or estimate dates

Respond ONLY with valid JSON (no markdown, no backticks):
{
  "results": [
    {
      "title": "exact exam title from the list above",
      "lastDate": "YYYY-MM-DD or null if no update needed",
      "vacancies": "number string or null if no update",
      "importantDates": [{"event": "Event Name", "date": "YYYY-MM-DD"}] or null if no update,
      "dateStatus": "confirmed or tentative",
      "reason": "brief source and reason"
    }
  ]
}`;
}

async function verifyBatch(exams) {
  const model = aiService.getModel();
  if (!model) return [];

  const prompt = buildPrompt(exams);

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      tools: [{ googleSearch: {} }],
    });

    const responseText = result.response.text().trim();
    const jsonStr = responseText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const parsed = JSON.parse(jsonStr);
    return parsed.results || [];
  } catch (err) {
    console.error(`[DateVerify] Batch verification failed: ${err.message}`);
    return [];
  }
}

async function applyCorrections(exams, results) {
  let updated = 0;
  let verified = 0;

  for (const correction of results) {
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

  return { updated, verified };
}

async function bulkVerifyDates() {
  if (!aiService.isAvailable()) {
    console.log('[DateVerify] Gemini AI not available — skipping');
    return { updated: 0, verified: 0 };
  }

  const exams = await Exam.find()
    .select('title category conductingBody lastDate importantDates vacancies dateStatus isActive')
    .lean();

  if (exams.length === 0) return { updated: 0, verified: 0 };

  console.log(`[DateVerify] Verifying dates for ${exams.length} exams in batches of ${BATCH_SIZE}...`);

  let totalUpdated = 0;
  let totalVerified = 0;

  for (let i = 0; i < exams.length; i += BATCH_SIZE) {
    const batch = exams.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(exams.length / BATCH_SIZE);

    console.log(`[DateVerify] Processing batch ${batchNum}/${totalBatches} (${batch.map(e => e.title).join(', ')})`);

    const results = await verifyBatch(batch);
    const { updated, verified } = await applyCorrections(batch, results);
    totalUpdated += updated;
    totalVerified += verified;

    if (i + BATCH_SIZE < exams.length) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  console.log(`[DateVerify] Complete: ${totalUpdated} exams updated, ${totalVerified} confirmed correct.`);
  return { updated: totalUpdated, verified: totalVerified };
}

module.exports = { bulkVerifyDates };
