const FEATURE_LINKS = [
  { label: 'AI Career Guide', path: '/ai-guide' },
  { label: 'Eligibility Checker', path: '/eligibility-checker' },
  { label: 'Mind Maps & Syllabus', path: '/mind-maps' },
  { label: 'Compare Exams', path: '/compare' },
  { label: 'Prep Time Estimator', path: '/prep-time-estimator' },
  { label: 'Exam Calendar', path: '/exam-calendar' },
];

const CATEGORY_KEYWORDS = {
  upsc: 'UPSC',
  'civil services': 'UPSC',
  ias: 'UPSC',
  ips: 'UPSC',
  ssc: 'SSC',
  'staff selection': 'SSC',
  banking: 'Banking',
  bank: 'Banking',
  ibps: 'Banking',
  sbi: 'Banking',
  rbi: 'Banking',
  railway: 'Railways',
  railways: 'Railways',
  rrb: 'Railways',
  defence: 'Defence',
  defense: 'Defence',
  nda: 'Defence',
  cds: 'Defence',
  afcat: 'Defence',
  'state psc': 'State PSC',
  psc: 'State PSC',
  teaching: 'Teaching',
  insurance: 'Insurance',
};

function normalize(text) {
  return text.toLowerCase().trim();
}

function matchesAny(msg, keywords) {
  return keywords.some((kw) => msg.includes(kw));
}

function formatDate(dateStr) {
  if (!dateStr) return 'Not announced';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function buildExamDetails(exam) {
  const lines = [`Here are the details for ${exam.title}:`];
  if (exam.category) lines.push(`Category: ${exam.category}`);
  if (exam.eligibility) lines.push(`Eligibility: ${exam.eligibility}`);
  if (exam.ageLimit) lines.push(`Age Limit: ${exam.ageLimit}`);
  if (exam.salary) lines.push(`Salary: ${exam.salary}`);
  if (exam.lastDate) lines.push(`Last Date to Apply: ${formatDate(exam.lastDate)}`);
  if (exam.examDate) lines.push(`Exam Date: ${formatDate(exam.examDate)}`);
  return lines.join('\n');
}

function findExamByName(msg, examsData) {
  if (!examsData || examsData.length === 0) return null;
  return examsData.find((exam) => {
    const title = normalize(exam.title);
    return msg.includes(title) || title.includes(msg);
  });
}

function findExamInMessage(msg, examsData) {
  if (!examsData || examsData.length === 0) return null;
  return examsData.find((exam) => {
    const titleWords = normalize(exam.title).split(/\s+/);
    if (titleWords.length >= 2) {
      return titleWords.every((word) => msg.includes(word));
    }
    return msg.includes(normalize(exam.title));
  });
}

function findExamsByCategory(msg, examsData) {
  if (!examsData || examsData.length === 0) return [];
  let matchedCategory = null;
  for (const [keyword, category] of Object.entries(CATEGORY_KEYWORDS)) {
    if (msg.includes(keyword)) {
      matchedCategory = category;
      break;
    }
  }
  if (!matchedCategory) return [];
  return examsData
    .filter((exam) => normalize(exam.category || '') === normalize(matchedCategory))
    .slice(0, 5);
}

export function getSmartResponse(message, examsData) {
  const msg = normalize(message);

  if (matchesAny(msg, ['hi', 'hello', 'hey', 'namaste'])) {
    return {
      text: 'Welcome to GovtExamPath! I can help you find information about government exams, check eligibility, explore study resources, and more. What exam or topic would you like to know about?',
      links: [{ label: 'Browse All Exams', path: '/exams' }],
      isAIFallback: false,
    };
  }

  if (matchesAny(msg, ['how to use', 'features', 'what can i do'])) {
    return {
      text: 'GovtExamPath offers several powerful features to help you in your exam preparation journey:',
      links: FEATURE_LINKS,
      isAIFallback: false,
    };
  }

  if (msg.includes('eligibility')) {
    const exam = findExamInMessage(msg, examsData);
    if (exam) {
      return {
        text: `Eligibility for ${exam.title}: ${exam.eligibility || 'Please check the detailed exam page for eligibility criteria.'}`,
        links: [{ label: `View ${exam.title} Details`, path: `/exams/${exam._id}` }],
        isAIFallback: false,
      };
    }
    return {
      text: 'Our Eligibility Checker helps you find out which government exams you qualify for based on your age, education, and other criteria.',
      links: [{ label: 'Check Your Eligibility', path: '/eligibility-checker' }],
      isAIFallback: false,
    };
  }

  if (matchesAny(msg, ['syllabus', 'mind map'])) {
    return {
      text: 'Explore our interactive Mind Maps to visualize exam syllabi and create structured study plans. Available for all major government exams.',
      links: [{ label: 'View Mind Maps', path: '/mind-maps' }],
      isAIFallback: false,
    };
  }

  if (msg.includes('current affairs')) {
    return {
      text: 'Stay updated with the latest current affairs relevant to government exams. We cover national, international, sports, economy, and more.',
      links: [{ label: 'Current Affairs', path: '/current-affairs' }],
      isAIFallback: false,
    };
  }

  if (matchesAny(msg, ['resources', 'study material', 'books'])) {
    return {
      text: 'Access curated study materials, recommended books, and preparation resources for all major government exams.',
      links: [{ label: 'Study Resources', path: '/resources' }],
      isAIFallback: false,
    };
  }

  if (matchesAny(msg, ['blog', 'tips', 'strategy'])) {
    return {
      text: 'Read expert tips, preparation strategies, and success stories from toppers on our blog.',
      links: [{ label: 'Read Our Blog', path: '/blog' }],
      isAIFallback: false,
    };
  }

  if (msg.includes('compare')) {
    return {
      text: 'Compare different government exams side by side to find which one suits you best. Compare eligibility, salary, difficulty, and more.',
      links: [{ label: 'Compare Exams', path: '/compare' }],
      isAIFallback: false,
    };
  }

  if (matchesAny(msg, ['prep time', 'how long', 'preparation time'])) {
    return {
      text: 'Our Prep Time Estimator helps you plan your study schedule based on the exam you are targeting and your current preparation level.',
      links: [{ label: 'Estimate Prep Time', path: '/prep-time-estimator' }],
      isAIFallback: false,
    };
  }

  if (matchesAny(msg, ['calendar', 'dates', 'schedule'])) {
    return {
      text: 'View upcoming exam dates, application deadlines, and important events in our Exam Calendar.',
      links: [{ label: 'Exam Calendar', path: '/exam-calendar' }],
      isAIFallback: false,
    };
  }

  if (matchesAny(msg, ['admit card', 'hall ticket'])) {
    return {
      text: 'Find the latest admit card and hall ticket download links for all government exams.',
      links: [{ label: 'Admit Cards', path: '/admit-card' }],
      isAIFallback: false,
    };
  }

  if (matchesAny(msg, ['result', 'score', 'merit'])) {
    return {
      text: 'Check the latest exam results, cutoff marks, and merit lists for government exams.',
      links: [{ label: 'Exam Results', path: '/results' }],
      isAIFallback: false,
    };
  }

  if (matchesAny(msg, ['contact', 'email', 'support'])) {
    return {
      text: 'You can reach us through our contact page. We are happy to help with any questions about the platform or exam preparation.',
      links: [{ label: 'Contact Us', path: '/contact' }],
      isAIFallback: false,
    };
  }

  if (matchesAny(msg, ['free', 'cost', 'paid'])) {
    return {
      text: 'GovtExamPath is completely free to use! All our features including AI Career Guide, Eligibility Checker, Mind Maps, and study resources are available at no cost.',
      links: [],
      isAIFallback: false,
    };
  }

  if (matchesAny(msg, ['age limit', 'age '])) {
    const exam = findExamInMessage(msg, examsData);
    if (exam) {
      return {
        text: `Age Limit for ${exam.title}: ${exam.ageLimit || 'Please check the detailed exam page for age limit information.'}`,
        links: [{ label: `View ${exam.title} Details`, path: `/exams/${exam._id}` }],
        isAIFallback: false,
      };
    }
  }

  if (matchesAny(msg, ['salary', 'pay'])) {
    const exam = findExamInMessage(msg, examsData);
    if (exam) {
      return {
        text: `Salary for ${exam.title}: ${exam.salary || 'Salary details are available on the exam page.'}`,
        links: [{ label: `View ${exam.title} Details`, path: `/exams/${exam._id}` }],
        isAIFallback: false,
      };
    }
  }

  if (matchesAny(msg, ['fee', 'application fee'])) {
    const exam = findExamInMessage(msg, examsData);
    if (exam) {
      return {
        text: `Application Fee for ${exam.title}: ${exam.applicationFee || 'Fee details are available on the exam page.'}`,
        links: [{ label: `View ${exam.title} Details`, path: `/exams/${exam._id}` }],
        isAIFallback: false,
      };
    }
  }

  if (matchesAny(msg, ['apply', 'application', 'how to apply'])) {
    const exam = findExamInMessage(msg, examsData);
    if (exam) {
      const lastDateInfo = exam.lastDate ? ` Last date to apply: ${formatDate(exam.lastDate)}.` : '';
      return {
        text: `To apply for ${exam.title}, visit the official application page.${lastDateInfo}`,
        links: [
          ...(exam.applicationLink ? [{ label: 'Apply Now', path: exam.applicationLink }] : []),
          { label: `View ${exam.title} Details`, path: `/exams/${exam._id}` },
        ],
        isAIFallback: false,
      };
    }
  }

  if (msg.includes('what is')) {
    const exam = findExamInMessage(msg, examsData);
    if (exam) {
      return {
        text: `${exam.title} is a ${exam.category || 'government'} exam conducted by ${exam.conductingBody || 'the respective authority'}. Check the details page for complete information including eligibility, syllabus, and important dates.`,
        links: [{ label: `View ${exam.title} Details`, path: `/exams/${exam._id}` }],
        isAIFallback: false,
      };
    }
  }

  const exam = findExamByName(msg, examsData) || findExamInMessage(msg, examsData);
  if (exam) {
    return {
      text: buildExamDetails(exam),
      links: [{ label: `View Full Details`, path: `/exams/${exam._id}` }],
      isAIFallback: false,
    };
  }

  const categoryExams = findExamsByCategory(msg, examsData);
  if (categoryExams.length > 0) {
    const examList = categoryExams.map((e) => e.title).join(', ');
    return {
      text: `Here are some ${categoryExams[0].category} exams: ${examList}`,
      links: categoryExams.map((e) => ({ label: e.title, path: `/exams/${e._id}` })),
      isAIFallback: false,
    };
  }

  return { text: null, links: [], isAIFallback: true };
}

export async function getAIResponse(message, conversationHistory) {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  const fallback = {
    text: "I couldn't find a specific answer. Try browsing our exams page or use the AI Career Guide for personalized recommendations.",
    links: [
      { label: 'Browse Exams', path: '/exams' },
      { label: 'AI Career Guide', path: '/ai-guide' },
    ],
  };

  if (!apiKey) {
    return fallback;
  }

  const systemInstruction = {
    role: 'user',
    parts: [
      {
        text: 'You are a helpful government exam preparation assistant for GovtExamPath.com, serving Indian aspirants. You are knowledgeable about UPSC, SSC, Banking, Railways, Defence, State PSC, and other government exams in India. Keep your responses concise, limited to 2-3 sentences. When relevant, suggest GovtExamPath features like AI Career Guide, Eligibility Checker, Mind Maps, Compare Exams, Prep Time Estimator, or Exam Calendar. Do not use markdown formatting in your responses.',
      },
    ],
  };

  const contents = [
    systemInstruction,
    { role: 'model', parts: [{ text: 'Understood. I am a government exam preparation assistant for GovtExamPath.com. I will keep my responses concise and helpful.' }] },
    ...(conversationHistory || []),
    { role: 'user', parts: [{ text: message }] },
  ];

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      }
    );

    if (!response.ok) {
      return fallback;
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return fallback;
    }

    return { text, links: [] };
  } catch {
    return fallback;
  }
}
