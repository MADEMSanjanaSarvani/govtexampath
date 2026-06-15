const axios = require('axios');
const cheerio = require('cheerio');
const crypto = require('crypto');
const https = require('https');
const ExamSource = require('../models/ExamSource');
const UpdateLog = require('../models/UpdateLog');
const Exam = require('../models/Exam');
const Notification = require('../models/Notification');
const User = require('../models/User');
const aiService = require('./aiExtractionService');

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
];

function getRandomUA() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const EXAM_KEYWORDS = [
  'last date', 'application', 'admit card', 'exam date', 'result',
  'notification', 'recruitment', 'vacancy', 'vacancies', 'apply online',
  'registration', 'extended', 'postponed', 'rescheduled', 'revised',
  'corrigendum', 'addendum', 'important notice', 'new dates',
  'answer key', 'cut off', 'cut-off', 'merit list', 'interview',
  'document verification', 'skill test', 'typing test', 'physical test',
];

function extractExamDetails(text) {
  const details = {};
  const lower = text.toLowerCase();

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

  if (lower.includes('cut off') || lower.includes('cut-off') || lower.includes('cutoff')) {
    const cutoffPatterns = [
      /(?:general|ur|unreserved)\s*[:\-–]?\s*(\d+\.?\d*)/i,
      /(?:obc)\s*[:\-–]?\s*(\d+\.?\d*)/i,
      /(?:sc)\s*[:\-–]?\s*(\d+\.?\d*)/i,
      /(?:st)\s*[:\-–]?\s*(\d+\.?\d*)/i,
      /(?:ews)\s*[:\-–]?\s*(\d+\.?\d*)/i,
    ];
    const categories = ['General', 'OBC', 'SC', 'ST', 'EWS'];
    const cutoffs = [];
    cutoffPatterns.forEach((pattern, idx) => {
      const match = text.match(pattern);
      if (match && match[1]) {
        cutoffs.push({ category: categories[idx], marks: match[1] });
      }
    });
    if (cutoffs.length > 0) {
      details.cutoffs = cutoffs;
    }
  }

  return details;
}

function hashContent(text) {
  return crypto.createHash('md5').update(text).digest('hex');
}

async function fetchPage(url, retries = 1) {
  const parsedUrl = new URL(url);
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': getRandomUA(),
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Referer': `${parsedUrl.protocol}//${parsedUrl.hostname}/`,
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'same-origin',
          'Upgrade-Insecure-Requests': '1',
        },
        timeout: 30000,
        maxRedirects: 5,
        httpsAgent,
        decompress: true,
      });
      return response.data;
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, 3000 + Math.random() * 2000));
    }
  }
}

let chromiumPath = null;
let chromiumChecked = false;

function findChromium() {
  if (chromiumChecked) return chromiumPath;
  chromiumChecked = true;
  if (process.env.CHROMIUM_PATH) {
    chromiumPath = process.env.CHROMIUM_PATH;
    return chromiumPath;
  }
  const fs = require('fs');
  const paths = [
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/google-chrome',
  ];
  chromiumPath = paths.find(p => fs.existsSync(p)) || null;
  if (chromiumPath) {
    console.log('[Scraper] Found Chromium at:', chromiumPath);
  } else {
    console.warn('[Scraper] No Chromium binary found — JS-rendered pages will use static HTML fallback. Set CHROMIUM_PATH env var or install chromium.');
  }
  return chromiumPath;
}

async function fetchPageWithBrowser(url) {
  const executablePath = findChromium();
  if (!executablePath) return null;

  let browser = null;
  try {
    const puppeteer = require('puppeteer-core');
    browser = await puppeteer.launch({
      executablePath,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--single-process'],
    });
    const page = await browser.newPage();
    await page.setUserAgent(getRandomUA());
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
    await page.waitForSelector('body', { timeout: 10000 });
    const html = await page.content();
    return html;
  } catch (err) {
    console.error(`[Scraper] Browser fetch failed for ${url}:`, err.message);
    return null;
  } finally {
    if (browser) await browser.close().catch(() => {});
  }
}

/**
 * Extract only exam-relevant text from the page for smarter hashing.
 * Instead of hashing the entire body (which changes due to timestamps/counters),
 * we only hash lines that contain exam keywords.
 */
function extractRelevantText($, selector) {
  const el = $(selector);
  const rawText = el.length ? el.text() : $('body').text();
  const lines = rawText.split(/\n/).map(l => l.trim().replace(/\s+/g, ' ')).filter(l => l.length > 15);

  const relevant = lines.filter(line => {
    const lower = line.toLowerCase();
    return EXAM_KEYWORDS.some(kw => lower.includes(kw));
  });

  return relevant.length > 0 ? relevant.join('\n') : rawText.substring(0, 5000);
}

function extractNotifications($, selector) {
  const items = [];
  const el = $(selector);
  const target = el.length ? el : $('body');

  target.find('a, li, tr, p, div.notification, div.notice, div.update, span, td').each((_, elem) => {
    const text = $(elem).text().trim().replace(/\s+/g, ' ');
    const href = $(elem).attr('href') || $(elem).find('a').first().attr('href') || '';
    if (text.length > 10 && text.length < 500) {
      const hasKeyword = EXAM_KEYWORDS.some(kw => text.toLowerCase().includes(kw));
      const hasDate = /\d{1,2}[\/\-.\s](?:\d{1,2}[\/\-.\s]\d{4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})/i.test(text);
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

  const numericPattern = /(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})/g;
  let match;
  while ((match = numericPattern.exec(text)) !== null) {
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year >= 2024) {
      const parsed = new Date(year, month - 1, day);
      if (!isNaN(parsed.getTime())) {
        dates.push({ raw: match[0], date: parsed });
      }
    }
  }

  const longMonthPattern = /(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/gi;
  while ((match = longMonthPattern.exec(text)) !== null) {
    const parsed = new Date(match[0]);
    if (!isNaN(parsed.getTime()) && parsed.getFullYear() >= 2024) {
      dates.push({ raw: match[0], date: parsed });
    }
  }

  const shortMonthPattern = /(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})/gi;
  while ((match = shortMonthPattern.exec(text)) !== null) {
    const parsed = new Date(match[0]);
    if (!isNaN(parsed.getTime()) && parsed.getFullYear() >= 2024) {
      dates.push({ raw: match[0], date: parsed });
    }
  }

  const usMonthPattern = /(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(\d{4})/gi;
  while ((match = usMonthPattern.exec(text)) !== null) {
    const parsed = new Date(match[0]);
    if (!isNaN(parsed.getTime()) && parsed.getFullYear() >= 2024) {
      dates.push({ raw: match[0], date: parsed });
    }
  }

  return dates;
}

/**
 * Match a notification text to an exam in the database.
 * Strategy: first try conductingBody match, then text search, then title keywords.
 */
async function matchExamInDatabase(text, category, conductingBody) {
  const lower = text.toLowerCase();

  // Strategy 1: Direct match by conducting body + active status
  if (conductingBody) {
    const bodyExams = await Exam.find({
      isActive: true,
      conductingBody: { $regex: conductingBody, $options: 'i' },
    }).select('title category lastDate importantDates officialWebsite conductingBody').limit(10);

    if (bodyExams.length > 0) {
      // Score each exam by how many of its title words appear in the notification
      let bestMatch = null;
      let bestScore = 0;
      for (const exam of bodyExams) {
        const titleWords = exam.title.toLowerCase().split(/[\s\-–()/]+/).filter(w => w.length > 2);
        const score = titleWords.filter(w => lower.includes(w)).length;
        if (score > bestScore) {
          bestScore = score;
          bestMatch = exam;
        }
      }
      if (bestMatch && bestScore >= 2) return bestMatch;
      if (bodyExams.length === 1) return bodyExams[0];
    }
  }

  // Strategy 2: Category match with text search
  const keywords = text
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 3 && !['this', 'that', 'with', 'from', 'date', 'last', 'apply', 'exam', 'online'].includes(w.toLowerCase()))
    .slice(0, 8)
    .join(' ');

  if (!keywords) return null;

  const query = { isActive: true };
  if (category) query.category = category;

  try {
    const exams = await Exam.find({
      ...query,
      $text: { $search: keywords },
    })
      .limit(5)
      .select('title category lastDate importantDates officialWebsite conductingBody');

    if (exams.length > 0) {
      // Score matches by title word overlap
      let bestMatch = null;
      let bestScore = 0;
      for (const exam of exams) {
        const titleWords = exam.title.toLowerCase().split(/[\s\-–()/]+/).filter(w => w.length > 2);
        const score = titleWords.filter(w => lower.includes(w)).length;
        if (score > bestScore) {
          bestScore = score;
          bestMatch = exam;
        }
      }
      return bestMatch || exams[0];
    }
  } catch (err) {
    // Text index might not exist, fall through
  }

  // Strategy 3: Regex title search for known exam acronyms
  const knownExams = ['UPSC', 'SSC CGL', 'SSC CHSL', 'SSC MTS', 'SSC GD', 'IBPS PO', 'IBPS Clerk',
    'SBI PO', 'SBI Clerk', 'RRB NTPC', 'NDA', 'CDS', 'AFCAT', 'CTET', 'UGC NET', 'NEET',
    'RBI Grade B', 'SEBI', 'NABARD', 'GATE', 'CAPF', 'LIC AAO', 'FCI'];

  for (const examName of knownExams) {
    if (lower.includes(examName.toLowerCase())) {
      const found = await Exam.findOne({
        isActive: true,
        title: { $regex: examName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' },
      }).select('title category lastDate importantDates officialWebsite conductingBody');
      if (found) return found;
    }
  }

  return null;
}

/**
 * Map notification type to user preference key.
 */
function getPreferenceKey(notificationType) {
  const map = {
    exam_schedule: 'examDates',
    hall_ticket: 'admitCards',
    result: 'results',
    new_exam: 'examDates',
    update: 'general',
    reminder: 'general',
    announcement: 'general',
    general: 'general',
  };
  return map[notificationType] || 'general';
}

/**
 * Send notification via all channels (Socket, Push, Email).
 * Respects user notification preferences.
 */
async function sendNotificationToUsers(notification) {
  const prefKey = getPreferenceKey(notification.type);
  const prefFilter = { [`notificationPreferences.${prefKey}`]: { $ne: false } };

  // Socket.io broadcast (goes to all connected users — client filters)
  try {
    const { getIO } = require('../config/socket');
    const io = getIO();
    io.emit('new_notification', {
      _id: notification._id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      createdAt: notification.createdAt,
    });
  } catch (_) {}

  // Push notifications via Firebase (only to opted-in users)
  try {
    const { sendPushNotification } = require('./pushService');
    const users = await User.find({
      'fcmTokens.0': { $exists: true },
      ...prefFilter,
    }).select('fcmTokens');
    const tokens = users.flatMap((u) => u.fcmTokens.map((t) => t.token));
    if (tokens.length > 0) {
      await sendPushNotification(tokens, notification.title, notification.message, {
        type: notification.type,
        notificationId: notification._id.toString(),
      });
    }
  } catch (err) {
    console.error('[Scraper] Push notification error:', err.message);
  }

  // Web Push for browser users (offline-capable)
  try {
    const { sendWebPushToAll } = require('./webPushService');
    await sendWebPushToAll(notification.title, notification.message, {
      type: notification.type,
      notificationId: notification._id.toString(),
    });
  } catch (err) {
    console.error('[Scraper] Web push error:', err.message);
  }

  // Email (only to opted-in users with email notifications enabled)
  if (notification.sendEmail) {
    try {
      const { sendNotificationEmail, buildNotificationEmailHTML } = require('./emailService');
      const emailFilter = { ...prefFilter, 'notificationPreferences.emailNotifications': { $ne: false } };
      const users = await User.find(emailFilter).select('email name').limit(500);
      if (users.length > 0) {
        const htmlFn = (email) => buildNotificationEmailHTML(notification.title, notification.message, notification.type, email);
        await sendNotificationEmail(users, `GovtExamPath: ${notification.title}`, htmlFn);
      }
    } catch (err) {
      console.error('[Scraper] Email notification error:', err.message);
    }
  }
}

async function checkSourceWithAI(source, $, relevantText) {
  const activeExams = await Exam.find({
    isActive: true,
    ...(source.category !== 'Miscellaneous' ? { category: source.category } : {}),
  }).select('title category conductingBody lastDate importantDates vacancies applicationFee').limit(60);

  const examTitles = activeExams.map(e => ({ id: e._id.toString(), title: `${e.title} (${e.conductingBody})` }));

  const aiUpdates = await aiService.extractExamUpdates(relevantText, source.name, source.category, examTitles);
  if (!aiUpdates || aiUpdates.length === 0) return 0;

  let updatedExams = 0;
  for (const update of aiUpdates) {
    const exam = activeExams.find(e => e._id.toString() === update.examId);
    if (!exam) continue;

    const mongoUpdate = {};
    const setFields = {};

    if (update.dates && update.dates.length > 0) {
      for (const d of update.dates) {
        const dateObj = new Date(d.date);
        if (isNaN(dateObj.getTime())) continue;

        if (d.event === 'Last Date to Apply') {
          setFields.lastDate = dateObj;
        } else {
          if (!mongoUpdate.$push) mongoUpdate.$push = {};
          if (!mongoUpdate.$push.importantDates) mongoUpdate.$push.importantDates = { $each: [] };
          mongoUpdate.$push.importantDates.$each.push({ event: d.event, date: dateObj });
        }
      }
    }

    if (update.vacancies) setFields.vacancies = String(update.vacancies);
    if (update.applicationFee) setFields.applicationFee = update.applicationFee;
    if (update.applicationLink) {
      try {
        const parsed = new URL(update.applicationLink);
        if (['http:', 'https:'].includes(parsed.protocol)) {
          setFields.applicationLink = update.applicationLink;
        }
      } catch {}
    }

    if (Object.keys(setFields).length === 0 && !mongoUpdate.$push) continue;

    const validation = await aiService.validateExamData(exam.title, {
      lastDate: exam.lastDate,
      importantDates: exam.importantDates,
      vacancies: exam.vacancies,
      applicationFee: exam.applicationFee,
    }, { setFields, push: mongoUpdate.$push });

    if (!validation.valid) {
      console.log(`[Scraper/AI] Rejected update for "${exam.title}": ${validation.reason}`);
      await UpdateLog.create({
        source: source._id,
        type: 'ai_rejected',
        exam: exam._id,
        details: `AI rejected update: ${validation.reason}`,
        changes: { proposed: setFields, reason: validation.reason },
      });
      continue;
    }

    if (Object.keys(setFields).length > 0) mongoUpdate.$set = setFields;
    await Exam.findByIdAndUpdate(exam._id, mongoUpdate);
    updatedExams++;

    await UpdateLog.create({
      source: source._id,
      type: 'exam_updated',
      exam: exam._id,
      details: `[AI] Updated "${exam.title}": ${update.summary || 'auto-update'}`,
      changes: { updates: setFields, ai: true, confidence: update.confidence },
    });

    const notifTitle = update.updateType === 'cutoff' ? `Cut-Off Released: ${exam.title}`
      : update.updateType === 'result' ? `Result Update: ${exam.title}`
      : update.updateType === 'admit_card' ? `Admit Card: ${exam.title}`
      : update.updateType === 'answer_key' ? `Answer Key: ${exam.title}`
      : `Exam Update: ${exam.title}`;

    const notification = await Notification.create({
      title: notifTitle,
      message: (update.summary || `Update for ${exam.title}`).substring(0, 200),
      type: 'update',
      exam: exam._id,
      recipients: [],
      isSent: false,
      sendEmail: true,
      priority: 'high',
    });

    await sendNotificationToUsers(notification);
    notification.isSent = true;
    await notification.save();
  }

  return updatedExams;
}

async function checkSourceWithRegex(source, $, notifications) {
  let updatedExams = 0;
  for (const item of notifications.slice(0, 15)) {
    const exam = await matchExamInDatabase(item.text, source.category, source.conductingBody);
    if (!exam) continue;

    const dates = extractDatesFromText(item.text);
    const lowerText = item.text.toLowerCase();
    const updates = {};

    if (lowerText.includes('last date') || lowerText.includes('apply') || lowerText.includes('registration')) {
      const futureDate = dates.find(d => d.date > new Date());
      if (futureDate) updates.lastDate = futureDate.date;
    }

    if (lowerText.includes('exam date') || lowerText.includes('admit card') || lowerText.includes('result') || lowerText.includes('answer key')) {
      const eventType = lowerText.includes('admit card') ? 'Admit Card'
        : lowerText.includes('answer key') ? 'Answer Key'
        : lowerText.includes('result') ? 'Result Date' : 'Exam Date';
      const futureDate = dates.find(d => d.date > new Date());
      if (futureDate) {
        if (!updates.$push) updates.$push = {};
        updates.$push.importantDates = { event: eventType, date: futureDate.date };
      }
    }

    const extraDetails = extractExamDetails(item.text);
    if (extraDetails.vacancies) updates.vacancies = extraDetails.vacancies;
    if (extraDetails.applicationFee) updates.applicationFee = extraDetails.applicationFee;
    if (extraDetails.ageLimit) updates.ageLimit = extraDetails.ageLimit;
    if (extraDetails.cutoffs && extraDetails.cutoffs.length > 0) {
      const year = new Date().getFullYear().toString();
      if (!updates.$push) updates.$push = {};
      updates.$push.cutoffs = {
        $each: extraDetails.cutoffs.map(c => ({ ...c, year, stage: 'Prelims' })),
      };
    }

    if (item.href && item.href.startsWith('http') && (lowerText.includes('apply') || lowerText.includes('registration'))) {
      updates.applicationLink = item.href;
    }

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
      details: `[Regex] Updated "${exam.title}" based on: ${item.text.substring(0, 150)}`,
      changes: { updates: setFields, item: item.text },
    });

    const isCutoff = lowerText.includes('cut off') || lowerText.includes('cut-off') || lowerText.includes('cutoff') || lowerText.includes('merit list');
    const isResult = lowerText.includes('result') || lowerText.includes('answer key');
    const notifTitle = isCutoff ? `Cut-Off Released: ${exam.title}`
      : isResult ? `Result Update: ${exam.title}`
      : `Exam Update: ${exam.title}`;
    const notification = await Notification.create({
      title: notifTitle,
      message: item.text.substring(0, 200),
      type: 'update',
      exam: exam._id,
      recipients: [],
      isSent: false,
      sendEmail: true,
      priority: 'high',
    });

    await sendNotificationToUsers(notification);
    notification.isSent = true;
    await notification.save();
  }
  return updatedExams;
}

async function checkSource(source) {
  try {
    let html;

    if (source.jsRendered) {
      html = await fetchPageWithBrowser(source.url);
      if (!html) {
        html = await fetchPage(source.url);
      }
    } else {
      html = await fetchPage(source.url);
    }

    let $ = cheerio.load(html);

    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
    if (bodyText.length < 500 && !source.jsRendered) {
      console.warn(`[Scraper] ${source.name}: minimal text (${bodyText.length} chars) — retrying with browser`);
      const browserHtml = await fetchPageWithBrowser(source.url);
      if (browserHtml) {
        const $browser = cheerio.load(browserHtml);
        const browserText = $browser('body').text().replace(/\s+/g, ' ').trim();
        if (browserText.length > bodyText.length) {
          $ = $browser;
        }
      }
    }

    const relevantText = extractRelevantText($, source.selector);
    const contentHash = hashContent(relevantText);

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

    if (aiService.isAvailable()) {
      console.log(`[Scraper] Using AI extraction for ${source.name}`);
      updatedExams = await checkSourceWithAI(source, $, relevantText);
    } else {
      console.log(`[Scraper] Using regex extraction for ${source.name} (AI unavailable)`);
      updatedExams = await checkSourceWithRegex(source, $, notifications);
    }

    return {
      changed: true,
      source: source.name,
      itemsFound: notifications.length,
      examsUpdated: updatedExams,
      method: aiService.isAvailable() ? 'ai' : 'regex',
    };
  } catch (error) {
    source.consecutiveFailures = (source.consecutiveFailures || 0) + 1;
    source.lastError = error.message;
    source.lastChecked = new Date();

    if (source.consecutiveFailures >= 20) {
      source.isActive = false;
      console.log(`[Scraper] Auto-disabled ${source.name} after 20 consecutive failures`);
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

    await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 3000));
  }

  console.log(`[Scraper] Completed. ${results.filter(r => r.changed).length} sources had changes.`);
  return results;
}

async function fixExistingSourceUrls() {
  const deprecatedSources = [
    'RRB Updates',
    'Defence Jobs - Indian Army',
    'EPFO Recruitment',
    'BPSC Notifications',
    'India Post Recruitment',
    'SBI Careers',
    'UIDAI Recruitment',
    'RBI Opportunities',
    'NHAI Recruitment',
    'PIB Press Releases',
    'SSC CPO Recruitment',
    'Delhi Police Recruitment',
    'LIC Recruitment',
    'IRDAI Recruitment',
    'Supreme Court Recruitment',
    'ICAR Recruitment',
    'AIIMS Recruitment',
    'NTA NEET Updates',
    'UPPSC Notifications',
    'MPPSC Notifications',
    'TSPSC Notifications',
    'APPSC Notifications',
  ];

  for (const name of deprecatedSources) {
    const source = await ExamSource.findOne({ name });
    if (source) {
      source.isActive = false;
      await source.save();
      console.log(`[Scraper] Deactivated deprecated source: ${name} (replaced by aggregator)`);
    }
  }

  const resetSources = ['UPSC Notifications', 'SSC Latest Updates', 'NTA Exam Updates', 'IBPS Notifications'];
  for (const name of resetSources) {
    const source = await ExamSource.findOne({ name });
    if (source && (source.consecutiveFailures >= 5 || !source.isActive)) {
      source.consecutiveFailures = 0;
      source.lastError = '';
      source.isActive = true;
      await source.save();
      console.log(`[Scraper] Reset source: ${name}`);
    }
  }
}

const ALL_DEFAULT_SOURCES = [
  // ─── Primary aggregator sources (most reliable from cloud IPs) ───
  {
    name: 'Sarkari Result',
    conductingBody: 'Aggregator',
    category: 'Miscellaneous',
    url: 'https://www.sarkariresult.com/latestjob.php',
    selector: '#post, .post, .job-list, body',
    checkIntervalHours: 2,
  },
  {
    name: 'FreeJobAlert Latest',
    conductingBody: 'Aggregator',
    category: 'Miscellaneous',
    url: 'https://www.freejobalert.com/latest-notifications/',
    selector: '#post, .post, .notification-list, body',
    checkIntervalHours: 2,
  },

  // ─── UPSC ───
  {
    name: 'UPSC Notifications',
    conductingBody: 'UPSC',
    category: 'UPSC',
    url: 'https://www.upsc.gov.in/',
    selector: '#content-area, .contentArea, #exams, .exam-notification, body',
    checkIntervalHours: 4,
  },
  {
    name: 'FreeJobAlert UPSC',
    conductingBody: 'UPSC',
    category: 'UPSC',
    url: 'https://www.freejobalert.com/upsc-recruitment/',
    selector: '#post, .post, body',
    checkIntervalHours: 4,
  },

  // ─── SSC ───
  {
    name: 'SSC Latest Updates',
    conductingBody: 'SSC',
    category: 'SSC',
    url: 'https://ssc.gov.in/',
    selector: '#exams-section, .latest-update, .notification-section, #ContentPlaceHolder1, body',
    checkIntervalHours: 4,
  },
  {
    name: 'FreeJobAlert SSC',
    conductingBody: 'SSC',
    category: 'SSC',
    url: 'https://www.freejobalert.com/ssc-recruitment/',
    selector: '#post, .post, body',
    checkIntervalHours: 4,
  },

  // ─── Banking ───
  {
    name: 'IBPS Notifications',
    conductingBody: 'IBPS',
    category: 'Banking',
    url: 'https://www.ibps.in/',
    selector: '.content-area, #main-content, .notification, body',
    checkIntervalHours: 6,
  },
  {
    name: 'FreeJobAlert Banking',
    conductingBody: 'Aggregator',
    category: 'Banking',
    url: 'https://www.freejobalert.com/bank-jobs/',
    selector: '#post, .post, body',
    checkIntervalHours: 4,
  },

  // ─── Railways ───
  {
    name: 'FreeJobAlert Railway',
    conductingBody: 'RRB',
    category: 'Railways',
    url: 'https://www.freejobalert.com/railway-jobs/',
    selector: '#post, .post, body',
    checkIntervalHours: 4,
  },
  {
    name: 'Sarkari Result Railway',
    conductingBody: 'RRB',
    category: 'Railways',
    url: 'https://www.sarkariresult.com/railway/',
    selector: '#post, .post, body',
    checkIntervalHours: 6,
  },

  // ─── Teaching ───
  {
    name: 'NTA Exam Updates',
    conductingBody: 'NTA',
    category: 'Teaching',
    url: 'https://www.nta.ac.in/',
    selector: '#latestUpdates, .latest-news, .notification-area, body',
    checkIntervalHours: 4,
    jsRendered: true,
  },
  {
    name: 'FreeJobAlert Teaching',
    conductingBody: 'NTA',
    category: 'Teaching',
    url: 'https://www.freejobalert.com/teaching-jobs/',
    selector: '#post, .post, body',
    checkIntervalHours: 6,
  },

  // ─── Defence ───
  {
    name: 'FreeJobAlert Defence',
    conductingBody: 'Aggregator',
    category: 'Defence',
    url: 'https://www.freejobalert.com/defence-jobs/',
    selector: '#post, .post, body',
    checkIntervalHours: 4,
  },
  {
    name: 'DRDO Recruitment',
    conductingBody: 'DRDO',
    category: 'Defence',
    url: 'https://www.drdo.gov.in/',
    selector: '.content-area, .recruitment, body',
    checkIntervalHours: 12,
  },

  // ─── Postal ───
  {
    name: 'FreeJobAlert Postal',
    conductingBody: 'India Post',
    category: 'Postal',
    url: 'https://www.freejobalert.com/india-post-jobs/',
    selector: '#post, .post, body',
    checkIntervalHours: 6,
  },

  // ─── Police ───
  {
    name: 'FreeJobAlert Police',
    conductingBody: 'Aggregator',
    category: 'Police',
    url: 'https://www.freejobalert.com/police-jobs/',
    selector: '#post, .post, body',
    checkIntervalHours: 4,
  },

  // ─── Insurance ───
  {
    name: 'FreeJobAlert Insurance',
    conductingBody: 'Aggregator',
    category: 'Insurance',
    url: 'https://www.freejobalert.com/insurance-jobs/',
    selector: '#post, .post, body',
    checkIntervalHours: 6,
  },

  // ─── Judiciary ───
  {
    name: 'FreeJobAlert Judiciary',
    conductingBody: 'Aggregator',
    category: 'Judiciary',
    url: 'https://www.freejobalert.com/court-jobs/',
    selector: '#post, .post, body',
    checkIntervalHours: 6,
  },

  // ─── Agriculture ───
  {
    name: 'FreeJobAlert Agriculture',
    conductingBody: 'Aggregator',
    category: 'Agriculture',
    url: 'https://www.freejobalert.com/agriculture-jobs/',
    selector: '#post, .post, body',
    checkIntervalHours: 6,
  },
  {
    name: 'FCI Recruitment',
    conductingBody: 'FCI',
    category: 'Agriculture',
    url: 'https://fci.gov.in/',
    selector: '.content-area, #main-content, body',
    checkIntervalHours: 12,
  },

  // ─── Healthcare ───
  {
    name: 'FreeJobAlert Healthcare',
    conductingBody: 'Aggregator',
    category: 'Healthcare',
    url: 'https://www.freejobalert.com/medical-jobs/',
    selector: '#post, .post, body',
    checkIntervalHours: 6,
  },

  // ─── State PSC ───
  {
    name: 'FreeJobAlert State PSC',
    conductingBody: 'Aggregator',
    category: 'State PSC',
    url: 'https://www.freejobalert.com/state-psc/',
    selector: '#post, .post, body',
    checkIntervalHours: 4,
  },

  // ─── Regulatory Bodies ───
  {
    name: 'FreeJobAlert Regulatory',
    conductingBody: 'Aggregator',
    category: 'Regulatory Bodies',
    url: 'https://www.freejobalert.com/central-govt-jobs/',
    selector: '#post, .post, body',
    checkIntervalHours: 6,
  },

  // ─── PSU ───
  {
    name: 'FreeJobAlert PSU',
    conductingBody: 'Aggregator',
    category: 'PSU',
    url: 'https://www.freejobalert.com/psu-jobs/',
    selector: '#post, .post, body',
    checkIntervalHours: 6,
  },

  // ─── Miscellaneous / Multi-category ───
  {
    name: 'Employment News',
    conductingBody: 'Aggregator',
    category: 'Miscellaneous',
    url: 'https://www.employmentnews.gov.in/',
    selector: '.content-area, #main-content, body',
    checkIntervalHours: 6,
  },
];

async function addMissingSources() {
  for (const src of ALL_DEFAULT_SOURCES) {
    const exists = await ExamSource.findOne({ name: src.name });
    if (!exists) {
      await ExamSource.create(src);
      console.log(`[Scraper] Added new source: ${src.name}`);
    } else {
      let changed = false;
      if (exists.url !== src.url) {
        exists.url = src.url;
        changed = true;
      }
      if (src.jsRendered && !exists.jsRendered) {
        exists.jsRendered = true;
        changed = true;
      }
      if (!exists.isActive) {
        exists.isActive = true;
        exists.consecutiveFailures = 0;
        exists.lastError = '';
        changed = true;
      }
      if (changed) {
        await exists.save();
        console.log(`[Scraper] Updated source: ${src.name}`);
      }
    }
  }
}

async function seedDefaultSources() {
  await fixExistingSourceUrls();

  const count = await ExamSource.countDocuments();
  if (count > 0) {
    await addMissingSources();
    return;
  }

  await ExamSource.insertMany(ALL_DEFAULT_SOURCES);
  console.log('[Scraper] Seeded default exam sources.');
}

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
    for (const exam of staleExams.slice(0, 10)) {
      const reasons = [];
      if (exam.updatedAt && exam.updatedAt < thirtyDaysAgo) reasons.push('not updated in 30+ days');
      if (exam.lastDate && exam.lastDate < now) reasons.push('deadline passed');
      console.log(`[Scraper]   - "${exam.title}": ${reasons.join(', ')}`);
    }
  }

  return staleExams;
}

async function cleanupPastExams() {
  const now = new Date();
  const activeExams = await Exam.find({ isActive: true }).select('title lastDate importantDates');
  let deactivated = 0;

  for (const exam of activeExams) {
    const allDatesPast = [];
    if (exam.lastDate) allDatesPast.push(new Date(exam.lastDate) < now);
    if (exam.importantDates && exam.importantDates.length > 0) {
      exam.importantDates.forEach(d => {
        if (d.date) allDatesPast.push(new Date(d.date) < now);
      });
    }
    if (allDatesPast.length > 0 && allDatesPast.every(v => v)) {
      await Exam.findByIdAndUpdate(exam._id, { isActive: false });
      deactivated++;
      console.log(`[Scraper] Deactivated past exam: "${exam.title}"`);
    }
  }
  console.log(`[Scraper] Cleanup: deactivated ${deactivated} past exams.`);
  return deactivated;
}

module.exports = {
  checkSource,
  runAllChecks,
  seedDefaultSources,
  addMissingSources,
  cleanupPastExams,
  extractNotifications,
  extractDatesFromText,
  extractExamDetails,
  getStaleExams,
  sendNotificationToUsers,
};
