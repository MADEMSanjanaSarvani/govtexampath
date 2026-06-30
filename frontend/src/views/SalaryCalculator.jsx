import React, { useState, useMemo } from 'react';
import { FiDollarSign, FiChevronDown, FiInfo } from 'react-icons/fi';
import SEO from '../components/common/SEO';
import Breadcrumb from '../components/common/Breadcrumb';
import { useLanguage } from '../context/LanguageContext';

const posts = [
  { name: 'IAS / IPS Officer (Entry)', level: 10, basic7: 56100, grade: 'Group A' },
  { name: 'SSC CGL - Tax Assistant / Auditor', level: 5, basic7: 29200, grade: 'Group C' },
  { name: 'SSC CGL - Inspector (CBDT/CBIC)', level: 7, basic7: 44900, grade: 'Group B' },
  { name: 'SSC CHSL - DEO / LDC', level: 2, basic7: 19900, grade: 'Group C' },
  { name: 'SSC MTS - Multi Tasking Staff', level: 1, basic7: 18000, grade: 'Group C' },
  { name: 'IBPS PO / SBI PO (Entry)', level: 'Bank', basic7: 48480, grade: 'Officer' },
  { name: 'IBPS Clerk / SBI Clerk (Entry)', level: 'Bank', basic7: 26730, grade: 'Clerical' },
  { name: 'RBI Grade B Officer', level: 'RBI', basic7: 78450, grade: 'Officer' },
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
  { name: 'SEBI Grade A Officer', level: 'Reg', basic7: 62500, grade: 'Officer' },
  { name: 'NABARD Grade A / SIDBI Grade A', level: 'Bank', basic7: 44500, grade: 'Officer' },
  { name: 'Civil Judge (Junior Division)', level: 9, basic7: 53100, grade: 'Judicial' },
  { name: 'SSC CPO - Sub Inspector (CAPF)', level: 6, basic7: 35400, grade: 'Group B' },
  { name: 'State Police Sub-Inspector', level: 6, basic7: 35400, grade: 'Group B' },
  { name: 'BSF / ITBP / CRPF Constable GD', level: 3, basic7: 21700, grade: 'Group C' },
  { name: 'BSF Head Constable Ministerial', level: 4, basic7: 25500, grade: 'Group C' },
  { name: 'PSU Engineer E-1 (HAL/NHPC/BEML)', level: 'PSU', basic7: 40000, grade: 'Executive' },
  { name: 'PSU Engineer E-2 (ISRO/GAIL/ONGC)', level: 'PSU', basic7: 60000, grade: 'Executive' },
  { name: 'HPCL Officer Grade A', level: 'PSU', basic7: 60000, grade: 'Executive' },
  { name: 'RRB Junior Engineer (Level 6)', level: 6, basic7: 35400, grade: 'Group B' },
  { name: 'EPFO Enforcement Officer', level: 7, basic7: 44900, grade: 'Group B' },
  { name: 'FCI Junior Engineer (E-1 IDA)', level: 'PSU', basic7: 40000, grade: 'Executive' },
];

const cityTypes = [
  { label: 'X (Delhi, Mumbai, Kolkata, Chennai, Bangalore, Hyderabad)', hra: 27 },
  { label: 'Y (Other state capitals, cities with 50L+ population)', hra: 18 },
  { label: 'Z (All other cities and towns)', hra: 9 },
];

const SalaryCalculator = () => {
  const { t } = useLanguage();
  const [selectedPost, setSelectedPost] = useState(0);
  const [cityType, setCityType] = useState(0);
  const [use8thCPC, setUse8thCPC] = useState(false);

  const salary = useMemo(() => {
    const post = posts[selectedPost];
    const fitment = use8thCPC ? 2.57 : 1;
    const basic = Math.round(post.basic7 * fitment);
    const da = Math.round(basic * (use8thCPC ? 0 : 0.50));
    const hra = Math.round(basic * (cityTypes[cityType].hra / 100));
    const ta = typeof post.level === 'number' && post.level >= 9 ? 7200 : 3600;
    const taWithDA = Math.round(ta * (1 + (use8thCPC ? 0 : 0.50)));
    const gross = basic + da + hra + taWithDA;
    const nps = Math.round(basic * 0.10);
    const annualGross = gross * 12;
    const taxableIncome = Math.max(0, annualGross - 75000);
    let annualTax = 0;
    if (taxableIncome > 2400000) annualTax += (taxableIncome - 2400000) * 0.30;
    if (taxableIncome > 2000000) annualTax += Math.min(taxableIncome - 2000000, 400000) * 0.25;
    if (taxableIncome > 1600000) annualTax += Math.min(taxableIncome - 1600000, 400000) * 0.20;
    if (taxableIncome > 1200000) annualTax += Math.min(taxableIncome - 1200000, 400000) * 0.15;
    if (taxableIncome > 800000) annualTax += Math.min(taxableIncome - 800000, 400000) * 0.10;
    if (taxableIncome > 400000) annualTax += Math.min(taxableIncome - 400000, 400000) * 0.05;
    if (taxableIncome <= 1200000) annualTax = 0;
    const tax = Math.round(annualTax / 12);
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
          {t('salaryCalcTitle').split(' ').slice(0, 2).join(' ')} <span className="gradient-text">{t('salaryCalcTitle').split(' ').slice(2).join(' ')}</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Estimate your monthly take-home salary for any government post under the 7th and expected 8th Pay Commission
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('selectPost')}</label>
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
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('cityType')}</label>
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
            <p className="font-semibold text-amber-800 dark:text-amber-300 text-sm">{t('payCommission8th')}</p>
            <p className="text-xs text-amber-600 dark:text-amber-400">{t('fitmentFactor')}</p>
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
          {t('monthlyBreakdown')}
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
            {use8thCPC ? t('payCommission8thExpected') : t('payCommission7th')}
          </span>
        </h2>

        <div className="space-y-3">
          {[
            { label: t('basicPay'), value: salary.basic, color: 'text-blue-600 dark:text-blue-400' },
            { label: `${t('dearnessAllowance')} (DA ${use8thCPC ? '0%' : '50%'})`, value: salary.da, color: 'text-purple-600 dark:text-purple-400' },
            { label: `${t('houseRentAllowance')} (HRA ${cityTypes[cityType].hra}%)`, value: salary.hra, color: 'text-green-600 dark:text-green-400' },
            { label: t('transportAllowance'), value: salary.ta, color: 'text-orange-600 dark:text-orange-400' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700/50">
              <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
              <span className={`font-semibold ${item.color}`}>₹{item.value.toLocaleString('en-IN')}</span>
            </div>
          ))}

          <div className="flex items-center justify-between py-3 bg-green-50 dark:bg-green-900/20 rounded-xl px-4 mt-2">
            <span className="font-bold text-green-800 dark:text-green-300">{t('grossSalary')}</span>
            <span className="text-xl font-extrabold text-green-700 dark:text-green-400">₹{salary.gross.toLocaleString('en-IN')}</span>
          </div>

          <div className="pt-2 space-y-2">
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">{t('npsDeduction')}</span>
              <span className="text-sm font-medium text-red-500">-₹{salary.nps.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">{t('estimatedTax')}</span>
              <span className="text-sm font-medium text-red-500">-₹{salary.tax.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex items-center justify-between py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl px-4 mt-2">
            <span className="font-bold text-blue-800 dark:text-blue-300 text-lg">{t('estimatedTakeHome')}</span>
            <span className="text-2xl font-extrabold text-blue-700 dark:text-blue-400">₹{salary.net.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Annual View */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('annualGrossCTC')}</p>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">₹{(salary.gross * 12).toLocaleString('en-IN')}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">₹{((salary.gross * 12) / 100000).toFixed(1)} LPA</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('annualTakeHome')}</p>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">₹{(salary.net * 12).toLocaleString('en-IN')}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">₹{((salary.net * 12) / 100000).toFixed(1)} LPA</p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 flex gap-4">
        <FiInfo className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <p className="font-semibold mb-1">{t('disclaimerTitle')}</p>
          <p>{t('salaryDisclaimer')}</p>
        </div>
      </div>

      {/* Educational Content Section */}
      <section className="mt-16 mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-10">

          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">
            Government Job Salary Structure in India: Complete Guide
          </h2>

          <div className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
            <p>
              The salary structure for central government employees in India is governed by the recommendations of the Central Pay Commission, which is constituted roughly every ten years. The 7th Central Pay Commission (7th CPC), implemented from January 2016, is currently in effect, while the 8th Pay Commission is expected to take effect from January 2027. Understanding this structure is crucial for any government job aspirant because it determines not just your monthly income but also your career-long financial trajectory, pension benefits, and post-retirement security.
            </p>
            <p>
              Under the 7th CPC, a government employee's total compensation consists of several components. The <strong className="text-gray-900 dark:text-gray-100">Basic Pay</strong> is the foundational component, determined by the Pay Level and the specific cell within the Pay Matrix. <strong className="text-gray-900 dark:text-gray-100">Dearness Allowance (DA)</strong> is a cost-of-living adjustment linked to the All India Consumer Price Index, revised twice a year in January and July. As of mid-2026, DA stands at approximately 50 percent of Basic Pay. <strong className="text-gray-900 dark:text-gray-100">House Rent Allowance (HRA)</strong> varies based on the city classification: 27 percent for X cities (major metros), 18 percent for Y cities (state capitals and large cities), and 9 percent for Z cities (all other locations). <strong className="text-gray-900 dark:text-gray-100">Transport Allowance (TA)</strong> is paid at a fixed rate with DA applied on top of it, and varies by pay level. Other components include Children Education Allowance, Leave Travel Concession (LTC), and various special duty allowances depending on the nature of the posting.
            </p>
            <p>
              Together, these allowances can add 80 to 120 percent on top of your Basic Pay, meaning the actual take-home salary is often more than double the basic figure. This is a critical point that many aspirants overlook when comparing government salaries with private sector packages. The structured, transparent, and periodically revised nature of government pay makes it one of the most predictable and secure income streams available in India.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">
              Pay Matrix Levels Explained
            </h3>
            <p>
              The 7th CPC introduced a rationalized Pay Matrix with 18 levels, replacing the older system of Pay Bands and Grade Pay. Each level corresponds to a certain grade of government service, and within each level, there are 40 cells representing annual increments. Here is a simplified overview of the key levels that are relevant to competitive exam aspirants.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Level 1 (Basic Pay: Rs 18,000 to Rs 56,900):</strong> This is the entry level for Group D posts such as Multi-Tasking Staff (MTS) recruited through SSC MTS examination, Safaiwala, and Peon. Despite being the lowest pay level, the total compensation with DA, HRA, and other allowances can reach Rs 30,000 to Rs 38,000 per month in metro cities.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Level 2 to 3 (Basic Pay: Rs 19,900 to Rs 63,200):</strong> Group C posts such as Lower Division Clerk (LDC), Data Entry Operator (DEO), and SSC GD Constable fall in this range. The SSC CHSL examination recruits candidates for Level 2 and Level 4 posts.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Level 4 to 5 (Basic Pay: Rs 25,500 to Rs 81,100):</strong> Posts like Postal Assistant, Sorting Assistant, Tax Assistant, and Auditor are placed here. SSC CGL recruits for many Level 5 positions, and the starting take-home salary in a metro city can be around Rs 50,000 to Rs 55,000 per month.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Level 6 to 7 (Basic Pay: Rs 35,400 to Rs 1,12,400):</strong> This range covers Group B posts such as Sub-Inspector of Police, Inspector (CBDT/CBIC), TGT Teachers in KVS, and equivalent positions. These are among the most sought-after posts in SSC CGL and SSC CPO examinations.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Level 10 (Basic Pay: Rs 56,100 to Rs 1,77,500):</strong> This is the entry level for Group A officers recruited through UPSC Civil Services (IAS, IPS, IFS), State PSC exams, NDA, and CDS. An IAS officer at Level 10 in a metro city can draw a gross salary of over Rs 1,00,000 per month, in addition to substantial perquisites such as government housing, vehicle, household staff, and other benefits that are not reflected in the pay slip.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Level 11 to 14 (Basic Pay: Rs 67,700 to Rs 2,08,700):</strong> These levels cover mid-career to senior Group A positions. An IAS officer typically reaches Level 14 (Joint Secretary) after 16 to 20 years of service, with a basic pay upward of Rs 1,44,200. At this level, the gross monthly compensation including all allowances can exceed Rs 2,50,000.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">
              Allowances That Double Your Take-Home
            </h3>
            <p>
              One of the most significant advantages of government employment is the comprehensive allowance structure. While the basic pay might appear modest compared to private sector base salaries, the allowances substantially increase the actual monthly income. Here is a detailed breakdown of the major allowances.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Dearness Allowance (DA):</strong> DA is the single largest allowance component and is currently at approximately 50 percent of basic pay as of mid-2026. It is revised every January and July based on the All India Consumer Price Index for Industrial Workers (AICPI-IW). Over the life of a pay commission, DA can accumulate significantly. Under the 6th CPC, DA had reached 125 percent before the 7th CPC was implemented with a merged base. For an employee with a basic pay of Rs 56,100 (Level 10), DA alone adds approximately Rs 28,050 per month.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">House Rent Allowance (HRA):</strong> HRA is calculated as a percentage of basic pay and varies by city classification. X-class cities (Delhi, Mumbai, Kolkata, Chennai, Bengaluru, Hyderabad) offer 27 percent HRA. Y-class cities (other state capitals and cities with a population exceeding 50 lakh) offer 18 percent. Z-class cities (all remaining locations) offer 9 percent. For a Level 10 officer posted in Delhi, HRA amounts to approximately Rs 15,147 per month. When DA crosses 25 percent and 50 percent thresholds, HRA rates are revised upward by 3 percentage points at each threshold, though these rates are subject to government orders.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Transport Allowance (TA):</strong> Officers at Level 9 and above receive a base TA of Rs 7,200 per month, while those below Level 9 receive Rs 3,600. DA is additionally applicable on TA. In cities classified as X, higher rates may apply. For a Level 10 officer, TA with DA amounts to roughly Rs 10,800 per month.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Children Education Allowance:</strong> Government employees receive Rs 2,250 per month per child for up to two children to cover educational expenses, along with a hostel subsidy of Rs 6,750 per month per child. This benefit continues from nursery through the twelfth standard. This allowance is not subject to income tax, making it particularly valuable.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Other Allowances:</strong> Depending on the nature of duties and posting location, employees may receive additional allowances such as Risk and Hardship Allowance, Special Duty Allowance for Northeast and Naxal-affected areas (up to 30 percent of basic pay), Night Duty Allowance, Overtime Allowance, and Uniform Allowance. Defence personnel receive Military Service Pay, Field Area Allowance, and Siachen Allowance, which can significantly boost their total compensation.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">
              Salary Comparison: Government vs Private Sector
            </h3>
            <p>
              Comparing government and private sector salaries purely on the basis of monthly take-home or CTC (Cost to Company) figures is fundamentally misleading. Several factors make government compensation far more valuable than the headline numbers suggest.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Pension and Retirement Benefits:</strong> Although the New Pension Scheme (NPS) has replaced the Old Pension Scheme (OPS) for employees who joined after January 2004, the government still contributes 14 percent of Basic Pay plus DA to the employee's NPS account (the employee contributes 10 percent). Under OPS, which some states are restoring, employees receive 50 percent of their last drawn basic pay as lifelong pension, along with Dearness Relief. A private sector employee would need to accumulate a retirement corpus of Rs 3 to 5 crore to generate an equivalent monthly pension through annuities. This pension benefit alone is worth Rs 10,000 to Rs 20,000 per month in equivalent private sector CTC during working years.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Job Security Premium:</strong> Government jobs offer virtually guaranteed employment until retirement at age 60 (or 62 for some services). There are no layoffs, no performance-based terminations in the corporate sense, and no economic downturns leading to mass retrenchments. Economists estimate that this job security is worth a 15 to 25 percent premium over equivalent private sector roles. During the COVID-19 pandemic, while millions of private sector employees faced pay cuts and job losses, government employees received their full salaries without interruption and even received DA hikes.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Perquisites Not Reflected in CTC:</strong> Senior government officers enjoy benefits that have no direct private sector equivalent. These include government housing at highly subsidized rates (often in prime locations where market rent would be Rs 50,000 to Rs 2,00,000 per month), official vehicles with fuel and driver, domestic help, medical reimbursement covering the entire family without any cap, subsidized canteens, Leave Travel Concession, and children's education facilities. For an IAS officer at the Joint Secretary level, these perquisites can be valued at Rs 1,50,000 to Rs 3,00,000 per month over and above the regular salary.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">Pay Commission Revisions:</strong> Every 10 years, the Pay Commission revises salaries with a fitment factor. The 6th CPC applied a fitment factor of 1.86x, and the 7th CPC applied 2.57x. This means that a government employee's salary effectively doubles every decade through Pay Commission revisions alone, in addition to annual increments and DA increases. No private sector job offers such a systematic, guaranteed salary escalation mechanism.
            </p>
            <p>
              When all these factors are accounted for, a government salary at Level 7 (Basic Pay Rs 44,900, gross approximately Rs 80,000 per month) is roughly equivalent to a private sector CTC of Rs 14 to 18 LPA when factoring in pension, job security, perquisites, and long-term pay progression.
            </p>

            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-8 mb-4">
              Which Government Jobs Pay the Highest?
            </h3>
            <p>
              While most government positions offer comfortable compensation, certain roles stand out for their exceptional pay packages. Here are the top-paying government positions in India.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">1. Cabinet Secretary:</strong> The Cabinet Secretary is the highest-ranking civil servant in India and draws a salary at Level 18, the apex of the Pay Matrix. The basic pay is Rs 2,50,000 per month (the maximum under the 7th CPC), with a total monthly compensation including allowances and perquisites estimated at Rs 4,00,000 to Rs 5,00,000. The Cabinet Secretary also receives a government bungalow in Lutyens' Delhi, an official car, security, and other facilities. This position is the pinnacle of the IAS career trajectory.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">2. RBI Governor:</strong> The Governor of the Reserve Bank of India draws a monthly salary of approximately Rs 2,50,000 along with substantial allowances including free furnished accommodation, car, medical facilities, and staff. The total compensation package is estimated at over Rs 5,00,000 per month. Additionally, the RBI Governor wields enormous influence over India's monetary policy, making it one of the most powerful financial positions in the country.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">3. SEBI Chairman:</strong> The Chairman of the Securities and Exchange Board of India receives compensation that is among the highest in the regulatory sector. The total package, including allowances and benefits, is estimated at Rs 4,00,000 to Rs 5,00,000 per month. SEBI officers, even at the entry level (Grade A), enjoy a significantly higher pay structure than their counterparts in central government service, with a starting gross salary of approximately Rs 1,00,000 per month.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">4. IAS Officers (Senior Levels):</strong> While IAS officers start at Level 10, their career trajectory can take them to Level 17 (Secretary to Government of India) with a basic pay of Rs 2,25,000 per month. Combined with DA, HRA, and extensive perquisites (including a bungalow in the national capital, vehicle, staff, and medical facilities for the entire family), the total compensation for a Secretary-level IAS officer is estimated at Rs 4,00,000 to Rs 6,00,000 per month when perquisites are monetized. The IAS also offers postings to international organizations and state-level constitutional positions that further enhance compensation.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">5. RBI Grade B Officers:</strong> RBI Grade B officers are among the highest-paid entry-level government officers in India. The starting basic pay is approximately Rs 55,200, but the RBI offers additional allowances that other government services do not, including a substantially higher HRA (up to 30 percent in metros), Grade Allowance, Special Allowance, and Family Allowance. The starting gross salary for an RBI Grade B officer exceeds Rs 1,05,000 per month, and the total CTC including perquisites is estimated at approximately Rs 18 to 20 LPA. With promotions and increments, RBI officers at the Director level can earn upward of Rs 3,00,000 per month.
            </p>
            <p>
              Other notable high-paying government positions include officers of the Indian Revenue Service (IRS), Indian Foreign Service (IFS) diplomats who receive foreign allowances in hard currency, NABARD officers, public sector bank officers at the General Manager level and above, and officers of the Indian Railway Traffic Service (IRTS) who manage one of the world's largest railway networks. For aspirants focused on maximizing financial returns, regulatory bodies such as SEBI, RBI, and IRDAI consistently offer the highest starting packages among government organizations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SalaryCalculator;
