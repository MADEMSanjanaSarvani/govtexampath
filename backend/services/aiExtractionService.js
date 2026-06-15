const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;
let model = null;

function initAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('[AI] GEMINI_API_KEY not set — AI extraction disabled, falling back to regex');
    return false;
  }
  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  console.log('[AI] Gemini AI extraction service initialized');
  return true;
}

function isAvailable() {
  return model !== null;
}

async function extractExamUpdates(scrapedText, sourceName, category, examTitles) {
  if (!model) return null;

  const examList = examTitles.slice(0, 50).map((e, i) => `${i + 1}. ${e.title} (ID: ${e.id})`).join('\n');

  const prompt = `You are an expert at extracting government exam information from Indian government website content.

SOURCE: ${sourceName} (Category: ${category})
TODAY'S DATE: ${new Date().toISOString().split('T')[0]}

ACTIVE EXAMS IN DATABASE:
${examList}

SCRAPED CONTENT:
${scrapedText.substring(0, 8000)}

TASK: Extract all exam-related updates from the scraped content. For each update found, identify:
1. Which exam from the database it belongs to (use the exact ID)
2. What type of update it is
3. Any dates, with their meaning (last date to apply, exam date, result date, admit card date, answer key date)
4. Vacancies count (only if explicitly mentioned as a number)
5. Application fee (only if explicitly mentioned)
6. Application link URL (only if a valid URL is found)

CRITICAL RULES:
- Only extract dates that are CLEARLY associated with a specific exam event (application deadline, exam date, result, admit card, answer key)
- Do NOT extract dates from website footers, copyright notices, "last updated" timestamps, or navigation elements
- Do NOT extract dates that appear to be news article publication dates rather than exam event dates
- Dates must be in 2025 or 2026 to be relevant
- Only match to exams you are CONFIDENT about — if unsure, skip it
- Vacancy numbers must be explicitly stated (e.g., "5000 vacancies" or "5000 posts"), not inferred
- Fee amounts must be explicitly stated with Rs/₹/INR prefix

Respond ONLY with valid JSON (no markdown, no code blocks). Use this exact format:
{
  "updates": [
    {
      "examId": "the exact ID from the exam list",
      "examTitle": "the exam title for logging",
      "updateType": "application_deadline|exam_date|admit_card|answer_key|result|cutoff|general",
      "summary": "brief description of the update in 1 sentence",
      "dates": [
        {
          "event": "Last Date to Apply|Exam Date|Admit Card|Answer Key|Result Date",
          "date": "YYYY-MM-DD"
        }
      ],
      "vacancies": null,
      "applicationFee": null,
      "applicationLink": null,
      "confidence": "high|medium"
    }
  ]
}

If no relevant exam updates are found, respond with: {"updates": []}`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    const jsonStr = responseText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const parsed = JSON.parse(jsonStr);

    if (!parsed.updates || !Array.isArray(parsed.updates)) {
      console.warn('[AI] Invalid response structure');
      return null;
    }

    const validated = parsed.updates.filter(u => {
      if (!u.examId || !u.updateType) return false;
      if (u.confidence === 'low') return false;
      if (u.dates) {
        u.dates = u.dates.filter(d => {
          if (!d.date || !d.event) return false;
          const date = new Date(d.date);
          if (isNaN(date.getTime())) return false;
          if (date.getFullYear() < 2025) return false;
          return true;
        });
      }
      return true;
    });

    return validated;
  } catch (err) {
    console.error('[AI] Extraction failed:', err.message);
    return null;
  }
}

async function validateExamData(examTitle, currentData, proposedChanges) {
  if (!model) return { valid: true, changes: proposedChanges };

  const prompt = `You are validating a proposed update to a government exam record.

EXAM: ${examTitle}
TODAY'S DATE: ${new Date().toISOString().split('T')[0]}

CURRENT DATA:
- Last Date: ${currentData.lastDate || 'Not set'}
- Important Dates: ${JSON.stringify(currentData.importantDates || [])}
- Vacancies: ${currentData.vacancies || 'Not set'}
- Application Fee: ${currentData.applicationFee || 'Not set'}

PROPOSED CHANGES:
${JSON.stringify(proposedChanges, null, 2)}

Validate these changes:
1. Are the dates reasonable? (Not in the past for future events, not too far in the future)
2. Do the changes make logical sense for this exam?
3. Are vacancy numbers reasonable (not zero, not unrealistically high)?
4. Would these changes improve data quality?

Respond ONLY with valid JSON:
{
  "valid": true/false,
  "reason": "brief explanation if invalid",
  "correctedChanges": null or corrected version of the changes
}`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    const jsonStr = responseText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error('[AI] Validation failed:', err.message);
    return { valid: true, changes: proposedChanges };
  }
}

function getModel() {
  return model;
}

module.exports = { initAI, isAvailable, extractExamUpdates, validateExamData, getModel };
