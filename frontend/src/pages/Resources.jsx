import React, { useState } from 'react';
import { FiSearch, FiDownload, FiExternalLink, FiBook, FiFileText, FiCheckCircle, FiChevronUp, FiInfo, FiZap } from 'react-icons/fi';
import SEO from '../components/common/SEO';
import Breadcrumb from '../components/common/Breadcrumb';
import toast from 'react-hot-toast';

// Genuinely hosted quick-reference notes (content displayed inline on site)
const hostedNotes = [
  {
    id: 'hn-1',
    title: 'Quantitative Aptitude: Shortcut Formulas',
    type: 'Notes',
    exam: 'SSC / Banking / Railways',
    category: 'SSC',
    description: 'Key formulas and shortcuts for Percentage, Profit & Loss, Speed-Time-Distance, Time & Work, and Simple/Compound Interest — fully readable without leaving this page.',
    pages: 'Hosted on GovtExamPath',
    fileUrl: null,
    isHosted: true,
    content: [
      { heading: 'Percentage', points: [
        'x% of y = y% of x',
        '% increase from A to B = (B−A)/A × 100',
        'If price rises by r%, consumption must fall by r/(100+r) × 100 to maintain the same expenditure',
        'Successive discounts of a% and b%: Net discount = a + b − ab/100',
      ]},
      { heading: 'Profit & Loss', points: [
        'Profit% = (SP − CP) / CP × 100',
        'SP = CP × (100 + P%) / 100',
        'Marked Price & Discount: SP = MP × (100 − D%) / 100',
        'False weight profit%: (True wt − False wt) / False wt × 100',
      ]},
      { heading: 'Speed, Time & Distance', points: [
        'Distance = Speed × Time',
        'Average speed (equal distances, two speeds x & y) = 2xy / (x+y)',
        'Relative speed (same direction) = |x − y|; opposite direction = x + y',
        'Train length: Time = (Train length + Platform length) / Speed',
      ]},
      { heading: 'Time & Work', points: [
        'If A completes work in a days: efficiency = 1/a per day',
        'A and B together: 1/a + 1/b per day',
        'Pipe filling: net rate = 1/a − 1/b (A fills, B empties)',
        'Efficiency ratio = Inverse of time ratio',
      ]},
      { heading: 'Simple & Compound Interest', points: [
        'SI = P × R × T / 100',
        'CI = P(1 + R/100)ⁿ − P',
        'For 2 years: CI − SI = P(R/100)²',
        'Effective annual rate for half-yearly compounding: (1 + R/200)² − 1',
      ]},
    ],
  },
  {
    id: 'hn-2',
    title: 'English Grammar: Top 40 Rules for Competitive Exams',
    type: 'Notes',
    exam: 'All Exams',
    category: 'SSC',
    description: 'Frequently tested grammar rules covering Subject-Verb Agreement, Articles, Common Error Pairs, Active/Passive, and Direct/Indirect Speech — all in one place.',
    pages: 'Hosted on GovtExamPath',
    fileUrl: null,
    isHosted: true,
    content: [
      { heading: 'Subject-Verb Agreement', points: [
        'Singular subject → singular verb: "Each student is responsible."',
        'Collective nouns acting as one → singular: "The team has won."',
        '"Either / Neither ... or / nor" → verb agrees with the nearer subject',
        '"A number of" = plural; "The number of" = singular',
        'Relative pronoun verb agrees with its antecedent: "It is I who am wrong."',
      ]},
      { heading: 'Articles (A / An / The)', points: [
        'Use "a" before consonant sounds; "an" before vowel sounds',
        '"An hour", "An honest man" (silent H takes "an")',
        '"A uniform", "A one-way street" (vowel letter but consonant sound)',
        '"The" for unique things: the sun, the moon, the sky',
        'No article before uncountable nouns used generally: "Water is precious."',
      ]},
      { heading: 'Common Error Pairs', points: [
        'Less (uncountable) vs Fewer (countable): "Less sugar", "Fewer errors"',
        'Between (two) vs Among (more than two)',
        'Since (point of time) vs For (period of time): "Since 2020" / "For 3 years"',
        'Beside (next to) vs Besides (in addition to)',
        'Affect (verb) vs Effect (noun)',
        'Lie/Lay: Lie (intransitive, to recline); Lay (transitive, to place)',
      ]},
      { heading: 'Active ↔ Passive Voice', points: [
        'Active: Subject + Verb + Object',
        'Present Simple Passive: is/am/are + Past Participle',
        'Past Simple Passive: was/were + Past Participle',
        'Present Continuous Passive: is/am/are + being + Past Participle',
        'Present Perfect Passive: has/have + been + Past Participle',
      ]},
      { heading: 'Direct ↔ Indirect Speech', points: [
        'Present Simple → Past Simple in reported speech',
        'Present Continuous → Past Continuous',
        '"will" → "would"; "can" → "could"; "may" → "might"',
        'This → That; Here → There; Now → Then; Today → That day',
        'Commands: say + to + person + infinitive: "He told me to sit down."',
      ]},
    ],
  },
  {
    id: 'hn-3',
    title: 'Indian Economy: Key Data & Indicators 2025-26',
    type: 'Notes',
    exam: 'UPSC / Banking / State PSC',
    category: 'Banking',
    description: 'Quick-reference card for GDP figures, RBI key rates, Union Budget 2025-26 highlights, and important economic institutions — all hosted on this page.',
    pages: 'Hosted on GovtExamPath',
    fileUrl: null,
    isHosted: true,
    content: [
      { heading: 'GDP & National Income', points: [
        'India GDP (2024-25, current prices): ~₹295 lakh crore',
        'GDP Growth Rate (2024-25): ~6.5% (NSO estimate)',
        'India GDP rank (PPP): 3rd globally (after US & China)',
        'Services sector: ~55% of GDP | Industry: ~28% | Agriculture: ~17%',
        'GNP = GDP + Net Factor Income from Abroad (NFIA)',
      ]},
      { heading: 'RBI Key Policy Rates (2025)', points: [
        'Repo Rate: 5.25% (rate at which RBI lends to banks)',
        'Reverse Repo Rate: 3.35% (rate at which RBI borrows from banks)',
        'CRR (Cash Reserve Ratio): 4%',
        'SLR (Statutory Liquidity Ratio): 18%',
        'Bank Rate: 5.50% | MSF Rate: 5.50%',
      ]},
      { heading: 'Inflation Concepts', points: [
        'CPI (Consumer Price Index): measures retail inflation for consumers',
        'WPI (Wholesale Price Index): measures wholesale price changes',
        'RBI target: CPI inflation 4% (tolerance band 2%–6%)',
        'Core inflation = CPI minus food and fuel (volatile components)',
        'Stagflation = high inflation + low/negative growth simultaneously',
      ]},
      { heading: 'Union Budget 2025-26 Highlights', points: [
        'No income tax up to ₹12 lakh (new tax regime)',
        'Capital expenditure: ₹11.21 lakh crore (~3.1% of GDP)',
        'Fiscal deficit target: 4.4% of GDP',
        'MSME credit guarantee cover enhanced to ₹5 crore',
        'PM Dhan-Dhanya Krishi Yojana for 100 low-productivity districts',
      ]},
      { heading: 'Key Economic Bodies', points: [
        'NITI Aayog: Policy think tank (replaced Planning Commission in 2015)',
        'RBI: Central bank, established 1935, nationalised 1949',
        'SEBI: Securities market regulator, established 1992',
        'IRDAI: Insurance regulatory authority',
        'NABARD: Apex institution for rural and agricultural financing',
        'EXIM Bank: Export-Import Bank of India (trade financing)',
      ]},
    ],
  },
];

const externalResources = [
  { id: 1, title: 'UPSC CSE Prelims Syllabus & Study Guide', type: 'Guide', exam: 'UPSC CSE', category: 'UPSC', description: 'Official UPSC Civil Services Preliminary exam syllabus with topic-wise coverage of History, Geography, Polity, Economics, Environment, and Science.', pages: '—', fileUrl: 'https://www.upsc.gov.in/', source: 'upsc.gov.in' },
  { id: 2, title: 'UPSC Previous Year Question Papers', type: 'PYQ', exam: 'UPSC CSE', category: 'UPSC', description: 'Official UPSC Civil Services Prelims and Mains question papers archive on the UPSC website.', pages: '—', fileUrl: 'https://www.upsc.gov.in/', source: 'upsc.gov.in' },
  { id: 3, title: 'Indian Polity by M. Laxmikanth – Overview', type: 'Guide', exam: 'UPSC / State PSC', category: 'UPSC', description: 'Chapter-wise summary of the most important book for Indian Polity. Covers Constitution, governance, and political system structure.', pages: '—', fileUrl: 'https://www.upsc.gov.in/', source: 'upsc.gov.in' },
  { id: 4, title: 'UPSC Mains Essay & Answer Writing Guide', type: 'Guide', exam: 'UPSC CSE', category: 'UPSC', description: 'Proven frameworks for essay writing and GS answer structuring including sample essays and scoring patterns used by toppers.', pages: '—', fileUrl: 'https://www.upsc.gov.in/', source: 'upsc.gov.in' },
  { id: 5, title: 'NCERT Textbooks (Class 6–12)', type: 'Guide', exam: 'UPSC / State PSC', category: 'UPSC', description: 'Official NCERT digital textbooks for History, Geography, Polity, Economics, and Science — the foundation of UPSC preparation.', pages: '—', fileUrl: 'https://ncert.nic.in/', source: 'ncert.nic.in' },
  { id: 6, title: 'SSC CGL Official Syllabus & Notice', type: 'Guide', exam: 'SSC CGL', category: 'SSC', description: 'Official SSC CGL Tier I & II syllabus, exam pattern, and notification on the SSC website.', pages: '—', fileUrl: 'https://ssc.gov.in/', source: 'ssc.gov.in' },
  { id: 7, title: 'SSC CGL Previous Year Papers & Answer Keys', type: 'PYQ', exam: 'SSC CGL', category: 'SSC', description: 'Shift-wise previous year question papers with official answer keys on SSC\'s official portal.', pages: '—', fileUrl: 'https://ssc.gov.in/', source: 'ssc.gov.in' },
  { id: 8, title: 'Quantitative Aptitude – Recommended Books', type: 'Books', exam: 'SSC / Banking', category: 'SSC', description: 'A curated list of top quantitative aptitude books (RS Aggarwal, Arihant, Kiran) with shortcut techniques for SSC and Banking exams.', pages: '—', fileUrl: 'https://ssc.gov.in/', source: 'ssc.gov.in' },
  { id: 9, title: 'SSC CHSL Official Syllabus & Exam Pattern', type: 'Guide', exam: 'SSC CHSL', category: 'SSC', description: 'Complete SSC CHSL Tier I & II syllabus with section-wise weightage from the official SSC notice.', pages: '—', fileUrl: 'https://ssc.gov.in/', source: 'ssc.gov.in' },
  { id: 10, title: 'SSC MTS & GD Constable Notifications', type: 'Guide', exam: 'SSC MTS / GD', category: 'SSC', description: 'Official SSC MTS and GD Constable exam notifications, eligibility criteria, and syllabus from SSC.', pages: '—', fileUrl: 'https://ssc.gov.in/', source: 'ssc.gov.in' },
  { id: 11, title: 'IBPS PO Exam Pattern & Syllabus', type: 'Guide', exam: 'IBPS PO', category: 'Banking', description: 'Detailed IBPS PO Prelims and Mains exam pattern, syllabus, and eligibility from the IBPS official site.', pages: '—', fileUrl: 'https://www.ibps.in/', source: 'ibps.in' },
  { id: 12, title: 'RBI Publications & Banking Awareness', type: 'Guide', exam: 'Banking Exams', category: 'Banking', description: 'RBI annual reports, policy documents, and circulars covering monetary policy, banking regulations, and financial sector data.', pages: '—', fileUrl: 'https://www.rbi.org.in/', source: 'rbi.org.in' },
  { id: 13, title: 'IBPS/SBI PO Previous Year Papers', type: 'PYQ', exam: 'IBPS PO / SBI PO', category: 'Banking', description: 'Previous year IBPS PO and SBI PO prelims and mains papers on the official IBPS portal.', pages: '—', fileUrl: 'https://www.ibps.in/', source: 'ibps.in' },
  { id: 14, title: 'IBPS Clerk Syllabus & Preparation Guide', type: 'Guide', exam: 'IBPS Clerk', category: 'Banking', description: 'Section-wise IBPS Clerk Prelims and Mains syllabus from the official IBPS website.', pages: '—', fileUrl: 'https://www.ibps.in/', source: 'ibps.in' },
  { id: 15, title: 'SBI Official Recruitment Notifications', type: 'Guide', exam: 'SBI PO / Clerk', category: 'Banking', description: 'SBI PO and Clerk recruitment notifications, syllabus PDFs, and previous papers from the SBI careers portal.', pages: '—', fileUrl: 'https://www.sbi.co.in/', source: 'sbi.co.in' },
  { id: 16, title: 'RRB NTPC Official Notification & Syllabus', type: 'Guide', exam: 'RRB NTPC', category: 'Railways', description: 'Official RRB NTPC CBT-1 and CBT-2 syllabus, exam dates, and notification from the Railways Recruitment Board.', pages: '—', fileUrl: 'https://www.rrbcdg.gov.in/', source: 'rrbcdg.gov.in' },
  { id: 17, title: 'Railway Group D Previous Year Papers', type: 'PYQ', exam: 'Railway Group D', category: 'Railways', description: 'Railway Group D previous year papers and answer keys from RRB official portals.', pages: '—', fileUrl: 'https://www.rrbcdg.gov.in/', source: 'rrbcdg.gov.in' },
  { id: 18, title: 'RRB JE & ALP Syllabus (Technical Guide)', type: 'Guide', exam: 'RRB JE / ALP', category: 'Railways', description: 'Technical syllabus for Junior Engineer and Assistant Loco Pilot exams from the official RRB portal.', pages: '—', fileUrl: 'https://www.rrbcdg.gov.in/', source: 'rrbcdg.gov.in' },
  { id: 19, title: 'NDA Exam Syllabus & Eligibility', type: 'Guide', exam: 'NDA', category: 'Defence', description: 'Official NDA written exam syllabus covering Mathematics and General Ability Test from UPSC.', pages: '—', fileUrl: 'https://www.upsc.gov.in/', source: 'upsc.gov.in' },
  { id: 20, title: 'CDS Previous Year Papers with Solutions', type: 'PYQ', exam: 'CDS', category: 'Defence', description: 'CDS exam previous year papers for English, GK, and Mathematics from UPSC official archives.', pages: '—', fileUrl: 'https://www.upsc.gov.in/', source: 'upsc.gov.in' },
  { id: 21, title: 'AFCAT Exam Guide & Official Syllabus', type: 'Guide', exam: 'AFCAT', category: 'Defence', description: 'Air Force Common Admission Test syllabus, eligibility, and notification from the Indian Air Force website.', pages: '—', fileUrl: 'https://indianairforce.nic.in/', source: 'indianairforce.nic.in' },
  { id: 22, title: 'Indian Army Recruitment – Agniveer / Soldier', type: 'Guide', exam: 'Agniveer', category: 'Defence', description: 'Official Agnipath scheme recruitment notification, physical standards, medical requirements from Join Indian Army.', pages: '—', fileUrl: 'https://www.joinindianarmy.nic.in/', source: 'joinindianarmy.nic.in' },
  { id: 23, title: 'State PSC General Studies Syllabus', type: 'Guide', exam: 'State PSC', category: 'State PSC', description: 'State-specific GS syllabus links for UPPSC, BPSC, MPPSC, RPSC — covering state history, geography, and polity.', pages: '—', fileUrl: 'https://www.uppsc.up.nic.in/', source: 'uppsc.up.nic.in' },
  { id: 24, title: 'UPPSC PCS Previous Year Papers', type: 'PYQ', exam: 'UPPSC PCS', category: 'State PSC', description: 'Previous year Prelims and Mains papers for UP PSC Provincial Civil Services from the UPPSC portal.', pages: '—', fileUrl: 'https://www.uppsc.up.nic.in/', source: 'uppsc.up.nic.in' },
  { id: 25, title: 'BPSC Official Recruitment Notifications', type: 'Guide', exam: 'BPSC', category: 'State PSC', description: 'BPSC exam notification, syllabus, and result archive from the Bihar Public Service Commission portal.', pages: '—', fileUrl: 'https://www.bpsc.bih.nic.in/', source: 'bpsc.bih.nic.in' },
  { id: 26, title: 'APPSC / TSPSC Official Portals', type: 'Guide', exam: 'APPSC / TSPSC', category: 'State PSC', description: 'Exam notifications, syllabus PDFs, and previous papers for APPSC and TSPSC Group 1/2 exams.', pages: '—', fileUrl: 'https://psc.ap.gov.in/', source: 'psc.ap.gov.in' },
  { id: 27, title: 'CTET Official Notification & Syllabus', type: 'Guide', exam: 'CTET', category: 'Teaching', description: 'Official CTET Paper I and Paper II syllabus, eligibility, and notification from NTA.', pages: '—', fileUrl: 'https://ctet.nic.in/', source: 'ctet.nic.in' },
  { id: 28, title: 'UGC NET Paper 1 Syllabus', type: 'Guide', exam: 'UGC NET', category: 'Teaching', description: 'Official UGC NET Paper 1 syllabus covering Teaching Aptitude, Research, ICT, and Higher Education from NTA.', pages: '—', fileUrl: 'https://ugcnet.nta.ac.in/', source: 'ugcnet.nta.ac.in' },
  { id: 29, title: 'KVS & NVS Teacher Recruitment Notifications', type: 'Guide', exam: 'KVS / NVS', category: 'Teaching', description: 'KVS PRT/TGT/PGT and NVS teacher recruitment notifications and syllabus PDFs from official portals.', pages: '—', fileUrl: 'https://kvsangathan.nic.in/', source: 'kvsangathan.nic.in' },
  { id: 30, title: 'State TET Previous Year Papers', type: 'PYQ', exam: 'State TET', category: 'Teaching', description: 'Previous year papers for UPTET, CTET, HTET, REET, and MPTET from official state exam portals.', pages: '—', fileUrl: 'https://ctet.nic.in/', source: 'ctet.nic.in' },
  { id: 31, title: 'SSC CPO Sub-Inspector Official Syllabus', type: 'Guide', exam: 'SSC CPO', category: 'Police', description: 'SSC CPO Sub-Inspector Paper I & II syllabus, physical test standards, and medical norms from SSC.', pages: '—', fileUrl: 'https://ssc.gov.in/', source: 'ssc.gov.in' },
  { id: 32, title: 'SSC GD Constable Notification', type: 'Guide', exam: 'SSC GD', category: 'Police', description: 'SSC GD Constable exam notification, eligibility, and syllabus from the SSC official portal.', pages: '—', fileUrl: 'https://ssc.gov.in/', source: 'ssc.gov.in' },
  { id: 33, title: 'Delhi Police Recruitment Portal', type: 'Guide', exam: 'Delhi Police', category: 'Police', description: 'Delhi Police SI and Constable exam notifications, admit cards, and results from the Delhi Police official site.', pages: '—', fileUrl: 'https://www.delhipolice.gov.in/', source: 'delhipolice.gov.in' },
  { id: 34, title: 'CAPF AC Previous Year Papers', type: 'PYQ', exam: 'UPSC CAPF', category: 'Police', description: 'UPSC CAPF Assistant Commandant previous year papers for General Ability and Intelligence from UPSC.', pages: '—', fileUrl: 'https://www.upsc.gov.in/', source: 'upsc.gov.in' },
  { id: 35, title: 'LIC AAO Official Recruitment Notification', type: 'Guide', exam: 'LIC AAO', category: 'Insurance', description: 'LIC AAO exam notification, syllabus, and admit card links from LIC India\'s official portal.', pages: '—', fileUrl: 'https://www.licindia.in/', source: 'licindia.in' },
  { id: 36, title: 'IRDAI Regulations & Insurance Awareness', type: 'Guide', exam: 'Insurance Exams', category: 'Insurance', description: 'IRDAI regulations, circulars, and insurance sector publications for Insurance Awareness preparation.', pages: '—', fileUrl: 'https://www.irdai.gov.in/', source: 'irdai.gov.in' },
  { id: 37, title: 'NIACL/UIIC AO Official Notifications', type: 'Guide', exam: 'NIACL / UIIC AO', category: 'Insurance', description: 'NIACL AO and UIIC AO exam notifications and syllabus from the official insurance company portals.', pages: '—', fileUrl: 'https://www.newindia.co.in/', source: 'newindia.co.in' },
  { id: 38, title: 'GATE 2027 Official Portal', type: 'Guide', exam: 'GATE', category: 'PSU', description: 'GATE 2027 notification, registration, syllabus for CS, ECE, ME, EE, CE, and other branches from IISc/IITs.', pages: '—', fileUrl: 'https://gate2027.iisc.ac.in/', source: 'gate2027.iisc.ac.in' },
  { id: 39, title: 'GATE Previous Year Papers (All Branches)', type: 'PYQ', exam: 'GATE', category: 'PSU', description: 'Official GATE previous year papers with answer keys for all branches from the official GATE portal.', pages: '—', fileUrl: 'https://gate2027.iisc.ac.in/', source: 'gate2027.iisc.ac.in' },
  { id: 40, title: 'DRDO CEPTAM Official Recruitment Portal', type: 'Guide', exam: 'DRDO / ISRO', category: 'PSU', description: 'DRDO CEPTAM exam notifications, eligibility, and apply links from the DRDO official website.', pages: '—', fileUrl: 'https://www.drdo.gov.in/', source: 'drdo.gov.in' },
  { id: 41, title: 'RBI Grade B Official Notification', type: 'Guide', exam: 'RBI Grade B', category: 'Regulatory Bodies', description: 'RBI Grade B Phase I & II exam notification, syllabus, and pattern from the Reserve Bank of India.', pages: '—', fileUrl: 'https://www.rbi.org.in/', source: 'rbi.org.in' },
  { id: 42, title: 'SEBI Grade A Official Exam Notification', type: 'Guide', exam: 'SEBI Grade A', category: 'Regulatory Bodies', description: 'SEBI Grade A exam notification, syllabus, and eligibility criteria from the SEBI official website.', pages: '—', fileUrl: 'https://www.sebi.gov.in/', source: 'sebi.gov.in' },
  { id: 43, title: 'NABARD Grade A & B Official Portal', type: 'Guide', exam: 'NABARD', category: 'Regulatory Bodies', description: 'NABARD recruitment notifications, exam dates, and syllabus from the NABARD official portal.', pages: '—', fileUrl: 'https://www.nabard.org/', source: 'nabard.org' },
  { id: 44, title: 'RBI / SEBI / NABARD Previous Year Papers', type: 'PYQ', exam: 'RBI / SEBI / NABARD', category: 'Regulatory Bodies', description: 'Previous year question papers for RBI Grade B, SEBI Grade A Phase I/II from official archives.', pages: '—', fileUrl: 'https://www.rbi.org.in/', source: 'rbi.org.in' },
  { id: 45, title: 'Judicial Services Exam Official Notifications', type: 'Guide', exam: 'Judiciary', category: 'Judiciary', description: 'State judicial services exam notifications covering IPC, CrPC, CPC, Evidence Act from respective High Court portals.', pages: '—', fileUrl: 'https://doj.gov.in/', source: 'doj.gov.in' },
  { id: 46, title: 'India Code – Bare Acts Online', type: 'Guide', exam: 'Judiciary / CLAT', category: 'Judiciary', description: 'Official Ministry of Law repository of all Indian bare acts, amendments, and notifications for free reading.', pages: '—', fileUrl: 'https://www.indiacode.nic.in/', source: 'indiacode.nic.in' },
  { id: 47, title: 'CLAT Previous Year Papers', type: 'PYQ', exam: 'CLAT', category: 'Judiciary', description: 'CLAT previous year papers with solutions from the Consortium of NLUs official portal.', pages: '—', fileUrl: 'https://consortiumofnlus.ac.in/', source: 'consortiumofnlus.ac.in' },
  { id: 48, title: 'NEET PG / NBE Official Portal', type: 'Guide', exam: 'NEET PG', category: 'Healthcare', description: 'NEET PG exam notification, registration, and syllabus from the National Board of Examinations.', pages: '—', fileUrl: 'https://natboard.edu.in/', source: 'natboard.edu.in' },
  { id: 49, title: 'AIIMS Staff Nurse & Hospital Recruitment', type: 'Guide', exam: 'Nursing Exams', category: 'Healthcare', description: 'AIIMS nursing officer and hospital staff recruitment notifications from AIIMS official portal.', pages: '—', fileUrl: 'https://www.aiims.edu/', source: 'aiims.edu' },
  { id: 50, title: 'India Post GDS & MTS Recruitment Portal', type: 'Guide', exam: 'India Post', category: 'Postal', description: 'India Post GDS, MTS, and Postman/Mail Guard exam notifications and apply links from indiapost.gov.in.', pages: '—', fileUrl: 'https://www.indiapost.gov.in/', source: 'indiapost.gov.in' },
  { id: 51, title: 'India Post Previous Year Papers', type: 'PYQ', exam: 'India Post', category: 'Postal', description: 'India Post GDS and Postman previous year papers from the official India Post portal.', pages: '—', fileUrl: 'https://www.indiapost.gov.in/', source: 'indiapost.gov.in' },
  { id: 52, title: 'FCI Manager & Agriculture Exam Portal', type: 'Guide', exam: 'FCI / ICAR', category: 'Agriculture', description: 'FCI Manager recruitment notification, eligibility, and apply links from the FCI official website.', pages: '—', fileUrl: 'https://fci.gov.in/', source: 'fci.gov.in' },
  { id: 53, title: 'Agriculture Ministry – Schemes & Policies', type: 'Guide', exam: 'NABARD / FCI', category: 'Agriculture', description: 'Indian agriculture schemes, rural economy data, and policy documents for FCI, NABARD, and ICAR exam preparation.', pages: '—', fileUrl: 'https://agricoop.nic.in/', source: 'agricoop.nic.in' },
  { id: 54, title: 'Best Books for Government Exams 2026', type: 'Books', exam: 'All Exams', category: 'UPSC', description: 'Curated list of must-read books for UPSC, SSC, Banking, and Railways — NCERTs, RS Aggarwal, Laxmikanth, and more.', pages: '—', fileUrl: 'https://www.upsc.gov.in/', source: 'upsc.gov.in' },
  { id: 55, title: 'Current Affairs – Monthly & Weekly Updates', type: 'Notes', exam: 'All Exams', category: 'UPSC', description: 'Browse and download current affairs on GovtExamPath — national, international, economy, sports, and awards.', pages: 'Hosted on GovtExamPath', fileUrl: '/current-affairs', source: 'govtexampath.com', isInternal: true },
  { id: 56, title: 'Static GK & Current Affairs Compilation', type: 'Notes', exam: 'All Exams', category: 'SSC', description: 'Month-wise current affairs and Static GK capsule (dams, rivers, national parks, headquarters, currencies) for all competitive exams.', pages: 'Hosted on GovtExamPath', fileUrl: '/current-affairs', source: 'govtexampath.com', isInternal: true },
  { id: 57, title: 'India Union Budget 2025-26 Official Document', type: 'Guide', exam: 'All Exams', category: 'Banking', description: 'Official Union Budget 2025-26 speech, highlights, and economic survey from the Ministry of Finance.', pages: '—', fileUrl: 'https://www.indiabudget.gov.in/', source: 'indiabudget.gov.in' },
  { id: 58, title: 'IBPS Computer Awareness Syllabus', type: 'Guide', exam: 'Banking / SSC', category: 'Banking', description: 'Computer awareness topics from the official IBPS syllabus — hardware, software, networking, MS Office, internet, and databases.', pages: '—', fileUrl: 'https://www.ibps.in/', source: 'ibps.in' },
];

const resourcesData = [...hostedNotes, ...externalResources];

const categories = ['All', 'UPSC', 'SSC', 'Banking', 'Railways', 'Defence', 'State PSC', 'Teaching', 'Police', 'Insurance', 'PSU', 'Regulatory Bodies', 'Judiciary', 'Healthcare', 'Postal', 'Agriculture', 'Miscellaneous'];
const types = ['All', 'Notes', 'Guide', 'PYQ', 'Books'];

const typeBadgeColors = {
  Notes: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  Guide: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  PYQ: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Books: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

const typeLabels = {
  Notes: 'On-Site Notes',
  Guide: 'Official Guide',
  PYQ: 'Prev. Year Papers',
  Books: 'Book List',
};

const resourcesSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Study Resources for Government Exams',
  description: 'Curated links to official government exam resources, study guides, and previous year papers for UPSC, SSC, Banking, Railways, Defence, Police, PSU, and more. Includes on-site quick-reference notes.',
  url: 'https://govtexampath.com/resources',
  isPartOf: { '@type': 'WebSite', name: 'GovtExamPath', url: 'https://govtexampath.com' },
};

const Resources = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [search, setSearch] = useState('');
  const [opening, setOpening] = useState(null);
  const [expandedNote, setExpandedNote] = useState(null);

  const filtered = resourcesData.filter(r => {
    const matchCat = selectedCategory === 'All' || r.category === selectedCategory;
    const matchType = selectedType === 'All' || r.type === selectedType;
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.exam.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchType && matchSearch;
  });

  const handleOpen = async (resource) => {
    if (resource.isHosted) {
      setExpandedNote(expandedNote === resource.id ? null : resource.id);
      return;
    }
    setOpening(resource.id);
    try {
      if (resource.fileUrl) {
        if (resource.fileUrl.startsWith('/')) {
          window.location.href = resource.fileUrl;
        } else {
          window.open(resource.fileUrl, '_blank', 'noopener,noreferrer');
        }
        toast.success(resource.isInternal ? `Opening: ${resource.title}` : `Opening ${resource.source} in new tab`, { duration: 3000 });
      } else {
        toast.error('This resource is temporarily unavailable.', { duration: 3000 });
      }
    } catch {
      toast.error('Failed to open resource. Please try again.');
    } finally {
      setTimeout(() => setOpening(null), 1000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO
        title="Study Resources Hub – Official Guides & Quick Notes"
        path="/resources"
        description="Curated links to official government exam resources and on-site quick-reference notes for UPSC, SSC, Banking, Railways, Defence, and more."
        jsonLd={resourcesSchema}
      />
      <Breadcrumb items={[{ label: 'Resources' }]} />

      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/25">
          <FiBook className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
          Study <span className="gradient-text">Resources Hub</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400">On-site quick-reference notes + curated links to official exam portals and study guides</p>
      </div>

      {/* Transparency banner */}
      <div className="max-w-4xl mx-auto mb-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 flex gap-3">
        <FiInfo className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800 dark:text-blue-300">
          <p className="font-semibold mb-1">About this section</p>
          <p>
            <span className="inline-flex items-center gap-1 font-medium text-teal-700 dark:text-teal-400"><FiZap className="w-3.5 h-3.5" /> On-Site Notes</span> — quick-reference material written and hosted on GovtExamPath. Expand them directly here.{' '}
            <span className="inline-flex items-center gap-1 font-medium text-blue-700 dark:text-blue-400 ml-1"><FiExternalLink className="w-3.5 h-3.5" /> Official Guides &amp; PYQs</span> — links to official government websites (UPSC, SSC, IBPS, RBI, etc.). You will be redirected to the source site.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, exam, or keyword..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none shadow-sm"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 justify-center flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary-400'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Type filter */}
      <div className="flex gap-2 justify-center mb-8 flex-wrap">
        {types.map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedType === type ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
          >
            {type === 'All' ? 'All Types' : type === 'Notes' ? '⚡ On-Site Notes' : type === 'Guide' ? '🔗 Official Guides' : type === 'PYQ' ? '📄 PYQ Papers' : '📚 Book Lists'}
          </button>
        ))}
      </div>

      {/* Resources grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <FiFileText className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No resources found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(resource => {
            const isExpanded = expandedNote === resource.id;
            const isHosted = resource.isHosted;
            const isInternal = resource.isInternal;
            return (
              <div
                key={resource.id}
                className={`rounded-2xl border p-5 transition-all duration-200 ${
                  isHosted
                    ? 'bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 border-teal-200 dark:border-teal-800 shadow-sm hover:shadow-md'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 card-hover'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${typeBadgeColors[resource.type]}`}>
                    {isHosted ? '⚡ On-Site Notes' : typeLabels[resource.type] || resource.type}
                  </span>
                  {!isHosted && resource.source && (
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-mono truncate max-w-[130px]" title={`Source: ${resource.source}`}>
                      {resource.source}
                    </span>
                  )}
                </div>

                <h3 className={`font-bold mb-1 line-clamp-2 transition-colors ${
                  isHosted
                    ? 'text-teal-900 dark:text-teal-100 group-hover:text-teal-700'
                    : 'text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400'
                }`}>
                  {resource.title}
                </h3>

                <p className={`text-xs font-medium mb-2 ${isHosted ? 'text-teal-600 dark:text-teal-400' : 'text-primary-600 dark:text-primary-400'}`}>
                  {resource.exam}
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4">{resource.description}</p>

                <button
                  onClick={() => handleOpen(resource)}
                  disabled={opening === resource.id}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all shadow-md ${
                    opening === resource.id
                      ? 'bg-green-500 text-white shadow-green-500/20'
                      : isHosted
                      ? isExpanded
                        ? 'bg-teal-700 text-white shadow-teal-700/20'
                        : 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:from-teal-700 hover:to-emerald-700 shadow-teal-500/20'
                      : isInternal
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-indigo-500/20'
                      : resource.fileUrl
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/20'
                      : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white cursor-not-allowed shadow-gray-500/20'
                  }`}
                >
                  {opening === resource.id ? (
                    <><FiCheckCircle className="w-4 h-4" /> Opening...</>
                  ) : isHosted ? (
                    isExpanded
                      ? <><FiChevronUp className="w-4 h-4" /> Collapse Notes</>
                      : <><FiZap className="w-4 h-4" /> Read Notes Here</>
                  ) : isInternal ? (
                    <><FiDownload className="w-4 h-4" /> View on GovtExamPath</>
                  ) : resource.fileUrl ? (
                    <><FiExternalLink className="w-4 h-4" /> Visit {resource.source}</>
                  ) : (
                    'Unavailable'
                  )}
                </button>

                {/* Inline expandable notes */}
                {isHosted && isExpanded && resource.content && (
                  <div className="mt-4 pt-4 border-t border-teal-200 dark:border-teal-700 space-y-4">
                    {resource.content.map((section, idx) => (
                      <div key={idx}>
                        <h4 className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider mb-2">{section.heading}</h4>
                        <ul className="space-y-1.5">
                          {section.points.map((point, pIdx) => (
                            <li key={pIdx} className="text-xs text-gray-700 dark:text-gray-300 flex gap-2">
                              <span className="text-teal-500 mt-0.5 flex-shrink-0">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* How to use section */}
      <div className="mt-12 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">How to Use This Resources Hub</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600 dark:text-gray-400 mb-8">
          <div>
            <h3 className="font-semibold text-teal-700 dark:text-teal-400 mb-2">⚡ On-Site Notes</h3>
            <p>Click "Read Notes Here" to expand quick-reference content directly on this page — no redirects. These notes are written and hosted by GovtExamPath covering Quant shortcuts, English grammar rules, and Indian Economy data. Bookmark the page for quick revision.</p>
          </div>
          <div>
            <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">🔗 Official Guides</h3>
            <p>These cards link to official government portals (UPSC, SSC, IBPS, RBI, etc.). Clicking opens the source site in a new tab. The domain name shown on each card tells you exactly where you will land. Always verify exam details on official sites before applying.</p>
          </div>
          <div>
            <h3 className="font-semibold text-orange-700 dark:text-orange-400 mb-2">📄 Previous Year Papers</h3>
            <p>PYQ cards link to official exam authority portals where authentic previous year papers are available. Solving PYQs is the single most effective strategy — aim for at least 30 full-length mock tests before your exam date.</p>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Exam-Specific Study Strategy</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">UPSC & State PSC</p>
              <p>Start with NCERT books (Class 6–12), then move to standard references. Read a newspaper daily. Practice answer writing for Mains from day one. Allocate 8–14 months for serious UPSC preparation.</p>
            </div>
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">SSC CGL / CHSL</p>
              <p>Focus on speed and accuracy — competitive cutoffs reward quick problem-solving. Practice 50+ questions daily in Quant and Reasoning. Take at least 30 full-length mocks and learn Vedic Math shortcuts.</p>
            </div>
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Banking (IBPS / SBI)</p>
              <p>Sectional time management is critical. Practice Data Interpretation and Puzzles daily. Build banking awareness by reading Economic Times. Take sectional tests before full mocks to identify weak areas.</p>
            </div>
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">Railways & Defence</p>
              <p>For Railways, master General Science and Math basics. For NDA/CDS, English and GK carry significant weight. For defence exams, parallel physical fitness preparation is essential from day one.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
