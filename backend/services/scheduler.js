const cron = require('node-cron');
const { runAllChecks, seedDefaultSources, addMissingSources, cleanupPastExams, getStaleExams } = require('./scraper');

let scraperJob = null;
let cleanupJob = null;

function startScheduler() {
  seedDefaultSources().catch(err => {
    console.error('[Scheduler] Failed to seed sources:', err.message);
  });

  addMissingSources().catch(err => {
    console.error('[Scheduler] Failed to add missing sources:', err.message);
  });

  // Run every 2 hours
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

  console.log('[Scheduler] Exam auto-update scheduler started (every 2 hours IST).');
  console.log('[Scheduler] Daily cleanup scheduled (midnight IST).');
}

function stopScheduler() {
  if (scraperJob) {
    scraperJob.stop();
    scraperJob = null;
  }
  if (cleanupJob) {
    cleanupJob.stop();
    cleanupJob = null;
  }
  console.log('[Scheduler] All schedulers stopped.');
}

module.exports = { startScheduler, stopScheduler };
