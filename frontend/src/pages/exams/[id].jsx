import ExamDetailPage from '@/views/ExamDetailPage';
import { examsData } from '@/data/examsData';

export default function ExamPage({ initialExam }) {
  return <ExamDetailPage initialExam={initialExam} />;
}

export async function getStaticPaths() {
  const paths = examsData.map((exam) => ({ params: { id: exam._id } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const exam = examsData.find((e) => e._id === params.id);
  if (!exam) return { notFound: true };
  return { props: { initialExam: exam } };
}
