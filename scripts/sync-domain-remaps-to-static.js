#!/usr/bin/env node
/**
 * Apply the REMAP table from .github/workflows/remap-dead-domains.yml to
 * frontend/src/data/examsData.js.
 *
 * WHY THIS EXISTS
 * The remap workflow rewrites hostnames on Exam documents and nothing else. The
 * static catalogue is what the site serves whenever the API is unavailable, so
 * after that workflow ran on 30 Aug 2026 the two stores disagreed: the database
 * pointed at tgpsc.gov.in and esb.mp.gov.in while the static fallback still held
 * tspsc.gov.in and peb.mp.gov.in. A user hitting the fallback would get exactly
 * the dead links the remap existed to remove.
 *
 * Same failure shape as the dateCorrections drift: a fix applied to one store
 * and not the other, invisible until the fallback is actually serving.
 *
 * The table is read out of the workflow rather than copied here, so there is one
 * source of truth for which hostnames are dead and what replaces them, and the
 * documented evidence bar for adding an entry keeps applying to both.
 *
 * Only the hostname changes; path and query survive. Dry run unless --apply.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const WORKFLOW = path.join(ROOT, '.github/workflows/remap-dead-domains.yml');
const STATIC = path.join(ROOT, 'frontend/src/data/examsData.js');
const APPLY = process.argv.includes('--apply');

/** Read `const REMAP = { ... }` out of the workflow's inline script. */
function loadRemap() {
  const src = fs.readFileSync(WORKFLOW, 'utf8');
  const start = src.indexOf('const REMAP = {');
  if (start === -1) throw new Error('REMAP table not found in the workflow');
  const open = src.indexOf('{', start);
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') {
      depth--;
      if (depth === 0) {
        // The block is YAML-indented and comment-heavy but is valid JS otherwise.
        // eslint-disable-next-line no-eval
        return eval(`(${src.slice(open, i + 1)})`);
      }
    }
  }
  throw new Error('unterminated REMAP table');
}

const REMAP = loadRemap();
const staticSrc = fs.readFileSync(STATIC, 'utf8');
// eslint-disable-next-line no-eval
const exams = eval(staticSrc.slice(
  staticSrc.indexOf('['), staticSrc.lastIndexOf(']') + 1
));

const remapUrl = (value) => {
  if (typeof value !== 'string' || !value.trim()) return null;
  let u;
  try { u = new URL(value.trim()); } catch { return null; }
  const replacement = REMAP[u.hostname.toLowerCase()];
  if (!replacement) return null;
  u.hostname = replacement;
  return u.href;
};

const planned = [];
for (const e of exams) {
  for (const field of ['officialWebsite', 'applicationLink']) {
    const next = remapUrl(e[field]);
    if (next) planned.push({ id: e._id, field, from: e[field].trim(), to: next });
  }
}

console.log(`remap entries: ${Object.keys(REMAP).length}   static exams: ${exams.length}`);
console.log(`links on a remapped host: ${planned.length}\n`);
for (const p of planned) {
  console.log(`  ${p.id.padEnd(24)} [${p.field}]`);
  console.log(`      ${p.from}  ->  ${p.to}`);
}

if (!planned.length) { console.log('\nNothing to do.'); process.exit(0); }
if (!APPLY) { console.log('\nDry run. Re-run with --apply to write these changes.'); process.exit(0); }

// Bound each replacement to its own exam's block, so a URL shared by several
// exams cannot be rewritten from the wrong record's entry.
let out = staticSrc;
let applied = 0;
for (const p of planned) {
  const anchor = `_id: '${p.id}'`;
  const at = out.indexOf(anchor);
  if (at === -1) { console.warn(`  ! block not found for ${p.id}`); continue; }
  const nextId = out.indexOf('_id: ', at + anchor.length);
  const end = nextId === -1 ? out.length : nextId;
  const block = out.slice(at, end);
  // The stored value may or may not carry a trailing slash that URL adds back,
  // so replace the exact original string rather than a normalised form.
  const replaced = block.replace(`'${p.from}'`, `'${p.to}'`);
  if (replaced === block) { console.warn(`  ! '${p.from}' not found in ${p.id}`); continue; }
  out = out.slice(0, at) + replaced + out.slice(end);
  applied++;
}

fs.writeFileSync(STATIC, out);
console.log(`\nApplied ${applied} of ${planned.length} change(s) to ${path.relative(ROOT, STATIC)}.`);
