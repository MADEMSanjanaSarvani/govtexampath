const cron = require('node-cron');
const { runAllChecks, seedDefaultSources, addMissingSources, cleanupPastExams, getStaleExams } = require('./scraper');
const { runCurrentAffairsScrape } = require('./currentAffairsScraper');
const { bulkVerifyDates } = require('./dateVerificationService');
const { runVerification } = require('./examVerificationService');
const { sendDeadlineReminders } = require('./deadlineReminderService');

let scraperJob = null;
let cleanupJob = null;
let currentAffairsJob = null;
let dateVerifyJob = null;
let examVerificationJob = null;
let deadlineReminderJob = null;

function startScheduler() {
  seedDefaultSources().catch(err => {
    console.error('[Scheduler] Failed to seed sources:', err.message);
  });

  addMissingSources().catch(err => {
    console.error('[Scheduler] Failed to add missing sources:', err.message);
  });

  // Run exam scraper every 2 hours
  scraperJob = cron.schedule('0 */2 * * *', async () => {
    console.log(`[Scheduler] Starting automated exam check at ${new Date().toISOString()}`);
    try {
      const results = await runAllChecks();
      const changed = results.filter(r => r.changed).length;
      console.log(`[Scheduler] Done. ${changed}/${results.length} sources had updates.`);
    } catch (error) {
      console.error('[Scheduler] Error during automated check:', error.message);
    }
  }, { timezone: 'Asia/Kolkata' });

  // Daily cleanup at midnight IST
  cleanupJob = cron.schedule('0 0 * * *', async () => {
    console.log(`[Scheduler] Starting daily cleanup at ${new Date().toISOString()}`);
    try {
      await cleanupPastExams();
      await getStaleExams();
    } catch (error) {
      console.error('[Scheduler] Cleanup error:', error.message);
    }
  }, { timezone: 'Asia/Kolkata' });

  // AI date verification daily at 5 AM IST + once on startup (after 2 min delay)
  dateVerifyJob = cron.schedule('0 5 * * *', async () => {
    console.log(`[Scheduler] Starting AI date verification at ${new Date().toISOString()}`);
    try {
      const result = await bulkVerifyDates();
      console.log(`[Scheduler] Date verification done: ${result.updated} updated, ${result.verified} confirmed.`);
    } catch (error) {
      console.error('[Scheduler] Date verification error:', error.message);
    }
  }, { timezone: 'Asia/Kolkata' });

  // Run date verification 2 minutes after startup
  setTimeout(async () => {
    console.log('[Scheduler] Running initial date verification...');
    try {
      const result = await bulkVerifyDates();
      console.log(`[Scheduler] Initial verification: ${result.updated} updated, ${result.verified} confirmed.`);
    } catch (error) {
      console.error('[Scheduler] Initial date verification error:', error.message);
    }
  }, 2 * 60 * 1000);

  // Current affairs scraping twice daily: 6 AM and 6 PM IST
  currentAffairsJob = cron.schedule('0 6,18 * * *', async () => {
    console.log(`[Scheduler] Starting current affairs scrape at ${new Date().toISOString()}`);
    try {
      await runCurrentAffairsScrape();
    } catch (error) {
      console.error('[Scheduler] Current affairs scrape error:', error.message);
    }
  }, { timezone: 'Asia/Kolkata' });

  // Exam data verification daily at 3 AM IST (runs after DC corrections at startup)
  examVerificationJob = cron.schedule('0 3 * * *', async () => {
    console.log(`[Scheduler] Starting exam data verification at ${new Date().toISOString()}`);
    try {
      const result = await runVerification();
      console.log(`[Scheduler] Verification done: ${result.autoFixed} auto-fixed, ${result.queued} queued for review.`);
    } catch (error) {
      console.error('[Scheduler] Exam verification error:', error.message);
    }
  }, { timezone: 'Asia/Kolkata' });

  // Application deadline / exam day reminders daily at 8 AM IST (after the
  // 5 AM date verification, so reminders use freshly-corrected dates)
  deadlineReminderJob = cron.schedule('0 8 * * *', async () => {
    console.log(`[Scheduler] Starting deadline reminder check at ${new Date().toISOString()}`);
    try {
      const result = await sendDeadlineReminders();
      console.log(`[Scheduler] Deadline reminders done: ${result.applyDeadlinesChecked} apply-deadline exam(s), ${result.examDaysChecked} exam-day exam(s) notified.`);
    } catch (error) {
      console.error('[Scheduler] Deadline reminder error:', error.message);
    }
  }, { timezone: 'Asia/Kolkata' });

  console.log('[Scheduler] Exam auto-update scheduler started (every 2 hours IST).');
  console.log('[Scheduler] Daily cleanup scheduled (midnight IST).');
  console.log('[Scheduler] AI date verification scheduled (5 AM IST daily + startup).');
  console.log('[Scheduler] Current affairs scraper scheduled (6 AM & 6 PM IST).');
  console.log('[Scheduler] Exam data verification scheduled (3 AM IST daily).');
  console.log('[Scheduler] Deadline reminders scheduled (8 AM IST daily).');
}

function stopScheduler() {
  if (scraperJob) { scraperJob.stop(); scraperJob = null; }
  if (cleanupJob) { cleanupJob.stop(); cleanupJob = null; }
  if (dateVerifyJob) { dateVerifyJob.stop(); dateVerifyJob = null; }
  if (currentAffairsJob) { currentAffairsJob.stop(); currentAffairsJob = null; }
  if (examVerificationJob) { examVerificationJob.stop(); examVerificationJob = null; }
  if (deadlineReminderJob) { deadlineReminderJob.stop(); deadlineReminderJob = null; }
  console.log('[Scheduler] All schedulers stopped.');
}

module.exports = { startScheduler, stopScheduler };
