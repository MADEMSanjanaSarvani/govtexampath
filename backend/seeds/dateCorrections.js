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
    lastDate: '2026-05-31',
    vacancies: '3,000+',
    importantDates: [
      { event: 'Notification Date', date: '2026-04-30' },
      { event: 'Application End Date', date: '2026-05-31' },
      { event: 'Tier-I Exam', date: '2026-07-15' },
    ],
    dateStatus: 'confirmed',
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
    lastDate: '2026-04-30',
    importantDates: [
      { event: 'Notification Date', date: '2026-03-31' },
      { event: 'Application End Date', date: '2026-04-30' },
      { event: 'Paper-I CBT (Completed)', date: '2026-06-15' },
    ],
    dateStatus: 'confirmed',
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
    // EPFO withdrew EO/AO requisitions; only APFC posts (80 vacancies) notified July 22
    title: 'UPSC EPFO 2026',
    lastDate: '2026-08-18',
    vacancies: '80 (APFC only; EO/AO posts withdrawn)',
    importantDates: [
      { event: 'Notification Date', date: '2026-07-22' },
      { event: 'Application Start', date: '2026-07-29' },
      { event: 'Application End Date', date: '2026-08-18' },
    ],
    dateStatus: 'confirmed',
    description: 'UPSC EPFO 2026 for 80 APFC posts. EO/AO vacancies withdrawn by EPFO. Applications July 29 - August 18, 2026.',
  },
  {
    title: 'UPSC EPFO (EO/AO) 2026',
    lastDate: '2026-08-18',
    vacancies: '80 (APFC only; EO/AO posts withdrawn)',
    importantDates: [
      { event: 'Notification Date', date: '2026-07-22' },
      { event: 'Application Start', date: '2026-07-29' },
      { event: 'Application End Date', date: '2026-08-18' },
    ],
    dateStatus: 'confirmed',
    description: 'UPSC EPFO 2026 for 80 APFC posts. EO/AO vacancies withdrawn by EPFO. Applications July 29 - August 18, 2026.',
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
    lastDate: '2026-07-21',
    vacancies: '6,715',
    importantDates: [
      { event: 'Notification Date', date: '2026-07-01' },
      { event: 'Application End Date', date: '2026-07-21' },
      { event: 'Prelims Exam', date: '2026-08-22' },
      { event: 'Mains Exam', date: '2026-10-04' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'IBPS Clerk 2026',
    lastDate: '2026-08-31',
    importantDates: [
      { event: 'Notification Expected', date: '2026-08-01' },
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
    lastDate: '2026-08-15',
    importantDates: [
      { event: 'Notification Expected', date: '2026-07-20' },
      { event: 'Prelims (Expected)', date: '2026-09-20' },
      { event: 'Mains (Expected)', date: '2026-10-25' },
    ],
    dateStatus: 'tentative',
  },
  {
    title: 'IBPS RRB Clerk 2026',
    lastDate: '2026-08-15',
    importantDates: [
      { event: 'Notification Expected', date: '2026-07-20' },
      { event: 'Prelims (Expected)', date: '2026-09-27' },
    ],
    dateStatus: 'tentative',
  },
  {
    // CRP RRB XV notification not yet released as of July 2026; July 15 in seeder is wrong
    title: 'IBPS RRB Officer Scale I 2026',
    lastDate: '2026-08-15',
    importantDates: [
      { event: 'Notification Expected', date: '2026-07-20' },
      { event: 'Prelims (Expected)', date: '2026-09-20' },
      { event: 'Mains (Expected)', date: '2026-10-25' },
    ],
    dateStatus: 'tentative',
  },
  {
    title: 'IBPS RRB Office Assistant 2026',
    lastDate: '2026-08-15',
    importantDates: [
      { event: 'Notification Expected', date: '2026-07-20' },
      { event: 'Prelims (Expected)', date: '2026-09-27' },
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
    // CEN 01/2026: 11,127 vacancies; applications May 15 - Jun 14, 2026 (closed); CBT 1 dates not yet announced
    title: 'RRB ALP 2026',
    lastDate: '2026-06-14',
    vacancies: '11,127',
    importantDates: [
      { event: 'Notification Released (CEN 01/2026)', date: '2026-05-15' },
      { event: 'Application Closed', date: '2026-06-14' },
      { event: 'Correction Window Ended', date: '2026-06-26' },
      { event: 'CBT 1 Date (Not Yet Announced)', date: '2026-10-01' },
    ],
    dateStatus: 'confirmed',
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
    lastDate: '2026-06-21',
    vacancies: '379',
    importantDates: [
      { event: 'AFCAT 1 Exam (Completed)', date: '2026-01-31' },
      { event: 'AFCAT 2 Notification', date: '2026-05-20' },
      { event: 'AFCAT 2 Application Closed (Extended)', date: '2026-06-21' },
      { event: 'AFCAT 2 Exam Date', date: '2026-08-08' },
    ],
    dateStatus: 'confirmed',
  },
  {
    // Agniveer SSR 01/2027 batch: application window Mar 14 – Apr 6 2026 (closed)
    title: 'Indian Navy SSR/AA 2026',
    lastDate: '2026-04-06',
    vacancies: '3,000+',
    importantDates: [
      { event: 'Notification Released', date: '2026-03-14' },
      { event: 'Application Closed', date: '2026-04-06' },
      { event: 'INET Stage 1 Exam', date: '2026-05-13' },
    ],
    dateStatus: 'confirmed',
  },
  {
    // CGEPT 01/2026 & 02/2026 batches: applications closed Jun 29, 2025 (630 vacancies). Stage III ongoing.
    // CGEPT 01/2027 batch (next) not yet announced.
    title: 'Indian Coast Guard GD 2026',
    lastDate: '2025-06-29',
    vacancies: '630',
    importantDates: [
      { event: 'CGEPT 01/2026 & 02/2026 Application Closed', date: '2025-06-29' },
      { event: 'Stage III Selection (Ongoing)', date: '2026-07-01' },
      { event: 'CGEPT 01/2027 Notification Expected', date: '2026-08-01' },
    ],
    dateStatus: 'confirmed',
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
    // Agniveer Apprentice 01/2027 & 02/2027: notification Jun 2, app Jun 5 - Jul 5 2026 (last date extended); INET Aug 2026
    title: 'Indian Navy Agniveer 2026',
    lastDate: '2026-07-05',
    importantDates: [
      { event: 'Notification Date', date: '2026-06-02' },
      { event: 'Application End (Extended)', date: '2026-07-05' },
      { event: 'INET Stage-I Exam', date: '2026-08-01' },
    ],
    dateStatus: 'confirmed',
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
    // KPSC KAS 2026 official notification not yet released as of July 2026
    title: 'KPSC KAS 2026',
    lastDate: '2026-10-31',
    importantDates: [
      { event: 'Notification Expected', date: '2026-09-01' },
      { event: 'Application End (Expected)', date: '2026-10-31' },
    ],
    dateStatus: 'tentative',
  },
  {
    title: 'TNPSC Group 1 2026',
    lastDate: '2026-07-29',
    vacancies: '26',
    importantDates: [
      { event: 'Notification Date', date: '2026-06-23' },
      { event: 'Application Start', date: '2026-06-30' },
      { event: 'Application End Date', date: '2026-07-29' },
      { event: 'Correction Window', date: '2026-08-02' },
      { event: 'Prelims Exam', date: '2026-09-06' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'UPPSC PCS 2026',
    lastDate: '2026-07-27',
    vacancies: '~500',
    importantDates: [
      { event: 'Notification Date', date: '2026-06-25' },
      { event: 'Application End Date', date: '2026-07-27' },
      { event: 'Prelims Exam', date: '2026-12-06' },
    ],
    dateStatus: 'confirmed',
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
    // Notification Nov 14, 2025; application closed Dec 17, 2025; Prelims Jun 14, 2026 (completed)
    title: 'WBPSC WBCS 2026',
    lastDate: '2025-12-17',
    importantDates: [
      { event: 'Notification Date', date: '2025-11-14' },
      { event: 'Application Closed', date: '2025-12-17' },
      { event: 'Prelims Exam (Completed)', date: '2026-06-14' },
      { event: 'Prelims Result (Expected)', date: '2026-09-01' },
      { event: 'Mains Exam (Expected)', date: '2026-12-01' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'MPSC Maharashtra 2026',
    lastDate: '2026-01-20',
    vacancies: '79',
    importantDates: [
      { event: 'Application Closed', date: '2026-01-20' },
      { event: 'Prelims (Completed)', date: '2026-05-31' },
      { event: 'Prelims Result', date: '2026-06-22' },
      { event: 'Mains Exam', date: '2026-10-03' },
    ],
    dateStatus: 'confirmed',
  },
  {
    // Notification Jan 30, app Feb 6-26; Prelims Apr 26 (completed); Mains Jun 27-29 (completed); 102 vacancies
    title: 'HPSC HCS 2026',
    lastDate: '2026-02-26',
    vacancies: '102',
    importantDates: [
      { event: 'Notification Date', date: '2026-01-30' },
      { event: 'Application Closed', date: '2026-02-26' },
      { event: 'Prelims Exam (Completed)', date: '2026-04-26' },
      { event: 'Mains Exam (Completed)', date: '2026-06-27' },
      { event: 'Interview/Final Selection (Pending)', date: '2026-09-01' },
    ],
    dateStatus: 'confirmed',
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
    // TGT: 1,417 vacancies, applications Jun 16 - Jul 15, 2026; PGT: 432 vacancies, exam completed Apr 12-17
    title: 'DSSSB TGT/PGT 2026',
    lastDate: '2026-07-15',
    vacancies: '1,417 TGT + 432 PGT',
    importantDates: [
      { event: 'PGT Exam (Completed)', date: '2026-04-12' },
      { event: 'TGT Notification', date: '2026-06-16' },
      { event: 'TGT Application Closes', date: '2026-07-15' },
    ],
    dateStatus: 'confirmed',
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
    // NVS TGT/PGT 2025-26 central recruitment: applications closed Dec 11 2025; Tier-1 CBT Jan 2026; Tier-2 Mar 2026
    title: 'NVS TGT/PGT 2026',
    lastDate: '2025-12-11',
    importantDates: [
      { event: 'Application Start', date: '2025-11-14' },
      { event: 'Application Closed', date: '2025-12-11' },
      { event: 'Tier-1 CBT (Completed)', date: '2026-01-10' },
      { event: 'Tier-2 Written (Completed)', date: '2026-03-29' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'Super TET 2026',
    lastDate: '2026-08-10',
    dateStatus: 'tentative',
  },

  // ═══ Police ═══
  {
    // Previous cycle result declared Jun 19, 2026. New 2026-27 cycle: revised vacancy 8,760 posts (Feb 25, 2026); notification expected Sep 2026
    title: 'Delhi Police Constable 2026',
    lastDate: '2026-10-31',
    vacancies: '8,760',
    importantDates: [
      { event: 'Revised Vacancy Notice', date: '2026-02-25' },
      { event: 'Previous Cycle Result Declared', date: '2026-06-19' },
      { event: 'New Cycle Notification Expected', date: '2026-09-01' },
      { event: 'Application End (Expected)', date: '2026-10-31' },
    ],
    dateStatus: 'tentative',
  },
  {
    // SSC CPO 2026: notification May 31, applications closed Jun 30, Paper-I Oct-Nov 2026
    title: 'Delhi Police SI 2026',
    lastDate: '2026-06-30',
    importantDates: [
      { event: 'SSC CPO Notification', date: '2026-05-31' },
      { event: 'Application Closed', date: '2026-06-30' },
      { event: 'Paper-I CBE', date: '2026-10-15' },
    ],
    dateStatus: 'confirmed',
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
    // 2025-26 cycle: notification Nov 8, applications closed Nov 30 2025, Phase I Dec 20, Phase II Jan 25 2026, result May 2026
    // Next 2026 cycle not yet notified (expected Oct-Nov 2026)
    title: 'NABARD Grade A 2026',
    lastDate: '2025-11-30',
    vacancies: '91',
    importantDates: [
      { event: 'Notification Date', date: '2025-11-08' },
      { event: 'Application Closed', date: '2025-11-30' },
      { event: 'Phase I Exam (Completed)', date: '2025-12-20' },
      { event: 'Phase II Mains (Completed)', date: '2026-01-25' },
      { event: 'Final Result Declared', date: '2026-05-05' },
      { event: 'Next Cycle Expected', date: '2026-11-01' },
    ],
    dateStatus: 'confirmed',
    description: 'NABARD Grade A 2025-26: 91 vacancies. Applications closed Nov 30, 2025; result declared May 2026. Next 2026 cycle notification expected Oct–Nov 2026.',
  },
  {
    title: 'EPFO SSA 2026',
    lastDate: '2026-09-20',
    dateStatus: 'tentative',
  },

  // ═══ Teaching (additional) ═══
  {
    // Notification Mar 20, application Mar 27 - May 3 2026 (extended); exam Jul 2-4 2026
    title: 'UPTET 2026',
    lastDate: '2026-05-03',
    importantDates: [
      { event: 'Notification Date', date: '2026-03-20' },
      { event: 'Application Closed', date: '2026-05-03' },
      { event: 'Exam (In Progress)', date: '2026-07-02' },
      { event: 'Exam Ends', date: '2026-07-04' },
    ],
    dateStatus: 'confirmed',
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
    // Drive 1 (Feb, 515 vacancies, GATE-based): app closed Feb 25. Drive 2 (May, 52 vacancies): app closed May 29
    title: 'NTPC Executive Trainee 2026',
    lastDate: '2026-05-29',
    vacancies: '567 (515 + 52)',
    importantDates: [
      { event: 'Drive 1 Notification', date: '2026-02-10' },
      { event: 'Drive 1 Application Closed', date: '2026-02-25' },
      { event: 'Drive 2 Notification', date: '2026-05-01' },
      { event: 'Drive 2 Application Closed', date: '2026-05-29' },
    ],
    dateStatus: 'confirmed',
  },
  {
    // Notification Jun 29 2026; application Jun 29 - Jul 28 2026; 1,524 vacancies across refineries
    title: 'IOCL Apprentice 2026',
    lastDate: '2026-07-28',
    vacancies: '1,524',
    importantDates: [
      { event: 'Notification Date', date: '2026-06-29' },
      { event: 'Application End Date', date: '2026-07-28' },
    ],
    dateStatus: 'confirmed',
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
    // NORCET 10: notification Feb 13, app Feb 24 - Mar 16; Prelims Apr 11, Mains Apr 30; 2,779 vacancies
    title: 'AIIMS Nursing Officer 2026',
    lastDate: '2026-03-16',
    vacancies: '2,779',
    importantDates: [
      { event: 'NORCET 10 Notification', date: '2026-02-13' },
      { event: 'Application Closed', date: '2026-03-16' },
      { event: 'Prelims Exam (Completed)', date: '2026-04-11' },
      { event: 'Mains Exam (Completed)', date: '2026-04-30' },
    ],
    dateStatus: 'confirmed',
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
    // AICE-JRF/SRF & AIEEA PG 2026: notification May 8, application closed Jun 10; exam Jul 4 2026
    title: 'ICAR NET 2026',
    lastDate: '2026-06-10',
    importantDates: [
      { event: 'Notification Date', date: '2026-05-08' },
      { event: 'Application Closed', date: '2026-06-10' },
      { event: 'Exam Date', date: '2026-07-04' },
    ],
    dateStatus: 'confirmed',
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
    // Reported: application Jun 1-29 2026; exam Jul 17 2026 (verify at indiapost.gov.in)
    title: 'India Post MTS 2026',
    lastDate: '2026-06-29',
    importantDates: [
      { event: 'Application Closed (Reported)', date: '2026-06-29' },
      { event: 'Exam Date (Reported)', date: '2026-07-17' },
    ],
    dateStatus: 'tentative',
  },

  // ═══ Miscellaneous ═══
  {
    // GATE 2027 (registration 2026): IIT Madras conducting; registration ~Aug 24 - Sep 29 2026
    title: 'GATE 2026',
    lastDate: '2026-09-29',
    importantDates: [
      { event: 'Notification Expected', date: '2026-07-15' },
      { event: 'Registration Opens (Expected)', date: '2026-08-24' },
      { event: 'Registration Closes (Expected)', date: '2026-09-29' },
      { event: 'Exam Dates', date: '2027-02-06' },
      { event: 'Exam Ends', date: '2027-02-14' },
    ],
    dateStatus: 'tentative',
  },
  {
    title: 'CAT 2026',
    lastDate: '2026-09-20',
    dateStatus: 'tentative',
  },
  {
    // CLAT 2026 cycle COMPLETE: notification Jul 2025, app closed Oct 31 2025, exam Dec 7 2025
    // CLAT 2027 registration expected Aug 2026, exam Dec 6 2026
    title: 'CLAT 2026',
    lastDate: '2025-10-31',
    importantDates: [
      { event: 'Notification Date', date: '2025-07-20' },
      { event: 'Application Closed', date: '2025-10-31' },
      { event: 'Exam Completed', date: '2025-12-07' },
      { event: 'Result Declared', date: '2025-12-16' },
      { event: 'CLAT 2027 Registration Expected', date: '2026-08-01' },
    ],
    dateStatus: 'confirmed',
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
  // ISRO: Main ICRB cycle (Scientist/Engineer SC) closed Feb 20 2026; seeder placeholder date Aug 1 is wrong
  {
    title: 'ISRO Scientist/Engineer 2026',
    lastDate: '2026-02-20',
    importantDates: [
      { event: 'ICRB Notification Released', date: '2026-01-20' },
      { event: 'Application Closed (ICRB)', date: '2026-02-20' },
    ],
    dateStatus: 'confirmed',
  },
  {
    // Duplicate seeder entry with placeholder Aug 31 date; ICRB cycle closed Feb 20 2026
    title: 'ISRO Scientist / Engineer SC 2026',
    lastDate: '2026-02-20',
    dateStatus: 'confirmed',
  },
  {
    // UPSC Combined Geo-Scientist 2026: prelims done June 7, mains Sep 13
    title: 'UPSC Combined Geo-Scientist 2026',
    lastDate: '2026-02-18',
    importantDates: [
      { event: 'Application Closed', date: '2026-02-18' },
      { event: 'Prelims (Completed)', date: '2026-06-07' },
      { event: 'Mains Exam', date: '2026-09-13' },
    ],
    dateStatus: 'confirmed',
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
    // SSC Phase XIII was a 2025 cycle (closed Jun 23, 2025) — seeder entry mislabeled as "2026" with wrong dates
    title: 'SSC Phase XIII Selection Post 2026',
    isActive: false,
    dateStatus: 'closed',
  },
  {
    // Duplicate ISRO entry; all ISRO Scientist/Engineer cycles for 2026 closed by April 2026
    title: 'ISRO Scientist/Engineer SC 2026',
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

  // Mark application status as closed for exams whose lastDate has passed by more than 7 days
  // and are still showing as tentative. Keep isActive: true so users can still see exam dates,
  // result dates, etc. — the exam is still ongoing even if applications are closed.
  const staleCloseResult = await Exam.updateMany(
    {
      lastDate: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      dateStatus: 'tentative',
    },
    { $set: { dateStatus: 'closed' } }
  );
  if (staleCloseResult.modifiedCount > 0) {
    console.log(`[DateCorrections] Marked ${staleCloseResult.modifiedCount} exams with stale tentative lastDates as closed (applications closed, exams still visible).`);
  }

  console.log(`[DateCorrections] Updated ${updated} exams, ${skipped} not found in DB.`);
  if (notFound.length > 0) {
    console.log(`[DateCorrections] Not found: ${notFound.join(', ')}`);
    console.log(`[DateCorrections] DB titles: ${allExams.map(e => e.title).join(' | ')}`);
  }
}

module.exports = { correctExamDates };
