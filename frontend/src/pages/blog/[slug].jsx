import BlogPost from '@/views/BlogPost';
import { blogPosts } from '@/data/blogData';

export default BlogPost;

export async function getStaticPaths() {
  const paths = blogPosts.map((post) => ({ params: { slug: post.slug } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return { notFound: true };
  return { props: {} };
}
