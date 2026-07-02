const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [300, 'Title cannot exceed 300 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'SSC',
      'UPSC',
      'Banking',
      'Railways',
      'State PSC',
      'Defence',
      'Teaching',
      'Police',
      'Insurance',
      'Regulatory Bodies',
      'PSU',
      'Judiciary',
      'Agriculture',
      'Postal',
      'Healthcare',
      'Miscellaneous',
    ],
  },
  eligibility: {
    type: String,
    default: '',
  },
  applicationLink: {
    type: String,
    default: '',
  },
  notificationPdfUrl: {
    type: String,
    default: '',
  },
  applicationStartDate: {
    type: Date,
  },
  lastDate: {
    type: Date,
  },
  examDate: {
    type: Date,
  },
  admitCardDate: {
    type: Date,
  },
  resultDate: {
    type: Date,
  },
  postedDate: {
    type: Date,
    default: Date.now,
  },
  importantDates: [
    {
      event: { type: String },
      date: { type: Date },
    },
  ],
  salary: {
    type: String,
    default: '',
  },
  ageLimit: {
    type: String,
    default: '',
  },
  applicationFee: {
    type: String,
    default: '',
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  dateStatus: {
    type: String,
    enum: ['confirmed', 'tentative'],
    default: 'tentative',
  },
  conductingBody: {
    type: String,
    default: '',
  },
  examPattern: {
    type: String,
    default: '',
  },
  examMode: {
    type: String,
    enum: ['online', 'offline', 'pen-paper', 'both', ''],
    default: '',
  },
  examDuration: {
    type: String,
    default: '',
  },
  negativeMarking: {
    type: String,
    default: '',
  },
  syllabus: {
    type: String,
    default: '',
  },
  selectionProcess: {
    type: String,
    default: '',
  },
  jobRole: {
    type: String,
    default: '',
  },
  careerGrowth: {
    type: String,
    default: '',
  },
  applicationProcess: {
    type: String,
    default: '',
  },
  officialWebsite: {
    type: String,
    default: '',
  },
  vacancies: {
    type: String,
    default: '',
  },
  categoryWiseVacancies: [
    {
      category: { type: String, default: 'General' },
      count: { type: String, default: '' },
    },
  ],
  qualifications: {
    type: String,
    default: '',
  },
  attempts: {
    type: String,
    default: '',
  },
  salaryRange: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
    description: { type: String, default: '' },
  },
  perks: {
    type: String,
    default: '',
  },
  ageLimitDetails: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
    relaxation: { type: String, default: '' },
  },
  posts: {
    type: [String],
    default: [],
  },
  cutoffs: [
    {
      category: { type: String, default: 'General' },
      marks: { type: String, default: '' },
      year: { type: String, default: '' },
      stage: { type: String, default: 'Prelims' },
    },
  ],
  jobLocations: {
    type: [String],
    default: [],
  },
  requiredDocuments: {
    type: [String],
    default: [],
  },
  previousYearPapers: [
    {
      year: { type: String, default: '' },
      paper: { type: String, default: '' },
      url: { type: String, default: '' },
      marks: { type: String, default: '' },
      questions: { type: String, default: '' },
      duration: { type: String, default: '' },
      topics: { type: String, default: '' },
    },
  ],
  faqs: [
    {
      question: { type: String },
      answer: { type: String },
    },
  ],
  contactInfo: {
    helpdesk: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
  },
  lastVerifiedAt: {
    type: Date,
  },
  lastVerifiedSource: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Text index for search functionality
examSchema.index({ title: 'text', description: 'text' });

// Compound indexes for common query patterns
examSchema.index({ category: 1, isActive: 1 });
examSchema.index({ category: 1, lastDate: 1 });
examSchema.index({ isActive: 1, lastDate: 1 });
examSchema.index({ isActive: 1, postedDate: -1 });

module.exports = mongoose.model('Exam', examSchema);
