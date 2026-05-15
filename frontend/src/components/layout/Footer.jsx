import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiMail, FiMapPin, FiSend } from 'react-icons/fi';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 mt-auto relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="text-xl font-bold text-white">GovtExamPath</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              India's trusted platform for government exam guidance. Get AI-powered recommendations, eligibility checking, mind maps, and free preparation resources for all major exams.
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com/govtexampath" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-pink-600 flex items-center justify-center transition-all duration-200 hover:scale-110">
                <FiInstagram className="w-4 h-4" />
              </a>
              <a href="mailto:govtexampath@gmail.com" className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-green-600 flex items-center justify-center transition-all duration-200 hover:scale-110">
                <FiMail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/exams" className="text-sm text-gray-400 hover:text-white transition-colors">Browse Exams</Link></li>
              <li><Link to="/ai-guide" className="text-sm text-gray-400 hover:text-white transition-colors">AI Career Guide</Link></li>
              <li><Link to="/eligibility-checker" className="text-sm text-gray-400 hover:text-white transition-colors">Eligibility Checker</Link></li>
              <li><Link to="/mind-maps" className="text-sm text-gray-400 hover:text-white transition-colors">Mind Maps</Link></li>
              <li><Link to="/resources" className="text-sm text-gray-400 hover:text-white transition-colors">Resources</Link></li>
              <li><Link to="/current-affairs" className="text-sm text-gray-400 hover:text-white transition-colors">Current Affairs</Link></li>
              <li><Link to="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/exam-calendar" className="text-sm text-gray-400 hover:text-white transition-colors">Exam Calendar</Link></li>
              <li><Link to="/admit-card" className="text-sm text-gray-400 hover:text-white transition-colors">Admit Cards</Link></li>
              <li><Link to="/results" className="text-sm text-gray-400 hover:text-white transition-colors">Results</Link></li>
              <li><Link to="/compare" className="text-sm text-gray-400 hover:text-white transition-colors">Compare Exams</Link></li>
              <li><Link to="/prep-time-estimator" className="text-sm text-gray-400 hover:text-white transition-colors">Prep Time Estimator</Link></li>
              <li><Link to="/faq" className="text-sm text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Exam Categories</h3>
            <ul className="space-y-3">
              <li><Link to="/exams?category=UPSC" className="text-sm text-gray-400 hover:text-white transition-colors">UPSC Exams</Link></li>
              <li><Link to="/exams?category=SSC" className="text-sm text-gray-400 hover:text-white transition-colors">SSC Exams</Link></li>
              <li><Link to="/exams?category=Banking" className="text-sm text-gray-400 hover:text-white transition-colors">Banking Exams</Link></li>
              <li><Link to="/exams?category=Railways" className="text-sm text-gray-400 hover:text-white transition-colors">Railway Exams</Link></li>
              <li><Link to="/exams?category=Defence" className="text-sm text-gray-400 hover:text-white transition-colors">Defence Exams</Link></li>
              <li><Link to="/exams?category=State%20PSC" className="text-sm text-gray-400 hover:text-white transition-colors">State PSC Exams</Link></li>
              <li><Link to="/exams?category=PSU" className="text-sm text-gray-400 hover:text-white transition-colors">PSU Exams</Link></li>
              <li><Link to="/exams?category=Judiciary" className="text-sm text-gray-400 hover:text-white transition-colors">Judiciary Exams</Link></li>
              <li><Link to="/exams?category=Healthcare" className="text-sm text-gray-400 hover:text-white transition-colors">Healthcare Exams</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-5">Contact & Newsletter</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <FiMail className="w-4 h-4 text-blue-400" /> govtexampath@gmail.com
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <FiMapPin className="w-4 h-4 text-red-400" /> New Delhi, India
              </li>
            </ul>

            <p className="text-sm text-gray-400 mb-3">Get weekly exam updates</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <button type="submit" className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                <FiSend className="w-4 h-4" />
              </button>
            </form>
            {subscribed && (
              <p className="text-xs text-green-400 mt-2">Subscribed successfully!</p>
            )}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} GovtExamPath. All rights reserved. Made with purpose for India's future civil servants.
            </p>
            <div className="flex gap-6 flex-wrap justify-center">
              <Link to="/about" className="text-sm text-gray-500 hover:text-gray-400 transition-colors">About</Link>
              <Link to="/contact" className="text-sm text-gray-500 hover:text-gray-400 transition-colors">Contact</Link>
              <Link to="/privacy-policy" className="text-sm text-gray-500 hover:text-gray-400 transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="text-sm text-gray-500 hover:text-gray-400 transition-colors">Terms of Service</Link>
              <Link to="/disclaimer" className="text-sm text-gray-500 hover:text-gray-400 transition-colors">Disclaimer</Link>
              <Link to="/faq" className="text-sm text-gray-500 hover:text-gray-400 transition-colors">FAQ</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
