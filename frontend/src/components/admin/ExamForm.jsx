import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import toast from 'react-hot-toast';

const categories = ['UPSC', 'SSC', 'Banking', 'Railways', 'Defence', 'State PSC', 'Teaching', 'Police', 'Insurance', 'Regulatory Bodies', 'PSU', 'Judiciary', 'Agriculture', 'Postal', 'Healthcare', 'Miscellaneous'];

const examModes = ['online', 'offline', 'pen-paper', 'both'];

const toDateStr = (d) => {
  if (!d) return '';
  try { return new Date(d).toISOString().split('T')[0]; } catch { return ''; }
};

const emptyForm = {
  title: '', description: '', category: '', conductingBody: '',
  eligibility: '', qualifications: '', applicationLink: '', officialWebsite: '', notificationPdfUrl: '',
  lastDate: '', applicationStartDate: '', examDate: '', admitCardDate: '', resultDate: '', dateStatus: 'tentative',
  salary: '', ageLimit: '', applicationFee: '', vacancies: '',
  examPattern: '', examMode: '', examDuration: '', negativeMarking: '',
  syllabus: '', selectionProcess: '', jobRole: '', careerGrowth: '', applicationProcess: '', perks: '',
  importantDates: [],
};

const Section = ({ title, open, onToggle, children }) => (
  <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
    <button type="button" onClick={onToggle} className="w-full flex items-center justify-between px-5 py-3 bg-gray-50 dark:bg-gray-700/50 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
      {title}
      {open ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
    </button>
    {open && <div className="p-5 space-y-4">{children}</div>}
  </div>
);

const ExamForm = ({ exam, onSubmit, loading: externalLoading }) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState({ basic: true, dates: true, eligibility: false, exam: false, career: false, links: false });

  const toggleSection = (key) => setSections(s => ({ ...s, [key]: !s[key] }));

  useEffect(() => {
    if (exam) {
      setForm({
        title: exam.title || '',
        description: exam.description || '',
        category: exam.category || '',
        conductingBody: exam.conductingBody || '',
        eligibility: exam.eligibility || '',
        qualifications: exam.qualifications || '',
        applicationLink: exam.applicationLink || '',
        officialWebsite: exam.officialWebsite || '',
        notificationPdfUrl: exam.notificationPdfUrl || '',
        lastDate: toDateStr(exam.lastDate),
        applicationStartDate: toDateStr(exam.applicationStartDate),
        examDate: toDateStr(exam.examDate),
        admitCardDate: toDateStr(exam.admitCardDate),
        resultDate: toDateStr(exam.resultDate),
        dateStatus: exam.dateStatus || 'tentative',
        salary: exam.salary || '',
        ageLimit: exam.ageLimit || '',
        applicationFee: exam.applicationFee || '',
        vacancies: exam.vacancies || '',
        examPattern: exam.examPattern || '',
        examMode: exam.examMode || '',
        examDuration: exam.examDuration || '',
        negativeMarking: exam.negativeMarking || '',
        syllabus: exam.syllabus || '',
        selectionProcess: exam.selectionProcess || '',
        jobRole: exam.jobRole || '',
        careerGrowth: exam.careerGrowth || '',
        applicationProcess: exam.applicationProcess || '',
        perks: exam.perks || '',
        importantDates: exam.importantDates || [],
      });
      setSections({ basic: true, dates: true, eligibility: true, exam: true, career: true, links: true });
    }
  }, [exam]);

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.category) errs.category = 'Category is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const addImportantDate = () => {
    setForm({ ...form, importantDates: [...form.importantDates, { event: '', date: '' }] });
  };

  const removeImportantDate = (index) => {
    setForm({ ...form, importantDates: form.importantDates.filter((_, i) => i !== index) });
  };

  const updateImportantDate = (index, field, value) => {
    const updated = [...form.importantDates];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, importantDates: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = { ...form };
      Object.keys(payload).forEach(k => {
        if (payload[k] === '' && !['title', 'description', 'category'].includes(k)) {
          delete payload[k];
        }
      });
      await onSubmit(payload);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save exam');
    } finally {
      setLoading(false);
    }
  };

  const isLoading = loading || externalLoading;

  const inputClass = (field) =>
    `w-full px-4 py-2.5 rounded-xl border ${
      errors[field] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
    } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm`;

  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Basic Info - Always Open */}
      <Section title="Basic Information *" open={sections.basic} onToggle={() => toggleSection('basic')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelClass}>Title *</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="e.g., SSC CGL 2026" className={inputClass('title')} />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className={labelClass}>Category *</label>
            <select name="category" value={form.category} onChange={handleChange} className={inputClass('category')}>
              <option value="">Select category</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>
          <div>
            <label className={labelClass}>Conducting Body</label>
            <input type="text" name="conductingBody" value={form.conductingBody} onChange={handleChange} placeholder="e.g., Staff Selection Commission" className={inputClass('conductingBody')} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Brief description of the exam" className={inputClass('description')} />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>
          <div>
            <label className={labelClass}>Vacancies</label>
            <input type="text" name="vacancies" value={form.vacancies} onChange={handleChange} placeholder="e.g., 15,000+" className={inputClass('vacancies')} />
          </div>
          <div>
            <label className={labelClass}>Application Fee</label>
            <input type="text" name="applicationFee" value={form.applicationFee} onChange={handleChange} placeholder="e.g., Gen: ₹100, SC/ST: Nil" className={inputClass('applicationFee')} />
          </div>
        </div>
      </Section>

      {/* Dates */}
      <Section title="Dates & Schedule" open={sections.dates} onToggle={() => toggleSection('dates')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Application Start</label>
            <input type="date" name="applicationStartDate" value={form.applicationStartDate} onChange={handleChange} className={inputClass('applicationStartDate')} />
          </div>
          <div>
            <label className={labelClass}>Last Date to Apply</label>
            <input type="date" name="lastDate" value={form.lastDate} onChange={handleChange} className={inputClass('lastDate')} />
          </div>
          <div>
            <label className={labelClass}>Exam Date</label>
            <input type="date" name="examDate" value={form.examDate} onChange={handleChange} className={inputClass('examDate')} />
          </div>
          <div>
            <label className={labelClass}>Admit Card Date</label>
            <input type="date" name="admitCardDate" value={form.admitCardDate} onChange={handleChange} className={inputClass('admitCardDate')} />
          </div>
          <div>
            <label className={labelClass}>Result Date</label>
            <input type="date" name="resultDate" value={form.resultDate} onChange={handleChange} className={inputClass('resultDate')} />
          </div>
          <div>
            <label className={labelClass}>Date Status</label>
            <select name="dateStatus" value={form.dateStatus} onChange={handleChange} className={inputClass('dateStatus')}>
              <option value="tentative">Tentative</option>
              <option value="confirmed">Confirmed</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className={labelClass}>Important Dates</label>
            <button type="button" onClick={addImportantDate} className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:underline">
              <FiPlus className="w-4 h-4" /> Add Date
            </button>
          </div>
          <div className="space-y-2">
            {form.importantDates.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <input type="text" value={item.event || ''} onChange={(e) => updateImportantDate(idx, 'event', e.target.value)} placeholder="Event name" className="flex-1 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
                <input type="date" value={toDateStr(item.date)} onChange={(e) => updateImportantDate(idx, 'date', e.target.value)} className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none text-sm" />
                <button type="button" onClick={() => removeImportantDate(idx)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><FiTrash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Eligibility */}
      <Section title="Eligibility & Requirements" open={sections.eligibility} onToggle={() => toggleSection('eligibility')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelClass}>Eligibility Criteria</label>
            <textarea name="eligibility" value={form.eligibility} onChange={handleChange} rows={2} placeholder="e.g., Bachelor's Degree from recognized University" className={inputClass('eligibility')} />
          </div>
          <div>
            <label className={labelClass}>Educational Qualification</label>
            <input type="text" name="qualifications" value={form.qualifications} onChange={handleChange} placeholder="e.g., Graduation / 12th pass" className={inputClass('qualifications')} />
          </div>
          <div>
            <label className={labelClass}>Age Limit</label>
            <input type="text" name="ageLimit" value={form.ageLimit} onChange={handleChange} placeholder="e.g., 18-32 years" className={inputClass('ageLimit')} />
          </div>
        </div>
      </Section>

      {/* Exam Details */}
      <Section title="Exam Details" open={sections.exam} onToggle={() => toggleSection('exam')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Exam Mode</label>
            <select name="examMode" value={form.examMode} onChange={handleChange} className={inputClass('examMode')}>
              <option value="">Select mode</option>
              {examModes.map(m => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Exam Duration</label>
            <input type="text" name="examDuration" value={form.examDuration} onChange={handleChange} placeholder="e.g., 2 hours" className={inputClass('examDuration')} />
          </div>
          <div>
            <label className={labelClass}>Negative Marking</label>
            <input type="text" name="negativeMarking" value={form.negativeMarking} onChange={handleChange} placeholder="e.g., 0.25 marks per wrong answer" className={inputClass('negativeMarking')} />
          </div>
          <div>
            <label className={labelClass}>Selection Process</label>
            <input type="text" name="selectionProcess" value={form.selectionProcess} onChange={handleChange} placeholder="e.g., Prelims → Mains → Interview" className={inputClass('selectionProcess')} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Exam Pattern</label>
            <textarea name="examPattern" value={form.examPattern} onChange={handleChange} rows={3} placeholder="Describe the exam pattern, number of papers, marks, etc." className={inputClass('examPattern')} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Syllabus</label>
            <textarea name="syllabus" value={form.syllabus} onChange={handleChange} rows={3} placeholder="Subject-wise syllabus details" className={inputClass('syllabus')} />
          </div>
        </div>
      </Section>

      {/* Career & Salary */}
      <Section title="Salary & Career" open={sections.career} onToggle={() => toggleSection('career')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Salary / Pay Scale</label>
            <input type="text" name="salary" value={form.salary} onChange={handleChange} placeholder="e.g., ₹25,500 - ₹1,51,100" className={inputClass('salary')} />
          </div>
          <div>
            <label className={labelClass}>Job Role</label>
            <input type="text" name="jobRole" value={form.jobRole} onChange={handleChange} placeholder="e.g., Income Tax Inspector, Tax Assistant" className={inputClass('jobRole')} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Career Growth</label>
            <textarea name="careerGrowth" value={form.careerGrowth} onChange={handleChange} rows={2} placeholder="Describe career progression" className={inputClass('careerGrowth')} />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Perks & Allowances</label>
            <textarea name="perks" value={form.perks} onChange={handleChange} rows={2} placeholder="e.g., DA, HRA, Medical, Pension" className={inputClass('perks')} />
          </div>
        </div>
      </Section>

      {/* Links */}
      <Section title="Links & Resources" open={sections.links} onToggle={() => toggleSection('links')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Application Link</label>
            <input type="url" name="applicationLink" value={form.applicationLink} onChange={handleChange} placeholder="https://..." className={inputClass('applicationLink')} />
          </div>
          <div>
            <label className={labelClass}>Official Website</label>
            <input type="url" name="officialWebsite" value={form.officialWebsite} onChange={handleChange} placeholder="https://..." className={inputClass('officialWebsite')} />
          </div>
          <div>
            <label className={labelClass}>Notification PDF URL</label>
            <input type="url" name="notificationPdfUrl" value={form.notificationPdfUrl} onChange={handleChange} placeholder="https://..." className={inputClass('notificationPdfUrl')} />
          </div>
          <div>
            <label className={labelClass}>Application Process</label>
            <textarea name="applicationProcess" value={form.applicationProcess} onChange={handleChange} rows={2} placeholder="Step-by-step application process" className={inputClass('applicationProcess')} />
          </div>
        </div>
      </Section>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[160px]"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : exam ? 'Update Exam' : 'Create Exam'}
        </button>
      </div>
    </form>
  );
};

export default ExamForm;
