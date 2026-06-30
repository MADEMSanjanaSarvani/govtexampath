export { default } from '@/views/Blog';

export async function getStaticProps() {
  return { props: {}, revalidate: 86400 };
}
