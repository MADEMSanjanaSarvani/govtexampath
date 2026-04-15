import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiCalendar, FiShare2, FiBookOpen } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import SEO from '../components/common/SEO';
import { blogPosts } from '../data/blogData';

const BlogPost = () => {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  const related = blogPosts.filter(p => p.slug !== slug && (p.category === post.category || p.tags.some(t => post.tags.includes(t)))).slice(0, 3);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const handleShare = async () => {
    const url = `https://govtexampath.com/blog/${slug}`;
    if (navigator.share) {
      try { await navigator.share({ title: post.title, url }); } catch {}
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO
        title={post.title}
        path={`/blog/${slug}`}
        description={post.description}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.description,
          author: { '@type': 'Organization', name: 'GovtExamPath' },
          publisher: { '@type': 'Organization', name: 'GovtExamPath', logo: { '@type': 'ImageObject', url: 'https://govtexampath.com/logo512.png' } },
          datePublished: post.date,
          url: `https://govtexampath.com/blog/${slug}`,
        }}
      />

      {/* Back link */}
      <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors mb-6">
        <FiArrowLeft className="w-4 h-4" /> Back to Blog
      </Link>

      {/* Header */}
      <article>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">{post.category}</span>
            <span className="flex items-center gap-1 text-sm text-gray-400"><FiCalendar className="w-3.5 h-3.5" /> {formatDate(post.date)}</span>
            <span className="flex items-center gap-1 text-sm text-gray-400"><FiClock className="w-3.5 h-3.5" /> {post.readTime}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight mb-4">{post.title}</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">{post.description}</p>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm text-gray-500">By {post.author}</span>
            <button onClick={handleShare} className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 hover:text-primary-600 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-400 transition-all">
              <FiShare2 className="w-4 h-4" /> Share
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-a:text-primary-600 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-li:text-gray-600 dark:prose-li:text-gray-300">
          <ReactMarkdown>{post.body}</ReactMarkdown>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex-wrap">
          <span className="text-sm font-medium text-gray-500">Tags:</span>
          {post.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300">{tag}</span>
          ))}
        </div>
      </article>

      {/* Related articles */}
      {related.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <FiBookOpen className="w-5 h-5" /> Related Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {related.map(r => (
              <Link key={r.slug} to={`/blog/${r.slug}`} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all group">
                <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">{r.category}</span>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mt-1 mb-1 text-sm group-hover:text-primary-600 transition-colors line-clamp-2">{r.title}</h3>
                <span className="text-xs text-gray-400">{r.readTime}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPost;
