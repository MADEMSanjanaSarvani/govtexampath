import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const categories = ['SSC', 'UPSC', 'Banking', 'Railways', 'State PSC', 'GATE', 'APPSC', 'TSPSC', 'Defence', 'Teaching', 'Other'];

const emptyForm = {
  title: '',
  description: '',
  category: '',
  eligibility: '',
  applicationLink: '',
  lastDate: '',
  salary: '',
  ageLimit: '',
  applicationFee: '',
  importantDates: [],
};

const ExamForm = ({ exam, onSubmit, loading: externalLoading }) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (exam) {
      setForm({
        title: exam.title || '',
        description: exam.description || '',
        category: exam.category || '',
        eligibility: exam.eligibility || '',
        applicationLink: exam.applicationLink || '',
        lastDate: exam.lastDate ? new Date(exam.lastDate).toISOString().split('T')[0] : '',
        salary: exam.salary || '',
        ageLimit: exam.ageLimit || '',
        applicationFee: exam.applicationFee || '',
        importantDates: exam.importantDates || [],
      });
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
    setForm({
      ...form,
      importantDates: [...form.importantDates, { event: '', date: '' }],
    });
  };

  const removeImportantDate = (index) => {
    setForm({
      ...form,
      importantDates: form.importantDates.filter((_, i) => i !== index),
    });
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
      await onSubmit(form);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save exam');
    } finally {
      setLoading(false);
    }
  };

  const isLoading = loading || externalLoading;

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl border ${
      errors[field] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
    } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="Exam title" className={inputClass('title')} />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
          <select name="category" value={form.category} onChange={handleChange} className={inputClass('category')}>
            <option value="">Select category</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Date</label>
          <input type="date" name="lastDate" value={form.lastDate} onChange={handleChange} className={inputClass('lastDate')} />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Exam description" className={inputClass('description')} />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Eligibility</label>
          <textarea name="eligibility" value={form.eligibility} onChange={handleChange} rows={3} placeholder="Eligibility criteria" className={inputClass('eligibility')} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Application Link</label>
          <input type="url" name="applicationLink" value={form.applicationLink} onChange={handleChange} placeholder="https://..." className={inputClass('applicationLink')} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Salary</label>
          <input type="text" name="salary" value={form.salary} onChange={handleChange} placeholder="e.g., Rs. 25,000 - 50,000" className={inputClass('salary')} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Age Limit</label>
          <input type="text" name="ageLimit" value={form.ageLimit} onChange={handleChange} placeholder="e.g., 18-32 years" className={inputClass('ageLimit')} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Application Fee</label>
          <input type="text" name="applicationFee" value={form.applicationFee} onChange={handleChange} placeholder="e.g., Rs. 500" className={inputClass('applicationFee')} />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Important Dates</label>
          <button
            type="button"
            onClick={addImportantDate}
            className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            <FiPlus className="w-4 h-4" /> Add Date
          </button>
        </div>
        <div className="space-y-3">
          {form.importantDates.map((item, idx) => (
            <div key={idx} className="flex gap-3 items-start">
              <input
                type="text"
                value={item.event || ''}
                onChange={(e) => updateImportantDate(idx, 'event', e.target.value)}
                placeholder="Event name"
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
              />
              <input
                type="date"
                value={item.date ? new Date(item.date).toISOString().split('T')[0] : ''}
                onChange={(e) => updateImportantDate(idx, 'date', e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 outline-none text-sm"
              />
              <button
                type="button"
                onClick={() => removeImportantDate(idx)}
                className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[160px]"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : exam ? (
            'Update Exam'
          ) : (
            'Create Exam'
          )}
        </button>
      </div>
    </form>
  );
};

export default ExamForm;
