export { default } from '@/views/Exams';

export async function getStaticProps() {
  return { props: {}, revalidate: 3600 };
}
