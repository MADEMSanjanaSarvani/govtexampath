import React, { useState, useMemo } from 'react';
import { FiDollarSign, FiChevronDown, FiInfo } from 'react-icons/fi';
import SEO from '../components/common/SEO';
import Breadcrumb from '../components/common/Breadcrumb';

const posts = [
  { name: 'IAS / IPS Officer (Entry)', level: 10, basic7: 56100, grade: 'Group A' },
  { name: 'SSC CGL - Tax Assistant / Auditor', level: 5, basic7: 29200, grade: 'Group C' },
  { name: 'SSC CGL - Inspector (CBDT/CBIC)', level: 7, basic7: 44900, grade: 'Group B' },
  { name: 'SSC CHSL - DEO / LDC', level: 2, basic7: 19900, grade: 'Group C' },
  { name: 'SSC MTS - Multi Tasking Staff', level: 1, basic7: 18000, grade: 'Group C' },
  { name: 'IBPS PO / SBI PO (Entry)', level: 'Bank', basic7: 36000, grade: 'Officer' },
  { name: 'IBPS Clerk / SBI Clerk (Entry)', level: 'Bank', basic7: 19900, grade: 'Clerical' },
  { name: 'RBI Grade B Officer', level: 'RBI', basic7: 55200, grade: 'Officer' },
  { name: 'RRB NTPC - Station Master', level: 5, basic7: 29200, grade: 'Group C' },
  { name: 'RRB NTPC - Goods Guard', level: 5, basic7: 29200, grade: 'Group C' },
  { name: 'Railway Group D', level: 1, basic7: 18000, grade: 'Group D' },
  { name: 'NDA / CDS - Lieutenant (Entry)', level: 10, basic7: 56100, grade: 'Officer' },
  { name: 'SSC GD Constable (CAPF)', level: 3, basic7: 21700, grade: 'Group C' },
  { name: 'SSC CPO - Sub Inspector', level: 6, basic7: 35400, grade: 'Group B' },
  { name: 'CTET - KVS PRT Teacher', level: 6, basic7: 35400, grade: 'Group B' },
  { name: 'CTET - KVS TGT Teacher', level: 7, basic7: 44900, grade: 'Group B' },
  { name: 'UGC NET - Assistant Professor', level: 10, basic7: 57700, grade: 'Group A' },
  { name: 'State PSC - SDM / DSP (Entry)', level: 10, basic7: 56100, grade: 'Group A' },
  { name: 'LIC AAO - Asst Administrative Officer', level: 'Ins', basic7: 38000, grade: 'Officer' },
  { name: 'Delhi Police Constable', level: 3, basic7: 21700, grade: 'Group C' },
  { name: 'India Post - Postal Assistant', level: 4, basic7: 25500, grade: 'Group C' },
  { name: 'SEBI Grade A Officer', level: 'Reg', basic7: 44500, grade: 'Officer' },
];

const cityTypes = [
  { label: 'X (Delhi, Mumbai, Kolkata, Chennai, Bangalore, Hyderabad)', hra: 27 },
  { label: 'Y (Other state capitals, cities with 50L+ population)', hra: 18 },
  { label: 'Z (All other cities and towns)', hra: 9 },
];

const SalaryCalculator = () => {
  const [selectedPost, setSelectedPost] = useState(0);
  const [cityType, setCityType] = useState(0);
  const [use8thCPC, setUse8thCPC] = useState(false);

  const salary = useMemo(() => {
    const post = posts[selectedPost];
    const fitment = use8thCPC ? 2.57 : 1;
    const basic = Math.round(post.basic7 * fitment);
    const da = Math.round(basic * (use8thCPC ? 0 : 0.53));
    const hra = Math.round(basic * (cityTypes[cityType].hra / 100));
    const ta = typeof post.level === 'number' && post.level >= 9 ? 7200 : 3600;
    const taWithDA = Math.round(ta * (1 + (use8thCPC ? 0 : 0.53)));
    const gross = basic + da + hra + taWithDA;
    const nps = Math.round(basic * 0.10);
    const tax = gross > 100000 ? Math.round((gross - 100000) * 0.10) : 0;
    const net = gross - nps - tax;

    return { basic, da, hra, ta: taWithDA, gross, nps, tax, net, post };
  }, [selectedPost, cityType, use8thCPC]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO
        title="Government Job Salary Calculator 2026"
        path="/salary-calculator"
        description="Calculate take-home salary for government jobs. Estimated salary for IAS, SSC CGL, IBPS PO, Railways, Defence, Teaching posts under 7th and 8th Pay Commission."
      />
      <Breadcrumb items={[{ label: 'Salary Calculator' }]} />

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/25">
          <FiDollarSign className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
          Government Job <span className="gradient-text">Salary Calculator</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Estimate your monthly take-home salary for any government post under the 7th and expected 8th Pay Commission
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Post</label>
          <div className="relative">
            <select
              value={selectedPost}
              onChange={(e) => setSelectedPost(Number(e.target.value))}
              className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none cursor-pointer"
            >
              {posts.map((post, i) => (
                <option key={i} value={i}>{post.name}</option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">City Type (for HRA)</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {cityTypes.map((city, i) => (
              <button
                key={i}
                onClick={() => setCityType(i)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                  cityType === i
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600 text-green-700 dark:text-green-400'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-green-300'
                }`}
              >
                City {city.label.split(' ')[0]} ({city.hra}% HRA)
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-300 text-sm">8th Pay Commission (Expected)</p>
            <p className="text-xs text-amber-600 dark:text-amber-400">Fitment factor 2.57x — expected from January 2027</p>
          </div>
          <button
            onClick={() => setUse8thCPC(!use8thCPC)}
            className={`relative w-14 h-7 rounded-full transition-colors ${use8thCPC ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
          >
            <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${use8thCPC ? 'translate-x-7' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>

      {/* Salary Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          Monthly Salary Breakdown
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
            {use8thCPC ? '8th CPC (Expected)' : '7th CPC (Current)'}
          </span>
        </h2>

        <div className="space-y-3">
          {[
            { label: 'Basic Pay', value: salary.basic, color: 'text-blue-600 dark:text-blue-400' },
            { label: `Dearness Allowance (DA ${use8thCPC ? '0%' : '53%'})`, value: salary.da, color: 'text-purple-600 dark:text-purple-400' },
            { label: `House Rent Allowance (HRA ${cityTypes[cityType].hra}%)`, value: salary.hra, color: 'text-green-600 dark:text-green-400' },
            { label: 'Transport Allowance (with DA)', value: salary.ta, color: 'text-orange-600 dark:text-orange-400' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700/50">
              <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
              <span className={`font-semibold ${item.color}`}>₹{item.value.toLocaleString('en-IN')}</span>
            </div>
          ))}

          <div className="flex items-center justify-between py-3 bg-green-50 dark:bg-green-900/20 rounded-xl px-4 mt-2">
            <span className="font-bold text-green-800 dark:text-green-300">Gross Salary</span>
            <span className="text-xl font-extrabold text-green-700 dark:text-green-400">₹{salary.gross.toLocaleString('en-IN')}</span>
          </div>

          <div className="pt-2 space-y-2">
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">NPS Deduction (10%)</span>
              <span className="text-sm font-medium text-red-500">-₹{salary.nps.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">Estimated Tax</span>
              <span className="text-sm font-medium text-red-500">-₹{salary.tax.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex items-center justify-between py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl px-4 mt-2">
            <span className="font-bold text-blue-800 dark:text-blue-300 text-lg">Estimated Take-Home</span>
            <span className="text-2xl font-extrabold text-blue-700 dark:text-blue-400">₹{salary.net.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Annual View */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Annual Gross (CTC)</p>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">₹{(salary.gross * 12).toLocaleString('en-IN')}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">₹{((salary.gross * 12) / 100000).toFixed(1)} LPA</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Annual Take-Home</p>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">₹{(salary.net * 12).toLocaleString('en-IN')}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">₹{((salary.net * 12) / 100000).toFixed(1)} LPA</p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 flex gap-4">
        <FiInfo className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <p className="font-semibold mb-1">Disclaimer</p>
          <p>These are estimated figures based on 7th CPC pay matrix and expected 8th CPC fitment factor of 2.57x. Actual salary may vary based on posting location, additional allowances, and individual tax slabs. Banking and insurance salaries follow their own pay structures. The 8th CPC figures are projections and subject to government notification.</p>
        </div>
      </div>
    </div>
  );
};

export default SalaryCalculator;
