import { examsData } from '@/data/examsData';

export { default } from '@/views/Exams';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function fetchPage(url, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
      if (res.ok) return res;
    } catch {
      // Wait before retrying to give Render free-tier time to wake up (cold start ~30s)
      if (attempt < retries - 1) await new Promise(r => setTimeout(r, 15000));
    }
  }
  return null;
}

export async function getStaticProps() {
  let initialExams = null;
  let initialTotalPages = 1;
  try {
    const res = await fetchPage(`${API_URL}/exams?limit=9&page=1`);
    if (res) {
      const json = await res.json();
      const exams = json.data?.exams;
      if (Array.isArray(exams) && exams.length) {
        initialExams = exams;
        initialTotalPages = json.data?.pagination?.pages || 1;
      }
    }
  } catch {
    // Backend unavailable at build time — fall through to static data
  }

  if (!initialExams) {
    initialExams = examsData.slice(0, 9);
    initialTotalPages = Math.ceil(examsData.length / 9) || 1;
  }

  return { props: { initialExams, initialTotalPages } };
}
