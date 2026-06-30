import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link, useSearchParams } from '@/lib/router';
import { FiSearch, FiX, FiPlus, FiChevronDown, FiArrowRight } from 'react-icons/fi';
import { examsData as staticExamsData } from '../data/examsData';
import SEO from '../components/common/SEO';
import Breadcrumb from '../components/common/Breadcrumb';
import ShareButtons from '../components/common/ShareButtons';
import { useLanguage } from '../context/LanguageContext';

const categoryBadgeColors = {
  UPSC: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  SSC: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Banking: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Railways: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Defence: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'State PSC': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Teaching: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  Police: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  Insurance: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  PSU: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400',
  'Regulatory Bodies': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Judiciary: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Healthcare: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  Postal: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Agriculture: 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400',
  Miscellaneous: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
};

const barColors = [
  'bg-blue-500 dark:bg-blue-400',
  'bg-emerald-500 dark:bg-emerald-400',
  'bg-amber-500 dark:bg-amber-400',
];

const popularComparisons = [
  { label: 'SSC CGL vs IBPS PO', ids: ['ssc-cgl', 'ibps-po'] },
  { label: 'UPSC vs State PSC', ids: ['upsc-civil-services', 'uppsc-pcs'] },
  { label: 'SSC CHSL vs SSC MTS', ids: ['ssc-chsl', 'ssc-mts'] },
  { label: 'SBI PO vs IBPS PO', ids: ['sbi-po', 'ibps-po'] },
  { label: 'NDA vs CDS', ids: ['nda', 'cds'] },
];

const examMap = new Map(staticExamsData.map((e) => [e._id, e]));

/* Searchable dropdown selector */
const ExamSelector = ({ index, selectedId, onChange, excludeIds }) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return staticExamsData.filter(
      (e) => !excludeIds.includes(e._id) && (!q || e.title.toLowerCase().includes(q) || e.category.toLowerCase().includes(q))
    ).slice(0, 30);
  }, [query, excludeIds]);

  const handleSelect = useCallback((id) => {
    onChange(id);
    setQuery('');
    setOpen(false);
  }, [onChange]);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = selectedId ? examMap.get(selectedId) : null;

  return (
    <div ref={ref} className="relative w-full">
      <div
        className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 px-4 py-3 cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
        onClick={() => setOpen(!open)}
      >
        {selected ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 min-w-0">
              <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${categoryBadgeColors[selected.category] || 'bg-gray-100 text-gray-700'}`}>
                {selected.category}
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white truncate">{selected.title}</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onChange(null); }}
              className="ml-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
              aria-label="Clear selection"
            >
              <FiX size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 w-full text-gray-400 dark:text-gray-500">
            <FiSearch size={16} />
            <span className="text-sm">{index === 0 ? t('selectExam1') : t('selectExam2')}</span>
            <FiChevronDown size={14} className="ml-auto" />
          </div>
        )}
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-64 overflow-hidden">
          <div className="p-2 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-2">
              <FiSearch size={14} className="text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('searchExams')}
                className="w-full bg-transparent text-sm outline-none text-gray-900 dark:text-white placeholder-gray-400"
                autoFocus
              />
            </div>
          </div>
          <ul className="overflow-y-auto max-h-48">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-400 text-center">{t('noExamsToCompare')}</li>
            ) : (
              filtered.map((exam) => (
                <li
                  key={exam._id}
                  onClick={() => handleSelect(exam._id)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className={`shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${categoryBadgeColors[exam.category] || 'bg-gray-100 text-gray-700'}`}>
                    {exam.category}
                  </span>
                  <span className="text-gray-800 dark:text-gray-200 truncate">{exam.title}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

/* Salary bar visual */
const SalaryBar = ({ exam, maxSalary, colorClass }) => {
  const max = exam.salaryRange?.max || 0;
  const min = exam.salaryRange?.min || 0;
  const widthPct = maxSalary > 0 ? Math.round((max / maxSalary) * 100) : 0;
  const minPct = maxSalary > 0 ? Math.round((min / maxSalary) * 100) : 0;

  return (
    <div className="w-full">
      <div className="relative h-7 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className={`absolute left-0 top-0 h-full rounded-full ${colorClass} opacity-30`} style={{ width: `${widthPct}%` }} />
        <div className={`absolute left-0 top-0 h-full rounded-full ${colorClass}`} style={{ width: `${minPct}%` }} />
        <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-800 dark:text-gray-100">
          {exam.salary || 'N/A'}
        </span>
      </div>
      {exam.salaryRange?.description && (
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">{exam.salaryRange.description}</p>
      )}
    </div>
  );
};

/* Helper to detect "better" values */
const parseNumeric = (str) => {
  if (!str) return 0;
  const nums = str.replace(/,/g, '').match(/\d+/g);
  return nums ? parseInt(nums[nums.length - 1], 10) : 0;
};

const countStages = (process) => {
  if (!process) return 0;
  return (process.match(/→/g) || []).length + 1;
};

const CompareExams = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedIds, setSelectedIds] = useState([null, null]);
  const [showThird, setShowThird] = useState(false);

  // Sync from URL on mount
  useEffect(() => {
    const param = searchParams.get('exams');
    if (param) {
      const ids = param.split(',').filter((id) => examMap.has(id)).slice(0, 3);
      if (ids.length >= 2) {
        setSelectedIds(ids.length === 3 ? ids : [ids[0], ids[1], null]);
        if (ids.length === 3) setShowThird(true);
      } else if (ids.length === 1) {
        setSelectedIds([ids[0], null]);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update URL when selections change
  useEffect(() => {
    const valid = selectedIds.filter(Boolean);
    if (valid.length >= 2) {
      setSearchParams({ exams: valid.join(',') }, { replace: true });
    } else if (valid.length === 0 && searchParams.has('exams')) {
      setSearchParams({}, { replace: true });
    }
  }, [selectedIds]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = useCallback((index, id) => {
    setSelectedIds((prev) => {
      const next = [...prev];
      next[index] = id;
      return next;
    });
  }, []);

  const addThirdSlot = () => {
    setShowThird(true);
    setSelectedIds((prev) => prev.length < 3 ? [...prev, null] : prev);
  };

  const removeThirdSlot = () => {
    setShowThird(false);
    setSelectedIds((prev) => prev.slice(0, 2));
  };

  const selectedExams = useMemo(
    () => selectedIds.filter(Boolean).map((id) => examMap.get(id)).filter(Boolean),
    [selectedIds]
  );

  const excludeIdsFor = useCallback(
    (index) => selectedIds.filter((id, i) => id && i !== index),
    [selectedIds]
  );

  const maxSalary = useMemo(
    () => Math.max(...selectedExams.map((e) => e.salaryRange?.max || 0), 1),
    [selectedExams]
  );

  const highlightBest = (values, higherIsBetter = true) => {
    const nums = values.map(parseNumeric);
    const best = higherIsBetter ? Math.max(...nums) : Math.min(...nums);
    if (nums.every((n) => n === 0)) return values.map(() => false);
    return nums.map((n) => n === best && nums.filter((v) => v === best).length < nums.length);
  };

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/compare${selectedExams.length >= 2 ? `?exams=${selectedExams.map((e) => e._id).join(',')}` : ''}`
    : '';

  const shareTitle = selectedExams.length >= 2
    ? `Compare ${selectedExams.map((e) => e.title).join(' vs ')} - GovtExamPath`
    : 'Compare Government Exams - GovtExamPath';

  const comparisonRows = useMemo(() => {
    if (selectedExams.length < 2) return [];

    const vacancyHighlights = highlightBest(selectedExams.map((e) => e.vacancies));
    const salaryHighlights = highlightBest(selectedExams.map((e) => String(e.salaryRange?.max || 0)));
    const attemptHighlights = highlightBest(selectedExams.map((e) => e.attempts));
    const stageValues = selectedExams.map((e) => String(countStages(e.selectionProcess)));
    const stageHighlights = highlightBest(stageValues, false);

    return [
      {
        label: 'Category',
        values: selectedExams.map((e) => (
          <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${categoryBadgeColors[e.category] || 'bg-gray-100 text-gray-700'}`}>
            {e.category}
          </span>
        )),
      },
      {
        label: 'Conducting Body',
        values: selectedExams.map((e) => e.conductingBody || 'N/A'),
      },
      {
        label: 'Qualification Required',
        values: selectedExams.map((e) => e.eligibility || e.qualifications || 'N/A'),
      },
      {
        label: 'Age Limit',
        values: selectedExams.map((e) => (
          <div>
            <span className="font-medium">{e.ageLimit || 'N/A'}</span>
            {e.ageLimitDetails?.relaxation && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Relaxation: {e.ageLimitDetails.relaxation}</p>
            )}
          </div>
        )),
      },
      {
        label: 'Salary Range',
        isSalary: true,
        highlights: salaryHighlights,
        values: selectedExams.map((e, i) => (
          <SalaryBar exam={e} maxSalary={maxSalary} colorClass={barColors[i]} />
        )),
      },
      {
        label: 'Application Fee',
        values: selectedExams.map((e) => e.applicationFee || 'N/A'),
      },
      {
        label: 'Vacancies',
        highlights: vacancyHighlights,
        values: selectedExams.map((e) => e.vacancies || 'N/A'),
      },
      {
        label: 'Attempt Limits',
        highlights: attemptHighlights,
        values: selectedExams.map((e) => e.attempts || 'N/A'),
      },
      {
        label: 'Exam Pattern',
        values: selectedExams.map((e) => (
          <p className="text-xs leading-relaxed">{e.examPattern ? e.examPattern.slice(0, 200) + (e.examPattern.length > 200 ? '...' : '') : 'N/A'}</p>
        )),
      },
      {
        label: 'Selection Process',
        values: selectedExams.map((e) => (
          <p className="text-xs leading-relaxed">{e.selectionProcess || 'N/A'}</p>
        )),
      },
      {
        label: 'Number of Stages',
        highlights: stageHighlights,
        values: selectedExams.map((e) => {
          const stages = countStages(e.selectionProcess);
          return `${stages} stage${stages !== 1 ? 's' : ''}`;
        }),
      },
    ];
  }, [selectedExams, maxSalary]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <SEO
        title="Compare Government Exams Side by Side"
        description="Compare 2-3 government exams side by side. Analyze salary, eligibility, age limit, vacancies, exam pattern and more. Make informed career decisions with GovtExamPath."
        path="/compare"
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Breadcrumb items={[{ label: 'Compare Exams', to: '/compare' }]} />
            <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {t('compareExamsTitle')}
              </span>
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">
              {t('compareExamsDesc')}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          {/* Exam Selectors */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <ExamSelector index={0} selectedId={selectedIds[0]} onChange={(id) => handleChange(0, id)} excludeIds={excludeIdsFor(0)} />
              <ExamSelector index={1} selectedId={selectedIds[1]} onChange={(id) => handleChange(1, id)} excludeIds={excludeIdsFor(1)} />
              {showThird ? (
                <div className="flex gap-2">
                  <div className="flex-1">
                    <ExamSelector index={2} selectedId={selectedIds[2]} onChange={(id) => handleChange(2, id)} excludeIds={excludeIdsFor(2)} />
                  </div>
                  <button
                    onClick={removeThirdSlot}
                    className="shrink-0 self-center p-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-400 hover:text-red-500 hover:border-red-300 dark:hover:border-red-500 transition-colors"
                    aria-label="Remove third exam"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={addThirdSlot}
                  className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl py-3 text-sm text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-500 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  <FiPlus size={16} />
                  Add Exam 3
                </button>
              )}
            </div>
          </div>

          {/* Popular Comparisons */}
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Popular Comparisons</h2>
            <div className="flex flex-wrap gap-2">
              {popularComparisons.map((pc) => (
                <button
                  key={pc.label}
                  onClick={() => {
                    const validIds = pc.ids.filter((id) => examMap.has(id));
                    if (validIds.length >= 2) {
                      setSelectedIds([validIds[0], validIds[1], validIds[2] || null]);
                      if (validIds.length === 3) setShowThird(true);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:border-blue-600 dark:hover:text-blue-400 transition-all shadow-sm"
                >
                  {pc.label}
                  <FiArrowRight size={12} />
                </button>
              ))}
            </div>
          </div>

          {/* Comparison Table */}
          {selectedExams.length >= 2 && (
            <div className="mt-8 space-y-6">
              {/* Share bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-5">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {selectedExams.map((e) => e.title).join(' vs ')}
                </h2>
                <ShareButtons url={shareUrl} title={shareTitle} description="Compare government exams side by side on GovtExamPath" />
              </div>

              {/* Salary Comparison Visual */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 sm:p-6">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Salary Comparison</h3>
                <div className="space-y-4">
                  {selectedExams.map((exam, i) => (
                    <div key={exam._id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{exam.title}</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{exam.salary || 'N/A'}</span>
                      </div>
                      <div className="relative h-8 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                        <div
                          className={`absolute left-0 top-0 h-full rounded-lg ${barColors[i]} opacity-25 transition-all duration-500`}
                          style={{ width: `${maxSalary > 0 ? Math.round(((exam.salaryRange?.max || 0) / maxSalary) * 100) : 0}%` }}
                        />
                        <div
                          className={`absolute left-0 top-0 h-full rounded-lg ${barColors[i]} transition-all duration-500`}
                          style={{ width: `${maxSalary > 0 ? Math.round(((exam.salaryRange?.min || 0) / maxSalary) * 100) : 0}%` }}
                        />
                        <div className="absolute inset-0 flex items-center px-3">
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                            {exam.salaryRange ? `Min: ₹${(exam.salaryRange.min || 0).toLocaleString('en-IN')} — Max: ₹${(exam.salaryRange.max || 0).toLocaleString('en-IN')}` : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main comparison table */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px]">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-5 py-4 w-44">
                          Attribute
                        </th>
                        {selectedExams.map((exam, i) => (
                          <th key={exam._id} className="text-left px-5 py-4">
                            <Link
                              to={`/exams/${exam._id}`}
                              className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {exam.title}
                            </Link>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonRows.map((row, rIdx) => (
                        <tr
                          key={row.label}
                          className={`border-b border-gray-100 dark:border-gray-700/50 ${rIdx % 2 === 0 ? 'bg-gray-50/50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-800'}`}
                        >
                          <td className="px-5 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 align-top whitespace-nowrap">
                            {row.label}
                          </td>
                          {row.values.map((val, cIdx) => {
                            const isBest = row.highlights?.[cIdx];
                            return (
                              <td
                                key={cIdx}
                                className={`px-5 py-4 text-sm text-gray-800 dark:text-gray-200 align-top ${isBest ? 'bg-green-50 dark:bg-green-900/20' : ''}`}
                              >
                                <div className={isBest ? 'font-semibold text-green-700 dark:text-green-400' : ''}>
                                  {val}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Links to individual exam pages */}
              <div className="flex flex-wrap gap-3">
                {selectedExams.map((exam) => (
                  <Link
                    key={exam._id}
                    to={`/exams/${exam._id}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors shadow-sm"
                  >
                    View {exam.title} details
                    <FiArrowRight size={14} />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {selectedExams.length < 2 && (
            <div className="mt-12 text-center py-16">
              <div className="mx-auto w-20 h-20 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-5">
                <FiSearch size={32} className="text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{t('selectExamsToCompare')}</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Choose at least 2 exams from the dropdowns above, or pick a popular comparison to get started.
              </p>
            </div>
          )}

          {/* Informational Content Section */}
          <div className="mt-16 space-y-10">
            {/* How to Choose Between Government Exams */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">
                How to Choose Between Government Exams
              </h2>
              <div className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4 leading-relaxed">
                <p>
                  India offers an extraordinary range of government examinations, from the prestigious UPSC Civil Services to high-volume recruitment drives conducted by SSC, IBPS, and the Railway Recruitment Boards. With dozens of exams announced every year, each promising job security, respectable salaries, and lifelong benefits, choosing the right exam to dedicate your preparation to is one of the most consequential career decisions you will make. Many aspirants spend years preparing without ever taking a step back to compare their options systematically, leading to wasted effort, missed opportunities, and unnecessary frustration.
                </p>
                <p>
                  Comparing exams before committing to a preparation plan is essential because each exam differs significantly in its competition level, syllabus depth, salary outcome, posting locations, and long-term career trajectory. A candidate who blindly targets UPSC without understanding that State PSC exams offer comparable administrative roles with far lower competition ratios may miss a more realistic path to the same career satisfaction. Similarly, a banking aspirant who does not realize that RBI Grade B and SEBI Grade A offer substantially higher salaries than IBPS PO might undervalue these alternatives. The comparison tool above lets you place any two or three exams side by side and evaluate them across every parameter that matters. Below, we break down the key factors you should weigh, walk through popular head-to-head comparisons, and share a smart multi-exam preparation strategy.
                </p>
              </div>
            </div>

            {/* Key Factors to Compare */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-10">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Key Factors to Compare
              </h3>
              <div className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4 leading-relaxed">
                <p>
                  When comparing government exams, candidates often fixate on a single metric such as salary or prestige. However, a thorough comparison requires evaluating at least six critical factors. Weighing all of them together gives you a realistic picture of what each career path actually looks like on the ground.
                </p>
                <p>
                  <strong>1. Competition Ratio:</strong> The competition ratio, calculated as the number of applicants per available vacancy, is arguably the most important factor determining your realistic chances of selection. UPSC Civil Services routinely sees over 10 lakh applicants competing for roughly 1,000 vacancies, translating to a competition ratio of approximately 1,000:1. In contrast, SSC CGL attracts around 30 lakh applicants for 10,000-15,000 vacancies (200:1), and IBPS PO sees approximately 15 lakh applicants for 3,000-4,000 posts (375:1). Railway Group D has one of the highest absolute applicant counts at over 1 crore, but also offers the largest number of vacancies, sometimes exceeding 100,000 in a single recruitment cycle, bringing its effective ratio to around 100:1. Understanding these ratios helps you calibrate how much preparation intensity and time commitment each exam demands.
                </p>
                <p>
                  <strong>2. Salary and Financial Benefits:</strong> Government salaries vary dramatically across exams. An IAS officer starts at approximately Rs 56,100 per month (Pay Level 10 under the 7th Pay Commission) but receives significant additional benefits including housing, vehicle, domestic help, and power-of-office perks that are difficult to quantify. An SBI PO starts at approximately Rs 52,000 per month with allowances, while an SSC CGL post like Tax Assistant offers around Rs 44,900 plus DA. At the regulatory body level, RBI Grade B officers start at over Rs 1 lakh per month gross, and SEBI Grade A offers a comparable package. When comparing salaries, always look at the total cost-to-company equivalent rather than just the basic pay, and factor in benefits like pension, medical coverage, housing allowance, and LTC that are unique to government service.
                </p>
                <p>
                  <strong>3. Job Satisfaction and Work Profile:</strong> The nature of daily work differs vastly between government roles. An IAS officer handles district administration, policy formulation, and crisis management, offering immense variety and responsibility. A bank PO manages branch operations, handles customer relationships, and works toward business targets. An SSC CGL officer in the Income Tax department conducts assessments and raids, while one posted in the Ministry of External Affairs may handle passport and visa operations. Defence officers experience a completely different lifestyle centered on discipline, physical fitness, and national security. Evaluate whether the day-to-day work of a role genuinely appeals to you, because job satisfaction in a 30-plus-year career matters far more than the starting salary.
                </p>
                <p>
                  <strong>4. Posting Location:</strong> Posting location significantly affects quality of life, especially for candidates with family obligations or geographic preferences. UPSC Civil Services and many SSC posts involve all-India postings, meaning you could be stationed anywhere from a remote district in Chhattisgarh to a metropolitan city like Delhi. Banking jobs through IBPS typically involve postings within the state or region where the regional rural bank or public sector bank operates, though transfers within the circle are common. State PSC exams guarantee postings within your home state, making them ideal for candidates who want to stay close to family. Defence postings are inherently mobile and may include remote border areas, field postings, and peace stations on a rotational basis.
                </p>
                <p>
                  <strong>5. Career Growth and Promotion Prospects:</strong> Long-term career growth varies significantly across services. IAS officers can rise to the level of Cabinet Secretary, the highest-ranking civil servant in India, with each promotion bringing exponentially greater authority and responsibility. Bank POs can progress to become General Managers or even Managing Directors of their respective banks over a 25-30 year career. SSC CGL officers in Group B posts like Inspector (Income Tax) or Inspector (Customs) can reach the level of Commissioner through departmental promotions, though the progression tends to be slower and more seniority-based compared to the IAS. RBI Grade B officers enjoy excellent promotion prospects within the central bank, with Grade C, D, and eventually Executive Director positions available. Defence officers follow a time-bound promotion system up to the rank of Colonel or equivalent, after which promotions become selection-based and highly competitive.
                </p>
                <p>
                  <strong>6. Preparation Overlap:</strong> Many government exams share significant syllabus overlap, which means preparing for one exam can simultaneously prepare you for others. Quantitative Aptitude, Reasoning, English Language, and General Awareness form the core of SSC, Banking, Railways, and Insurance exams. If your preparation covers these four pillars thoroughly, you can appear for SSC CGL, IBPS PO, RRB NTPC, and LIC AAO in the same year with minimal additional effort. UPSC and State PSC exams share an extensive overlap in General Studies, with the difference mainly in the depth of state-specific topics. Understanding these overlaps allows you to maximize the return on your preparation investment.
                </p>
              </div>
            </div>

            {/* Popular Exam Comparisons */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-10">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Popular Exam Comparisons
              </h3>
              <div className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-5 leading-relaxed">
                <p>
                  Below are brief breakdowns of the most frequently compared government exam pairs. These comparisons highlight the key trade-offs candidates face when deciding which exam to prioritize.
                </p>
                <div className="bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
                  <p className="font-semibold text-purple-700 dark:text-purple-400 mb-1">UPSC Civil Services vs State PSC</p>
                  <p>
                    UPSC Civil Services is the most prestigious exam in India, leading to the IAS, IPS, and IFS cadres with all-India jurisdiction and immense executive authority. State PSC exams, such as UPPSC, MPPSC, BPSC, and TNPSC, lead to state-level administrative roles like SDM, DSP, and Block Development Officer. The core syllabus for both overlaps substantially in General Studies, including Indian Polity, History, Geography, Economics, and Current Affairs, with State PSC adding state-specific topics. The critical difference lies in competition: UPSC sees roughly 10 lakh applicants for 1,000 posts, while most State PSCs receive 2-5 lakh applications for 300-800 posts, making the probability of selection meaningfully higher. Many successful candidates adopt a dual-preparation strategy, targeting their State PSC as a realistic primary goal while simultaneously attempting UPSC as an aspirational target.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl p-4">
                  <p className="font-semibold text-green-700 dark:text-green-400 mb-1">SBI PO vs IBPS PO</p>
                  <p>
                    Both exams recruit Probationary Officers for public sector banks and share an almost identical exam pattern of Prelims, Mains, and Interview. SBI PO recruits exclusively for the State Bank of India, the largest public sector bank, and tends to offer slightly higher starting compensation due to SBI's separate pay structure. IBPS PO recruits for 11 participating public sector banks (such as PNB, BOB, Canara Bank, and Union Bank), and candidates receive allotment based on their preference and merit rank. The SBI PO exam is generally considered slightly tougher in terms of the difficulty level of individual questions, while IBPS PO sees higher competition due to the larger number of applicants. A smart strategy is to prepare for both simultaneously, since the syllabus is nearly identical, and appear for SBI PO as the primary target while using IBPS PO as a backup opportunity.
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                  <p className="font-semibold text-blue-700 dark:text-blue-400 mb-1">SSC CGL vs SSC CHSL</p>
                  <p>
                    SSC CGL and SSC CHSL are both conducted by the Staff Selection Commission but target different qualification levels and post categories. SSC CGL requires a graduation degree and recruits for Group B and Group C posts such as Income Tax Inspector, Excise Inspector, Auditor, and Assistant in various ministries, with starting salaries ranging from Rs 44,900 to Rs 47,600 under Pay Level 5-7. SSC CHSL requires only a 12th pass qualification and recruits for Lower Division Clerk (LDC), Postal Assistant, and Data Entry Operator posts at Pay Level 2-4, with starting salaries around Rs 25,500 to Rs 35,400. The CGL exam is considerably more competitive and includes an additional Tier covering quantitative aptitude and English at a higher difficulty level. For graduates, CGL is almost always the better choice due to significantly higher salary, superior job profile, and better promotion prospects. CHSL serves as an excellent option for candidates who have completed 12th but not yet graduated, or for those who want to enter government service quickly while continuing their education.
                  </p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
                  <p className="font-semibold text-emerald-700 dark:text-emerald-400 mb-1">RBI Grade B vs SEBI Grade A</p>
                  <p>
                    Both the Reserve Bank of India and the Securities and Exchange Board of India are regulatory bodies that offer some of the highest compensation packages in the Indian government sector. RBI Grade B officers start with a gross monthly salary exceeding Rs 1 lakh and are involved in monetary policy, banking regulation, foreign exchange management, and financial inclusion. SEBI Grade A officers earn a comparable starting package and work in securities market regulation, investor protection, and corporate governance oversight. RBI Grade B recruits through a three-phase process (Prelims, Mains with two papers, and Interview), while SEBI Grade A follows a similar structure but with a greater emphasis on financial markets and securities law. Both exams demand a strong foundation in economics, finance, and current affairs. The key differentiator is the work domain: RBI focuses on banking and monetary systems, while SEBI centers on capital markets and securities regulation. Candidates with a background in commerce, economics, or finance should strongly consider both of these exams, as they offer among the best pay-to-competition ratios in the government sector.
                  </p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                  <p className="font-semibold text-amber-700 dark:text-amber-400 mb-1">NDA vs CDS</p>
                  <p>
                    Both NDA (National Defence Academy) and CDS (Combined Defence Services) are pathways to becoming a commissioned officer in the Indian Armed Forces, but they target different age groups and educational stages. NDA is open to candidates who have passed 12th standard (or are appearing), with an age limit of 16.5 to 19.5 years, and involves a rigorous three-year training program at the National Defence Academy in Khadakwasla, Pune, after which candidates proceed to their respective service academies. CDS is open to graduates aged 19 to 25 and offers a shorter training duration of 18 months at IMA (Dehradun), OTA (Chennai), Naval Academy, or Air Force Academy depending on the entry. NDA is considered the more prestigious entry because it offers a longer and more comprehensive training that shapes officers from a younger age, and NDA alumni often form a close-knit community within the forces. CDS provides a faster route for graduates who discover their interest in defence services later. Both exams include a written test followed by the SSB (Services Selection Board) interview, which is a five-day assessment of personality, leadership, and officer-like qualities.
                  </p>
                </div>
              </div>
            </div>

            {/* Smart Strategy: Prepare for Multiple Exams */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-10">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Smart Strategy: Prepare for Multiple Exams
              </h3>
              <div className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4 leading-relaxed">
                <p>
                  One of the most effective strategies in the government exam ecosystem is preparing for a cluster of exams simultaneously rather than putting all your effort into a single exam. This approach works because several major exams share a substantial portion of their syllabus, and the skills developed for one exam directly transfer to others. By identifying the right cluster, you multiply your chances of selection without proportionally multiplying your study hours.
                </p>
                <p>
                  <strong>The SSC-Banking-Railways-Insurance Cluster:</strong> This is the largest overlap cluster and is ideal for graduates targeting Group B and Group C government posts. The four pillars of preparation, namely Quantitative Aptitude, Reasoning Ability, English Language, and General Awareness, are common across SSC CGL, IBPS PO, IBPS Clerk, SBI PO, SBI Clerk, RRB NTPC, LIC AAO, and NIACL AO. If you build a strong foundation in these four areas, you can appear for all of these exams within a single year. The differences lie in the specific focus areas: banking exams emphasize data interpretation and financial awareness, SSC exams tend to have tougher quantitative aptitude questions, and railway exams include a stronger current affairs component. By preparing the common base first and then adding exam-specific modules in the last 4-6 weeks before each exam, you can cover the entire cluster efficiently.
                </p>
                <p>
                  <strong>The UPSC-State PSC Cluster:</strong> Candidates preparing for UPSC Civil Services already cover the vast majority of the State PSC General Studies syllabus. Indian Polity, History, Geography, Indian Economy, Science and Technology, Environment, and Ethics are common across both. The additional effort required for a State PSC exam is typically limited to state-specific history, geography, economy, and a state-level current affairs module. Many successful UPSC aspirants simultaneously appear for their home state's PSC exam as a pragmatic backup, and a significant number of current State PSC officers initially began their journey as UPSC aspirants. This dual approach ensures that even if the UPSC outcome is uncertain, the candidate has a realistic secondary path to an administrative career.
                </p>
                <p>
                  <strong>The Regulatory Bodies Cluster (RBI, SEBI, NABARD, SIDBI):</strong> These exams target candidates with a strong background in economics, finance, and banking. RBI Grade B, SEBI Grade A, NABARD Grade A, and SIDBI Grade B share significant syllabus overlap in Economic and Social Issues, Finance and Management, and English Language. Candidates preparing for any one of these exams are well-positioned to attempt the others with minimal additional preparation. Given that these organizations offer among the highest salaries in the government sector and recruit relatively small numbers (50-200 officers per cycle), appearing for all four in the same year substantially increases the probability of landing at least one of these coveted positions.
                </p>
                <p>
                  The key to making a multi-exam strategy work is disciplined scheduling. Map out the exam calendar at the beginning of the year, identify the exams whose dates are spaced at least 4-6 weeks apart, and plan your preparation in phases. Use the comparison tool above to identify exactly which parameters overlap and where you need to add exam-specific modules. This strategic approach transforms what seems like an overwhelming number of exams into a structured and manageable preparation journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompareExams;
