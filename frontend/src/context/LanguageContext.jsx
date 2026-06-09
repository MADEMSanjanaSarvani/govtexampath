import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const translations = {
  en: {
    home: 'Home',
    exams: 'Exams',
    tools: 'Tools',
    resources: 'Resources',
    currentAffairs: 'Current Affairs',
    blog: 'Blog',
    login: 'Login',
    register: 'Register',
    dashboard: 'Dashboard',
    profile: 'Profile',
    bookmarks: 'Bookmarks',
    notifications: 'Notifications',
    logout: 'Logout',
    search: 'Search',
    searchExams: 'Search exams by title, category...',
    browseExams: 'Browse Exams',
    allExams: 'All Exams',
    allCategories: 'All',
    openNow: 'Open Now',
    viewAll: 'View All',
    exploreExams: 'Explore Exams',
    careerGuide: 'Career Guide',
    eligibilityChecker: 'Eligibility Checker',
    mindMaps: 'Mind Maps',
    freeResources: 'Free Resources',
    examCalendar: 'Exam Calendar',
    examPriority: 'Exam Priority Matrix',
    prepRoadmap: 'Prep Roadmap',
    cutOff: 'Cut-Off Marks',
    compareExams: 'Compare Exams',
    prepTime: 'Prep Time Estimator',
    salaryCalc: 'Salary Calculator',
    about: 'About',
    aboutUs: 'About Us',
    contact: 'Contact',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    disclaimer: 'Disclaimer',
    faq: 'FAQ',
    getStarted: 'Get Started Free',
    subscribe: 'Subscribe',
    readMore: 'Read More',
    latestExams: 'Latest Exams',
    successStories: 'Success Stories',
    free: 'Free',
    students: 'Students',
    categories: 'Categories',
    examCategories: 'Exam Categories',
    language: 'Language',
    hindi: 'Hindi',
    english: 'English',
    quickLinks: 'Quick Links',
    contactNewsletter: 'Contact & Newsletter',
    weeklyUpdates: 'Get weekly exam updates',
    yourEmail: 'Your email',
    subscribedSuccess: 'Subscribed successfully!',
    copyright: 'All rights reserved. Made with purpose for India\'s future civil servants.',
    adminPanel: 'Admin Panel',
    policies: 'Policies',
  },
  hi: {
    home: 'होम',
    exams: 'परीक्षाएं',
    tools: 'उपकरण',
    resources: 'संसाधन',
    currentAffairs: 'समसामयिकी',
    blog: 'ब्लॉग',
    login: 'लॉगिन',
    register: 'रजिस्टर',
    dashboard: 'डैशबोर्ड',
    profile: 'प्रोफाइल',
    bookmarks: 'बुकमार्क',
    notifications: 'सूचनाएं',
    logout: 'लॉगआउट',
    search: 'खोजें',
    searchExams: 'शीर्षक, श्रेणी से परीक्षा खोजें...',
    browseExams: 'परीक्षाएं ब्राउज़ करें',
    allExams: 'सभी परीक्षाएं',
    allCategories: 'सभी',
    openNow: 'अभी खुला है',
    viewAll: 'सभी देखें',
    exploreExams: 'परीक्षाएं देखें',
    careerGuide: 'करियर गाइड',
    eligibilityChecker: 'पात्रता जांचें',
    mindMaps: 'सिलेबस माइंड मैप',
    freeResources: 'मुफ्त संसाधन',
    examCalendar: 'परीक्षा कैलेंडर',
    examPriority: 'परीक्षा प्राथमिकता मैट्रिक्स',
    prepRoadmap: 'तैयारी रोडमैप',
    cutOff: 'कट-ऑफ अंक',
    compareExams: 'परीक्षाओं की तुलना',
    prepTime: 'तैयारी समय अनुमान',
    salaryCalc: 'वेतन कैलकुलेटर',
    about: 'हमारे बारे में',
    aboutUs: 'हमारे बारे में',
    contact: 'संपर्क',
    privacyPolicy: 'गोपनीयता नीति',
    termsOfService: 'सेवा की शर्तें',
    disclaimer: 'अस्वीकरण',
    faq: 'अक्सर पूछे जाने वाले प्रश्न',
    getStarted: 'मुफ्त शुरू करें',
    subscribe: 'सदस्यता लें',
    readMore: 'और पढ़ें',
    latestExams: 'नवीनतम परीक्षाएं',
    successStories: 'सफलता की कहानियां',
    free: 'मुफ्त',
    students: 'छात्र',
    categories: 'श्रेणियां',
    examCategories: 'परीक्षा श्रेणियां',
    language: 'भाषा',
    hindi: 'हिन्दी',
    english: 'English',
    quickLinks: 'त्वरित लिंक',
    contactNewsletter: 'संपर्क और समाचार पत्र',
    weeklyUpdates: 'साप्ताहिक परीक्षा अपडेट पाएं',
    yourEmail: 'आपका ईमेल',
    subscribedSuccess: 'सफलतापूर्वक सदस्यता ली!',
    copyright: 'सर्वाधिकार सुरक्षित। भारत के भावी सिविल सेवकों के लिए बनाया गया।',
    adminPanel: 'एडमिन पैनल',
    policies: 'नीतियां',
  },
};

const LanguageContext = createContext(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('lang', language);
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  }, []);

  const t = useCallback((key) => {
    const dict = translations[language] || translations.en;
    return dict[key] || translations.en[key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
