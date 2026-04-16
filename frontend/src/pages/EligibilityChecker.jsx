import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiAlertTriangle, FiXCircle, FiSearch } from 'react-icons/fi';
import SEO from '../components/common/SEO';

const eligibilityData = [
  { name: 'UPSC Civil Services (IAS/IPS)', category: 'UPSC', minAge: 21, maxAge: 32, ageSC: 37, ageOBC: 35, ageEWS: 32, qualification: 'Graduation', minQualLevel: 3, attempts: 'Gen: 6, OBC: 9, SC/ST: Unlimited', nationality: 'Indian citizen', physicalReq: 'Medical fitness required' },
  { name: 'SSC CGL', category: 'SSC', minAge: 18, maxAge: 32, ageSC: 37, ageOBC: 35, ageEWS: 32, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'SSC CHSL', category: 'SSC', minAge: 18, maxAge: 27, ageSC: 32, ageOBC: 30, ageEWS: 27, qualification: '12th', minQualLevel: 2, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'SSC MTS', category: 'SSC', minAge: 18, maxAge: 25, ageSC: 30, ageOBC: 28, ageEWS: 25, qualification: '10th', minQualLevel: 1, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'SSC GD Constable', category: 'SSC', minAge: 18, maxAge: 23, ageSC: 28, ageOBC: 26, ageEWS: 23, qualification: '10th', minQualLevel: 1, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'Height: 170cm(M)/157cm(F), Chest: 80cm(M)' },
  { name: 'IBPS PO', category: 'Banking', minAge: 20, maxAge: 30, ageSC: 35, ageOBC: 33, ageEWS: 30, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen / Nepal / Bhutan subjects', physicalReq: 'None' },
  { name: 'IBPS Clerk', category: 'Banking', minAge: 20, maxAge: 28, ageSC: 33, ageOBC: 31, ageEWS: 28, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'SBI PO', category: 'Banking', minAge: 21, maxAge: 30, ageSC: 35, ageOBC: 33, ageEWS: 30, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'SBI Clerk', category: 'Banking', minAge: 20, maxAge: 28, ageSC: 33, ageOBC: 31, ageEWS: 28, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'RBI Grade B', category: 'Banking', minAge: 21, maxAge: 30, ageSC: 35, ageOBC: 33, ageEWS: 30, qualification: 'Graduation (60%)', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'RRB NTPC (Graduate)', category: 'Railways', minAge: 18, maxAge: 33, ageSC: 38, ageOBC: 36, ageEWS: 33, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'Medical fitness, Vision standards' },
  { name: 'RRB NTPC (12th Level)', category: 'Railways', minAge: 18, maxAge: 30, ageSC: 35, ageOBC: 33, ageEWS: 30, qualification: '12th', minQualLevel: 2, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'Medical fitness' },
  { name: 'Railway Group D', category: 'Railways', minAge: 18, maxAge: 33, ageSC: 38, ageOBC: 36, ageEWS: 33, qualification: '10th', minQualLevel: 1, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'PET: 35kg lift(M)/20kg(F), 1000m run' },
  { name: 'CDS (Combined Defence Services)', category: 'Defence', minAge: 19, maxAge: 25, ageSC: 25, ageOBC: 25, ageEWS: 25, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen (unmarried)', physicalReq: 'Strict medical & physical standards' },
  { name: 'NDA (National Defence Academy)', category: 'Defence', minAge: 16, maxAge: 19, ageSC: 19, ageOBC: 19, ageEWS: 19, qualification: '12th', minQualLevel: 2, attempts: 'No limit (within age)', nationality: 'Indian citizen (unmarried)', physicalReq: 'Strict physical & medical standards, SSB' },
  { name: 'AFCAT', category: 'Defence', minAge: 20, maxAge: 26, ageSC: 26, ageOBC: 26, ageEWS: 26, qualification: 'Graduation (60%)', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'Strict medical standards, AFSB' },
  { name: 'Indian Army Soldier GD', category: 'Defence', minAge: 17, maxAge: 21, ageSC: 21, ageOBC: 21, ageEWS: 21, qualification: '10th', minQualLevel: 1, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: '1600m run (5 min 30 sec), Pull-ups, Balance' },
  { name: 'CTET (Central Teacher)', category: 'Teaching', minAge: 18, maxAge: 65, ageSC: 65, ageOBC: 65, ageEWS: 65, qualification: 'Graduation + B.Ed/D.El.Ed', minQualLevel: 3, attempts: 'No limit', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'UGC NET (JRF & Asst Prof)', category: 'Teaching', minAge: 18, maxAge: 65, ageSC: 65, ageOBC: 65, ageEWS: 65, qualification: 'Post Graduation (55%)', minQualLevel: 4, attempts: 'No limit (JRF age: 31)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'KVS TGT/PGT', category: 'Teaching', minAge: 21, maxAge: 40, ageSC: 45, ageOBC: 43, ageEWS: 40, qualification: 'Graduation + B.Ed', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'State PSC (PCS)', category: 'State PSC', minAge: 21, maxAge: 40, ageSC: 45, ageOBC: 43, ageEWS: 40, qualification: 'Graduation', minQualLevel: 3, attempts: 'Varies by state', nationality: 'Indian citizen + State domicile', physicalReq: 'Medical fitness for some posts' },
  { name: 'UPPSC PCS', category: 'State PSC', minAge: 21, maxAge: 40, ageSC: 45, ageOBC: 43, ageEWS: 40, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen + UP domicile', physicalReq: 'None' },
  { name: 'SSC CPO (Sub-Inspector)', category: 'Police', minAge: 20, maxAge: 25, ageSC: 30, ageOBC: 28, ageEWS: 25, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'Height: 170cm(M)/157cm(F), PET required' },
  { name: 'Delhi Police SI', category: 'Police', minAge: 20, maxAge: 25, ageSC: 30, ageOBC: 28, ageEWS: 25, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'Height, Chest, PET required' },
  { name: 'Delhi Police Constable', category: 'Police', minAge: 18, maxAge: 25, ageSC: 30, ageOBC: 28, ageEWS: 25, qualification: '12th', minQualLevel: 2, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'Height: 170cm(M)/157cm(F), 1600m run' },
  { name: 'State Police Constable', category: 'Police', minAge: 18, maxAge: 25, ageSC: 30, ageOBC: 28, ageEWS: 25, qualification: '10th/12th (varies)', minQualLevel: 1, attempts: 'No limit (within age)', nationality: 'Indian citizen + State domicile', physicalReq: 'PET: Running, Long Jump, Shot Put' },
  { name: 'LIC AAO', category: 'Insurance', minAge: 21, maxAge: 30, ageSC: 35, ageOBC: 33, ageEWS: 30, qualification: 'Graduation (60%)', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'NIACL AO', category: 'Insurance', minAge: 21, maxAge: 30, ageSC: 35, ageOBC: 33, ageEWS: 30, qualification: 'Graduation (60%)', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'UIIC AO', category: 'Insurance', minAge: 21, maxAge: 30, ageSC: 35, ageOBC: 33, ageEWS: 30, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'GATE (PSU Recruitment)', category: 'GATE', minAge: 0, maxAge: 99, ageSC: 99, ageOBC: 99, ageEWS: 99, qualification: 'B.E./B.Tech/M.Sc', minQualLevel: 3, attempts: 'No limit', nationality: 'Indian citizen / Foreign nationals', physicalReq: 'None' },
  { name: 'UPSC EPFO (EO/AO)', category: 'UPSC', minAge: 21, maxAge: 30, ageSC: 35, ageOBC: 33, ageEWS: 30, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'UPSC ESE (Engineering)', category: 'UPSC', minAge: 21, maxAge: 30, ageSC: 35, ageOBC: 33, ageEWS: 30, qualification: 'B.E./B.Tech', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'UPSC CMS (Medical)', category: 'UPSC', minAge: 21, maxAge: 32, ageSC: 37, ageOBC: 35, ageEWS: 32, qualification: 'MBBS', minQualLevel: 4, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'Medical fitness' },
  { name: 'SEBI Grade A', category: 'Banking', minAge: 21, maxAge: 30, ageSC: 35, ageOBC: 33, ageEWS: 30, qualification: 'Graduation (60%)', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'NABARD Grade A', category: 'Banking', minAge: 21, maxAge: 30, ageSC: 35, ageOBC: 33, ageEWS: 30, qualification: 'Graduation (60%)', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'IBPS RRB PO', category: 'Banking', minAge: 18, maxAge: 30, ageSC: 35, ageOBC: 33, ageEWS: 30, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'IBPS SO (Specialist)', category: 'Banking', minAge: 20, maxAge: 30, ageSC: 35, ageOBC: 33, ageEWS: 30, qualification: 'Graduation/PG in specialization', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'RPF Constable', category: 'Police', minAge: 18, maxAge: 25, ageSC: 30, ageOBC: 28, ageEWS: 25, qualification: '10th', minQualLevel: 1, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'PET: 1600m run, Long Jump, High Jump' },
  { name: 'RPF Sub-Inspector', category: 'Police', minAge: 20, maxAge: 25, ageSC: 30, ageOBC: 28, ageEWS: 25, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'PET: 1600m run, Long Jump, High Jump' },
  { name: 'IB ACIO (Intelligence)', category: 'Police', minAge: 18, maxAge: 27, ageSC: 32, ageOBC: 30, ageEWS: 27, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'DSSSB TGT (Delhi)', category: 'Teaching', minAge: 18, maxAge: 32, ageSC: 37, ageOBC: 35, ageEWS: 32, qualification: 'Graduation + B.Ed + CTET', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'SUPER TET (UP)', category: 'Teaching', minAge: 21, maxAge: 40, ageSC: 45, ageOBC: 43, ageEWS: 40, qualification: 'Graduation + B.Ed + CTET/UPTET', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen + UP domicile', physicalReq: 'None' },
  { name: 'ESIC UDC', category: 'Insurance', minAge: 18, maxAge: 27, ageSC: 32, ageOBC: 30, ageEWS: 27, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'Indian Coast Guard', category: 'Defence', minAge: 18, maxAge: 22, ageSC: 22, ageOBC: 22, ageEWS: 22, qualification: '10th/12th/Diploma', minQualLevel: 1, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'PFT mandatory, Vision standards' },
  { name: 'SSC JE (Engineering)', category: 'SSC', minAge: 18, maxAge: 32, ageSC: 37, ageOBC: 35, ageEWS: 32, qualification: 'Diploma/Degree in Engineering', minQualLevel: 2, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'SSC Stenographer', category: 'SSC', minAge: 18, maxAge: 30, ageSC: 35, ageOBC: 33, ageEWS: 30, qualification: '12th', minQualLevel: 2, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'Stenography skill test (80/100 wpm)' },
];

const qualLevelMap = { '10th': 1, '12th': 2, Diploma: 2, 'Graduation': 3, 'Post Graduation': 4 };

const EligibilityChecker = () => {
  const [form, setForm] = useState({ age: '', qualification: '', category: 'General' });
  const [results, setResults] = useState(null);
  const [checked, setChecked] = useState(false);
  const [showAllNotEligible, setShowAllNotEligible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const age = parseInt(form.age);
    if (isNaN(age) || age < 14 || age > 60) return;

    const userQualLevel = qualLevelMap[form.qualification] || 0;
    const cat = form.category;

    const eligible = [];
    const almostEligible = [];
    const notEligible = [];

    eligibilityData.forEach((exam) => {
      const maxAge = cat === 'SC' || cat === 'ST' ? exam.ageSC : cat === 'OBC' ? exam.ageOBC : cat === 'EWS' ? (exam.ageEWS || exam.maxAge) : exam.maxAge;
      const qualMet = userQualLevel >= exam.minQualLevel;
      const ageMet = age >= exam.minAge && age <= maxAge;
      const ageAlmost = age >= exam.minAge - 1 && age <= maxAge + 2;

      const details = {
        ageRange: `${exam.minAge}-${maxAge} years`,
        attempts: exam.attempts || 'No limit',
        nationality: exam.nationality || 'Indian citizen',
        relaxation: cat === 'SC' || cat === 'ST' ? '+5 years' : cat === 'OBC' ? '+3 years' : cat === 'EWS' ? 'No relaxation' : 'N/A',
      };

      if (qualMet && ageMet) {
        eligible.push({ ...exam, ...details, reason: `Age ${age} within ${exam.minAge}-${maxAge} years, ${form.qualification} meets ${exam.qualification} requirement` });
      } else if (qualMet && ageAlmost && !ageMet) {
        const reason = age > maxAge ? `You are ${age - maxAge} year(s) above the max age (${maxAge})` : `You are ${exam.minAge - age} year(s) below minimum age (${exam.minAge})`;
        almostEligible.push({ ...exam, ...details, reason });
      } else if (!qualMet && ageMet) {
        almostEligible.push({ ...exam, ...details, reason: `Age eligible, but requires ${exam.qualification} (you have ${form.qualification})` });
      } else {
        const reasons = [];
        if (!qualMet) reasons.push(`Requires ${exam.qualification}`);
        if (!ageMet) reasons.push(`Age limit: ${exam.minAge}-${maxAge} years`);
        notEligible.push({ ...exam, ...details, reason: reasons.join('. ') });
      }
    });

    setResults({ eligible, almostEligible, notEligible });
    setChecked(true);
  };

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
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO title="Eligibility Checker" path="/eligibility-checker" description="Instantly check which government exams you're eligible for based on your age, education, and category. Covers UPSC, SSC, Banking, Railways, Defence, and more." />
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/25">
          <FiCheckCircle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
          Eligibility <span className="gradient-text">Checker</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400">Find out which government exams you're eligible for in seconds</p>
      </div>

      {/* Form */}
      <div className="max-w-xl mx-auto mb-10">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-lg">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Your Age</label>
              <input
                type="number"
                min="14"
                max="60"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                placeholder="Enter your age"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Highest Qualification</label>
              <select
                value={form.qualification}
                onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="">Select Qualification</option>
                <option value="10th">10th Pass</option>
                <option value="12th">12th Pass</option>
                <option value="Diploma">Diploma (ITI/Polytechnic)</option>
                <option value="Graduation">Graduation (B.A/B.Sc/B.Com/B.Tech etc.)</option>
                <option value="Post Graduation">Post Graduation (M.A/M.Sc/MBA/M.Tech etc.)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="General">General</option>
                <option value="EWS">EWS (Economically Weaker Section)</option>
                <option value="OBC">OBC (Other Backward Classes)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25 flex items-center justify-center gap-2"
            >
              <FiSearch className="w-5 h-5" /> Check Eligibility
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {checked && results && (
        <div className="space-y-8">
          {/* Summary Banner */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
              Results for: Age {form.age}, {form.qualification}, {form.category} Category
            </h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm">
                <p className="text-2xl font-extrabold text-green-600">{results.eligible.length}</p>
                <p className="text-xs text-gray-500 mt-1">Eligible</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm">
                <p className="text-2xl font-extrabold text-yellow-600">{results.almostEligible.length}</p>
                <p className="text-xs text-gray-500 mt-1">Almost Eligible</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm">
                <p className="text-2xl font-extrabold text-gray-400">{results.notEligible.length}</p>
                <p className="text-xs text-gray-500 mt-1">Not Eligible</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
              Out of {eligibilityData.length} government exams checked, you are eligible for <strong className="text-green-600">{results.eligible.length}</strong> exams.
            </p>
          </div>

          {/* Eligible */}
          {results.eligible.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FiCheckCircle className="w-6 h-6 text-green-500" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Eligible Exams ({results.eligible.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.eligible.map((exam, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border-2 border-green-200 dark:border-green-800 p-5 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{exam.name}</h3>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${categoryBadgeColors[exam.category] || 'bg-gray-100 text-gray-600'}`}>{exam.category}</span>
                    </div>
                    <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1.5">
                      <FiCheckCircle className="w-4 h-4 flex-shrink-0" /> {exam.reason}
                    </p>
                    <div className="mt-3 space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded text-green-700 dark:text-green-400">Age: {exam.ageRange}</span>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded text-blue-700 dark:text-blue-400">Qual: {exam.qualification}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded">Attempts: {exam.attempts}</span>
                        <span className="px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded">Nationality: {exam.nationality}</span>
                      </div>
                      {form.category !== 'General' && (
                        <div className="px-2 py-1 bg-orange-50 dark:bg-orange-900/20 rounded text-orange-700 dark:text-orange-400 inline-block">
                          {form.category} relaxation: {exam.relaxation}
                        </div>
                      )}
                      {exam.physicalReq && exam.physicalReq !== 'None' && (
                        <div className="px-2 py-1 bg-red-50 dark:bg-red-900/20 rounded text-red-700 dark:text-red-400 inline-block">
                          Physical: {exam.physicalReq}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Almost Eligible */}
          {results.almostEligible.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FiAlertTriangle className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Almost Eligible ({results.almostEligible.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.almostEligible.map((exam, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border-2 border-yellow-200 dark:border-yellow-800 p-5 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{exam.name}</h3>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${categoryBadgeColors[exam.category] || 'bg-gray-100 text-gray-600'}`}>{exam.category}</span>
                    </div>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400 flex items-center gap-1.5">
                      <FiAlertTriangle className="w-4 h-4 flex-shrink-0" /> {exam.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Not Eligible */}
          {results.notEligible.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FiXCircle className="w-6 h-6 text-gray-400" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Not Eligible ({results.notEligible.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(showAllNotEligible ? results.notEligible : results.notEligible.slice(0, 6)).map((exam, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-5 opacity-70">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-700 dark:text-gray-300">{exam.name}</h3>
                      <span className="px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500">{exam.category}</span>
                    </div>
                    <p className="text-sm text-gray-500 flex items-center gap-1.5">
                      <FiXCircle className="w-4 h-4 flex-shrink-0" /> {exam.reason}
                    </p>
                  </div>
                ))}
              </div>
              {results.notEligible.length > 6 && (
                <button
                  onClick={() => setShowAllNotEligible(!showAllNotEligible)}
                  className="mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  {showAllNotEligible ? 'Show Less' : `Show All ${results.notEligible.length} Not Eligible Exams`}
                </button>
              )}
            </div>
          )}

          {/* CTA */}
          <div className="text-center pt-6">
            <Link to="/ai-guide" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
              Get Personalized Recommendations from AI Guide
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default EligibilityChecker;
