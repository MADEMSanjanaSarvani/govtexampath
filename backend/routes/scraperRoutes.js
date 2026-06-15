const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const {
  getSources,
  addSource,
  updateSource,
  deleteSource,
  triggerCheck,
  getLogs,
  getStats,
  triggerCurrentAffairsScrape,
  triggerDateVerification,
  reapplyDateCorrections,
} = require('../controllers/scraperController');

router.use(auth, adminAuth);

router.get('/stats', getStats);
router.get('/sources', getSources);
router.post('/sources', addSource);
router.put('/sources/:id', updateSource);
router.delete('/sources/:id', deleteSource);
router.post('/check', triggerCheck);
router.post('/check/:sourceId', triggerCheck);
router.post('/scrape-current-affairs', triggerCurrentAffairsScrape);
router.post('/verify-dates', triggerDateVerification);
router.post('/reapply-corrections', reapplyDateCorrections);
router.get('/logs', getLogs);

module.exports = router;
