const Exam = require('../models/Exam');

// Verified dates as of June 15, 2026 from official sources and aggregators
const corrections = [
  // ═══ SSC ═══
  {
    title: 'SSC CGL 2026',
    lastDate: '2026-06-22',
    vacancies: '12,256',
    importantDates: [
      { event: 'Notification Date', date: '2026-05-21' },
      { event: 'Application End Date', date: '2026-06-22' },
      { event: 'Tier-I Exam (Tentative)', date: '2026-08-20' },
      { event: 'Tier-II Exam (Tentative)', date: '2026-12-15' },
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
    dateStatus: 'tentative',
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
      { event: 'Application Closed', date: '2026-04-30' },
      { event: 'Paper-I CBT (Tentative)', date: '2026-06-15' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'SSC Stenographer Grade C & D 2026',
    lastDate: '2026-08-30',
    importantDates: [
      { event: 'Notification Expected', date: '2026-07-30' },
      { event: 'Application End (Expected)', date: '2026-08-30' },
    ],
    dateStatus: 'tentative',
  },
  {
    title: 'SSC CPO 2026',
    lastDate: '2026-09-15',
    importantDates: [
      { event: 'Notification Expected', date: '2026-08-15' },
      { event: 'Paper-I Exam (Tentative)', date: '2026-11-20' },
    ],
    dateStatus: 'tentative',
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
    title: 'UPSC Civil Services 2026',
    lastDate: '2026-02-24',
    importantDates: [
      { event: 'Notification Date', date: '2026-02-04' },
      { event: 'Application Closed', date: '2026-02-24' },
      { event: 'Prelims (Completed)', date: '2026-05-24' },
      { event: 'Prelims Result Expected', date: '2026-06-20' },
      { event: 'Mains Exam', date: '2026-09-19' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'UPSC NDA 2026',
    lastDate: '2026-06-11',
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
    lastDate: '2026-07-15',
    importantDates: [
      { event: 'Notification Expected', date: '2026-06-15' },
      { event: 'Exam Date (Tentative)', date: '2026-08-10' },
    ],
    dateStatus: 'tentative',
  },
  {
    title: 'UPSC EPFO 2026',
    lastDate: '2026-08-15',
    dateStatus: 'tentative',
  },
  {
    title: 'UPSC ESE 2026',
    lastDate: '2026-10-15',
    importantDates: [
      { event: 'Prelims (Tentative)', date: '2027-02-15' },
    ],
    dateStatus: 'tentative',
  },
  {
    title: 'UPSC CMS 2026',
    lastDate: '2026-08-15',
    dateStatus: 'tentative',
  },
  {
    title: 'UPSC Geo-Scientist 2026',
    lastDate: '2026-09-15',
    dateStatus: 'tentative',
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
      { event: 'Prelims (Expected)', date: '2026-10-10' },
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
    lastDate: '2026-07-15',
    importantDates: [
      { event: 'Notification Expected', date: '2026-06-20' },
      { event: 'Prelims (Expected)', date: '2026-08-01' },
      { event: 'Mains (Expected)', date: '2026-09-12' },
    ],
    dateStatus: 'tentative',
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
      { event: 'CBT-1 Undergraduate (Completed)', date: '2026-05-07' },
      { event: 'CBT-2 Graduate', date: '2026-07-10' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'RRB Group D 2026',
    lastDate: '2026-10-15',
    dateStatus: 'tentative',
  },
  {
    title: 'RRB JE 2026',
    lastDate: '2026-08-31',
    dateStatus: 'tentative',
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
      { event: 'AFCAT 1 (Completed)', date: '2026-01-31' },
      { event: 'AFCAT 2 Notification', date: '2026-05-20' },
      { event: 'AFCAT 2 Application Closed', date: '2026-06-19' },
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
    lastDate: '2026-09-30',
    dateStatus: 'tentative',
  },
  {
    title: 'Indian Air Force Agniveer 2026',
    lastDate: '2026-08-15',
    dateStatus: 'tentative',
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
    lastDate: '2026-09-15',
    vacancies: '91',
    importantDates: [
      { event: 'Notification Expected', date: '2026-08-15' },
    ],
    dateStatus: 'tentative',
  },
  {
    title: 'TSPSC Group 1 2026',
    lastDate: '2026-09-30',
    dateStatus: 'tentative',
  },
  {
    title: 'KPSC KAS 2026',
    lastDate: '2026-09-15',
    dateStatus: 'tentative',
  },
  {
    title: 'TNPSC Group 1 2026',
    lastDate: '2026-08-30',
    dateStatus: 'tentative',
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
    lastDate: '2026-07-31',
    dateStatus: 'tentative',
  },
  {
    title: 'RPSC RAS 2026',
    lastDate: '2026-07-03',
    vacancies: '607',
    importantDates: [
      { event: 'Notification Date', date: '2026-06-04' },
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
      { event: 'Correction Window', date: '2026-06-15' },
      { event: 'Exam Date', date: '2026-09-06' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'UGC NET 2026',
    lastDate: '2026-05-24',
    importantDates: [
      { event: 'Application Closed', date: '2026-05-24' },
      { event: 'Exam Starts', date: '2026-06-22' },
      { event: 'Exam Ends', date: '2026-06-30' },
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
    lastDate: '2026-08-15',
    dateStatus: 'tentative',
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
    lastDate: '2026-02-15',
    importantDates: [
      { event: 'Exam (Completed)', date: '2026-05-03' },
      { event: 'Re-Exam', date: '2026-06-21' },
      { event: 'Result Expected', date: '2026-07-01' },
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
    lastDate: '2026-02-16',
    vacancies: '28,740',
    importantDates: [
      { event: 'Notification Date', date: '2026-01-30' },
      { event: 'Application Closed', date: '2026-02-16' },
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
];

async function correctExamDates() {
  let updated = 0;
  let skipped = 0;

  for (const correction of corrections) {
    const exam = await Exam.findOne({ title: correction.title });
    if (!exam) {
      skipped++;
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
    update.isActive = true;

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

  if (updated > 0) {
    console.log(`[DateCorrections] Updated ${updated} exams with verified dates (${skipped} not found in DB).`);
  }
}

module.exports = { correctExamDates };
