const Exam = require('../models/Exam');

// Verified dates as of June 19, 2026 from official sources
const corrections = [
  // ═══ SSC ═══
  {
    title: 'SSC CGL 2026',
    lastDate: '2026-06-22',
    vacancies: '12,256',
    importantDates: [
      { event: 'Notification Date', date: '2026-05-21' },
      { event: 'Application Closed', date: '2026-06-22' },
      { event: 'Correction Window (Open)', date: '2026-07-01' },
      { event: 'Correction Window Ends', date: '2026-07-07' },
      { event: 'Tier-I Exam (Tentative)', date: '2026-09-01' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'SSC CHSL 2026',
    lastDate: '2026-07-18',
    vacancies: '3,000+',
    importantDates: [
      { event: 'Notification Expected', date: '2026-06-25' },
      { event: 'Application End (Expected)', date: '2026-07-18' },
      { event: 'Tier-I Exam (Tentative)', date: '2026-09-15' },
    ],
    dateStatus: 'tentative',
  },
  {
    title: 'SSC MTS 2026',
    lastDate: '2026-07-31',
    importantDates: [
      { event: 'Notification Date', date: '2026-06-30' },
      { event: 'Application End Date', date: '2026-07-31' },
      { event: 'CBT Exam (Tentative)', date: '2026-10-15' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'SSC GD Constable 2026',
    lastDate: '2025-12-31',
    vacancies: '25,487',
    importantDates: [
      { event: 'Application Closed', date: '2025-12-31' },
      { event: 'CBT Exam (Completed)', date: '2026-04-27' },
      { event: 'Result Expected', date: '2026-07-15' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'SSC JE 2026',
    lastDate: '2026-07-21',
    importantDates: [
      { event: 'Notification Expected', date: '2026-06-20' },
      { event: 'Application End Date', date: '2026-07-21' },
      { event: 'Paper-I CBT (Tentative)', date: '2026-10-15' },
    ],
    dateStatus: 'tentative',
  },
  {
    title: 'SSC Stenographer Grade C & D 2026',
    lastDate: '2026-05-15',
    vacancies: '1,170',
    importantDates: [
      { event: 'Notification Date', date: '2026-04-24' },
      { event: 'Application Closed', date: '2026-05-15' },
      { event: 'Fee Payment Deadline', date: '2026-05-16' },
      { event: 'Correction Window', date: '2026-05-25' },
      { event: 'Exam Date (Tentative)', date: '2026-08-01' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'SSC CPO 2026',
    lastDate: '2026-06-30',
    importantDates: [
      { event: 'Notification Date', date: '2026-05-31' },
      { event: 'Application End Date', date: '2026-06-30' },
      { event: 'Paper-I Exam (Tentative)', date: '2026-11-01' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'SSC Selection Post 2026',
    lastDate: '2026-10-30',
    importantDates: [
      { event: 'CBT Exam (Tentative)', date: '2027-01-15' },
    ],
    dateStatus: 'tentative',
  },

  // ═══ UPSC ═══
  {
    // Duplicate seeder entry with wrong lastDate (had 2026-02-11 = prelims date, not application deadline)
    title: 'UPSC IES / Engineering Services 2026',
    lastDate: '2025-10-16',
    vacancies: '474',
    importantDates: [
      { event: 'Notification Released', date: '2025-09-26' },
      { event: 'Application Closed', date: '2025-10-16' },
      { event: 'Prelims (Completed)', date: '2026-02-08' },
      { event: 'Prelims Result Out', date: '2026-02-26' },
      { event: 'Mains (Completed)', date: '2026-06-21' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'UPSC Civil Services 2026',
    lastDate: '2026-02-24',
    vacancies: '933',
    importantDates: [
      { event: 'Notification Date', date: '2026-02-04' },
      { event: 'Application Closed', date: '2026-02-24' },
      { event: 'Prelims (Completed)', date: '2026-05-24' },
      { event: 'Mains Exam', date: '2026-08-21' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'UPSC NDA 2026',
    lastDate: '2026-06-11',
    vacancies: '394',
    importantDates: [
      { event: 'NDA 2 Notification', date: '2026-05-20' },
      { event: 'NDA 2 Application Closed', date: '2026-06-11' },
      { event: 'NDA 2 Exam Date', date: '2026-09-13' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'UPSC CDS 2026',
    lastDate: '2026-06-11',
    importantDates: [
      { event: 'CDS 1 Exam (Completed)', date: '2026-04-12' },
      { event: 'CDS 2 Application Closed', date: '2026-06-11' },
      { event: 'CDS 2 Exam Date', date: '2026-09-13' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'UPSC CAPF 2026',
    lastDate: '2026-03-12',
    vacancies: '349',
    importantDates: [
      { event: 'Notification Date', date: '2026-02-20' },
      { event: 'Application Closed', date: '2026-03-12' },
      { event: 'Exam Date', date: '2026-07-19' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'UPSC EPFO 2026',
    lastDate: '2026-08-15',
    dateStatus: 'tentative',
  },
  {
    title: 'UPSC ESE 2026',
    lastDate: '2025-10-16',
    importantDates: [
      { event: 'Notification Released', date: '2025-09-26' },
      { event: 'Application Closed', date: '2025-10-16' },
      { event: 'Prelims (Completed)', date: '2026-02-08' },
      { event: 'Prelims Result Out', date: '2026-02-26' },
      { event: 'Mains (Completed)', date: '2026-06-21' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'UPSC CMS 2026',
    lastDate: '2026-03-31',
    vacancies: '1,358',
    importantDates: [
      { event: 'Notification Date', date: '2026-03-11' },
      { event: 'Application Closed', date: '2026-03-31' },
      { event: 'Exam Date', date: '2026-08-02' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'UPSC Geo-Scientist 2026',
    lastDate: '2025-09-23',
    importantDates: [
      { event: 'Application Closed', date: '2025-09-23' },
      { event: 'Prelims (Completed)', date: '2026-02-15' },
    ],
    dateStatus: 'confirmed',
  },

  // ═══ Banking ═══
  {
    title: 'IBPS PO 2026',
    lastDate: '2026-07-15',
    importantDates: [
      { event: 'Notification Expected', date: '2026-06-20' },
      { event: 'Application End (Expected)', date: '2026-07-15' },
      { event: 'Prelims Exam', date: '2026-08-22' },
      { event: 'Mains Exam', date: '2026-10-04' },
    ],
    dateStatus: 'tentative',
  },
  {
    title: 'IBPS Clerk 2026',
    lastDate: '2026-08-15',
    importantDates: [
      { event: 'Notification Expected', date: '2026-07-15' },
      { event: 'Prelims Exam', date: '2026-10-10' },
      { event: 'Mains Exam', date: '2026-12-27' },
    ],
    dateStatus: 'tentative',
  },
  {
    title: 'IBPS SO 2026',
    lastDate: '2026-07-31',
    importantDates: [
      { event: 'Notification Expected', date: '2026-06-20' },
      { event: 'Prelims Exam', date: '2026-08-29' },
      { event: 'Mains Exam', date: '2026-11-01' },
    ],
    dateStatus: 'tentative',
  },
  {
    title: 'IBPS RRB PO 2026',
    lastDate: '2026-07-20',
    importantDates: [
      { event: 'Prelims (Expected)', date: '2026-09-15' },
      { event: 'Mains (Expected)', date: '2026-10-25' },
    ],
    dateStatus: 'tentative',
  },
  {
    title: 'IBPS RRB Clerk 2026',
    lastDate: '2026-07-20',
    importantDates: [
      { event: 'Prelims (Expected)', date: '2026-09-20' },
    ],
    dateStatus: 'tentative',
  },
  {
    title: 'SBI PO 2026',
    lastDate: '2026-07-08',
    vacancies: '1,500',
    importantDates: [
      { event: 'Notification Date', date: '2026-06-18' },
      { event: 'Application End Date', date: '2026-07-08' },
      { event: 'Prelims Exam (Tentative)', date: '2026-08-15' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'SBI Clerk 2026',
    lastDate: '2026-08-30',
    importantDates: [
      { event: 'Notification Expected', date: '2026-07-15' },
    ],
    dateStatus: 'tentative',
  },
  {
    title: 'SBI SO 2026',
    lastDate: '2026-11-15',
    dateStatus: 'tentative',
  },
  {
    title: 'RBI Grade B 2026',
    lastDate: '2026-05-20',
    vacancies: '60',
    importantDates: [
      { event: 'Notification Date', date: '2026-04-29' },
      { event: 'Application Closed', date: '2026-05-20' },
      { event: 'Phase 1 (Completed)', date: '2026-06-13' },
      { event: 'Phase 2 Exam', date: '2026-07-25' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'RBI Assistant 2026',
    lastDate: '2026-09-30',
    dateStatus: 'tentative',
  },

  // ═══ Railways ═══
  {
    title: 'RRB NTPC 2026',
    lastDate: '2025-11-27',
    vacancies: '8,868',
    importantDates: [
      { event: 'Application Closed', date: '2025-11-27' },
      { event: 'CBT-1 Graduate (Completed)', date: '2026-03-16' },
      { event: 'CBT-1 Undergraduate (Completed)', date: '2026-06-20' },
      { event: 'CBT-2 Undergraduate', date: '2026-09-17' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'RRB Group D 2026',
    lastDate: '2026-03-09',
    vacancies: '22,195',
    importantDates: [
      { event: 'Notification Date', date: '2026-01-30' },
      { event: 'Application Closed', date: '2026-03-09' },
      { event: 'CBT Exam (Tentative)', date: '2026-08-15' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'RRB JE 2025-26',
    lastDate: '2025-12-12',
    importantDates: [
      { event: 'Application End Date', date: '2025-12-12' },
      { event: 'CBT-1 Completed', date: '2026-03-03' },
      { event: 'CBT-2 Date', date: '2026-07-02' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'RRB ALP 2026',
    lastDate: '2026-07-31',
    dateStatus: 'tentative',
  },
  {
    title: 'RPF Constable 2026',
    lastDate: '2026-08-30',
    dateStatus: 'tentative',
  },
  {
    title: 'RPF SI 2026',
    lastDate: '2026-08-30',
    dateStatus: 'tentative',
  },

  // ═══ Defence ═══
  {
    title: 'AFCAT 2026',
    lastDate: '2026-06-19',
    vacancies: '379',
    importantDates: [
      { event: 'AFCAT 1 Exam (Completed)', date: '2026-01-31' },
      { event: 'AFCAT 2 Notification', date: '2026-05-20' },
      { event: 'AFCAT 2 Application Closed', date: '2026-06-19' },
      { event: 'AFCAT 2 Exam Date', date: '2026-08-08' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'Indian Navy SSR/AA 2026',
    lastDate: '2026-07-15',
    dateStatus: 'tentative',
  },
  {
    title: 'Indian Coast Guard GD 2026',
    lastDate: '2026-08-10',
    dateStatus: 'tentative',
  },
  {
    title: 'Indian Army Agniveer 2026',
    lastDate: '2026-04-01',
    vacancies: '25,000+',
    importantDates: [
      { event: 'Registration Started', date: '2026-02-13' },
      { event: 'Application Closed', date: '2026-04-01' },
      { event: 'CEE Exam (Tentative)', date: '2026-06-15' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'Indian Air Force Agniveer 2026',
    lastDate: '2026-07-26',
    vacancies: '3,500+',
    importantDates: [
      { event: 'Intake 01/2027 Completed', date: '2026-03-31' },
      { event: 'Intake 02/2027 Registration Opens', date: '2026-07-06' },
      { event: 'Intake 02/2027 Application Closed', date: '2026-07-26' },
      { event: 'Intake 02/2027 Exam Date', date: '2026-09-22' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'Indian Navy Agniveer 2026',
    lastDate: '2026-09-15',
    dateStatus: 'tentative',
  },
  {
    title: 'DRDO SET 2026',
    lastDate: '2026-10-15',
    dateStatus: 'tentative',
  },

  // ═══ State PSC ═══
  {
    title: 'APPSC Group 1 2026',
    lastDate: '2026-09-04',
    vacancies: '91',
    importantDates: [
      { event: 'Notification Date', date: '2026-08-15' },
      { event: 'Application End Date', date: '2026-09-04' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'TSPSC Group 1 2026',
    lastDate: '2026-09-30',
    dateStatus: 'tentative',
  },
  {
    title: 'KPSC KAS 2026',
    lastDate: '2026-06-15',
    importantDates: [
      { event: 'Notification Date', date: '2026-05-06' },
      { event: 'Registration Started', date: '2026-05-15' },
      { event: 'Application End (Expected)', date: '2026-06-15' },
    ],
    dateStatus: 'tentative',
  },
  {
    title: 'TNPSC Group 1 2026',
    lastDate: '2026-08-15',
    importantDates: [
      { event: 'Notification Date', date: '2026-06-23' },
      { event: 'Application End (Expected)', date: '2026-08-15' },
      { event: 'Exam Date', date: '2026-09-06' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'UPPSC PCS 2026',
    lastDate: '2026-08-30',
    importantDates: [
      { event: 'Notification Expected', date: '2026-07-15' },
      { event: 'Prelims Exam', date: '2026-12-06' },
    ],
    dateStatus: 'tentative',
  },
  {
    title: 'MPPSC State Services 2026',
    lastDate: '2026-04-03',
    vacancies: '155',
    importantDates: [
      { event: 'Notification Date', date: '2026-01-10' },
      { event: 'Application Closed', date: '2026-02-09' },
      { event: 'Extended Last Date', date: '2026-04-03' },
      { event: 'Prelims Exam (Tentative)', date: '2026-10-18' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'RPSC RAS 2026',
    lastDate: '2026-07-03',
    vacancies: '607',
    importantDates: [
      { event: 'Notification Date', date: '2026-05-27' },
      { event: 'Application Start', date: '2026-06-04' },
      { event: 'Application End Date', date: '2026-07-03' },
      { event: 'Prelims Exam', date: '2026-11-29' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'BPSC Bihar PCS 2026',
    lastDate: '2026-05-31',
    vacancies: '1,186',
    importantDates: [
      { event: 'Application Start', date: '2026-05-07' },
      { event: 'Application Closed', date: '2026-05-31' },
      { event: 'Prelims Exam', date: '2026-07-26' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'WBPSC WBCS 2026',
    lastDate: '2026-07-30',
    dateStatus: 'tentative',
  },
  {
    title: 'MPSC Maharashtra 2026',
    lastDate: '2026-08-10',
    dateStatus: 'tentative',
  },
  {
    title: 'HPSC HCS 2026',
    lastDate: '2026-09-10',
    dateStatus: 'tentative',
  },
  {
    title: 'GPSC Class 1-2 2026',
    lastDate: '2026-08-25',
    dateStatus: 'tentative',
  },

  // ═══ Teaching ═══
  {
    title: 'CTET 2026',
    lastDate: '2026-06-10',
    importantDates: [
      { event: 'Notification Date', date: '2026-05-11' },
      { event: 'Application Closed', date: '2026-06-10' },
      { event: 'Correction Window', date: '2026-06-18' },
      { event: 'Exam Date', date: '2026-09-06' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'UGC NET 2026',
    lastDate: '2026-05-24',
    importantDates: [
      { event: 'Application Start', date: '2026-04-29' },
      { event: 'Application Closed', date: '2026-05-24' },
      { event: 'Correction Window', date: '2026-05-27' },
      { event: 'Exam Completed', date: '2026-06-30' },
      { event: 'Result Expected', date: '2026-08-15' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'DSSSB TGT/PGT 2026',
    lastDate: '2026-07-20',
    dateStatus: 'tentative',
  },
  {
    title: 'KVS TGT/PGT 2026',
    lastDate: '2025-12-15',
    vacancies: '9,921',
    importantDates: [
      { event: 'Notification Date', date: '2025-11-13' },
      { event: 'Application Closed', date: '2025-12-15' },
      { event: 'Tier-1 (Completed)', date: '2026-01-10' },
      { event: 'Tier-2 (Completed)', date: '2026-03-29' },
      { event: 'Result Expected', date: '2026-07-15' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'NVS TGT/PGT 2026',
    lastDate: '2026-09-15',
    dateStatus: 'tentative',
  },
  {
    title: 'Super TET 2026',
    lastDate: '2026-08-10',
    dateStatus: 'tentative',
  },

  // ═══ Police ═══
  {
    title: 'Delhi Police Constable 2026',
    lastDate: '2026-08-30',
    vacancies: '8,760',
    dateStatus: 'tentative',
  },
  {
    title: 'Delhi Police SI 2026',
    lastDate: '2026-07-15',
    importantDates: [
      { event: 'Notification Date', date: '2026-05-31' },
      { event: 'Exam (Tentative)', date: '2026-10-15' },
    ],
    dateStatus: 'tentative',
  },
  {
    title: 'UP Police Constable 2026',
    lastDate: '2026-01-30',
    importantDates: [
      { event: 'Notification Released', date: '2025-12-31' },
      { event: 'Application End Date', date: '2026-01-30' },
      { event: 'Exam Completed', date: '2026-06-10' },
      { event: 'Answer Key Released', date: '2026-06-20' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'Bihar Police Constable 2026',
    lastDate: '2026-09-10',
    dateStatus: 'tentative',
  },
  {
    title: 'MP Police Constable 2026',
    lastDate: '2026-09-20',
    dateStatus: 'tentative',
  },

  // ═══ Insurance ═══
  {
    title: 'LIC AAO 2026',
    lastDate: '2026-09-15',
    importantDates: [
      { event: 'Notification Expected', date: '2026-08-15' },
    ],
    dateStatus: 'tentative',
  },
  {
    title: 'NIACL AO 2026',
    lastDate: '2026-09-10',
    dateStatus: 'tentative',
  },
  {
    title: 'LIC ADO 2026',
    lastDate: '2026-10-15',
    dateStatus: 'tentative',
  },
  {
    title: 'GIC Scale I Officer 2026',
    lastDate: '2026-10-30',
    dateStatus: 'tentative',
  },

  // ═══ Regulatory Bodies ═══
  {
    title: 'SEBI Grade A 2026',
    lastDate: '2025-11-28',
    vacancies: '135',
    importantDates: [
      { event: 'Notification Date', date: '2025-10-30' },
      { event: 'Application Closed', date: '2025-11-28' },
      { event: 'Phase 1 (Completed)', date: '2026-01-10' },
      { event: 'Phase 2 (Completed)', date: '2026-02-21' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'NABARD Grade A 2026',
    lastDate: '2026-08-30',
    importantDates: [
      { event: 'Notification Expected', date: '2026-07-30' },
    ],
    dateStatus: 'tentative',
  },
  {
    title: 'EPFO SSA 2026',
    lastDate: '2026-09-20',
    dateStatus: 'tentative',
  },

  // ═══ Teaching (additional) ═══
  {
    title: 'UPTET 2026',
    lastDate: '2026-06-30',
    importantDates: [
      { event: 'Application Closed', date: '2026-06-30' },
      { event: 'Exam Date (Tentative)', date: '2026-09-21' },
    ],
    dateStatus: 'tentative',
  },
  {
    title: 'KVS PRT 2026',
    lastDate: '2026-06-15',
    importantDates: [
      { event: 'Application Closed', date: '2026-06-15' },
      { event: 'Exam Date (Tentative)', date: '2026-09-15' },
    ],
    dateStatus: 'tentative',
  },
  {
    title: 'CTET 2026',
    lastDate: '2026-06-10',
    importantDates: [
      { event: 'Notification Date', date: '2026-05-11' },
      { event: 'Application Closed', date: '2026-06-10' },
      { event: 'Correction Window', date: '2026-06-18' },
      { event: 'Exam Date', date: '2026-09-06' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'RPSC School Lecturer 2026',
    lastDate: '2026-05-31',
    importantDates: [
      { event: 'Application Closed', date: '2026-05-31' },
      { event: 'Exam Date (Tentative)', date: '2026-11-01' },
    ],
    dateStatus: 'tentative',
  },
  {
    title: 'Sainik Schools Teacher 2026',
    lastDate: '2026-06-10',
    importantDates: [
      { event: 'Application Closed', date: '2026-06-10' },
      { event: 'Selection Process (Tentative)', date: '2026-08-15' },
    ],
    dateStatus: 'tentative',
  },

  // ═══ Judiciary ═══
  {
    title: 'Judicial Services Exam 2026',
    lastDate: '2026-10-30',
    dateStatus: 'tentative',
  },

  // ═══ PSU ═══
  {
    title: 'ONGC Recruitment 2026',
    lastDate: '2026-03-15',
    importantDates: [
      { event: 'Application Closed', date: '2026-03-15' },
      { event: 'Selection via GATE 2026', date: '2026-02-15' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'NTPC Executive Trainee 2026',
    lastDate: '2026-05-15',
    dateStatus: 'tentative',
  },
  {
    title: 'IOCL Apprentice 2026',
    lastDate: '2026-06-30',
    dateStatus: 'tentative',
  },
  {
    title: 'BHEL Engineer Trainee 2026',
    lastDate: '2026-08-15',
    dateStatus: 'tentative',
  },
  {
    title: 'SAIL Management Trainee 2026',
    lastDate: '2026-09-10',
    dateStatus: 'tentative',
  },
  {
    title: 'Coal India Management Trainee 2026',
    lastDate: '2026-09-25',
    dateStatus: 'tentative',
  },
  {
    title: 'Power Grid Engineer Trainee 2026',
    lastDate: '2026-10-10',
    dateStatus: 'tentative',
  },

  // ═══ Healthcare ═══
  {
    title: 'AIIMS Nursing Officer 2026',
    lastDate: '2026-05-20',
    dateStatus: 'tentative',
  },
  {
    title: 'NEET UG 2026',
    lastDate: '2026-03-11',
    importantDates: [
      { event: 'Registration Started', date: '2026-02-08' },
      { event: 'Application Closed', date: '2026-03-11' },
      { event: 'Exam (Completed)', date: '2026-05-03' },
      { event: 'Re-Exam', date: '2026-06-21' },
      { event: 'Result Expected', date: '2026-07-10' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'NEET PG 2026',
    lastDate: '2026-08-30',
    dateStatus: 'tentative',
  },
  {
    title: 'ESIC UDC 2026',
    lastDate: '2026-08-20',
    dateStatus: 'tentative',
  },

  // ═══ Agriculture ═══
  {
    title: 'ICAR NET 2026',
    lastDate: '2026-06-20',
    dateStatus: 'tentative',
  },
  {
    title: 'FCI Manager 2026',
    lastDate: '2026-08-20',
    dateStatus: 'tentative',
  },

  // ═══ Postal ═══
  {
    title: 'India Post GDS 2026',
    lastDate: '2026-02-14',
    vacancies: '28,740',
    importantDates: [
      { event: 'Notification Date', date: '2026-01-30' },
      { event: 'Application Closed', date: '2026-02-14' },
      { event: 'Fee Payment Deadline', date: '2026-02-16' },
      { event: 'Merit List Expected', date: '2026-06-30' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'India Post MTS 2026',
    lastDate: '2026-08-15',
    dateStatus: 'tentative',
  },

  // ═══ Miscellaneous ═══
  {
    title: 'GATE 2026',
    lastDate: '2026-09-30',
    importantDates: [
      { event: 'Notification Expected', date: '2026-08-25' },
      { event: 'Registration Opens', date: '2026-08-01' },
      { event: 'Registration End (Expected)', date: '2026-09-30' },
      { event: 'Exam Dates', date: '2027-02-06' },
    ],
    dateStatus: 'tentative',
  },
  {
    title: 'CAT 2026',
    lastDate: '2026-09-20',
    dateStatus: 'tentative',
  },
  {
    title: 'CLAT 2026',
    lastDate: '2026-04-15',
    dateStatus: 'tentative',
  },
  {
    title: 'JSSC CGL 2026',
    lastDate: '2026-09-15',
    dateStatus: 'tentative',
  },
  {
    title: 'OSSSC Combined 2026',
    lastDate: '2026-08-30',
    dateStatus: 'tentative',
  },

  // ═══ Newly Added State PSC ═══
  {
    title: 'Mizoram PSC 2026',
    lastDate: '2026-09-30',
    dateStatus: 'tentative',
  },
  {
    title: 'Sikkim PSC 2026',
    lastDate: '2026-10-15',
    dateStatus: 'tentative',
  },

  // ═══ Newly Added State Police Constable ═══
  {
    title: 'Gujarat Police Constable 2026',
    lastDate: '2026-09-15',
    dateStatus: 'tentative',
  },
  {
    title: 'Haryana Police Constable 2026',
    lastDate: '2026-08-31',
    dateStatus: 'tentative',
  },
  {
    title: 'Punjab Police Constable 2026',
    lastDate: '2026-09-15',
    dateStatus: 'tentative',
  },
  {
    title: 'Jharkhand Police Constable 2026',
    lastDate: '2026-09-30',
    dateStatus: 'tentative',
  },
  {
    title: 'Chhattisgarh Police Constable 2026',
    lastDate: '2026-09-20',
    dateStatus: 'tentative',
  },
  {
    title: 'Uttarakhand Police Constable 2026',
    lastDate: '2026-08-31',
    dateStatus: 'tentative',
  },
  {
    title: 'Odisha Police Constable 2026',
    lastDate: '2026-09-30',
    dateStatus: 'tentative',
  },
  {
    title: 'Kerala Police Constable 2026',
    lastDate: '2026-10-15',
    dateStatus: 'tentative',
  },
  {
    title: 'Assam Police Constable 2026',
    lastDate: '2026-09-15',
    dateStatus: 'tentative',
  },
  {
    title: 'Himachal Pradesh Police Constable 2026',
    lastDate: '2026-09-30',
    dateStatus: 'tentative',
  },
  {
    title: 'J&K Police Constable 2026',
    lastDate: '2026-09-30',
    dateStatus: 'tentative',
  },
  {
    title: 'Goa Police Constable 2026',
    lastDate: '2026-10-15',
    dateStatus: 'tentative',
  },
  {
    title: 'West Bengal Police Constable 2026',
    lastDate: '2026-09-30',
    importantDates: [
      { event: 'Written Exam (Expected)', date: '2026-11-30' },
    ],
    dateStatus: 'tentative',
  },

  // MPPSC - dates were logically impossible (prelims before application deadline)
  {
    title: 'MPPSC State Service Exam 2025',
    importantDates: [
      { event: 'Prelims Exam Date', date: '2026-09-21' },
      { event: 'Mains Exam Date', date: '2026-12-07' },
    ],
    dateStatus: 'tentative',
  },
  // Salary corrections
  {
    title: 'RRB NTPC 2024',
    salaryRange: { min: 29200, max: 92300 },
  },
  {
    title: 'UPSC CDS I 2025',
    salaryRange: { min: 56100, max: 177500 },
  },
  {
    title: 'UPSC NDA II 2025',
    salaryRange: { min: 56100, max: 177500 },
  },
  {
    title: 'UPSC CDS II 2025',
    salaryRange: { min: 56100, max: 177500 },
  },
  // Deactivate closed exams
  {
    title: 'SSC Selection Post Phase-XII',
    isActive: false,
    dateStatus: 'closed',
  },
  {
    title: 'RBI Assistant 2025',
    isActive: false,
    dateStatus: 'closed',
  },
  {
    title: 'UGC NET June 2025',
    isActive: false,
    dateStatus: 'closed',
  },
  {
    title: 'India Post PA/SA 2025',
    isActive: false,
    dateStatus: 'closed',
  },
  {
    title: 'Indian Navy Agniveer AA 2025',
    isActive: false,
    dateStatus: 'closed',
  },
];

async function correctExamDates() {
  let updated = 0;
  let skipped = 0;
  const notFound = [];

  const allExams = await Exam.find({}).select('title').lean();
  console.log(`[DateCorrections] Found ${allExams.length} exams in DB. Applying ${corrections.length} corrections...`);

  for (const correction of corrections) {
    let exam = await Exam.findOne({ title: correction.title });

    if (!exam) {
      const escaped = correction.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      exam = await Exam.findOne({ title: { $regex: new RegExp(`^${escaped}$`, 'i') } });
    }

    if (!exam) {
      const keywords = correction.title.replace(/\d{4}/, '').trim();
      if (keywords.length > 3) {
        const escaped = keywords.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        exam = await Exam.findOne({ title: { $regex: new RegExp(escaped, 'i') } });
      }
    }

    if (!exam) {
      skipped++;
      notFound.push(correction.title);
      continue;
    }

    const update = {};

    if (correction.lastDate) {
      update.lastDate = new Date(correction.lastDate);
    }

    if (correction.vacancies) {
      update.vacancies = correction.vacancies;
    }

    update.dateStatus = correction.dateStatus || 'tentative';
    // Respect isActive from correction; default true unless status is closed
    update.isActive = correction.isActive !== undefined
      ? correction.isActive
      : (correction.dateStatus !== 'closed');

    if (correction.importantDates) {
      update.importantDates = correction.importantDates.map(d => ({
        event: d.event,
        date: new Date(d.date),
      }));
    }

    await Exam.findByIdAndUpdate(exam._id, { $set: update });
    updated++;
  }

  await Exam.updateMany(
    { dateStatus: { $exists: false } },
    { $set: { dateStatus: 'tentative' } }
  );
  await Exam.updateMany(
    { dateStatus: null },
    { $set: { dateStatus: 'tentative' } }
  );

  // Remove known duplicate/fake entries that were seeded with wrong titles/data
  const duplicateTitlesToRemove = [
    'RBI Grade B Officer 2026',                          // duplicate of 'RBI Grade B 2026' with wrong salary
    'SEBI Officer Grade A 2026',                         // duplicate of 'SEBI Grade A 2025-26'
    'NABARD Assistant Manager 2026',                     // duplicate of 'NABARD Grade A 2025-26'
    'UPSC CBI DSP 2026 (Dy. SP via UPSC)',               // FAKE — no such standalone UPSC exam; CBI DSPs recruited via IPS/SSC CPO
    'HPSC HCS 2026 (Haryana Civil Service)',             // duplicate of 'HPSC HCS 2026'
    'MPPSC State Service Exam 2026',                     // duplicate of 'MPPSC State Services 2026'
    'JPSC Combined Civil Service 2026',                  // duplicate of 'JPSC Combined Civil Services 2026'
    'Jharkhand PSC Combined Civil Service 2026 (JPSC CCE)', // third duplicate of the same JPSC exam
    'CGPSC State Service Exam 2026',                     // duplicate of 'CGPSC 2026 (Chhattisgarh State Service)'
    'WBPSC WBCS Prelims 2026',                           // duplicate of 'WBPSC WBCS 2026' with conflicting dates
    'PPSC Civil Services 2026 (Punjab)',                 // duplicate of 'PPSC Punjab Civil Service 2026'
    'Punjab PCS 2026 (Punjab Civil Service)',            // third duplicate of the same PPSC exam
  ];
  let removed = 0;
  for (const title of duplicateTitlesToRemove) {
    const result = await Exam.deleteOne({ title });
    if (result.deletedCount > 0) {
      removed++;
      console.log(`[DateCorrections] Removed duplicate exam: "${title}"`);
    }
  }
  if (removed > 0) {
    console.log(`[DateCorrections] Removed ${removed} duplicate exam entries from DB.`);
  }

  // Fix wrong salary data on RBI Grade B 2026 (the correct entry)
  await Exam.updateOne(
    { title: 'RBI Grade B 2026' },
    { $set: { salary: '₹78,450 (starting basic) → ~₹1.6L/month in-hand' } }
  );

  // Fix conductingBody for exams seeded with the wrong 'conductedBy' field name.
  // Mongoose strict mode drops unknown fields on insert, leaving conductingBody empty.
  const conductingBodyPatches = [
    { titleRegex: /UPSC|Civil Services|NDA(?!\s*I)|CDS|CAPF|IFS\b|ESE|IES.*Engin/i, body: 'Union Public Service Commission' },
    { titleRegex: /^SSC/i,                                    body: 'Staff Selection Commission' },
    { titleRegex: /^IBPS/i,                                   body: 'Institute of Banking Personnel Selection' },
    { titleRegex: /^SBI/i,                                    body: 'State Bank of India' },
    { titleRegex: /^RBI/i,                                    body: 'Reserve Bank of India' },
    { titleRegex: /^RRB|Railway Recruitment Board/i,          body: 'Railway Recruitment Board' },
    { titleRegex: /^RPF/i,                                    body: 'Railway Protection Force' },
    { titleRegex: /^SEBI/i,                                   body: 'Securities and Exchange Board of India' },
    { titleRegex: /^NABARD/i,                                 body: 'National Bank for Agriculture and Rural Development' },
    { titleRegex: /^EPFO/i,                                   body: 'Employees Provident Fund Organisation' },
    { titleRegex: /^LIC/i,                                    body: 'Life Insurance Corporation of India' },
    { titleRegex: /^NIACL/i,                                  body: 'New India Assurance Co. Ltd.' },
    { titleRegex: /^GIC/i,                                    body: 'General Insurance Corporation of India' },
    { titleRegex: /^DRDO/i,                                   body: 'Defence Research and Development Organisation' },
    { titleRegex: /^AFCAT/i,                                  body: 'Indian Air Force' },
    { titleRegex: /Indian Air Force Agniveer/i,               body: 'Indian Air Force' },
    { titleRegex: /Indian Army Agniveer/i,                    body: 'Indian Army' },
    { titleRegex: /Indian Navy/i,                             body: 'Indian Navy' },
    { titleRegex: /Indian Coast Guard/i,                      body: 'Indian Coast Guard' },
    { titleRegex: /^CTET/i,                                   body: 'Central Board of Secondary Education' },
    { titleRegex: /^UGC NET/i,                                body: 'National Testing Agency' },
    { titleRegex: /^DSSSB/i,                                  body: 'Delhi Subordinate Services Selection Board' },
    { titleRegex: /^KVS/i,                                    body: 'Kendriya Vidyalaya Sangathan' },
    { titleRegex: /^NVS/i,                                    body: 'Navodaya Vidyalaya Samiti' },
    { titleRegex: /^ONGC/i,                                   body: 'Oil and Natural Gas Corporation' },
    { titleRegex: /^NTPC/i,                                   body: 'NTPC Limited' },
    { titleRegex: /^IOCL/i,                                   body: 'Indian Oil Corporation Limited' },
    { titleRegex: /^BHEL/i,                                   body: 'Bharat Heavy Electricals Limited' },
    { titleRegex: /^SAIL/i,                                   body: 'Steel Authority of India Limited' },
    { titleRegex: /^Coal India/i,                             body: 'Coal India Limited' },
    { titleRegex: /^Power Grid/i,                             body: 'Power Grid Corporation of India' },
    { titleRegex: /^AIIMS/i,                                  body: 'All India Institute of Medical Sciences' },
    { titleRegex: /^NEET/i,                                   body: 'National Testing Agency' },
    { titleRegex: /^ESIC/i,                                   body: 'Employees State Insurance Corporation' },
    { titleRegex: /^ICAR/i,                                   body: 'Indian Council of Agricultural Research' },
    { titleRegex: /^FCI/i,                                    body: 'Food Corporation of India' },
    { titleRegex: /^India Post GDS/i,                         body: 'India Post' },
    { titleRegex: /^GATE/i,                                   body: 'Indian Institute of Technology' },
    { titleRegex: /^APPSC/i,                                  body: 'Andhra Pradesh Public Service Commission' },
    { titleRegex: /^TSPSC/i,                                  body: 'Telangana State Public Service Commission' },
    { titleRegex: /^KPSC/i,                                   body: 'Karnataka Public Service Commission' },
    { titleRegex: /^TNPSC/i,                                  body: 'Tamil Nadu Public Service Commission' },
    { titleRegex: /^UPPSC/i,                                  body: 'Uttar Pradesh Public Service Commission' },
    { titleRegex: /^MPPSC/i,                                  body: 'Madhya Pradesh Public Service Commission' },
    { titleRegex: /^RPSC/i,                                   body: 'Rajasthan Public Service Commission' },
    { titleRegex: /^BPSC/i,                                   body: 'Bihar Public Service Commission' },
    { titleRegex: /^WBPSC/i,                                  body: 'West Bengal Public Service Commission' },
    { titleRegex: /^MPSC/i,                                   body: 'Maharashtra Public Service Commission' },
    { titleRegex: /^HPSC/i,                                   body: 'Haryana Public Service Commission' },
    { titleRegex: /^GPSC/i,                                   body: 'Gujarat Public Service Commission' },
  ];
  let bodyFixed = 0;
  for (const { titleRegex, body } of conductingBodyPatches) {
    const result = await Exam.updateMany(
      { conductingBody: { $in: ['', null] }, title: { $regex: titleRegex } },
      { $set: { conductingBody: body } }
    );
    bodyFixed += result.modifiedCount || 0;
  }
  if (bodyFixed > 0) {
    console.log(`[DateCorrections] Fixed conductingBody for ${bodyFixed} exams seeded with wrong field name.`);
  }

  // Auto-close exams whose lastDate has passed by more than 7 days and are still tentative
  // This catches placeholder "end-of-month" dates that slipped past without a real notification
  const staleCloseResult = await Exam.updateMany(
    {
      lastDate: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      dateStatus: 'tentative',
      isActive: true,
    },
    { $set: { isActive: false, dateStatus: 'closed' } }
  );
  if (staleCloseResult.modifiedCount > 0) {
    console.log(`[DateCorrections] Auto-closed ${staleCloseResult.modifiedCount} exams with stale tentative lastDates.`);
  }

  console.log(`[DateCorrections] Updated ${updated} exams, ${skipped} not found in DB.`);
  if (notFound.length > 0) {
    console.log(`[DateCorrections] Not found: ${notFound.join(', ')}`);
    console.log(`[DateCorrections] DB titles: ${allExams.map(e => e.title).join(' | ')}`);
  }
}

module.exports = { correctExamDates };
