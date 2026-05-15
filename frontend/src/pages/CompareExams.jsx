import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiSearch, FiX, FiPlus, FiChevronDown, FiArrowRight } from 'react-icons/fi';
import { examsData } from '../data/examsData';
import SEO from '../components/common/SEO';
import Breadcrumb from '../components/common/Breadcrumb';
import ShareButtons from '../components/common/ShareButtons';

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

const examMap = new Map(examsData.map((e) => [e._id, e]));

/* Searchable dropdown selector */
const ExamSelector = ({ index, selectedId, onChange, excludeIds }) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return examsData.filter(
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
            <span className="text-sm">Select Exam {index + 1}</span>
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
                placeholder="Type to search exams..."
                className="w-full bg-transparent text-sm outline-none text-gray-900 dark:text-white placeholder-gray-400"
                autoFocus
              />
            </div>
          </div>
          <ul className="overflow-y-auto max-h-48">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-400 text-center">No exams found</li>
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
                Compare Government Exams
              </span>
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">
              Select 2 or 3 exams to compare them side by side across salary, eligibility, vacancies, exam pattern and more.
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
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Select exams to compare</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Choose at least 2 exams from the dropdowns above, or pick a popular comparison to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CompareExams;
