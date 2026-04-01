import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSend, FiCpu, FiUser, FiArrowRight } from 'react-icons/fi';

const examRecommendations = {
  '10th': {
    Administrative: ['SSC MTS (Multi Tasking Staff)', 'Railway Group D', 'State Police Constable'],
    Banking: ['IBPS Clerk (after 12th)', 'India Post GDS'],
    Railways: ['Railway Group D', 'RRB ALP (Apprentice)', 'RPF Constable'],
    Defence: ['Indian Army Soldier GD', 'Indian Navy MR', 'Air Force Group Y'],
    Teaching: ['State TET (after D.El.Ed)'],
    Police: ['State Police Constable', 'SSC GD Constable', 'CISF Constable'],
  },
  '12th': {
    Administrative: ['SSC CHSL (LDC, DEO, PA/SA)', 'SSC MTS', 'State PSC Lower Division Clerk'],
    Banking: ['IBPS Clerk', 'SBI Clerk', 'RBI Office Attendant'],
    Railways: ['RRB NTPC (12th level)', 'Railway Group D', 'RPF Sub-Inspector'],
    Defence: ['NDA (National Defence Academy)', 'Indian Army Clerk', 'Air Force Group X & Y', 'Indian Coast Guard Navik'],
    Teaching: ['CTET (after D.El.Ed/B.Ed)', 'State TET'],
    Police: ['SSC GD Constable', 'Delhi Police Constable', 'State Police SI (some states)'],
  },
  'Graduation': {
    Administrative: ['UPSC Civil Services (IAS/IPS/IFS)', 'SSC CGL', 'State PSC (SDM, DSP, BDO)', 'RBI Grade B'],
    Banking: ['IBPS PO', 'SBI PO', 'RBI Grade B', 'NABARD Grade A', 'IBPS SO', 'Insurance AO (LIC AAO, NIACL AO)'],
    Railways: ['RRB NTPC (Graduate level)', 'RRB JE (with B.Tech)', 'Indian Railway Traffic Service (through UPSC)'],
    Defence: ['CDS (Combined Defence Services)', 'AFCAT (Air Force)', 'SSB (Service Selection Board)', 'CAPF (through UPSC)'],
    Teaching: ['CTET', 'UGC NET/JRF (after PG)', 'KVS Teacher', 'NVS Teacher'],
    Police: ['UPSC CAPF (AC)', 'SSC CPO (Sub-Inspector)', 'State PSC Police SI', 'IB ACIO'],
  },
  'Post Graduation': {
    Administrative: ['UPSC Civil Services (IAS/IPS/IFS)', 'State PSC Higher Posts', 'RBI Grade B', 'SEBI Grade A', 'NABARD Grade A/B'],
    Banking: ['RBI Grade B', 'SEBI Grade A', 'NABARD Grade A', 'SIDBI Grade A', 'IBPS SO (Specialist Officer)'],
    Railways: ['Indian Railway Service through UPSC Engineering Services'],
    Defence: ['CDS', 'AFCAT', 'Military Engineering Service'],
    Teaching: ['UGC NET/JRF', 'Assistant Professor (College/University)', 'KVS PGT', 'NVS PGT'],
    Police: ['IPS through UPSC CSE', 'State PSC Police DSP/ASP', 'IB Deputy Central Intelligence Officer'],
  },
};

const freeTextAnswers = {
  salary_ias: 'An IAS officer starts at Pay Level 10 (Rs 56,100 - Rs 1,77,500). A Cabinet Secretary earns at Pay Level 18 (Rs 2,50,000 fixed). Additional perks include government bungalow, car with driver, security, and various allowances. The total in-hand salary for a Sub-Divisional Magistrate (entry level) is approximately Rs 80,000 - Rs 1,00,000 per month.',
  prepare_upsc: 'UPSC preparation strategy:\n\n1. Start with NCERTs (Class 6-12) for History, Geography, Polity, Economics\n2. Read The Hindu/Indian Express daily for Current Affairs\n3. Standard books: Laxmikanth (Polity), Spectrum (Modern History), Shankar IAS (Environment)\n4. Optional subject: Choose based on your graduation background and interest\n5. Answer writing practice: Write at least 2-3 answers daily\n6. Previous year papers: Solve last 10 years of Prelims papers\n7. Mock tests: Join a test series 4-6 months before Prelims\n8. Revision: Regular revision is key - maintain short notes',
  ssc_cgl_eligible: 'SSC CGL Eligibility:\n- Age: 18-32 years (with relaxation: OBC +3, SC/ST +5, PwD +10 years)\n- Qualification: Bachelor\'s degree from a recognized university\n- There is no minimum percentage requirement\n- Final year students can also apply\n- Both male and female candidates are eligible',
};

const initialMessages = [
  {
    id: 1,
    type: 'bot',
    text: 'Welcome to the AI Career Guide! I can help you find the best government exams based on your profile. Let me ask you a few questions to get started.',
    timestamp: new Date(),
  },
  {
    id: 2,
    type: 'bot',
    text: 'What is your highest educational qualification?',
    timestamp: new Date(),
    options: ['10th Pass', '12th Pass', 'Graduation', 'Post Graduation'],
  },
];

const AIGuide = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [step, setStep] = useState('qualification');
  const [profile, setProfile] = useState({ qualification: '', age: '', category: '', strength: '' });
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const addBotMessage = (text, options = null, delay = 800) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        text,
        timestamp: new Date(),
        options,
      }]);
    }, delay);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { id: Date.now(), type: 'user', text, timestamp: new Date() }]);
  };

  const handleOption = (option) => {
    addUserMessage(option);

    if (step === 'qualification') {
      const qual = option.replace(' Pass', '');
      setProfile(prev => ({ ...prev, qualification: qual }));
      setStep('age');
      addBotMessage('How old are you? Please enter your age.', null, 600);
    } else if (step === 'category') {
      setProfile(prev => ({ ...prev, category: option }));
      setStep('strength');
      addBotMessage('What are your strongest areas?', ['General Knowledge', 'Mathematics', 'English', 'Reasoning', 'Science'], 600);
    } else if (step === 'strength') {
      const updatedProfile = { ...profile, strength: option };
      setProfile(updatedProfile);
      setStep('done');
      generateRecommendations(updatedProfile);
    }
  };

  const generateRecommendations = (p) => {
    const qual = p.qualification;
    const cat = p.category;
    const recommendations = examRecommendations[qual]?.[cat] || [];

    if (recommendations.length === 0) {
      addBotMessage(`Based on your profile (${qual}, interested in ${cat}), I recommend exploring our exam catalog for the latest opportunities. Many new exams are added regularly!`, null, 1000);
    } else {
      const recText = `Based on your profile, here are my top recommendations:\n\n` +
        recommendations.map((exam, i) => `${i + 1}. ${exam}`).join('\n') +
        `\n\nThese exams are well-suited for someone with ${qual} qualification who is interested in ${cat} roles. Your strength in ${p.strength} will be particularly helpful.` +
        `\n\nWould you like to know more about any specific exam? Feel free to ask!`;

      addBotMessage(recText, null, 1200);
      setTimeout(() => {
        addBotMessage('You can also ask me questions like:\n- "What is the salary of IAS officer?"\n- "How to prepare for UPSC?"\n- "Am I eligible for SSC CGL?"\n\nOr type "restart" to start over.', null, 500);
      }, 2500);
    }
  };

  const govtExamKeywords = [
    'exam', 'exams', 'government', 'govt', 'ssc', 'upsc', 'ibps', 'ias', 'ips', 'ifs',
    'cgl', 'chsl', 'mts', 'ntpc', 'nda', 'cds', 'capf', 'gate', 'ctet', 'net', 'jrf',
    'banking', 'bank', 'railway', 'railways', 'rrb', 'police', 'constable', 'si', 'inspector',
    'defence', 'defense', 'army', 'navy', 'airforce', 'air force', 'psc', 'appsc', 'tspsc',
    'salary', 'pay', 'eligibility', 'eligible', 'syllabus', 'pattern', 'prepare', 'preparation',
    'study', 'books', 'notes', 'admit', 'result', 'cutoff', 'cut off', 'vacancy', 'vacancies',
    'age limit', 'qualification', 'degree', 'graduate', 'graduation', '10th', '12th',
    'lic', 'insurance', 'teaching', 'teacher', 'professor', 'ugc', 'kvs', 'nvs',
    'job', 'jobs', 'career', 'post', 'recruitment', 'notification', 'apply', 'application',
    'sbi', 'rbi', 'nabard', 'sebi', 'best exam', 'which exam', 'recommend', 'suggestion',
    'civil services', 'ias officer', 'collector', 'magistrate', 'afcat',
    'restart', 'start over', 'hello', 'hi', 'help', 'thank',
  ];

  const isGovtExamRelated = (text) => {
    const lower = text.toLowerCase();
    return govtExamKeywords.some(keyword => lower.includes(keyword));
  };

  const handleFreeText = (text) => {
    const lower = text.toLowerCase();

    if (lower.includes('restart') || lower.includes('start over')) {
      setStep('qualification');
      setProfile({ qualification: '', age: '', category: '', strength: '' });
      setMessages(initialMessages);
      return;
    }

    // Greetings
    if (/^(hi|hello|hey|good morning|good evening|namaste)\s*[!.]*$/i.test(text.trim())) {
      addBotMessage('Hello! I\'m the GovtExamPath AI Guide. I can help you with government job exams, eligibility, salary details, and preparation tips. What would you like to know?');
      return;
    }

    // Thanks
    if (/^(thanks|thank you|thankyou|dhanyavaad)\s*[!.]*$/i.test(text.trim())) {
      addBotMessage('You\'re welcome! Feel free to ask any more questions about government exams. Type "restart" to start a new guided session.');
      return;
    }

    // Check if the input is related to govt exams
    if (!isGovtExamRelated(text)) {
      addBotMessage('I\'m sorry, I can only help with questions related to government jobs and exams.\n\nPlease ask about:\n- Government exam eligibility & syllabus\n- Salary of government posts\n- Exam preparation strategies\n- Which exam is best for you\n\nOr type "restart" to get personalized exam recommendations.');
      return;
    }

    // Check for very short or unclear input (less than 3 meaningful characters)
    if (text.trim().length < 3 || /^[^a-zA-Z]*$/.test(text.trim())) {
      addBotMessage('Can you clarify your question related to exams or jobs? For example:\n- "What is the salary of IAS officer?"\n- "Am I eligible for SSC CGL?"\n- "How to prepare for UPSC?"');
      return;
    }

    if (lower.includes('salary') && (lower.includes('ias') || lower.includes('civil service') || lower.includes('collector'))) {
      addBotMessage(freeTextAnswers.salary_ias);
    } else if ((lower.includes('prepare') || lower.includes('preparation') || lower.includes('study')) && lower.includes('upsc')) {
      addBotMessage(freeTextAnswers.prepare_upsc);
    } else if (lower.includes('eligible') && (lower.includes('ssc') || lower.includes('cgl'))) {
      addBotMessage(freeTextAnswers.ssc_cgl_eligible);
    } else if (lower.includes('best exam') || lower.includes('which exam') || lower.includes('recommend') || lower.includes('suggestion')) {
      if (profile.qualification) {
        addBotMessage(`Based on your ${profile.qualification} qualification, I'd recommend checking: ${Object.values(examRecommendations[profile.qualification] || {}).flat().slice(0, 5).join(', ')}. Which sector interests you most?`, ['Administrative', 'Banking', 'Railways', 'Defence', 'Teaching', 'Police']);
        setStep('category');
      } else {
        addBotMessage('I need to know your qualification first. What is your highest educational qualification?', ['10th Pass', '12th Pass', 'Graduation', 'Post Graduation']);
        setStep('qualification');
      }
    } else if (lower.includes('salary') && (lower.includes('ssc') || lower.includes('cgl'))) {
      addBotMessage('SSC CGL salary varies by post:\n\n- Tax Assistant: Rs 25,500 - Rs 81,100 (Level 4)\n- Auditor/Accountant: Rs 25,500 - Rs 81,100 (Level 4)\n- Inspector (Income Tax/Excise): Rs 44,900 - Rs 1,42,400 (Level 7)\n- Statistical Investigator: Rs 35,400 - Rs 1,12,400 (Level 6)\n\nIn-hand salary for Group B posts ranges from Rs 45,000 to Rs 70,000 per month including all allowances.');
    } else if (lower.includes('banking') && (lower.includes('salary') || lower.includes('pay'))) {
      addBotMessage('Banking sector salaries:\n\n- IBPS Clerk: Rs 19,900 - Rs 63,200 (in-hand ~Rs 28,000-32,000)\n- IBPS PO: Rs 36,000 - Rs 63,840 (in-hand ~Rs 42,000-50,000)\n- SBI PO: Rs 36,000 - Rs 63,840 (in-hand ~Rs 45,000-55,000 with metro posting)\n- RBI Grade B: Rs 55,200 - Rs 1,47,200 (in-hand ~Rs 80,000-1,00,000)\n\nAll banks provide additional perks like leased accommodation, medical insurance, and loans at concessional rates.');
    } else if (lower.includes('police') && (lower.includes('salary') || lower.includes('pay'))) {
      addBotMessage('Police sector salaries:\n\n- Constable: Rs 21,700 - Rs 69,100 (Level 3)\n- Head Constable: Rs 25,500 - Rs 81,100 (Level 4)\n- Sub-Inspector: Rs 35,400 - Rs 1,12,400 (Level 6)\n- Inspector: Rs 44,900 - Rs 1,42,400 (Level 7)\n- DSP/ASP: Rs 56,100 - Rs 1,77,500 (Level 10)\n\nAdditional allowances include Uniform Allowance, Risk Allowance, and Housing.');
    } else if (lower.includes('teaching') && (lower.includes('salary') || lower.includes('pay'))) {
      addBotMessage('Teaching sector salaries:\n\n- Primary Teacher (PRT/KVS): Rs 35,400 - Rs 1,12,400 (Level 6)\n- TGT: Rs 44,900 - Rs 1,42,400 (Level 7)\n- PGT: Rs 47,600 - Rs 1,51,100 (Level 8)\n- Assistant Professor: Rs 57,700 - Rs 2,18,200 (Level 10 Academic)\n\nTeachers also get summer/winter vacations, medical benefits, and pension.');
    } else if (lower.includes('insurance') && (lower.includes('salary') || lower.includes('pay'))) {
      addBotMessage('Insurance sector salaries:\n\n- LIC AAO: Rs 32,795 - Rs 62,315 (CTC ~Rs 12-15 LPA)\n- NIACL AO: Rs 32,795 - Rs 62,315 (CTC ~Rs 11-14 LPA)\n- LIC ADO: Rs 28,000 - Rs 50,000 approx\n\nInsurance officers also get DA, HRA, Medical Insurance, Performance Bonus, and Pension benefits.');
    } else if (lower.includes('railway') && (lower.includes('salary') || lower.includes('pay'))) {
      addBotMessage('Railway sector salaries:\n\n- Group D: Rs 18,000 - Rs 56,900 (Level 1)\n- NTPC (12th level): Rs 19,900 - Rs 63,200 (Level 2-3)\n- NTPC (Graduate): Rs 35,400 - Rs 1,12,400 (Level 5-6)\n- JE: Rs 35,400 - Rs 1,12,400 (Level 6)\n- ALP: Rs 25,500 - Rs 81,100 (Level 4)\n\nRailway employees also get free rail passes, quarters, and medical facilities.');
    } else if (lower.includes('eligibility') || lower.includes('eligible')) {
      addBotMessage('I can check eligibility for specific exams. Which exam are you interested in?\n\nPopular options:', ['UPSC CSE', 'SSC CGL', 'IBPS PO', 'RRB NTPC', 'NDA', 'CTET']);
    } else if (lower.includes('syllabus') || lower.includes('pattern')) {
      addBotMessage('Which exam\'s syllabus/pattern would you like to know about? You can browse detailed exam information on our Exams page.\n\nPopular exams:', ['UPSC CSE', 'SSC CGL', 'IBPS PO', 'RRB NTPC', 'GATE']);
    } else {
      addBotMessage('I can help you with government exam related queries:\n\n- Exam recommendations based on your profile\n- Salary information for various govt posts\n- Eligibility details for specific exams\n- Preparation strategies and tips\n- Syllabus and exam pattern details\n\nTry asking something specific like "What is the salary of IAS?" or type "restart" to get personalized recommendations.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const text = input.trim();
    setInput('');
    addUserMessage(text);

    if (step === 'age') {
      const age = parseInt(text);
      if (isNaN(age) || age < 14 || age > 60) {
        addBotMessage('Please enter a valid age between 14 and 60.');
        return;
      }
      setProfile(prev => ({ ...prev, age: text }));
      setStep('category');
      addBotMessage(`Great! You're ${age} years old. Which career sector interests you the most?`, ['Administrative', 'Banking', 'Railways', 'Defence', 'Teaching', 'Police'], 600);
    } else if (step === 'done') {
      handleFreeText(text);
    } else {
      handleFreeText(text);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
          <FiCpu className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
          AI <span className="gradient-text">Career Guide</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400">Get personalized government exam recommendations based on your profile</p>
      </div>

      {/* Chat Container */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
        {/* Messages */}
        <div className="h-[500px] overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  msg.type === 'user'
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                    : 'bg-gradient-to-br from-purple-500 to-pink-600'
                }`}>
                  {msg.type === 'user' ? <FiUser className="w-4 h-4 text-white" /> : <FiCpu className="w-4 h-4 text-white" />}
                </div>
                <div>
                  <div className={`px-4 py-3 rounded-2xl ${
                    msg.type === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-md'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-md'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  </div>
                  {msg.options && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {msg.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleOption(opt)}
                          className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                  <FiCpu className="w-4 h-4 text-white" />
                </div>
                <div className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-tl-md">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={step === 'age' ? 'Enter your age...' : 'Type your message...'}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-500/20"
            >
              <FiSend className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/eligibility-checker" className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all group">
          <span className="text-2xl">&#10003;</span>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100 text-sm group-hover:text-primary-600 transition-colors">Eligibility Checker</p>
            <p className="text-xs text-gray-500">Check exam eligibility</p>
          </div>
          <FiArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
        </Link>
        <Link to="/mind-maps" className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all group">
          <span className="text-2xl">🗺️</span>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100 text-sm group-hover:text-primary-600 transition-colors">Mind Maps</p>
            <p className="text-xs text-gray-500">Explore exam syllabi</p>
          </div>
          <FiArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
        </Link>
        <Link to="/resources" className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all group">
          <span className="text-2xl">📚</span>
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100 text-sm group-hover:text-primary-600 transition-colors">Resources</p>
            <p className="text-xs text-gray-500">Study materials</p>
          </div>
          <FiArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
        </Link>
      </div>
    </div>
  );
};

export default AIGuide;
