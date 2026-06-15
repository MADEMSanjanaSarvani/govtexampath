const Exam = require('../models/Exam');

const corrections = [
  {
    title: 'SSC CGL 2026',
    lastDate: '2026-06-22',
    vacancies: '12,256',
    importantDates: [
      { event: 'Notification Date', date: '2026-05-21' },
      { event: 'Application Start Date', date: '2026-05-21' },
      { event: 'Application End Date', date: '2026-06-22' },
      { event: 'Tier-I Exam Date (Tentative)', date: '2026-08-20' },
      { event: 'Tier-II Exam Date (Tentative)', date: '2026-12-15' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'SSC CHSL 2026',
    lastDate: '2026-07-18',
    importantDates: [
      { event: 'Notification Expected', date: '2026-06-30' },
      { event: 'Application End Date (Expected)', date: '2026-07-18' },
      { event: 'Tier-I Exam Date (Tentative)', date: '2026-09-15' },
    ],
    dateStatus: 'tentative',
  },
  {
    title: 'SSC MTS 2026',
    lastDate: '2026-07-31',
    importantDates: [
      { event: 'Notification Date', date: '2026-06-30' },
      { event: 'Application End Date', date: '2026-07-31' },
      { event: 'CBT Exam Date (Tentative)', date: '2026-10-01' },
    ],
    dateStatus: 'tentative',
  },
  {
    title: 'SSC GD Constable 2026',
    lastDate: '2025-12-31',
    vacancies: '25,487',
    importantDates: [
      { event: 'Application End Date', date: '2025-12-31' },
      { event: 'CBT Exam Start', date: '2026-04-27' },
      { event: 'CBT Exam End', date: '2026-05-30' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'SSC JE 2026',
    lastDate: '2026-09-30',
    dateStatus: 'tentative',
  },
  {
    title: 'SSC Stenographer',
    lastDate: '2026-08-30',
    dateStatus: 'tentative',
  },
  {
    title: 'SSC CPO 2026',
    lastDate: '2026-09-15',
    importantDates: [
      { event: 'Paper-I Exam Date (Tentative)', date: '2026-11-20' },
    ],
    dateStatus: 'tentative',
  },
  {
    title: 'UPSC Civil Services 2026',
    lastDate: '2026-02-24',
    importantDates: [
      { event: 'Notification Date', date: '2026-02-04' },
      { event: 'Application End Date', date: '2026-02-24' },
      { event: 'Prelims Exam Date', date: '2026-05-24' },
      { event: 'Prelims Result (Expected)', date: '2026-06-15' },
      { event: 'Mains Exam Date (Tentative)', date: '2026-09-20' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'UPSC NDA 2026',
    lastDate: '2026-06-11',
    importantDates: [
      { event: 'NDA 2 Notification', date: '2026-05-20' },
      { event: 'NDA 2 Application End', date: '2026-06-11' },
      { event: 'NDA 2 Exam Date', date: '2026-09-13' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'UPSC CDS 2026',
    lastDate: '2026-06-11',
    importantDates: [
      { event: 'CDS 1 Exam Date (Completed)', date: '2026-04-12' },
      { event: 'CDS 2 Notification', date: '2026-05-20' },
      { event: 'CDS 2 Application End', date: '2026-06-11' },
      { event: 'CDS 2 Exam Date', date: '2026-09-13' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'UPSC CAPF 2026',
    lastDate: '2026-06-10',
    dateStatus: 'tentative',
  },
  {
    title: 'UPSC EPFO 2026',
    lastDate: '2026-07-20',
    dateStatus: 'tentative',
  },
  {
    title: 'UPSC ESE 2026',
    lastDate: '2026-10-15',
    importantDates: [
      { event: 'Prelims Exam Date (Tentative)', date: '2027-02-15' },
    ],
    dateStatus: 'tentative',
  },
  {
    title: 'UPSC CMS 2026',
    lastDate: '2026-07-30',
    dateStatus: 'tentative',
  },
  {
    title: 'IBPS PO 2026',
    lastDate: '2026-07-15',
    importantDates: [
      { event: 'Notification Expected', date: '2026-06-15' },
      { event: 'Application End Date (Expected)', date: '2026-07-15' },
      { event: 'Prelims Exam Date', date: '2026-08-22' },
      { event: 'Mains Exam Date', date: '2026-10-04' },
    ],
    dateStatus: 'tentative',
  },
  {
    title: 'IBPS Clerk 2026',
    lastDate: '2026-08-15',
    importantDates: [
      { event: 'Prelims Exam Date (Expected)', date: '2026-10-10' },
    ],
    dateStatus: 'tentative',
  },
  {
    title: 'IBPS RRB PO 2026',
    lastDate: '2026-07-20',
    importantDates: [
      { event: 'Prelims Exam Date (Expected)', date: '2026-09-15' },
      { event: 'Mains Exam Date (Expected)', date: '2026-10-25' },
    ],
    dateStatus: 'tentative',
  },
  {
    title: 'IBPS RRB Clerk 2026',
    lastDate: '2026-07-20',
    importantDates: [
      { event: 'Prelims Exam Date (Expected)', date: '2026-09-20' },
    ],
    dateStatus: 'tentative',
  },
  {
    title: 'SBI PO 2026',
    lastDate: '2026-07-15',
    importantDates: [
      { event: 'Notification Expected', date: '2026-06-20' },
      { event: 'Application End Date (Expected)', date: '2026-07-15' },
      { event: 'Prelims Exam Date (Expected)', date: '2026-08-01' },
      { event: 'Mains Exam Date (Expected)', date: '2026-09-12' },
    ],
    dateStatus: 'tentative',
  },
  {
    title: 'SBI Clerk 2026',
    lastDate: '2026-08-30',
    importantDates: [
      { event: 'Notification Expected', date: '2026-07-15' },
      { event: 'Prelims Exam Date (Expected)', date: '2026-10-15' },
    ],
    dateStatus: 'tentative',
  },
  {
    title: 'RBI Grade B 2026',
    lastDate: '2026-05-20',
    vacancies: '60',
    importantDates: [
      { event: 'Notification Date', date: '2026-04-29' },
      { event: 'Application End Date', date: '2026-05-20' },
      { event: 'Phase 1 Exam Date', date: '2026-06-13' },
      { event: 'Phase 2 Exam Date', date: '2026-07-25' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'RBI Assistant 2026',
    lastDate: '2026-09-05',
    dateStatus: 'tentative',
  },
  {
    title: 'RRB NTPC 2026',
    lastDate: '2025-11-27',
    vacancies: '8,868',
    importantDates: [
      { event: 'Application End Date', date: '2025-11-27' },
      { event: 'CBT-1 Graduate Level (Completed)', date: '2026-03-16' },
      { event: 'CBT-2 Graduate Level', date: '2026-07-10' },
      { event: 'CBT-1 Undergraduate', date: '2026-05-07' },
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
    title: 'AFCAT 2026',
    lastDate: '2026-06-19',
    vacancies: '379',
    importantDates: [
      { event: 'AFCAT 1 Exam Date (Completed)', date: '2026-01-31' },
      { event: 'AFCAT 2 Notification', date: '2026-05-20' },
      { event: 'AFCAT 2 Application End', date: '2026-06-19' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'CTET 2026',
    lastDate: '2026-06-10',
    importantDates: [
      { event: 'Notification Date', date: '2026-05-11' },
      { event: 'Application End Date', date: '2026-06-10' },
      { event: 'Correction Window', date: '2026-06-15' },
      { event: 'Exam Date', date: '2026-09-06' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'UGC NET 2026',
    lastDate: '2026-05-24',
    importantDates: [
      { event: 'Application End Date', date: '2026-05-24' },
      { event: 'Exam Start Date', date: '2026-06-22' },
      { event: 'Exam End Date', date: '2026-06-30' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'NEET UG 2026',
    lastDate: '2026-02-15',
    importantDates: [
      { event: 'Exam Date (Completed)', date: '2026-05-03' },
      { event: 'Re-Exam Date', date: '2026-06-21' },
      { event: 'Result Expected', date: '2026-06-30' },
    ],
    dateStatus: 'confirmed',
  },
  {
    title: 'NEET PG 2026',
    lastDate: '2026-08-30',
    dateStatus: 'tentative',
  },
  {
    title: 'LIC AAO 2026',
    lastDate: '2026-06-15',
    dateStatus: 'tentative',
  },
  {
    title: 'SEBI Grade A 2026',
    lastDate: '2026-07-25',
    dateStatus: 'tentative',
  },
  {
    title: 'NABARD Grade A 2026',
    lastDate: '2026-08-05',
    dateStatus: 'tentative',
  },
  {
    title: 'Delhi Police Constable 2026',
    lastDate: '2026-07-10',
    dateStatus: 'tentative',
  },
  {
    title: 'UP Police Constable 2026',
    lastDate: '2026-08-15',
    dateStatus: 'tentative',
  },
  {
    title: 'GATE 2027',
    lastDate: '2026-10-15',
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

    if (correction.importantDates) {
      update.importantDates = correction.importantDates.map(d => ({
        event: d.event,
        date: new Date(d.date),
      }));
    }

    await Exam.findByIdAndUpdate(exam._id, { $set: update });
    updated++;
  }

  // Mark all exams without explicit corrections as tentative
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
