const axios = require('axios');
const cheerio = require('cheerio');
const crypto = require('crypto');
const https = require('https');
const ExamSource = require('../models/ExamSource');
const UpdateLog = require('../models/UpdateLog');
const Exam = require('../models/Exam');
const Notification = require('../models/Notification');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const DATE_PATTERNS = [
  /(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})/g,
  /(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/gi,
  /(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})/gi,
  /(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(\d{4})/gi,
];

const EXAM_KEYWORDS = [
  'last date', 'application', 'admit card', 'exam date', 'result',
  'notification', 'recruitment', 'vacancy', 'vacancies', 'apply online',
  'registration', 'extended', 'postponed', 'rescheduled', 'revised',
  'corrigendum', 'addendum', 'important notice', 'new dates',
];

/**
 * Extract additional exam details (vacancies, applicationFee, ageLimit) from text.
 * Returns an object with only the fields that were detected.
 */
function extractExamDetails(text) {
  const details = {};
  const lower = text.toLowerCase();

  // --- Vacancies ---
  // Patterns: "X vacancies", "X posts", "total vacancies: X", "vacancies: X", "posts: X"
  const vacancyPatterns = [
    /(\d[\d,]+)\s*(?:vacancies|vacancy|posts?)\b/i,
    /(?:total\s+)?(?:vacancies|vacancy|posts?)\s*[:\-–]\s*(\d[\d,]+)/i,
    /(?:no\.?\s*of\s+)?(?:vacancies|vacancy|posts?)\s*[:\-–]?\s*(\d[\d,]+)/i,
  ];
  for (const pattern of vacancyPatterns) {
    const match = text.match(pattern);
    if (match) {
      const num = match[1] || match[2];
      if (num) {
        details.vacancies = num.replace(/,/g, '').trim();
        break;
      }
    }
  }

  // --- Application Fee ---
  // Patterns: "application fee: Rs X", "fee Rs. X", "fee: X/-"
  const feePatterns = [
    /(?:application\s+)?fee\s*[:\-–]\s*(?:rs\.?\s*)?(\d[\d,]+)/i,
    /(?:fee\s*[:\-–]?\s*)?rs\.?\s*(\d[\d,]+)/i,
    /(?:examination\s+)?fee\s*[:\-–]\s*(?:₹|inr)?\s*(\d[\d,]+)/i,
  ];
  if (lower.includes('fee') || lower.includes('rs')) {
    for (const pattern of feePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        details.applicationFee = `Rs. ${match[1].trim()}`;
        break;
      }
    }
  }

  // --- Age Limit ---
  // Patterns: "age limit: X-Y years", "minimum age: X", "maximum age: Y", "X to Y years"
  const ageLimitPatterns = [
    /age\s*(?:limit)?\s*[:\-–]\s*(\d{1,2})\s*[-–to]+\s*(\d{1,2})\s*years?/i,
    /(\d{1,2})\s*[-–to]+\s*(\d{1,2})\s*years?\s*(?:of\s+age)?/i,
    /(?:minimum|min\.?)\s*age\s*[:\-–]\s*(\d{1,2})\s*years?/i,
    /(?:maximum|max\.?)\s*age\s*[:\-–]\s*(\d{1,2})\s*years?/i,
  ];
  if (lower.includes('age')) {
    for (const pattern of ageLimitPatterns) {
      const match = text.match(pattern);
      if (match) {
        if (match[2]) {
          details.ageLimit = `${match[1]}-${match[2]} years`;
        } else if (match[1]) {
          const prefix = lower.includes('minimum') || lower.includes('min') ? 'Minimum' : 'Maximum';
          details.ageLimit = `${prefix}: ${match[1]} years`;
        }
        break;
      }
    }
  }

  return details;
}

function hashContent(text) {
  return crypto.createHash('md5').update(text).digest('hex');
}

async function fetchPage(url) {
  const response = await axios.get(url, {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
    },
    timeout: 45000,
    maxRedirects: 5,
    httpsAgent,
  });
  return response.data;
}

function extractRelevantText($, selector) {
  const el = $(selector);
  if (!el.length) return $('body').text();
  return el.text();
}

function extractNotifications($, selector) {
  const items = [];
  const el = $(selector);
  const target = el.length ? el : $('body');

  target.find('a, li, tr, p, div.notification, div.notice, div.update').each((_, elem) => {
    const text = $(elem).text().trim().replace(/\s+/g, ' ');
    const href = $(elem).attr('href') || $(elem).find('a').first().attr('href') || '';
    if (text.length > 10 && text.length < 500) {
      const hasKeyword = EXAM_KEYWORDS.some(kw => text.toLowerCase().includes(kw));
      const hasDate = DATE_PATTERNS.some(p => { p.lastIndex = 0; return p.test(text); });
      if (hasKeyword || hasDate) {
        items.push({ text, href: href.trim() });
      }
    }
  });

  const seen = new Set();
  return items.filter(item => {
    if (seen.has(item.text)) return false;
    seen.add(item.text);
    return true;
  });
}

function extractDatesFromText(text) {
  const dates = [];
  for (const pattern of DATE_PATTERNS) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(text)) !== null) {
      try {
        const parsed = new Date(match[0]);
        if (!isNaN(parsed.getTime()) && parsed.getFullYear() >= 2024) {
          dates.push({ raw: match[0], date: parsed });
        }
      } catch (_) {}
    }
  }
  return dates;
}

async function matchExamInDatabase(text, category) {
  const keywords = text
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3)
    .slice(0, 5)
    .join(' ');

  if (!keywords) return null;

  const query = { isActive: true };
  if (category) query.category = category;

  const exams = await Exam.find({
    ...query,
    $text: { $search: keywords },
  })
    .limit(3)
    .select('title category lastDate importantDates officialWebsite');

  return exams.length > 0 ? exams[0] : null;
}

async function checkSource(source) {
  try {
    const html = await fetchPage(source.url);
    const $ = cheerio.load(html);
    const text = extractRelevantText($, source.selector);
    const contentHash = hashContent(text);

    source.lastChecked = new Date();
    source.consecutiveFailures = 0;
    source.lastError = '';

    if (contentHash === source.lastContentHash) {
      await source.save();
      return { changed: false, source: source.name };
    }

    source.lastContentHash = contentHash;
    source.lastChanged = new Date();
    await source.save();

    const notifications = extractNotifications($, source.selector);

    await UpdateLog.create({
      source: source._id,
      type: 'change_detected',
      details: `Detected ${notifications.length} relevant items on ${source.name}`,
      changes: { items: notifications.slice(0, 20) },
    });

    let updatedExams = 0;
    for (const item of notifications.slice(0, 10)) {
      const exam = await matchExamInDatabase(item.text, source.category);
      if (!exam) continue;

      const dates = extractDatesFromText(item.text);
      if (dates.length === 0) continue;

      const lowerText = item.text.toLowerCase();
      const updates = {};

      if (lowerText.includes('last date') || lowerText.includes('apply') || lowerText.includes('registration')) {
        const futureDate = dates.find(d => d.date > new Date());
        if (futureDate) updates.lastDate = futureDate.date;
      }

      if (lowerText.includes('exam date') || lowerText.includes('admit card') || lowerText.includes('result')) {
        const eventType = lowerText.includes('admit card') ? 'Admit Card'
          : lowerText.includes('result') ? 'Result Date' : 'Exam Date';
        const futureDate = dates.find(d => d.date > new Date());
        if (futureDate) {
          if (!updates.$push) updates.$push = {};
          updates.$push = {
            importantDates: { event: eventType, date: futureDate.date },
          };
        }
      }

      // Extract additional details (vacancies, applicationFee, ageLimit)
      const extraDetails = extractExamDetails(item.text);
      if (extraDetails.vacancies) updates.vacancies = extraDetails.vacancies;
      if (extraDetails.applicationFee) updates.applicationFee = extraDetails.applicationFee;
      if (extraDetails.ageLimit) updates.ageLimit = extraDetails.ageLimit;

      if (Object.keys(updates).length === 0) continue;

      const { $push, ...setFields } = updates;
      const mongoUpdate = {};
      if (Object.keys(setFields).length > 0) mongoUpdate.$set = setFields;
      if ($push) mongoUpdate.$push = $push;

      await Exam.findByIdAndUpdate(exam._id, mongoUpdate);
      updatedExams++;

      await UpdateLog.create({
        source: source._id,
        type: 'exam_updated',
        exam: exam._id,
        details: `Auto-updated "${exam.title}" based on: ${item.text.substring(0, 150)}`,
        changes: { updates: setFields, item: item.text },
      });

      await Notification.create({
        title: `Exam Update: ${exam.title}`,
        message: item.text.substring(0, 200),
        type: 'update',
        exam: exam._id,
        recipients: [],
        isSent: true,
      });

      try {
        const { getIO } = require('../config/socket');
        const io = getIO();
        io.emit('new_notification', {
          title: `Exam Update: ${exam.title}`,
          message: item.text.substring(0, 200),
          type: 'update',
        });
      } catch (_) {}
    }

    return {
      changed: true,
      source: source.name,
      itemsFound: notifications.length,
      examsUpdated: updatedExams,
    };
  } catch (error) {
    source.consecutiveFailures = (source.consecutiveFailures || 0) + 1;
    source.lastError = error.message;
    source.lastChecked = new Date();

    if (source.consecutiveFailures >= 10) {
      source.isActive = false;
    }

    await source.save();

    await UpdateLog.create({
      source: source._id,
      type: 'error',
      details: `Scrape failed: ${error.message}`,
    });

    return { changed: false, source: source.name, error: error.message };
  }
}

async function runAllChecks() {
  const sources = await ExamSource.find({ isActive: true });
  console.log(`[Scraper] Checking ${sources.length} sources...`);

  const results = [];
  for (const source of sources) {
    const hoursElapsed = source.lastChecked
      ? (Date.now() - source.lastChecked.getTime()) / (1000 * 60 * 60)
      : Infinity;

    if (hoursElapsed < source.checkIntervalHours) continue;

    const result = await checkSource(source);
    results.push(result);

    // Rate limit: wait 3 seconds between requests
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  console.log(`[Scraper] Completed. ${results.filter(r => r.changed).length} sources had changes.`);
  return results;
}

async function fixExistingSourceUrls() {
  const urlFixes = {
    'UPSC Notifications': 'https://www.upsc.gov.in/',
    'SSC Latest Updates': 'https://ssc.gov.in/',
    'NTA Exam Updates': 'https://www.nta.ac.in/',
    'Defence Jobs - Indian Army': 'https://indianarmy.nic.in/Site/FormTemplete/frmTempSimple.aspx?MnId=dg1O3lNH6Wc=&ParentID=0&flag=xxRPIhiSJl0=',
    'India Post Recruitment': 'https://www.indiapost.gov.in/',
  };

  for (const [name, newUrl] of Object.entries(urlFixes)) {
    const source = await ExamSource.findOne({ name });
    if (source && source.url !== newUrl) {
      source.url = newUrl;
      source.selector = 'body';
      source.consecutiveFailures = 0;
      source.lastError = '';
      await source.save();
      console.log(`[Scraper] Fixed URL for ${name}`);
    }
  }
}

async function seedDefaultSources() {
  await fixExistingSourceUrls();

  const count = await ExamSource.countDocuments();
  if (count > 0) return;

  const defaults = [
    {
      name: 'UPSC Notifications',
      conductingBody: 'UPSC',
      category: 'UPSC',
      url: 'https://www.upsc.gov.in/',
      selector: 'body',
      checkIntervalHours: 4,
    },
    {
      name: 'SSC Latest Updates',
      conductingBody: 'SSC',
      category: 'SSC',
      url: 'https://ssc.gov.in/',
      selector: 'body',
      checkIntervalHours: 4,
    },
    {
      name: 'IBPS Notifications',
      conductingBody: 'IBPS',
      category: 'Banking',
      url: 'https://www.ibps.in/',
      selector: 'body',
      checkIntervalHours: 6,
    },
    {
      name: 'RRB Updates',
      conductingBody: 'RRB',
      category: 'Railways',
      url: 'https://www.rrbcdg.gov.in/',
      selector: 'body',
      checkIntervalHours: 6,
    },
    {
      name: 'NTA Exam Updates',
      conductingBody: 'NTA',
      category: 'Teaching',
      url: 'https://www.nta.ac.in/',
      selector: 'body',
      checkIntervalHours: 4,
    },
    {
      name: 'Defence Jobs - Indian Army',
      conductingBody: 'Indian Army',
      category: 'Defence',
      url: 'https://indianarmy.nic.in/Site/FormTemplete/frmTempSimple.aspx?MnId=dg1O3lNH6Wc=&ParentID=0&flag=xxRPIhiSJl0=',
      selector: 'body',
      checkIntervalHours: 12,
    },
    {
      name: 'India Post Recruitment',
      conductingBody: 'India Post',
      category: 'Postal',
      url: 'https://www.indiapost.gov.in/',
      selector: 'body',
      checkIntervalHours: 12,
    },
    {
      name: 'SBI Careers',
      conductingBody: 'SBI',
      category: 'Banking',
      url: 'https://www.sbi.co.in/web/careers',
      selector: 'body',
      checkIntervalHours: 6,
    },
    {
      name: 'EPFO Recruitment',
      conductingBody: 'EPFO',
      category: 'Regulatory Bodies',
      url: 'https://www.epfindia.gov.in/',
      selector: 'body',
      checkIntervalHours: 12,
    },
    {
      name: 'UIDAI Recruitment',
      conductingBody: 'UIDAI',
      category: 'Miscellaneous',
      url: 'https://uidai.gov.in/',
      selector: 'body',
      checkIntervalHours: 12,
    },
  ];

  await ExamSource.insertMany(defaults);
  console.log('[Scraper] Seeded default exam sources.');
}

/**
 * Find exams that are potentially stale:
 * - updatedAt is older than 30 days, OR
 * - lastDate has passed (exam application window is closed)
 * Logs stale exams and returns the list.
 */
async function getStaleExams() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const now = new Date();

  const staleExams = await Exam.find({
    isActive: true,
    $or: [
      { updatedAt: { $lt: thirtyDaysAgo } },
      { lastDate: { $lt: now } },
    ],
  }).select('title category lastDate updatedAt conductingBody');

  if (staleExams.length > 0) {
    console.log(`[Scraper] Found ${staleExams.length} potentially stale exams:`);
    for (const exam of staleExams) {
      const reasons = [];
      if (exam.updatedAt && exam.updatedAt < thirtyDaysAgo) {
        reasons.push('not updated in 30+ days');
      }
      if (exam.lastDate && exam.lastDate < now) {
        reasons.push('application deadline passed');
      }
      console.log(`[Scraper]   - "${exam.title}" (${exam.category}): ${reasons.join(', ')}`);
    }
  } else {
    console.log('[Scraper] No stale exams found.');
  }

  return staleExams;
}

module.exports = {
  checkSource,
  runAllChecks,
  seedDefaultSources,
  extractNotifications,
  extractDatesFromText,
  extractExamDetails,
  getStaleExams,
};
