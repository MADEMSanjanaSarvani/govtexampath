const cron = require('node-cron');
const { runAllChecks, seedDefaultSources } = require('./scraper');

let scraperJob = null;

function startScheduler() {
  seedDefaultSources().catch(err => {
    console.error('[Scheduler] Failed to seed sources:', err.message);
  });

  // Run every 4 hours: at minute 0 of hours 0, 4, 8, 12, 16, 20
  scraperJob = cron.schedule('0 */4 * * *', async () => {
    console.log(`[Scheduler] Starting automated exam check at ${new Date().toISOString()}`);
    try {
      const results = await runAllChecks();
      const changed = results.filter(r => r.changed).length;
      console.log(`[Scheduler] Done. ${changed}/${results.length} sources had updates.`);
    } catch (error) {
      console.error('[Scheduler] Error during automated check:', error.message);
    }
  }, { timezone: 'Asia/Kolkata' });

  console.log('[Scheduler] Exam auto-update scheduler started (every 4 hours IST).');
}

function stopScheduler() {
  if (scraperJob) {
    scraperJob.stop();
    scraperJob = null;
    console.log('[Scheduler] Scheduler stopped.');
  }
}

module.exports = { startScheduler, stopScheduler };
