/**
 * Is this string a MongoDB ObjectId?
 *
 * Mongoose's findById throws a CastError when handed anything that isn't one,
 * and controllers catch that in their generic error handler and answer 500. On
 * this site that is not a rare edge case: frontend/src/data/examsData.js keys
 * its 215 exams by slug ("upsc-cms", "gate-cse"), those slugs are the _id in
 * the prerendered /exams/<id> pages, and the live database keys the same exams
 * by ObjectId. So every visit to a static exam page asks the API for a slug,
 * and every one of those answered 500 — the Render log for 2026-08-21 is
 * almost entirely "Cast to ObjectId failed for value ... for model Exam".
 *
 * The requests themselves are harmless to the reader, since examService falls
 * back to the static record. The damage is that each one spends a slot in the
 * 300-per-15-minute rate limiter, which is why the same log shows real traffic
 * to /api/exams being turned away with 429, and that genuine faults are
 * invisible in a log made of this.
 *
 * Uses an explicit 24-hex-character test rather than
 * mongoose.Types.ObjectId.isValid. That helper has accepted any 12-byte string
 * in some versions and only 24-hex in others — the installed version rejects
 * "abcdefghijkl", but a slug of exactly the wrong length silently becoming a
 * nonsense ObjectId is not a behaviour worth leaving to the dependency. The
 * regex says what is meant and does not change under an upgrade.
 */
const isObjectId = (value) => typeof value === 'string' && /^[a-f\d]{24}$/i.test(value);

module.exports = { isObjectId };
