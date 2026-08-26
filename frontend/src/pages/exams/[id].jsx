import ExamDetailPage from '@/views/ExamDetailPage';
import { examsData } from '@/data/examsData';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Sent only from getStaticPaths/getStaticProps, which run at build time on the
// server -- this is deliberately not NEXT_PUBLIC, so it is never bundled into
// client JS. It exempts the build from the API's IP rate limiter; without it the
// build exceeds 300 requests per 15 minutes partway through and every remaining
// exam is generated from a 429.
const BUILD_HEADERS = process.env.BOT_API_KEY
  ? { 'x-bot-api-key': process.env.BOT_API_KEY }
  : {};

export default function ExamPage({ initialExam }) {
  return <ExamDetailPage initialExam={initialExam} />;
}

async function fetchPage(url, retries = 4) {
  let lastReason = 'unknown';
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, { headers: BUILD_HEADERS, signal: AbortSignal.timeout(30000) });
      if (res.ok) return res;
      lastReason = `HTTP ${res.status}`;
    } catch (err) {
      lastReason = err?.name === 'TimeoutError' ? 'timeout' : (err?.message || 'network error');
    }

    // The backoff used to live inside the catch, so it only applied to thrown
    // errors. A sleeping Render instance does not throw -- it answers 502/503
    // while it wakes -- so every attempt fell through with no wait and the
    // whole retry loop finished in under a second, well before the ~30s cold
    // start. Backing off on any failure is the point of the retry.
    if (attempt < retries - 1) {
      const waitMs = 15000 * (attempt + 1);
      console.warn(`  exams API: ${lastReason}, retrying in ${waitMs / 1000}s`);
      await new Promise(r => setTimeout(r, waitMs));
    }
  }
  console.warn(`  exams API: gave up on ${url} after ${retries} attempts (${lastReason})`);
  return null;
}

export async function getStaticPaths() {
  const apiIds = new Set();
  try {
    let page = 1;
    while (true) {
      const res = await fetchPage(`${API_URL}/exams?limit=300&page=${page}`);
      if (!res) break;
      const json = await res.json();
      const exams = json.data?.exams || [];
      if (!exams.length) break;
      exams.forEach(e => apiIds.add(String(e._id)));
      const { pagination } = json.data;
      if (!pagination || page >= pagination.pages) break;
      page++;
    }
  } catch {
    // Backend unavailable at build time — static fallback covers all paths
  }

  // Merge API IDs with static data so inactive/unseeded exams still get pages
  const allIds = [...apiIds];
  for (const e of examsData) {
    if (!apiIds.has(e._id)) allIds.push(e._id);
  }

  console.log(
    `  exam paths: ${apiIds.size} from API + ${allIds.length - apiIds.size} static-only = ${allIds.length} total`
  );

  // With fallback: false, a path missing here is a hard 404 in the export. So
  // when the API cannot be reached the build still succeeds, just with the
  // static catalogue alone -- and silently drops every exam whose URL is a
  // database id. That happened on 26 Aug 2026: the deploy shipped 675 files
  // where the previous release had 1476, and those pages 404ed until the next
  // good build replaced them.
  //
  // Keeping the previous release live is strictly better than replacing it
  // with a site missing most of its pages, so fail instead of shipping one.
  // Local builds with no backend are still possible via the escape hatch.
  if (apiIds.size === 0 && process.env.ALLOW_STATIC_ONLY_BUILD !== 'true') {
    throw new Error(
      'getStaticPaths: the exams API returned no ids, so only the static catalogue ' +
      'would be rendered and every database-backed exam page would 404. Refusing to ' +
      'build rather than replace a good deploy with a broken one. Check that ' +
      `${API_URL} is reachable. To build without a backend anyway (local work, ` +
      'fresh clone), set ALLOW_STATIC_ONLY_BUILD=true.'
    );
  }

  return {
    paths: allIds.map(id => ({ params: { id } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  let initialExam = null;
  try {
    const res = await fetch(`${API_URL}/exams/${params.id}`, {
      headers: BUILD_HEADERS,
      signal: AbortSignal.timeout(10000),
    });
    if (res.ok) {
      const json = await res.json();
      initialExam = json.data ?? null;
    }
  } catch {
    // Backend unavailable — fall through to static data
  }

  // Static file fallback so builds never fail
  if (!initialExam) {
    initialExam = examsData.find(e => e._id === params.id) ?? null;
  }

  return { props: { initialExam } };
}
