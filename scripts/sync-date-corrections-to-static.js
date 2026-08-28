#!/usr/bin/env node
/**
 * Apply backend/seeds/dateCorrections.js to frontend/src/data/examsData.js.
 *
 * WHY THIS EXISTS
 * dateCorrections is applied to Exam documents on every backend boot, and to
 * nothing else. The static catalogue is the fallback the site serves whenever the
 * API is unavailable, and no job has ever corrected it, so the two stores drift
 * apart in one direction. The Full Data Audit measured the result on 28 Aug 2026:
 * zero date contradictions across 495 database exams, 60 across the 215 static
 * ones, 33 of them more than 90 days apart.
 *
 * SCOPE IS DELIBERATELY NARROW: lastDate only.
 * Where the curated file covers a contradicting exam, its corrected lastDate has
 * matched that exam's own importantDates timeline and contradicted the static
 * lastDate every time — IBPS PO, UPPSC PCS and KPSC KAS all follow that shape. So
 * lastDate is the field that goes stale, which fits, since lastDate is what the
 * auto-fix workflows rewrite. importantDates is left alone: the evidence says it
 * is already right, and rewriting it would be changing the thing being used as
 * the reference.
 *
 * Dry run unless --apply is passed. Edits are surgical string replacements inside
 * each exam's own block, so comments and formatting elsewhere survive untouched.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CORRECTIONS = path.join(ROOT, 'backend/seeds/dateCorrections.js');
const STATIC = path.join(ROOT, 'frontend/src/data/examsData.js');
const APPLY = process.argv.includes('--apply');

/** Pull an array literal out of a source file by matching brackets. */
function extractArray(src, declaration) {
  const start = src.indexOf(declaration);
  if (start === -1) throw new Error(`could not find: ${declaration}`);
  const open = src.indexOf('[', start);
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '[') depth++;
    else if (src[i] === ']') {
      depth--;
      if (depth === 0) return src.slice(open, i + 1);
    }
  }
  throw new Error(`unterminated array: ${declaration}`);
}

// Titles differ in punctuation and spacing between the two files, so compare on a
// normalised form rather than requiring an exact match.
const normalise = (t) =>
  String(t || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const correctionsSrc = fs.readFileSync(CORRECTIONS, 'utf8');
const staticSrc = fs.readFileSync(STATIC, 'utf8');

// eslint-disable-next-line no-eval
const corrections = eval(extractArray(correctionsSrc, 'const corrections = ['));
// eslint-disable-next-line no-eval
const exams = eval(extractArray(staticSrc, 'export const examsData = ['));

const byTitle = new Map();
for (const c of corrections) {
  if (c && c.title && c.lastDate) byTitle.set(normalise(c.title), c);
}

const parse = (d) => {
  if (typeof d !== 'string' || !d.trim()) return null;
  const x = new Date(d);
  return isNaN(x) ? null : x;
};

const planned = [];
const skipped = { noMatch: 0, alreadyEqual: 0, noLastDate: 0 };

for (const e of exams) {
  const c = byTitle.get(normalise(e.title));
  if (!c) { skipped.noMatch++; continue; }
  if (!e.lastDate) { skipped.noLastDate++; continue; }
  if (e.lastDate === c.lastDate) { skipped.alreadyEqual++; continue; }

  // Only act where the correction agrees with this exam's own timeline. That
  // agreement is the evidence that lastDate is the stale side; without it the
  // correction and the timeline are two unreconciled claims and picking either
  // would be a guess.
  const appEnd = (e.importantDates || [])
    .find((d) => /application end|last date|application closed/i.test(d?.event || ''));
  const tl = appEnd && parse(appEnd.date);
  const corrected = parse(c.lastDate);
  const agrees = tl && corrected && tl.getTime() === corrected.getTime();

  planned.push({
    id: e._id,
    title: e.title,
    from: e.lastDate,
    to: c.lastDate,
    timeline: appEnd ? appEnd.date : null,
    agrees,
  });
}

const confident = planned.filter((p) => p.agrees);
const unconfirmed = planned.filter((p) => !p.agrees);

console.log(`corrections: ${corrections.length}   static exams: ${exams.length}`);
console.log(`matched by title: ${planned.length + skipped.alreadyEqual}`);
console.log(`  already in agreement : ${skipped.alreadyEqual}`);
console.log(`  differ, timeline confirms correction : ${confident.length}`);
console.log(`  differ, timeline does NOT confirm    : ${unconfirmed.length}`);
console.log(`unmatched static exams: ${skipped.noMatch}\n`);

if (confident.length) {
  console.log('WILL CHANGE (lastDate -> curated value, confirmed by the exam\'s own timeline):');
  for (const p of confident) {
    console.log(`  ${p.id.padEnd(24)} ${p.from}  ->  ${p.to}   [timeline ${p.timeline}]`);
  }
  console.log();
}
if (unconfirmed.length) {
  console.log('LEFT ALONE (correction and timeline disagree — needs a human):');
  for (const p of unconfirmed) {
    console.log(`  ${p.id.padEnd(24)} static=${p.from}  curated=${p.to}  timeline=${p.timeline ?? 'none'}`);
  }
  console.log();
}

if (!APPLY) {
  console.log('Dry run. Re-run with --apply to write these changes.');
  process.exit(0);
}
if (!confident.length) {
  console.log('Nothing to apply.');
  process.exit(0);
}

// Replace lastDate inside each exam's own block only. Locating the block by its
// _id and bounding the search to that block keeps a rewrite from landing on a
// different exam that happens to share a date string.
let out = staticSrc;
let applied = 0;
for (const p of confident) {
  const idAnchor = `_id: '${p.id}'`;
  const at = out.indexOf(idAnchor);
  if (at === -1) { console.warn(`  ! block not found for ${p.id}, skipped`); continue; }
  const nextId = out.indexOf('_id: ', at + idAnchor.length);
  const end = nextId === -1 ? out.length : nextId;
  const block = out.slice(at, end);
  const replaced = block.replace(`lastDate: '${p.from}'`, `lastDate: '${p.to}'`);
  if (replaced === block) { console.warn(`  ! lastDate '${p.from}' not found in ${p.id}, skipped`); continue; }
  out = out.slice(0, at) + replaced + out.slice(end);
  applied++;
}

fs.writeFileSync(STATIC, out);
console.log(`Applied ${applied} of ${confident.length} change(s) to ${path.relative(ROOT, STATIC)}.`);
