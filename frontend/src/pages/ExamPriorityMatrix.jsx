import React, { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTarget, FiTrendingUp, FiAward, FiAlertTriangle, FiFilter, FiChevronRight, FiUsers, FiBriefcase, FiDollarSign, FiStar, FiClock, FiArrowRight, FiZap, FiEye, FiThumbsUp } from 'react-icons/fi';
import SEO from '../components/common/SEO';
import { useLanguage } from '../context/LanguageContext';

const examPriorityData = [
  // Sweet Spot
  {
    name: 'RBI Grade B', category: 'Banking', qualification: 'graduation', quadrant: 'sweet-spot',
    vacancies: '300+', applicants: '50,000', ratio: '167:1', salary: '₹77,208+', prepMonths: '6-8',
    tip: 'Hidden gem — one of the best risk-reward exams in India. Tough syllabus filters out casual applicants.',
    whySkipped: 'Most aspirants think RBI is "too tough" because of the Phase 2 descriptive paper. In reality, 95% of applicants never prepare for it — they just fill the form. Your real competition is only 5,000-8,000 serious candidates for 300 seats.',
    compareWith: 'SBI PO',
    compareNote: 'SBI PO pays ₹44,900 with 1,000:1 competition. RBI Grade B pays ₹77,208 with just 167:1 competition. That\'s 6x less competition for nearly double the salary.',
    successRate: '0.6%',
    perks: ['₹77,208 starting salary (highest in banking)', 'RBI quarters in metro cities', 'Can reach ₹2.5 lakh/month as ED', 'International deputation opportunities'],
  },
  {
    name: 'NABARD Grade A', category: 'Banking', qualification: 'graduation', quadrant: 'sweet-spot',
    vacancies: '150+', applicants: '30,000', ratio: '200:1', salary: '₹44,500+', prepMonths: '5-7',
    tip: 'Rural banking focus with great perks. Competition is much lower than mainstream bank PO exams.',
    whySkipped: 'People assume NABARD means "rural posting" and ignore it. The truth? NABARD officers are posted in state capitals and district HQs, not villages. The rural focus is in policy, not your living location.',
    compareWith: 'IBPS PO',
    compareNote: 'IBPS PO has 10 lakh applicants fighting for 4,000 seats (250:1). NABARD has just 30,000 applicants for 150 seats (200:1) — with significantly better salary, perks, and career growth.',
    successRate: '0.5%',
    perks: ['Grade A salary: ₹44,500+ (better than IBPS PO)', 'Housing in state capitals', 'Agricultural development policy role', 'Rapid promotions — smaller organization'],
  },
  {
    name: 'SEBI Grade A', category: 'Regulatory', qualification: 'graduation', quadrant: 'sweet-spot',
    vacancies: '100+', applicants: '25,000', ratio: '250:1', salary: '₹44,500+', prepMonths: '5-7',
    tip: 'Elite regulator post. Small batch means high quality peers and rapid career growth.',
    whySkipped: 'Aspirants think regulatory bodies are "boring desk jobs." SEBI officers regulate India\'s ₹300+ lakh crore stock market. The prestige is on par with IAS in the financial world, and the pay overtakes IAS within 5 years.',
    compareWith: 'UPSC CSE',
    compareNote: 'UPSC CSE has 13 lakh applicants for 933 seats (1,394:1). SEBI has 25,000 for 100 seats (250:1). SEBI\'s in-hand salary crosses ₹1.5 lakh/month in 5 years — comparable to a Joint Secretary in UPSC.',
    successRate: '0.4%',
    perks: ['Among highest-paying govt jobs in India', 'Mumbai posting (financial capital)', 'Market regulator prestige', 'In-hand crosses ₹1.5L/month within 5 years'],
  },
  {
    name: 'ECGC PO', category: 'Insurance', qualification: 'graduation', quadrant: 'sweet-spot',
    vacancies: '75+', applicants: '15,000', ratio: '200:1', salary: '₹36,000+', prepMonths: '3-4',
    tip: 'Most aspirants don\'t even know this exam exists. Excellent salary for relatively easy preparation.',
    whySkipped: '90% of aspirants have never heard of ECGC (Export Credit Guarantee Corporation). It doesn\'t appear in coaching center pamphlets, YouTube thumbnails, or Telegram groups. That\'s exactly why the competition is so low.',
    compareWith: 'IBPS Clerk',
    compareNote: 'IBPS Clerk has 15 lakh applicants for ₹19,900 salary. ECGC PO has just 15,000 applicants for ₹36,000+ salary. Almost 100x less competition for almost double the salary.',
    successRate: '0.5%',
    perks: ['₹36,000+ starting (higher than most bank clerks)', 'Central govt insurance corporation', 'Only 3-4 months preparation needed', 'Exam pattern similar to IBPS PO — shared prep'],
  },
  {
    name: 'FCI Manager', category: 'PSU', qualification: 'graduation', quadrant: 'sweet-spot',
    vacancies: '500+', applicants: '80,000', ratio: '160:1', salary: '₹40,000+', prepMonths: '4-6',
    tip: 'Central government perks with manageable competition. Perfect for those who missed banking exams.',
    whySkipped: 'FCI doesn\'t have the "glamour" of banking or UPSC. People picture godowns and warehouses. But FCI Managers work in office-based roles managing India\'s food security program — it\'s a senior administrative position.',
    compareWith: 'SSC CGL',
    compareNote: 'SSC CGL has 30 lakh applicants and takes 2 years from notification to joining. FCI has 80,000 applicants with faster recruitment. Similar salary band, 18x less competition.',
    successRate: '0.6%',
    perks: ['Central government pay + DA', 'All-India posting with transfer options', 'Depot Manager is a senior designation', 'Food Corporation perks & allowances'],
  },
  {
    name: 'NDA', category: 'Defence', qualification: '12th', quadrant: 'sweet-spot',
    vacancies: '400+', applicants: '~50,000 serious', ratio: '125:1', salary: '₹56,100+', prepMonths: '4-6',
    tip: 'Best route into Armed Forces after 12th. 6 lakh apply on paper but only ~50,000 appear prepared. Physical fitness and SSB filter most.',
    whySkipped: 'The SSB interview scares people off — "only 1-2% clear SSB." But here\'s the thing: NDA\'s written exam is easier than most board exams. Of 6 lakh who apply, only ~50,000 show up prepared. The real filter is SSB, and those who prepare for it have a 10-15% selection rate.',
    compareWith: 'SSC CHSL',
    compareNote: 'SSC CHSL (also 12th pass) has 30+ lakh applicants for ₹25,500 salary. NDA has ~50,000 serious competitors for ₹56,100+ salary, plus free training at one of the world\'s finest military academies.',
    successRate: '0.8%',
    perks: ['₹56,100+ starting (highest for 12th pass)', 'Free world-class 3-year training at NDA', 'Officer rank in Armed Forces', 'Pension, canteen, housing for life'],
  },
  {
    name: 'State PSC', category: 'State PSC', qualification: 'graduation', quadrant: 'sweet-spot',
    vacancies: '500-2,000', applicants: '1-3 lakh', ratio: '150-300:1', salary: '₹36,000-56,000', prepMonths: '8-12',
    tip: 'State-level IAS equivalent. Far less competition than UPSC with similar job satisfaction.',
    whySkipped: 'Everyone dreams of becoming an IAS officer through UPSC, ignoring that State PSC officers (SDM, DSP, BDO) have the same ground-level power and public respect in their state. A UPSC aspirant failing 3 attempts could have been a state IAS by now.',
    compareWith: 'UPSC CSE',
    compareNote: 'UPSC CSE: 13 lakh applicants, 933 seats, 2+ years prep. State PSC: 1-3 lakh applicants, 500-2,000 seats, 8-12 months prep. Many State PSC officers say their job satisfaction matches IAS officers — with less politics.',
    successRate: '0.3-1%',
    perks: ['SDM, DSP, BDO — powerful designations', 'Posting in your own state', 'Same 7th CPC salary as central services', 'Faster promotion — smaller cadre'],
  },
  {
    name: 'APPSC Group 1', category: 'State PSC', qualification: 'graduation', quadrant: 'sweet-spot',
    vacancies: '300+', applicants: '60,000', ratio: '200:1', salary: '₹49,870-1,58,970', prepMonths: '8-12',
    tip: 'Andhra Pradesh\'s top civil services exam. Far easier than UPSC CSE with state-level postings in AP — ideal for Telugu-speaking aspirants.',
    whySkipped: 'Telugu-medium aspirants often aim for UPSC directly, ignoring that APPSC Group 1 offers the same administrative power within AP. The exam can be written in Telugu, giving a massive advantage over Hindi-belt UPSC competition.',
    compareWith: 'UPSC CSE',
    compareNote: 'UPSC has 13 lakh applicants from all over India. APPSC Group 1 has just 60,000, mostly from AP/TS. You can write in Telugu. Same designation (Collector/SP equivalent at state level), fraction of the competition.',
    successRate: '0.5%',
    perks: ['Deputy Collector, DSP level posts in AP', 'Telugu-medium option available', 'State-level administrative power', 'AP government salary: ₹49,870-1,58,970'],
  },
  {
    name: 'TSPSC Group 1', category: 'State PSC', qualification: 'graduation', quadrant: 'sweet-spot',
    vacancies: '200+', applicants: '50,000', ratio: '250:1', salary: '₹49,870-1,58,970', prepMonths: '8-12',
    tip: 'Telangana\'s premier civil services exam. Excellent career in state administration with postings across Telangana districts.',
    whySkipped: 'Hyderabad-based aspirants flock to UPSC coaching centers, treating State PSC as a "backup." But TSPSC Group 1 officers become District Collectors and SPs in Telangana — the same power and respect, in a state that\'s actively expanding its bureaucracy.',
    compareWith: 'UPSC CSE',
    compareNote: 'A Telangana aspirant competing in UPSC faces 13 lakh all-India candidates. In TSPSC Group 1, you face 50,000 — mostly from your own state. Same career trajectory, 26x less competition.',
    successRate: '0.4%',
    perks: ['Deputy Collector, DSP in Telangana', 'Hyderabad posting possibility', 'Telangana\'s growing state machinery', 'Telugu-medium option available'],
  },
  {
    name: 'AFCAT', category: 'Defence', qualification: 'graduation', quadrant: 'sweet-spot',
    vacancies: '300+', applicants: '40,000', ratio: '133:1', salary: '₹56,100+', prepMonths: '3-5',
    tip: 'Air Force entry for graduates. SSB interview filters ensure quality over quantity.',
    whySkipped: 'People think Air Force = pilot only. AFCAT has ground duty and technical branches too — administration, logistics, accounts, education, meteorology. You don\'t need to fly a fighter jet to serve in the IAF.',
    compareWith: 'IBPS PO',
    compareNote: 'IBPS PO: 10 lakh applicants, ₹44,900 salary, desk job. AFCAT: 40,000 applicants, ₹56,100+ salary, officer rank, travel, adventure. 25x less competition, better pay, far more exciting career.',
    successRate: '0.75%',
    perks: ['₹56,100+ starting as Flying/Ground Officer', 'Air Force canteen, mess, housing', 'Adventure: paragliding, mountaineering', 'Respect of military uniform'],
  },
  {
    name: 'UPSC CAPF AC', category: 'UPSC', qualification: 'graduation', quadrant: 'sweet-spot',
    vacancies: '250+', applicants: '50,000', ratio: '200:1', salary: '₹56,100+', prepMonths: '4-6',
    tip: 'Central Armed Police Forces officer post. Easier than CSE but similar prestige in uniformed services.',
    whySkipped: 'UPSC aspirants treat CAPF AC as "lesser UPSC." The irony? CAPF AC officers (BSF, CRPF, CISF, ITBP, SSB Commandants) earn the same salary as IPS officers and command thousands of jawans. Many IPS officers serve alongside CAPF ACs.',
    compareWith: 'UPSC CSE',
    compareNote: 'UPSC CSE: 1,394:1 competition. UPSC CAPF AC: 200:1 competition. Same UPSC conducting body, same ₹56,100+ salary, same officer-level posting. 7x less competition for a uniformed services career.',
    successRate: '0.5%',
    perks: ['Same salary as IPS: ₹56,100+', 'UPSC on your resume', 'BSF/CRPF/CISF Commandant rank', 'Central government pension & perks'],
  },
  {
    name: 'CDS', category: 'Defence', qualification: 'graduation', quadrant: 'sweet-spot',
    vacancies: '450+', applicants: '50,000', ratio: '111:1', salary: '₹56,100+', prepMonths: '3-5',
    tip: 'Graduate route to Army, Navy, Air Force. SSB stage removes majority — written exam is accessible.',
    whySkipped: 'The "SSB rejection rate" narrative keeps lakhs of eligible graduates away. But CDS written exam has the LOWEST competition ratio (111:1) among all major exams. Clear the easy written, then prepare seriously for SSB — that\'s the real strategy.',
    compareWith: 'SSC CGL',
    compareNote: 'SSC CGL: 30 lakh applicants, ₹25,500 starting. CDS: 50,000 applicants, ₹56,100+ starting. CDS written is easier than CGL Tier 1. You get officer rank, military prestige, pension for life — at 1/60th the competition.',
    successRate: '0.9%',
    perks: ['Lowest competition ratio: 111:1', 'Army/Navy/Air Force officer commission', 'Free training at OTA/IMA/INA/AFA', 'Lifetime pension after 20 years'],
  },

  // Worth the Effort
  {
    name: 'SSC CGL', category: 'SSC', qualification: 'graduation', quadrant: 'worth-effort',
    vacancies: '15,000+', applicants: '30+ lakh', ratio: '200:1', salary: '₹25,500-1,51,100', prepMonths: '8-12',
    tip: 'The gold standard for graduate-level exams. Massive vacancies make it worth every hour of prep.',
    whySkipped: 'Nobody "skips" CGL — it\'s overhyped. 30 lakh applicants, but only 3-4 lakh are seriously prepared. The real problem: people prepare ONLY for CGL when the same syllabus can get them into 5+ exams simultaneously.',
    compareWith: 'RBI Grade B',
    compareNote: 'CGL Tier 4 (top posts) pay ₹1,51,100 — but only ~200 seats at that level. Most CGL selections land at ₹25,500-44,900. Meanwhile, RBI Grade B starts at ₹77,208 with fewer applicants.',
    successRate: '0.5%',
    perks: ['15,000+ vacancies across ministries', 'Auditor, Inspector, Tax Assistant posts', 'Top posts reach ₹1,51,100', 'CGL prep overlaps with 5+ other exams'],
  },
  {
    name: 'RRB NTPC', category: 'Railways', qualification: 'graduation', quadrant: 'worth-effort',
    vacancies: '11,000+', applicants: '1.2 crore', ratio: '1,000:1', salary: '₹19,900-35,400', prepMonths: '6-8',
    tip: 'Huge applicant pool but also huge vacancies. Syllabus overlaps with SSC — prepare both simultaneously.',
    whySkipped: 'The "1.2 crore applicants" number scares people. Here\'s the reality: 40% don\'t show up, 30% walk out within an hour, and 20% haven\'t prepared at all. Your real competition is about 1.2 lakh serious candidates for 11,000 seats.',
    compareWith: 'SSC CHSL',
    compareNote: 'SSC CHSL has similar salary (₹25,500) with 30 lakh applicants and 4,500 seats. RRB NTPC has 11,000+ seats. Actual serious competition is similar, but Railways offers more opportunities.',
    successRate: '0.09%',
    perks: ['11,000+ vacancies — massive intake', 'Railway pass for family', 'Railway quarters & medical benefits', 'Transfer across India — see the country'],
  },
  {
    name: 'RRB Group D', category: 'Railways', qualification: '10th', quadrant: 'worth-effort',
    vacancies: '1,03,000+', applicants: '1.5 crore', ratio: '145:1', salary: '₹18,000+', prepMonths: '3-5',
    tip: 'Largest government recruitment in India. Over 1 lakh posts means even average preparation can succeed.',
    whySkipped: 'People look at "1.5 crore applicants" and give up before trying. But 1,03,000 vacancies is extraordinary — no other exam offers this many seats. The ratio (145:1) is actually BETTER than SBI Clerk (500:1) or SSC MTS (625:1).',
    compareWith: 'SSC MTS',
    compareNote: 'SSC MTS: 8,000 seats, 50 lakh applicants (625:1). RRB Group D: 1,03,000 seats, 1.5 crore applicants (145:1). Group D has 4x better ratio and 13x more vacancies. The math is clear.',
    successRate: '0.7%',
    perks: ['1,03,000+ posts — India\'s largest recruitment', 'Railway benefits from day one', '10th pass qualification — no degree needed', 'Promotion path to higher grades'],
  },
  {
    name: 'IBPS PO', category: 'Banking', qualification: 'graduation', quadrant: 'worth-effort',
    vacancies: '4,000+', applicants: '10+ lakh', ratio: '250:1', salary: '₹44,900+', prepMonths: '6-8',
    tip: 'Banking sector\'s premier exam. CWE score valid for 11 public sector banks — one exam, many chances.',
    whySkipped: 'Everyone prepares for IBPS PO — that\'s the problem. But the "one exam, 11 banks" model means your single score gives you 11 chances. Compare that to SBI PO where one score = one bank. IBPS PO is actually the smarter choice.',
    compareWith: 'SBI PO',
    compareNote: 'SBI PO: 1,000:1 ratio for one bank. IBPS PO: 250:1 ratio for 11 banks (PNB, BOB, Canara, Union, etc.). Your selection probability is mathematically 4x better with IBPS.',
    successRate: '0.4%',
    perks: ['One exam score → 11 bank opportunities', '₹44,900 starting, grows to ₹1.5L+', 'Metro city posting in most banks', 'Banker lifestyle with corporate perks'],
  },
  {
    name: 'CRPF ASI/SI', category: 'Police', qualification: 'graduation', quadrant: 'worth-effort',
    vacancies: '2,000+', applicants: '3 lakh', ratio: '150:1', salary: '₹29,200+', prepMonths: '4-6',
    tip: 'Paramilitary force with excellent perks. Physical test requirement significantly reduces actual competition.',
    whySkipped: 'The physical test (1600m run, long jump, high jump) scares away 50%+ applicants before exam day. If you\'re reasonably fit, your competition drops dramatically. Most coaching channels don\'t cover CRPF because it\'s "not glamorous."',
    compareWith: 'SSC CPO',
    compareNote: 'SSC CPO has 15 lakh applicants for 4,000 SI posts (375:1). CRPF ASI/SI has just 3 lakh applicants for 2,000 posts (150:1). Same uniform, same designation, 2.5x less competition.',
    successRate: '0.67%',
    perks: ['Central Armed Police Force — nationwide respect', 'Free accommodation & rations', 'Risk/hardship allowance on top of pay', 'Physical fitness filter = less actual competition'],
  },
  {
    name: 'SSC CPO', category: 'SSC', qualification: 'graduation', quadrant: 'worth-effort',
    vacancies: '4,000+', applicants: '15+ lakh', ratio: '375:1', salary: '₹35,400+', prepMonths: '6-8',
    tip: 'Delhi Police & CAPF Sub-Inspector. Uniform job with SSC-level syllabus — great overlap with CGL prep.',
    whySkipped: 'The physical test and medical requirements filter many who apply. If you\'re preparing for CGL, adding CPO takes almost zero extra effort — the syllabus is 80% the same. Most CGL aspirants ignore this easy addition.',
    compareWith: 'SSC CGL',
    compareNote: 'CGL and CPO have nearly identical syllabus. CGL pays ₹25,500 for most posts. CPO pays ₹35,400+ with the prestige of a police uniform. If you\'re preparing for CGL, you\'re already preparing for CPO.',
    successRate: '0.27%',
    perks: ['Delhi Police SI — metro city posting', 'CAPF SI — central government perks', 'Same SSC syllabus as CGL', '₹35,400+ with uniform allowance'],
  },
  {
    name: 'IBPS Clerk', category: 'Banking', qualification: 'graduation', quadrant: 'worth-effort',
    vacancies: '5,000+', applicants: '15+ lakh', ratio: '300:1', salary: '₹19,900+', prepMonths: '4-6',
    tip: 'Stepping stone into banking. Many PO toppers started as Clerks — internal promotion path is solid.',
    whySkipped: 'Aspirants think "clerk" means dead-end career. Reality: 70% of current bank managers started as clerks. Internal promotion exams (JAIIB/CAIIB) can make you a Scale 2 officer within 5-7 years, earning ₹60,000+.',
    compareWith: 'IBPS PO',
    compareNote: 'Can\'t crack PO this year? IBPS Clerk gets you inside the bank NOW. Once inside, the promotion exam (internal) has only 10-15% of the competition. It\'s easier to reach PO from clerk than from outside.',
    successRate: '0.33%',
    perks: ['5,000+ vacancies across 11 banks', 'Internal promotion to PO within 3-5 years', 'Banking sector job security', 'Same bank, same building as PO — just different starting point'],
  },
  {
    name: 'CTET', category: 'Teaching', qualification: 'graduation', quadrant: 'worth-effort',
    vacancies: 'Eligibility test', applicants: '20+ lakh', ratio: 'N/A', salary: '₹35,400+', prepMonths: '2-3',
    tip: 'Gateway to KVS, NVS, state teaching jobs. Qualify once, apply to hundreds of teaching vacancies.',
    whySkipped: 'People think teaching pays poorly. CTET-qualified KVS teachers start at ₹35,400 (7th CPC) and reach ₹1 lakh+ as PGTs. KVS schools give housing, children\'s education fee, and summers off. It\'s one of India\'s best work-life balance jobs.',
    compareWith: 'SSC CGL',
    compareNote: 'SSC CGL: 30 lakh applicants, 8-12 months prep, ₹25,500 starting. CTET: 2-3 months prep, and once qualified, you can apply to KVS (₹35,400+), NVS (₹35,400+), and state teacher jobs (₹25,000+) — all with summer vacations.',
    successRate: '~20%',
    perks: ['Qualifies you for KVS, NVS, state teaching', '2-3 months preparation is sufficient', 'Teachers get summer & winter breaks', 'KVS: ₹35,400+ with housing & education perks'],
  },
  {
    name: 'APPSC Group 2', category: 'State PSC', qualification: 'graduation', quadrant: 'worth-effort',
    vacancies: '500+', applicants: '1.5 lakh', ratio: '300:1', salary: '₹37,100-91,450', prepMonths: '6-8',
    tip: 'Deputy Tahsildar, Municipal Commissioner level posts in AP. Good stepping stone — many Group 2 officers later crack Group 1.',
    whySkipped: 'AP aspirants either aim for Group 1 or go straight for UPSC, treating Group 2 as "settling." But Group 2 officers (Deputy Tahsildar, Municipal Commissioner) have real administrative power and earn ₹37,100-91,450 — while Group 1 aspirants are still preparing.',
    compareWith: 'APPSC Group 1',
    compareNote: 'Group 1 takes 1-2 years of intense prep. Group 2 needs 6-8 months. Many Group 2 officers crack Group 1 later while earning a salary. Smart strategy: secure Group 2 first, then aim higher.',
    successRate: '0.33%',
    perks: ['Deputy Tahsildar, Municipal Commissioner', '₹37,100-91,450 salary range', 'Stepping stone to Group 1', 'Telugu-medium option available'],
  },
  {
    name: 'TSPSC Group 2', category: 'State PSC', qualification: 'graduation', quadrant: 'worth-effort',
    vacancies: '400+', applicants: '1.2 lakh', ratio: '300:1', salary: '₹37,100-91,450', prepMonths: '6-8',
    tip: 'Mid-level Telangana state services. Solid career with manageable preparation timeline of 6-8 months alongside Group 1.',
    whySkipped: 'Hyderabad coaching centers push Group 1 or nothing. Group 2 aspirants are made to feel they\'re "not ambitious enough." Truth: Group 2 is a guaranteed government career that 99.7% of Group 1 aspirants will never achieve.',
    compareWith: 'TSPSC Group 1',
    compareNote: 'Group 1 aspirants spend 1-2 years preparing with no salary. Group 2 officers earn ₹37,100+ within 8 months of preparation. Many eventually crack Group 1 too — while getting paid.',
    successRate: '0.33%',
    perks: ['Municipal Commissioner, Deputy Tahsildar', '₹37,100-91,450 salary', 'Telangana state government posting', 'Prepare alongside Group 1 — 70% syllabus overlap'],
  },
  {
    name: 'TSPSC Group 4', category: 'State PSC', qualification: '10th', quadrant: 'worth-effort',
    vacancies: '5,000+', applicants: '5 lakh', ratio: '100:1', salary: '₹16,400-49,870', prepMonths: '3-4',
    tip: 'Largest Telangana state recruitment for 10th pass. Junior Assistant and clerical posts — excellent ratio of just 100:1.',
    whySkipped: 'The salary looks low (₹16,400 starting), so people dismiss it. But 10th pass government jobs with 100:1 competition are unicorns. Most 10th pass exams (SSC GD, RRB Group D) have 5-10x worse ratios. This is the easiest entry into government service.',
    compareWith: 'SSC GD Constable',
    compareNote: 'SSC GD: 1 crore applicants, 385:1 ratio, physical test mandatory. TSPSC Group 4: 5 lakh applicants, 100:1 ratio, no physical test. For 10th pass candidates, Group 4 is mathematically 4x easier to crack.',
    successRate: '1%',
    perks: ['100:1 ratio — best for 10th pass', 'No physical test required', 'Junior Assistant — office-based work', 'Telangana state government benefits'],
  },
  {
    name: 'ISRO Scientist/Engineer SC', category: 'PSU', qualification: 'graduation', quadrant: 'sweet-spot',
    vacancies: '250+', applicants: '40,000', ratio: '160:1', salary: '₹56,100+ (E-2 IDA)', prepMonths: '4-6',
    tip: 'Space agency prestige with surprisingly manageable competition. GATE score helps shortlisting significantly.',
    whySkipped: 'Most aspirants assume ISRO only takes IIT/NIT toppers. In reality, any B.E./B.Tech with 65% from a recognized university qualifies. The written test filters out casual applicants — the real competition is just 5,000-8,000 serious engineers for 250 seats.',
    compareWith: 'BHEL Engineer',
    compareNote: 'BHEL has 2 lakh applicants for 200 seats (1,000:1). ISRO has 40,000 applicants for 250 seats (160:1). ISRO pays better (IDA E-2 vs IDA E-1) with 6x less competition. The ISRO brand also opens doors for international space collaborations.',
    successRate: '0.6%',
    perks: ['₹56,100+ E-2 IDA scale — one of best PSU pay scales', 'ISRO brand for global recognition', 'Cutting-edge space research environment', 'On-campus housing in Bangalore/Thiruvananthapuram'],
  },
  {
    name: 'SIDBI Grade A Officer', category: 'Banking', qualification: 'graduation', quadrant: 'sweet-spot',
    vacancies: '100+', applicants: '20,000', ratio: '200:1', salary: '₹44,500+', prepMonths: '4-5',
    tip: 'Development finance for MSMEs with excellent salary — far less competition than mainstream bank PO exams.',
    whySkipped: 'SIDBI (Small Industries Development Bank) isn\'t mentioned in most coaching materials. It lacks the brand recall of SBI or IBPS. That\'s exactly why 95% of banking aspirants skip it — creating a low-competition window for those who know about it.',
    compareWith: 'IBPS PO',
    compareNote: 'IBPS PO has 15+ lakh applicants for 4,000 seats (375:1). SIDBI has just 20,000 applicants for 100 seats (200:1). Near-identical salary, but SIDBI is 2x easier to crack. Plus SIDBI officers deal with policy-level MSME finance — more intellectually stimulating work.',
    successRate: '0.5%',
    perks: ['Grade A salary comparable to IBPS PO', 'MSME development finance role — high impact work', 'Less competition than all mainstream PSBs', 'Based in Mumbai financial hub'],
  },
  {
    name: 'HAL Management Trainee', category: 'PSU', qualification: 'graduation', quadrant: 'worth-effort',
    vacancies: '200+', applicants: '60,000', ratio: '300:1', salary: '₹40,000+ (E-1 IDA)', prepMonths: '4-6',
    tip: 'Defence manufacturing PSU with strong job security and growth. GATE score is a significant advantage.',
    whySkipped: 'HAL is overshadowed by ISRO and DRDO in aspirant mindshare. But HAL is India\'s only aircraft manufacturer — niche skills, stable demand, and consistent recruitment every 2-3 years. Less hyped = less competition.',
    compareWith: 'BHEL Engineer',
    compareNote: 'BHEL competes in declining thermal power sector. HAL operates in defence aerospace — a sector with guaranteed government demand. HAL offers comparable salary with better long-term job security in a growth industry (India\'s defence budget rising 10% annually).',
    successRate: '0.3%',
    perks: ['E-1 IDA scale (~₹40,000 basic + allowances = ₹70,000+ in-hand)', 'Aerospace/defence manufacturing — strategic sector', 'Technical growth with international collaborations (Apache, Tejas)', 'Bangalore posting for most roles'],
  },
  {
    name: 'NHPC Executive Trainee', category: 'PSU', qualification: 'graduation', quadrant: 'worth-effort',
    vacancies: '150+', applicants: '50,000', ratio: '333:1', salary: '₹40,000+ (E-1 IDA)', prepMonths: '3-5',
    tip: 'Hydro power PSU with excellent remote area allowances and fast promotions. GATE score is key to shortlisting.',
    whySkipped: 'NHPC sounds niche — most engineers don\'t even know it stands for National Hydroelectric Power Corporation. The "hydro" tag makes people think it\'s limited to project sites in hills. Reality: NHPC has offices in Delhi and all major cities.',
    compareWith: 'NTPC Executive Trainee',
    compareNote: 'NTPC ET gets 3-5 lakh applications (huge competition). NHPC ET gets ~50,000 applications for similar posts. Same IDA E-1 pay scale, but NHPC is 6-10x less competitive. The project site allowances for hill postings add ₹15,000-25,000/month extra.',
    successRate: '0.3%',
    perks: ['E-1 IDA scale + Remote/Hill Area allowances', 'Fast-track promotion: E-1 to E-3 in 5 years', 'Renewable energy sector — future-proof career', 'Smaller org = more visibility and responsibility early on'],
  },

  // High Stakes
  {
    name: 'SBI PO', category: 'Banking', qualification: 'graduation', quadrant: 'high-stakes',
    vacancies: '2,000+', applicants: '20+ lakh', ratio: '1,000:1', salary: '₹44,900+', prepMonths: '8-10',
    tip: 'India\'s most prestigious banking exam. SBI brand carries weight — tough but incredibly rewarding.',
    whySkipped: 'Everyone applies for SBI PO — that\'s the problem. Nobody "skips" it. But here\'s what most don\'t realize: IBPS PO gives the SAME salary at 4x less competition across 11 banks. SBI PO is brand obsession, not career optimization.',
    compareWith: 'IBPS PO',
    compareNote: 'SBI PO: 1,000:1 for one bank. IBPS PO: 250:1 for 11 banks. The salary is identical (₹44,900+). The only difference is the logo on your ID card. Is that worth 4x more competition?',
    successRate: '0.1%',
    perks: ['SBI brand name — India\'s largest bank', '₹44,900+ starting salary', 'Metro city postings', 'Strong alumni network'],
  },
  {
    name: 'SSC CHSL', category: 'SSC', qualification: '12th', quadrant: 'high-stakes',
    vacancies: '4,500+', applicants: '30+ lakh', ratio: '667:1', salary: '₹25,500+', prepMonths: '6-8',
    tip: '12th pass gateway to central government. LDC, PA, DEO posts — good career growth within departments.',
    whySkipped: 'CHSL is popular but the competition-to-reward ratio is poor. 30 lakh applicants for ₹25,500 salary. For the same qualification (12th pass), NDA pays ₹56,100+ at 125:1 competition. The difference is awareness.',
    compareWith: 'NDA',
    compareNote: 'Both need 12th pass. CHSL: 667:1 ratio, ₹25,500 salary, desk job. NDA: 125:1 ratio, ₹56,100 salary, officer rank. NDA is 5x easier to crack and pays more than double.',
    successRate: '0.15%',
    perks: ['Central government posting', 'LDC → UDC → Section Officer promotion path', 'Ministry postings in Delhi', '12th pass qualification sufficient'],
  },
  {
    name: 'SSC MTS', category: 'SSC', qualification: '10th', quadrant: 'high-stakes',
    vacancies: '8,000+', applicants: '50+ lakh', ratio: '625:1', salary: '₹18,000+', prepMonths: '4-6',
    tip: 'Easiest syllabus among SSC exams but the sheer number of applicants makes it competitive.',
    whySkipped: 'Everyone knows MTS — that\'s the problem. With the easiest syllabus and 10th pass requirement, it attracts the maximum crowd. For 10th pass candidates, RRB Group D (145:1) and TSPSC Group 4 (100:1) offer dramatically better odds.',
    compareWith: 'RRB Group D',
    compareNote: 'SSC MTS: 625:1 ratio, 8,000 seats. RRB Group D: 145:1 ratio, 1,03,000 seats. Group D has 4x better odds and 13x more vacancies. Both need only 10th pass.',
    successRate: '0.16%',
    perks: ['Central government job', 'Easiest syllabus — basic math & English', '8,000+ vacancies', 'Promotion to LDC possible over time'],
  },
  {
    name: 'RBI Assistant', category: 'Banking', qualification: 'graduation', quadrant: 'high-stakes',
    vacancies: '450+', applicants: '8+ lakh', ratio: '1,778:1', salary: '₹36,091+', prepMonths: '6-8',
    tip: 'RBI brand with great perks. Limited vacancies but the salary and job security make it worth trying.',
    whySkipped: 'The 1,778:1 ratio is brutal for an "assistant" post. Most aspirants who want RBI should aim for RBI Grade B instead — the ratio drops to 167:1 and the salary nearly doubles. RBI Assistant is a prestige trap.',
    compareWith: 'RBI Grade B',
    compareNote: 'RBI Assistant: 1,778:1 ratio, ₹36,091 salary. RBI Grade B: 167:1 ratio, ₹77,208 salary. Grade B is 10x easier to crack and pays double. The "tougher syllabus" narrative keeps people from even trying.',
    successRate: '0.06%',
    perks: ['RBI brand prestige', '₹36,091+ with metro allowances', 'Limited but premium recruitment', 'RBI staff quarters in prime locations'],
  },
  {
    name: 'SSC JE', category: 'SSC', qualification: 'graduation', quadrant: 'high-stakes',
    vacancies: '1,500+', applicants: '10+ lakh', ratio: '667:1', salary: '₹35,400+', prepMonths: '6-8',
    tip: 'For engineering graduates only. Technical syllabus reduces competition from general graduates.',
    whySkipped: 'Engineering graduates chase GATE for PSU jobs or private sector placements. SSC JE offers ₹35,400+ in CPWD, CWC, MES — but campus placement culture makes engineers forget government options exist.',
    compareWith: 'GATE (for PSU)',
    compareNote: 'GATE PSU jobs: 1,000:1, need top 500 rank. SSC JE: 667:1, straightforward exam. Both give engineering graduates ₹35,000-40,000 starting salary. JE is the more realistic path for most engineers.',
    successRate: '0.15%',
    perks: ['Engineering-specific — less general competition', 'CPWD, CWC, MES postings', '₹35,400+ starting salary', 'Technical role — use your degree'],
  },
  {
    name: 'IBPS SO', category: 'Banking', qualification: 'graduation', quadrant: 'high-stakes',
    vacancies: '1,500+', applicants: '5+ lakh', ratio: '333:1', salary: '₹36,000+', prepMonths: '4-6',
    tip: 'Specialist Officers in IT, Agriculture, HR, Marketing. Domain knowledge gives you an edge.',
    whySkipped: 'Most banking aspirants prepare only for PO/Clerk, ignoring that SO posts in IT, Agriculture, and HR have far less competition. If you have a relevant degree, your domain knowledge is a massive unfair advantage.',
    compareWith: 'IBPS PO',
    compareNote: 'IBPS PO: 250:1, generalist exam — everyone competes equally. IBPS SO: 333:1 overall, but YOUR specific specialization (IT/Agri/HR) may have only 50:1. Your degree becomes your weapon.',
    successRate: '0.3%',
    perks: ['Specialist role — use your degree expertise', 'IT Officer, Agriculture Officer, HR Officer', '₹36,000+ with specialization allowance', 'Less overlap with general banking aspirants'],
  },
  {
    name: 'APPSC Group 3', category: 'State PSC', qualification: '12th', quadrant: 'high-stakes',
    vacancies: '2,000+', applicants: '3 lakh', ratio: '150:1', salary: '₹22,460-66,330', prepMonths: '4-6',
    tip: 'Panchayat Secretary and other village-level posts in AP. Large applicant pool for 12th pass level but decent vacancies.',
    whySkipped: '"Village-level post" sounds unappealing to urban aspirants. But Panchayat Secretaries are the most powerful local administrators — they control village development budgets and directly impact lakhs of lives. The salary grows to ₹66,330.',
    compareWith: 'SSC CHSL',
    compareNote: 'CHSL: 667:1, ₹25,500, Delhi desk job. APPSC Group 3: 150:1, ₹22,460-66,330, Panchayat Secretary with administrative power. 4x less competition and more career growth at the grassroots level.',
    successRate: '0.67%',
    perks: ['Panchayat Secretary — grassroots administrative power', '2,000+ vacancies in AP', '₹22,460-66,330 salary range', '4x less competition than SSC CHSL'],
  },
  {
    name: 'TSPSC Group 3', category: 'State PSC', qualification: '12th', quadrant: 'high-stakes',
    vacancies: '1,500+', applicants: '2.5 lakh', ratio: '167:1', salary: '₹22,460-66,330', prepMonths: '4-6',
    tip: 'Telangana Panchayat Secretary posts. Competitive but the syllabus is manageable for 12th pass candidates.',
    whySkipped: 'Same as APPSC Group 3 — the "village posting" label turns off aspirants. But Telangana\'s development push means Panchayat Secretaries are getting more responsibilities, budget allocation, and recognition than ever.',
    compareWith: 'SSC CHSL',
    compareNote: 'CHSL: 667:1 ratio. TSPSC Group 3: 167:1 ratio. Both need 12th pass. Group 3 has 4x less competition and offers administrative power that a CHSL LDC can never get.',
    successRate: '0.6%',
    perks: ['Panchayat Secretary in Telangana', '1,500+ vacancies', '₹22,460-66,330 salary', 'Local governance power & recognition'],
  },

  // Hardest Battle
  {
    name: 'UPSC CSE', category: 'UPSC', qualification: 'graduation', quadrant: 'hardest',
    vacancies: '933', applicants: '13+ lakh', ratio: '1,394:1', salary: '₹56,100+', prepMonths: '18-24',
    tip: 'The Mount Everest of Indian exams. 1-2 years of dedicated full-time preparation is the norm.',
    whySkipped: 'This is the most popular exam — nobody skips it. But 98% of aspirants who start UPSC prep never even clear Prelims. The opportunity cost is devastating: 2-3 years, no income, no backup. For every IAS officer, there are 1,393 people who could have been RBI Grade B officers, SEBI officers, or State PSC toppers.',
    compareWith: 'State PSC + CAPF AC',
    compareNote: 'Instead of spending 2 years on UPSC (1,394:1), you could crack State PSC (200:1) in year 1 and CAPF AC (200:1) in year 2 — both at ₹56,100+ salary, both with officer-level prestige. Two guaranteed government careers vs one lottery ticket.',
    successRate: '0.07%',
    perks: ['IAS/IPS/IFS — India\'s most prestigious careers', 'District administration power', '₹56,100+ growing to ₹2.5 lakh as Secretary', 'International postings, deputation opportunities'],
  },
  {
    name: 'SSC GD Constable', category: 'SSC', qualification: '10th', quadrant: 'hardest',
    vacancies: '26,000+', applicants: '1+ crore', ratio: '385:1', salary: '₹21,700+', prepMonths: '4-6',
    tip: 'Despite 26k+ vacancies, 1 crore applicants make this extremely tough. Physical fitness is the real filter.',
    whySkipped: 'SSC GD attracts 1 crore applicants — the highest for any exam. For 10th pass candidates, RRB Group D (145:1, 1 lakh posts) and TSPSC Group 4 (100:1) are objectively better options. The "constable" designation also limits career growth.',
    compareWith: 'RRB Group D',
    compareNote: 'SSC GD: 385:1, constable rank, physical test mandatory. RRB Group D: 145:1, railway employee, 1,03,000 seats. Group D has 3x better odds, 4x more seats, and better promotion prospects in Railways.',
    successRate: '0.26%',
    perks: ['26,000+ vacancies', 'BSF, CRPF, CISF constable posting', 'Physical fitness focused selection', 'Central government salary & benefits'],
  },
  {
    name: 'SBI Clerk', category: 'Banking', qualification: 'graduation', quadrant: 'hardest',
    vacancies: '5,000+', applicants: '25+ lakh', ratio: '500:1', salary: '₹19,900+', prepMonths: '6-8',
    tip: 'Don\'t be fooled by the "clerk" designation — the competition is fierce. State-wise cutoffs vary wildly.',
    whySkipped: 'SBI Clerk has the WORST salary-to-competition ratio in banking. 500:1 competition for ₹19,900. Compare: IBPS Clerk (300:1, same salary, 11 banks), ECGC PO (200:1, ₹36,000+). People choose SBI for the brand, not the math.',
    compareWith: 'IBPS Clerk + ECGC PO',
    compareNote: 'SBI Clerk: 500:1 for ₹19,900 at 1 bank. IBPS Clerk: 300:1 for ₹19,900 at 11 banks. ECGC PO: 200:1 for ₹36,000+. If you skip SBI obsession, you can be a PO elsewhere for half the competition.',
    successRate: '0.2%',
    perks: ['SBI brand value', '5,000+ vacancies', 'Metro city branches', 'Promotion to PO through internal exam'],
  },
  {
    name: 'UPSC NDA', category: 'UPSC', qualification: '12th', quadrant: 'hardest',
    vacancies: '400', applicants: '6+ lakh', ratio: '1,500:1', salary: '₹56,100+', prepMonths: '6-8',
    tip: 'Total applicants are 6 lakh, but only 50,000 appear seriously. SSB interview has a 95% rejection rate — focus heavily on SSB prep.',
    whySkipped: 'UPSC NDA\'s ratio is misleadingly shown as 1,500:1. In reality, 40% don\'t show up and most are unprepared. About 6,000 are called for SSB out of which 400 get selected — that\'s 15:1 at SSB stage. The secret: most fail SSB because they don\'t prepare for it.',
    compareWith: 'CDS',
    compareNote: 'NDA: 1,500:1 on paper (but serious competition is lower — see Sweet Spot section). CDS: 111:1 (graduates). If you can wait till graduation, CDS offers the same military officer career at less competition.',
    successRate: '0.07%',
    perks: ['Youngest military officer entry (17.5 years)', 'Free NDA training — world-class academy', '₹56,100+ from the start', 'Career before most people finish college'],
  },
  {
    name: 'UGC NET', category: 'Teaching', qualification: 'post-graduation', quadrant: 'hardest',
    vacancies: 'Eligibility test', applicants: '12+ lakh', ratio: 'N/A', salary: '₹57,700+', prepMonths: '6-8',
    tip: 'Assistant Professor eligibility. Only ~6% qualify. Master your subject — there\'s no shortcut here.',
    whySkipped: 'PhD scholars and PG students assume NET is their "only option" for academia. But a NET-qualified candidate can also apply for KVS PGT (₹47,600+), college librarians, and research positions. Most NET aspirants don\'t explore these parallel opportunities.',
    compareWith: 'CTET + KVS PGT',
    compareNote: 'UGC NET: ~6% pass rate, only for assistant professor eligibility. CTET: ~20% pass rate, qualifies for KVS (₹35,400-47,600+), NVS, state teaching. For teaching careers, CTET is the faster, surer path.',
    successRate: '~6%',
    perks: ['Assistant Professor eligibility', '₹57,700+ with UGC pay scales', 'JRF option: ₹31,000/month fellowship', 'Academic career & research freedom'],
  },
  {
    name: 'GATE (for PSU)', category: 'PSU', qualification: 'graduation', quadrant: 'hardest',
    vacancies: '1,000+', applicants: '10+ lakh', ratio: '1,000:1', salary: '₹40,000-60,000', prepMonths: '8-12',
    tip: 'GATE score opens doors to ONGC, BHEL, NTPC, IOCL. Top 500 rank needed for premier PSUs.',
    whySkipped: 'Engineering students fixate on GATE for IIT MTech or premier PSUs (ONGC, NTPC). But a decent GATE score (top 5,000) can get you into smaller but excellent PSUs (BEL, MECL, NFL) that nobody talks about. Also, SSC JE exists.',
    compareWith: 'SSC JE',
    compareNote: 'GATE for top PSUs: need top 500 rank out of 10 lakh. SSC JE: 667:1, straightforward exam, ₹35,400+ in CPWD/MES. For most engineers, SSC JE is the realistic government job path — not GATE.',
    successRate: '0.1%',
    perks: ['Premier PSU jobs (ONGC, NTPC, IOCL)', '₹40,000-60,000 starting in top PSUs', 'IIT MTech admission option', 'Engineering career with government stability'],
  },
];

const quadrants = {
  'sweet-spot': { label: 'Sweet Spot', subtitle: 'Lower competition, good vacancies', icon: FiTarget, color: 'emerald', bgClass: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800', chipClass: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400', headerBg: 'bg-gradient-to-r from-emerald-500 to-green-500' },
  'worth-effort': { label: 'Worth the Effort', subtitle: 'High vacancies, manageable competition', icon: FiTrendingUp, color: 'amber', bgClass: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800', chipClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400', headerBg: 'bg-gradient-to-r from-amber-500 to-orange-500' },
  'high-stakes': { label: 'High Stakes', subtitle: 'Fewer seats or tougher odds', icon: FiAward, color: 'blue', bgClass: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800', chipClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400', headerBg: 'bg-gradient-to-r from-blue-500 to-indigo-500' },
  'hardest': { label: 'Hardest Battle', subtitle: 'Brutal competition or very few seats', icon: FiAlertTriangle, color: 'red', bgClass: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800', chipClass: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400', headerBg: 'bg-gradient-to-r from-red-500 to-rose-500' },
};

const qualFilters = [
  { key: 'all', label: 'All Levels' },
  { key: '10th', label: '10th Pass' },
  { key: '12th', label: '12th Pass' },
  { key: 'graduation', label: 'Graduation' },
  { key: 'post-graduation', label: 'Post Graduation' },
];

const eyeOpeners = [
  { popular: 'UPSC CSE', popularRatio: '1,394:1', hidden: 'State PSC', hiddenRatio: '150-300:1', insight: 'Same designation (Collector/SP), same salary, posted in your own state — at 5-9x less competition.' },
  { popular: 'SBI PO', popularRatio: '1,000:1', hidden: 'RBI Grade B', hiddenRatio: '167:1', insight: 'RBI pays ₹77,208 vs SBI\'s ₹44,900. Less competition AND nearly double salary.' },
  { popular: 'SSC MTS', popularRatio: '625:1', hidden: 'RRB Group D', hiddenRatio: '145:1', insight: 'Both 10th pass. Group D has 1,03,000 seats vs MTS\'s 8,000 — 4x better odds.' },
  { popular: 'SSC CHSL', popularRatio: '667:1', hidden: 'NDA', hiddenRatio: '125:1', insight: 'Both 12th pass. NDA pays ₹56,100 (vs ₹25,500) with officer rank and military training — at 5x less competition.' },
  { popular: 'SBI Clerk', popularRatio: '500:1', hidden: 'ECGC PO', hiddenRatio: '200:1', insight: 'ECGC PO pays ₹36,000+ vs Clerk\'s ₹19,900. You\'d be a PO, not a clerk — with 2.5x less competition.' },
];

const ExamPriorityMatrix = () => {
  const { t } = useLanguage();
  const [qualFilter, setQualFilter] = useState('all');
  const [selectedExam, setSelectedExam] = useState(null);
  const [eyeOpenerIdx, setEyeOpenerIdx] = useState(0);
  const detailRef = useRef(null);

  const selectAndScroll = (exam) => {
    setSelectedExam(exam);
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const filtered = useMemo(() => {
    if (qualFilter === 'all') return examPriorityData;
    return examPriorityData.filter(e => e.qualification === qualFilter);
  }, [qualFilter]);

  const groupedByQuadrant = useMemo(() => {
    const groups = {};
    Object.keys(quadrants).forEach(q => { groups[q] = filtered.filter(e => e.quadrant === q); });
    return groups;
  }, [filtered]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SEO
        title="Exam Priority Matrix — Which Government Exam Should You Target? | GovtExamPath"
        description="Find the best government exam for you based on competition level, vacancies, and salary. Compare 30+ exams across 4 priority quadrants — from hidden gems to hardest battles."
      />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full text-sm mb-4">
              <FiTarget className="w-4 h-4" /> {t('smartExamSelection')}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">
              {t('examPriorityTitle')}
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-6">
              {t('examPriorityDesc')}
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
              <div className="bg-white/10 backdrop-blur rounded-xl p-3">
                <p className="text-2xl font-bold">37</p>
                <p className="text-xs text-white/70">{t('examsCompared')}</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-3">
                <p className="text-2xl font-bold">4</p>
                <p className="text-xs text-white/70">{t('priorityQuadrants')}</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-3">
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-white/70">{t('hiddenGems')}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-10">

        {/* Eye-Opener Banner */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-2xl p-6 mb-8 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="flex items-center gap-2 mb-4">
            <FiEye className="w-5 h-5 text-yellow-400" />
            <h2 className="font-bold text-yellow-400">{t('eyeOpener')}</h2>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={eyeOpenerIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid sm:grid-cols-[1fr,auto,1fr] gap-4 items-center"
            >
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-center">
                <p className="text-xs text-red-300 mb-1">{t('whatMostChoose')}</p>
                <p className="font-bold text-lg">{eyeOpeners[eyeOpenerIdx].popular}</p>
                <p className="text-2xl font-extrabold text-red-400 mt-1">{eyeOpeners[eyeOpenerIdx].popularRatio}</p>
                <p className="text-xs text-gray-400">{t('competitionRatio')}</p>
              </div>
              <div className="hidden sm:flex flex-col items-center gap-1">
                <FiArrowRight className="w-6 h-6 text-yellow-400" />
                <span className="text-xs text-yellow-400 font-semibold">{t('insteadTry')}</span>
              </div>
              <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 text-center">
                <p className="text-xs text-emerald-300 mb-1">{t('whatSmartChoose')}</p>
                <p className="font-bold text-lg">{eyeOpeners[eyeOpenerIdx].hidden}</p>
                <p className="text-2xl font-extrabold text-emerald-400 mt-1">{eyeOpeners[eyeOpenerIdx].hiddenRatio}</p>
                <p className="text-xs text-gray-400">{t('competitionRatio')}</p>
              </div>
            </motion.div>
          </AnimatePresence>
          <p className="text-sm text-gray-300 mt-4 text-center">{eyeOpeners[eyeOpenerIdx].insight}</p>
          <div className="flex justify-center gap-2 mt-4">
            {eyeOpeners.map((_, i) => (
              <button
                key={i}
                onClick={() => setEyeOpenerIdx(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === eyeOpenerIdx ? 'bg-yellow-400 scale-125' : 'bg-gray-600 hover:bg-gray-500'}`}
              />
            ))}
          </div>
        </div>

        {/* Qualification Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <FiFilter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('filterByQualification')}:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {qualFilters.map(f => (
              <button
                key={f.key}
                onClick={() => { setQualFilter(f.key); setSelectedExam(null); }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  qualFilter === f.key
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Exam Detail */}
        {selectedExam && (
          <motion.div
            ref={detailRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 mb-8 overflow-hidden"
          >
            <div className={`${quadrants[selectedExam.quadrant].headerBg} px-6 py-4 flex items-center justify-between`}>
              <div>
                <h3 className="text-xl font-bold text-white">{selectedExam.name}</h3>
                <p className="text-sm text-white/70">{selectedExam.category} | {selectedExam.qualification === 'post-graduation' ? 'Post Graduation' : selectedExam.qualification === 'graduation' ? 'Graduation' : selectedExam.qualification} required</p>
              </div>
              <button onClick={() => setSelectedExam(null)} className="text-white/70 hover:text-white text-2xl leading-none">&times;</button>
            </div>

            <div className="p-6">
              {/* Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                  <FiBriefcase className="w-5 h-5 mx-auto text-blue-500 mb-1" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t('vacancies')}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{selectedExam.vacancies}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                  <FiUsers className="w-5 h-5 mx-auto text-purple-500 mb-1" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t('applicants')}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{selectedExam.applicants}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                  <FiTarget className="w-5 h-5 mx-auto text-red-500 mb-1" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t('competition')}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{selectedExam.ratio}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                  <FiDollarSign className="w-5 h-5 mx-auto text-green-500 mb-1" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t('startingSalary')}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{selectedExam.salary}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
                  <FiClock className="w-5 h-5 mx-auto text-orange-500 mb-1" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t('prepTimeLabel')}</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{selectedExam.prepMonths} {t('months')}</p>
                </div>
              </div>

              {/* Why People Skip This */}
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FiEye className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-1">{t('whySkipped')}</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{selectedExam.whySkipped}</p>
                  </div>
                </div>
              </div>

              {/* Direct Comparison */}
              <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FiZap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-indigo-800 dark:text-indigo-300 mb-1">
                      {t('realityCheck')}: {selectedExam.name} vs {selectedExam.compareWith}
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{selectedExam.compareNote}</p>
                  </div>
                </div>
              </div>

              {/* Perks */}
              {selectedExam.perks && (
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FiThumbsUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">{t('keyAdvantages')}</h4>
                      <div className="grid sm:grid-cols-2 gap-1.5">
                        {selectedExam.perks.map((perk, i) => (
                          <p key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                            <span className="text-emerald-500 mt-0.5">&#10003;</span> {perk}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Our Take */}
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 flex items-start gap-3">
                <FiStar className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700 dark:text-gray-300"><strong>{t('ourTake')}:</strong> {selectedExam.tip}</p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 mt-5">
                <Link to="/eligibility-checker" className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1.5">
                  {t('checkEligibilityBtn')} <FiChevronRight className="w-3.5 h-3.5" />
                </Link>
                <Link to="/prep-time-estimator" className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1.5">
                  {t('estimatePrepTime')} <FiClock className="w-3.5 h-3.5" />
                </Link>
                <Link to="/exams" className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-1.5">
                  {t('viewFullDetails')} <FiChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quadrant Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {Object.entries(quadrants).map(([key, q]) => {
            const Icon = q.icon;
            const exams = groupedByQuadrant[key] || [];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl border overflow-hidden ${q.bgClass}`}
              >
                <div className={`${q.headerBg} px-5 py-3 flex items-center gap-2`}>
                  <Icon className="w-5 h-5 text-white" />
                  <div>
                    <h2 className="font-bold text-white">{q.label}</h2>
                    <p className="text-xs text-white/70">{q.subtitle}</p>
                  </div>
                  <span className="ml-auto bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-full">{exams.length}</span>
                </div>
                <div className="p-4">
                  {exams.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">{t('noExamsMatch')}</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {exams.map(exam => (
                        <button
                          key={exam.name}
                          onClick={() => selectAndScroll(exam)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all hover:scale-105 cursor-pointer ${
                            selectedExam?.name === exam.name
                              ? 'ring-2 ring-offset-1 ring-indigo-500 ' + q.chipClass
                              : q.chipClass + ' hover:shadow-md'
                          }`}
                        >
                          {exam.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Competition Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 mb-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">{t('competitionLandscape')}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t('competitionLandscapeDesc')}</p>
          <div className="space-y-3">
            {filtered
              .filter(e => e.ratio !== 'N/A' && !e.ratio.includes('-'))
              .sort((a, b) => {
                const parseRatio = (r) => parseInt(r.replace(/[,:]/g, '').split('1')[0].trim());
                return parseRatio(a.ratio) - parseRatio(b.ratio);
              })
              .slice(0, 15)
              .map(exam => {
                const ratio = parseInt(exam.ratio.replace(/[,:]/g, '').split('1')[0].trim());
                const maxRatio = 1800;
                const width = Math.min((ratio / maxRatio) * 100, 100);
                const q = quadrants[exam.quadrant];
                return (
                  <div key={exam.name} className="flex items-center gap-3 group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-lg p-1 -m-1 transition-colors" onClick={() => selectAndScroll(exam)}>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-28 text-right truncate group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">{exam.name}</span>
                    <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-7 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${width}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full ${q.headerBg} flex items-center justify-end pr-2`}
                      >
                        {width > 12 && <span className="text-xs font-bold text-white whitespace-nowrap">{exam.ratio}</span>}
                      </motion.div>
                      {width <= 12 && <span className="text-xs font-bold text-gray-500 dark:text-gray-400 ml-2 -mt-7 relative block">{exam.ratio}</span>}
                    </div>
                  </div>
                );
              })}
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center">Click any bar to see why people overlook that exam</p>
        </div>

        {/* Salary vs Competition scatter-like section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 mb-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">{t('bestSalaryRatio')}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{t('bestSalaryRatioDesc')}</p>
          <div className="space-y-3">
            {[...filtered]
              .filter(e => {
                const r = e.ratio;
                if (r === 'N/A' || r.includes('-')) return false;
                const s = e.salary;
                if (!s || s.includes('-')) return false;
                return true;
              })
              .map(e => {
                const ratio = parseInt(e.ratio.replace(/[,:]/g, '').split('1')[0].trim());
                const salaryNum = parseInt(e.salary.replace(/[₹,+]/g, '').trim());
                return { ...e, ratioNum: ratio, salaryNum, score: salaryNum / ratio };
              })
              .sort((a, b) => b.score - a.score)
              .slice(0, 10)
              .map((exam, idx) => {
                const q = quadrants[exam.quadrant];
                return (
                  <div
                    key={exam.name}
                    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:shadow-md transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                    onClick={() => selectAndScroll(exam)}
                  >
                    <span className={`w-7 h-7 rounded-lg ${q.headerBg} text-white text-xs font-bold flex items-center justify-center flex-shrink-0`}>
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{exam.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{exam.salary} salary | {exam.ratio} competition</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${q.chipClass} flex-shrink-0`}>
                      {q.label}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* How to Use */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 mb-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">How to Read This Matrix</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20">
              <FiTarget className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-emerald-700 dark:text-emerald-400">Sweet Spot</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Hidden gems most aspirants skip. Lower applicant counts, decent vacancies, great salary. Start here if you want the best odds.</p>
              </div>
            </div>
            <div className="flex gap-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20">
              <FiTrendingUp className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-amber-700 dark:text-amber-400">Worth the Effort</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Mainstream exams with large vacancies. Competition is real but the sheer number of posts means consistent effort pays off.</p>
              </div>
            </div>
            <div className="flex gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-950/20">
              <FiAward className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-700 dark:text-blue-400">High Stakes</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Prestigious exams with fewer seats or tough cutoffs. Worth attempting alongside safer options — don't put all eggs here.</p>
              </div>
            </div>
            <div className="flex gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/20">
              <FiAlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-red-700 dark:text-red-400">Hardest Battle</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Brutal competition ratios. Only attempt if you can commit 1-2 years of full-time preparation. Always keep backup exams ready.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Smart Strategy Section */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-6 mb-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">The Smart Aspirant's Strategy</h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <span className="w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">1</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Pick 1-2 Sweet Spot exams as your primary target</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">These give you the best return on your preparation time. RBI Grade B, SEBI, NABARD, CDS, CAPF AC — any of these can be your main goal.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">2</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Add 1-2 Worth the Effort exams with overlapping syllabus</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">SSC CGL + CPO share 80% syllabus. IBPS PO + Clerk are the same exam at different levels. One preparation, multiple attempts.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">3</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Attempt High Stakes / Hardest only if you have a safety net</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Already secured a Sweet Spot job? Now aim for UPSC CSE or SBI PO from a position of strength — not desperation.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">4</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Never prepare for just one exam</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">The most successful government job aspirants target 3-5 exams simultaneously. Your GK, Reasoning, and Quant preparation works across all of them.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pb-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Found your target exam? Check if you're eligible and start preparing.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/eligibility-checker" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2">
              Check Eligibility <FiChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/compare" className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 transition-all flex items-center gap-2">
              Compare Exams Side by Side <FiChevronRight className="w-4 h-4" />
            </Link>
            <Link to="/exams" className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-400 transition-all flex items-center gap-2">
              Browse All Exams <FiChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPriorityMatrix;
