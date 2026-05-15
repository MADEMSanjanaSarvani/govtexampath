import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiMessageCircle, FiX, FiSend, FiArrowRight } from 'react-icons/fi';
import { getSmartResponse, getAIResponse } from '../../utils/chatbotEngine';
import { examsData } from '../../data/examsData';

const WELCOME_MESSAGE = {
  id: 'welcome',
  text: '👋 Hi! I\'m your GovtExamPath assistant. I can help you with:\n\n• Finding the right government exam\n• Checking eligibility & age limits\n• Exam dates, salary & syllabus info\n• Navigating the website\n\nAsk me anything or try the quick actions below!',
  sender: 'bot',
  links: [],
  timestamp: Date.now(),
};

const QUICK_ACTIONS = [
  'Browse Exams',
  'Check Eligibility',
  'Compare Exams',
  'Exam Calendar',
  'AI Career Guide',
  'Prep Time Estimator',
];

const HelpBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('helpbot-messages');
    return saved ? JSON.parse(saved) : [WELCOME_MESSAGE];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showPulse, setShowPulse] = useState(() => {
    return !localStorage.getItem('helpbot-pulse-seen');
  });
  const pulseCountRef = useRef(0);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    sessionStorage.setItem('helpbot-messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!showPulse) return;
    const interval = setInterval(() => {
      pulseCountRef.current += 1;
      if (pulseCountRef.current >= 3) {
        clearInterval(interval);
        setShowPulse(false);
        localStorage.setItem('helpbot-pulse-seen', 'true');
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [showPulse]);

  const handleSend = useCallback(async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isTyping) return;

    const userMessage = {
      id: Date.now().toString(),
      text: trimmed,
      sender: 'user',
      links: [],
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const smartResult = getSmartResponse(trimmed, examsData);

    if (!smartResult.isAIFallback) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: smartResult.text,
        sender: 'bot',
        links: smartResult.links || [],
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
      return;
    }

    const conversationHistory = messages
      .filter((m) => m.id !== 'welcome')
      .map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

    const aiResult = await getAIResponse(trimmed, conversationHistory);
    const botMessage = {
      id: (Date.now() + 1).toString(),
      text: aiResult.text,
      sender: 'bot',
      links: aiResult.links || [],
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, botMessage]);
    setIsTyping(false);
  }, [input, isTyping, messages]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    if (showPulse) {
      setShowPulse(false);
      localStorage.setItem('helpbot-pulse-seen', 'true');
    }
  };

  const showQuickActions = messages.length <= 1 || messages[messages.length - 1]?.id === 'welcome';

  return (
    <>
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 w-80 sm:w-96 max-h-[500px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 flex flex-col animate-slide-up"
          style={{
            animation: 'slideUp 0.3s ease-out',
          }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-white font-semibold text-sm">GovtExamPath Assistant</h3>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
                <span className="text-green-200 text-xs">Online</span>
              </span>
            </div>
            <button
              onClick={handleToggle}
              className="text-white/80 hover:text-white transition-colors"
            >
              <FiX size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" style={{ maxHeight: '350px' }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 text-sm whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-2xl rounded-tl-sm'
                  }`}
                >
                  {msg.text}
                  {msg.links && msg.links.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {msg.links.map((link, idx) => (
                        <Link
                          key={idx}
                          to={link.path}
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                            msg.sender === 'user'
                              ? 'bg-blue-500 text-white hover:bg-blue-400'
                              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          {link.label}
                          <FiArrowRight size={10} />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {showQuickActions && (
            <div className="px-4 pb-2">
              <div className="flex flex-wrap gap-1.5">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action}
                    onClick={() => handleSend(action)}
                    disabled={isTyping}
                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors disabled:opacity-50"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about any exam..."
                disabled={isTyping}
                className="flex-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <button
                onClick={() => handleSend()}
                disabled={isTyping || !input.trim()}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSend size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleToggle}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg z-50 flex items-center justify-center hover:scale-110 transition-transform ${
          showPulse ? 'animate-pulse' : ''
        }`}
      >
        {isOpen ? <FiX size={24} /> : <FiMessageCircle size={24} />}
      </button>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default HelpBot;
