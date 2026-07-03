import ExamDetailPage from '@/views/ExamDetailPage';
import { examsData } from '@/data/examsData';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ExamPage({ initialExam }) {
  return <ExamDetailPage initialExam={initialExam} />;
}

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

  return {
    paths: allIds.map(id => ({ params: { id } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  let initialExam = null;
  try {
    const res = await fetch(`${API_URL}/exams/${params.id}`, {
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
