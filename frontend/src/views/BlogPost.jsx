import React from 'react';
import { useParams, Link, Navigate } from '@/lib/router';
import { FiClock, FiCalendar, FiShare2, FiBookOpen, FiArrowRight } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import SEO from '../components/common/SEO';
import Breadcrumb from '../components/common/Breadcrumb';
import ShareButtons from '../components/common/ShareButtons';
import { blogPosts } from '../data/blogData';
import { useLanguage } from '../context/LanguageContext';

const categoryGradients = {
  Strategy: 'from-blue-600 via-cyan-600 to-blue-700',
  'Exam Guide': 'from-purple-600 via-indigo-600 to-purple-700',
  Tips: 'from-green-600 via-emerald-600 to-teal-700',
  'Current Affairs': 'from-orange-600 via-amber-600 to-orange-700',
  Career: 'from-rose-600 via-pink-600 to-rose-700',
};

const categoryExamLinks = {
  'SSC': [{ name: 'SSC CGL', path: '/exams?category=SSC' }, { name: 'SSC CHSL', path: '/exams?category=SSC' }],
  'Banking': [{ name: 'IBPS PO', path: '/exams?category=Banking' }, { name: 'SBI PO', path: '/exams?category=Banking' }],
  'UPSC': [{ name: 'UPSC CSE', path: '/exams?category=UPSC' }, { name: 'UPSC CDS', path: '/exams?category=UPSC' }],
  'Railways': [{ name: 'RRB NTPC', path: '/exams?category=Railways' }],
  'Defence': [{ name: 'NDA', path: '/exams?category=Defence' }, { name: 'CDS', path: '/exams?category=Defence' }],
  'General': [{ name: 'All Exams', path: '/exams' }],
};

const BlogPost = () => {
  const { t } = useLanguage();
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  const related = blogPosts.filter(p => p.slug !== slug && (p.category === post.category || (p.tags || []).some(t => (post.tags || []).includes(t)))).slice(0, 3);

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
        article={{
          title: post.title,
          description: post.description,
          author: post.author || 'GovtExamPath',
          datePublished: post.date,
        }}
      />

      <Breadcrumb items={[{ label: 'Blog', to: '/blog' }, { label: post.title }]} />

      {/* Hero header */}
      <article>
        <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${categoryGradients[post.category] || 'from-indigo-600 via-purple-600 to-indigo-700'} p-7 sm:p-10 mb-8`}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-1/3 -translate-y-1/3" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">{post.category}</span>
              <span className="flex items-center gap-1 text-sm text-white/80"><FiCalendar className="w-3.5 h-3.5" /> {formatDate(post.date)}</span>
              <span className="flex items-center gap-1 text-sm text-white/80"><FiClock className="w-3.5 h-3.5" /> {post.readTime}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-3">{post.title}</h1>
            <p className="text-base text-white/80 max-w-2xl mb-5">{post.description}</p>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{(post.author || 'G')[0]}</span>
                </div>
                <span className="text-sm text-white/90 font-medium">By {post.author}</span>
              </div>
              <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-white/20 hover:bg-white/30 text-white rounded-xl backdrop-blur-sm transition-all border border-white/20">
                <FiShare2 className="w-4 h-4" /> {t('share')}
              </button>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <ShareButtons url={`https://govtexampath.com/blog/${slug}`} title={post.title} description={post.description} />
        </div>

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-a:text-primary-600 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-li:text-gray-600 dark:prose-li:text-gray-300 prose-img:rounded-xl prose-img:mx-auto prose-table:w-full prose-th:text-left prose-td:align-top">
          <ReactMarkdown>{post.body}</ReactMarkdown>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex-wrap">
          <span className="text-sm font-semibold text-gray-500">{t('tags')}</span>
          {post.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">{tag}</span>
          ))}
        </div>
      </article>

      {/* Related articles */}
      {related.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FiBookOpen className="w-3.5 h-3.5 text-white" />
            </div>
            {t('relatedArticles')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {related.map(r => (
              <Link key={r.slug} to={`/blog/${r.slug}`} className="group flex flex-col bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <div className={`h-[3px] bg-gradient-to-r ${categoryGradients[r.category] || 'from-indigo-500 to-purple-600'}`} />
                <div className="p-4 flex-1 flex flex-col">
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">{r.category}</span>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm group-hover:text-primary-600 transition-colors line-clamp-2 flex-1">{r.title}</h3>
                  <span className="text-xs text-gray-400 mt-2 flex items-center gap-1"><FiClock className="w-3 h-3" />{r.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Related Exams */}
      {(() => {
        const matchedCategories = Object.keys(categoryExamLinks).filter(
          cat => post.category === cat || post.tags.some(t => t === cat || t.startsWith(cat))
        );
        const examLinks = [...new Map(
          matchedCategories.flatMap(cat => categoryExamLinks[cat]).map(e => [e.name, e])
        ).values()];
        if (examLinks.length === 0 && categoryExamLinks['General']) {
          examLinks.push(...categoryExamLinks['General']);
        }
        return examLinks.length > 0 ? (
          <div className="mt-10 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-700 p-6 sm:p-8 text-white">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              {t('relatedExams')}
            </h2>
            <p className="text-blue-100 text-sm mb-5">{t('relatedExamsDesc')}</p>
            <div className="flex flex-wrap gap-3">
              {examLinks.map(exam => (
                <Link
                  key={exam.name}
                  to={exam.path}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
                >
                  {exam.name}
                  <FiArrowRight className="w-3.5 h-3.5" />
                </Link>
              ))}
            </div>
          </div>
        ) : null;
      })()}
    </div>
  );
};

export default BlogPost;
