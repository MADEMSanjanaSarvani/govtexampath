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
    home: 'होम', exams: 'परीक्षाएं', tools: 'उपकरण', resources: 'संसाधन',
    currentAffairs: 'समसामयिकी', blog: 'ब्लॉग', login: 'लॉगिन', register: 'रजिस्टर',
    dashboard: 'डैशबोर्ड', profile: 'प्रोफाइल', bookmarks: 'बुकमार्क', notifications: 'सूचनाएं',
    logout: 'लॉगआउट', search: 'खोजें', searchExams: 'शीर्षक, श्रेणी से परीक्षा खोजें...',
    browseExams: 'परीक्षाएं ब्राउज़ करें', allExams: 'सभी परीक्षाएं', allCategories: 'सभी',
    openNow: 'अभी खुला है', viewAll: 'सभी देखें', exploreExams: 'परीक्षाएं देखें',
    careerGuide: 'करियर गाइड', eligibilityChecker: 'पात्रता जांचें', mindMaps: 'सिलेबस माइंड मैप',
    freeResources: 'मुफ्त संसाधन', examCalendar: 'परीक्षा कैलेंडर', examPriority: 'परीक्षा प्राथमिकता मैट्रिक्स',
    prepRoadmap: 'तैयारी रोडमैप', cutOff: 'कट-ऑफ अंक', compareExams: 'परीक्षाओं की तुलना',
    prepTime: 'तैयारी समय अनुमान', salaryCalc: 'वेतन कैलकुलेटर', about: 'हमारे बारे में',
    aboutUs: 'हमारे बारे में', contact: 'संपर्क', privacyPolicy: 'गोपनीयता नीति',
    termsOfService: 'सेवा की शर्तें', disclaimer: 'अस्वीकरण', faq: 'अक्सर पूछे जाने वाले प्रश्न',
    getStarted: 'मुफ्त शुरू करें', subscribe: 'सदस्यता लें', readMore: 'और पढ़ें',
    latestExams: 'नवीनतम परीक्षाएं', successStories: 'सफलता की कहानियां', free: 'मुफ्त',
    students: 'छात्र', categories: 'श्रेणियां', examCategories: 'परीक्षा श्रेणियां',
    language: 'भाषा', hindi: 'हिन्दी', english: 'English', quickLinks: 'त्वरित लिंक',
    contactNewsletter: 'संपर्क और समाचार पत्र', weeklyUpdates: 'साप्ताहिक परीक्षा अपडेट पाएं',
    yourEmail: 'आपका ईमेल', subscribedSuccess: 'सफलतापूर्वक सदस्यता ली!',
    copyright: 'सर्वाधिकार सुरक्षित। भारत के भावी सिविल सेवकों के लिए बनाया गया।',
    adminPanel: 'एडमिन पैनल', policies: 'नीतियां',
  },
  te: {
    home: 'హోమ్', exams: 'పరీక్షలు', tools: 'సాధనాలు', resources: 'వనరులు',
    currentAffairs: 'ప్రస్తుత వ్యవహారాలు', blog: 'బ్లాగ్', login: 'లాగిన్', register: 'నమోదు',
    dashboard: 'డాష్‌బోర్డ్', profile: 'ప్రొఫైల్', bookmarks: 'బుక్‌మార్క్‌లు', notifications: 'నోటిఫికేషన్లు',
    logout: 'లాగౌట్', search: 'వెతకండి', searchExams: 'శీర్షిక, వర్గం ద్వారా పరీక్షలు వెతకండి...',
    browseExams: 'పరీక్షలు చూడండి', allExams: 'అన్ని పరీక్షలు', allCategories: 'అన్నీ',
    openNow: 'ఇప్పుడు తెరిచి ఉంది', viewAll: 'అన్నీ చూడండి', exploreExams: 'పరీక్షలు అన్వేషించండి',
    careerGuide: 'కెరీర్ గైడ్', eligibilityChecker: 'అర్హత తనిఖీ', mindMaps: 'మైండ్ మ్యాప్స్',
    freeResources: 'ఉచిత వనరులు', examCalendar: 'పరీక్ష క్యాలెండర్', examPriority: 'పరీక్ష ప్రాధాన్యత',
    prepRoadmap: 'సన్నాహక రోడ్‌మ్యాప్', cutOff: 'కట్-ఆఫ్ మార్కులు', compareExams: 'పరీక్షలు పోల్చండి',
    prepTime: 'సన్నాహక సమయ అంచనా', salaryCalc: 'జీతం కాలిక్యులేటర్', about: 'మా గురించి',
    aboutUs: 'మా గురించి', contact: 'సంప్రదించండి', privacyPolicy: 'గోప్యతా విధానం',
    termsOfService: 'సేవా నిబంధనలు', disclaimer: 'నిరాకరణ', faq: 'తరచూ అడిగే ప్రశ్నలు',
    getStarted: 'ఉచితంగా ప్రారంభించండి', subscribe: 'సభ్యత్వం తీసుకోండి', readMore: 'మరింత చదవండి',
    latestExams: 'తాజా పరీక్షలు', successStories: 'విజయ గాథలు', free: 'ఉచిత',
    students: 'విద్యార్థులు', categories: 'వర్గాలు', examCategories: 'పరీక్ష వర్గాలు',
    language: 'భాష', hindi: 'హిందీ', english: 'English', quickLinks: 'త్వరిత లింక్‌లు',
    contactNewsletter: 'సంప్రదింపు & వార్తాలేఖ', weeklyUpdates: 'వారపు పరీక్ష అప్‌డేట్‌లు పొందండి',
    yourEmail: 'మీ ఇమెయిల్', subscribedSuccess: 'విజయవంతంగా సభ్యత్వం పొందారు!',
    copyright: 'సర్వహక్కులు సురక్షితం. భారతదేశ భవిష్యత్ సివిల్ సర్వెంట్‌ల కోసం నిర్మించబడింది.',
    adminPanel: 'అడ్మిన్ పానెల్', policies: 'విధానాలు',
  },
  kn: {
    home: 'ಮುಖಪುಟ', exams: 'ಪರೀಕ್ಷೆಗಳು', tools: 'ಸಾಧನಗಳು', resources: 'ಸಂಪನ್ಮೂಲಗಳು',
    currentAffairs: 'ಪ್ರಚಲಿತ ವಿದ್ಯಮಾನಗಳು', blog: 'ಬ್ಲಾಗ್', login: 'ಲಾಗಿನ್', register: 'ನೋಂದಣಿ',
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', profile: 'ಪ್ರೊಫೈಲ್', bookmarks: 'ಬುಕ್‌ಮಾರ್ಕ್‌ಗಳು', notifications: 'ಅಧಿಸೂಚನೆಗಳು',
    logout: 'ಲಾಗ್‌ಔಟ್', search: 'ಹುಡುಕಿ', searchExams: 'ಶೀರ್ಷಿಕೆ, ವರ್ಗದ ಮೂಲಕ ಪರೀಕ್ಷೆಗಳನ್ನು ಹುಡುಕಿ...',
    browseExams: 'ಪರೀಕ್ಷೆಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ', allExams: 'ಎಲ್ಲಾ ಪರೀಕ್ಷೆಗಳು', allCategories: 'ಎಲ್ಲಾ',
    openNow: 'ಈಗ ತೆರೆದಿದೆ', viewAll: 'ಎಲ್ಲವನ್ನೂ ನೋಡಿ', exploreExams: 'ಪರೀಕ್ಷೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',
    careerGuide: 'ವೃತ್ತಿ ಮಾರ್ಗದರ್ಶಿ', eligibilityChecker: 'ಅರ್ಹತೆ ತಪಾಸಣೆ', mindMaps: 'ಮೈಂಡ್ ಮ್ಯಾಪ್ಸ್',
    freeResources: 'ಉಚಿತ ಸಂಪನ್ಮೂಲಗಳು', examCalendar: 'ಪರೀಕ್ಷಾ ಕ್ಯಾಲೆಂಡರ್', examPriority: 'ಪರೀಕ್ಷಾ ಆದ್ಯತೆ',
    prepRoadmap: 'ತಯಾರಿ ರೋಡ್‌ಮ್ಯಾಪ್', cutOff: 'ಕಟ್-ಆಫ್ ಅಂಕಗಳು', compareExams: 'ಪರೀಕ್ಷೆಗಳನ್ನು ಹೋಲಿಸಿ',
    prepTime: 'ತಯಾರಿ ಸಮಯ ಅಂದಾಜು', salaryCalc: 'ವೇತನ ಕ್ಯಾಲ್ಕುಲೇಟರ್', about: 'ನಮ್ಮ ಬಗ್ಗೆ',
    aboutUs: 'ನಮ್ಮ ಬಗ್ಗೆ', contact: 'ಸಂಪರ್ಕಿಸಿ', privacyPolicy: 'ಗೌಪ್ಯತಾ ನೀತಿ',
    termsOfService: 'ಸೇವಾ ನಿಯಮಗಳು', disclaimer: 'ಹಕ್ಕು ನಿರಾಕರಣೆ', faq: 'ಪದೇ ಪದೇ ಕೇಳಲಾಗುವ ಪ್ರಶ್ನೆಗಳು',
    getStarted: 'ಉಚಿತವಾಗಿ ಪ್ರಾರಂಭಿಸಿ', subscribe: 'ಚಂದಾದಾರರಾಗಿ', readMore: 'ಇನ್ನಷ್ಟು ಓದಿ',
    latestExams: 'ಇತ್ತೀಚಿನ ಪರೀಕ್ಷೆಗಳು', successStories: 'ಯಶಸ್ಸಿನ ಕಥೆಗಳು', free: 'ಉಚಿತ',
    students: 'ವಿದ್ಯಾರ್ಥಿಗಳು', categories: 'ವರ್ಗಗಳು', examCategories: 'ಪರೀಕ್ಷಾ ವರ್ಗಗಳು',
    language: 'ಭಾಷೆ', hindi: 'ಹಿಂದಿ', english: 'English', quickLinks: 'ತ್ವರಿತ ಲಿಂಕ್‌ಗಳು',
    contactNewsletter: 'ಸಂಪರ್ಕ ಮತ್ತು ನ್ಯೂಸ್‌ಲೆಟರ್', weeklyUpdates: 'ಸಾಪ್ತಾಹಿಕ ಪರೀಕ್ಷಾ ಅಪ್‌ಡೇಟ್‌ಗಳನ್ನು ಪಡೆಯಿರಿ',
    yourEmail: 'ನಿಮ್ಮ ಇಮೇಲ್', subscribedSuccess: 'ಯಶಸ್ವಿಯಾಗಿ ಚಂದಾದಾರರಾಗಿದ್ದೀರಿ!',
    copyright: 'ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ. ಭಾರತದ ಭವಿಷ್ಯದ ನಾಗರಿಕ ಸೇವಕರಿಗಾಗಿ ನಿರ್ಮಿಸಲಾಗಿದೆ.',
    adminPanel: 'ಅಡ್ಮಿನ್ ಪ್ಯಾನಲ್', policies: 'ನೀತಿಗಳು',
  },
  ta: {
    home: 'முகப்பு', exams: 'தேர்வுகள்', tools: 'கருவிகள்', resources: 'வளங்கள்',
    currentAffairs: 'நடப்பு நிகழ்வுகள்', blog: 'வலைப்பதிவு', login: 'உள்நுழை', register: 'பதிவு செய்',
    dashboard: 'டாஷ்போர்டு', profile: 'சுயவிவரம்', bookmarks: 'புக்மார்க்கள்', notifications: 'அறிவிப்புகள்',
    logout: 'வெளியேறு', search: 'தேடு', searchExams: 'தலைப்பு, வகை மூலம் தேர்வுகளை தேடுங்கள்...',
    browseExams: 'தேர்வுகளை உலாவுங்கள்', allExams: 'அனைத்து தேர்வுகளும்', allCategories: 'அனைத்தும்',
    openNow: 'இப்போது திறந்துள்ளது', viewAll: 'அனைத்தையும் காண்க', exploreExams: 'தேர்வுகளை ஆராயுங்கள்',
    careerGuide: 'தொழில் வழிகாட்டி', eligibilityChecker: 'தகுதி சோதனை', mindMaps: 'மைண்ட் மேப்ஸ்',
    freeResources: 'இலவச வளங்கள்', examCalendar: 'தேர்வு நாட்காட்டி', examPriority: 'தேர்வு முன்னுரிமை',
    prepRoadmap: 'தயாரிப்பு வரைபடம்', cutOff: 'கட்-ஆஃப் மதிப்பெண்கள்', compareExams: 'தேர்வுகளை ஒப்பிடுங்கள்',
    prepTime: 'தயாரிப்பு நேர மதிப்பீடு', salaryCalc: 'சம்பள கணக்கிடு', about: 'எங்களைப் பற்றி',
    aboutUs: 'எங்களைப் பற்றி', contact: 'தொடர்பு கொள்ளுங்கள்', privacyPolicy: 'தனியுரிமை கொள்கை',
    termsOfService: 'சேவை விதிமுறைகள்', disclaimer: 'மறுப்பு', faq: 'அடிக்கடி கேட்கப்படும் கேள்விகள்',
    getStarted: 'இலவசமாக தொடங்குங்கள்', subscribe: 'சந்தா செலுத்துங்கள்', readMore: 'மேலும் படிக்க',
    latestExams: 'சமீபத்திய தேர்வுகள்', successStories: 'வெற்றிக் கதைகள்', free: 'இலவசம்',
    students: 'மாணவர்கள்', categories: 'வகைகள்', examCategories: 'தேர்வு வகைகள்',
    language: 'மொழி', hindi: 'இந்தி', english: 'English', quickLinks: 'விரைவு இணைப்புகள்',
    contactNewsletter: 'தொடர்பு & செய்திமடல்', weeklyUpdates: 'வாராந்திர தேர்வு புதுப்பிப்புகளை பெறுங்கள்',
    yourEmail: 'உங்கள் மின்னஞ்சல்', subscribedSuccess: 'வெற்றிகரமாக சந்தா செலுத்தப்பட்டது!',
    copyright: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை. இந்தியாவின் எதிர்கால சிவில் சேவையாளர்களுக்காக உருவாக்கப்பட்டது.',
    adminPanel: 'நிர்வாக குழு', policies: 'கொள்கைகள்',
  },
  ml: {
    home: 'ഹോം', exams: 'പരീക്ഷകൾ', tools: 'ഉപകരണങ്ങൾ', resources: 'വിഭവങ്ങൾ',
    currentAffairs: 'കറന്റ് അഫയേഴ്സ്', blog: 'ബ്ലോഗ്', login: 'ലോഗിൻ', register: 'രജിസ്റ്റർ',
    dashboard: 'ഡാഷ്ബോർഡ്', profile: 'പ്രൊഫൈൽ', bookmarks: 'ബുക്ക്മാർക്കുകൾ', notifications: 'അറിയിപ്പുകൾ',
    logout: 'ലോഗൗട്ട്', search: 'തിരയുക', searchExams: 'തലക്കെട്ട്, വിഭാഗം വഴി പരീക്ഷകൾ തിരയുക...',
    browseExams: 'പരീക്ഷകൾ ബ്രൗസ് ചെയ്യുക', allExams: 'എല്ലാ പരീക്ഷകളും', allCategories: 'എല്ലാം',
    openNow: 'ഇപ്പോൾ തുറന്നിരിക്കുന്നു', viewAll: 'എല്ലാം കാണുക', exploreExams: 'പരീക്ഷകൾ പര്യവേക്ഷണം ചെയ്യുക',
    careerGuide: 'കരിയർ ഗൈഡ്', eligibilityChecker: 'യോഗ്യതാ പരിശോധന', mindMaps: 'മൈൻഡ് മാപ്സ്',
    freeResources: 'സൗജന്യ വിഭവങ്ങൾ', examCalendar: 'പരീക്ഷ കലണ്ടർ', examPriority: 'പരീക്ഷ മുൻഗണന',
    prepRoadmap: 'തയ്യാറെടുപ്പ് റോഡ്മാപ്പ്', cutOff: 'കട്ട്-ഓഫ് മാർക്കുകൾ', compareExams: 'പരീക്ഷകൾ താരതമ്യം ചെയ്യുക',
    prepTime: 'തയ്യാറെടുപ്പ് സമയ കണക്കുകൂട്ടൽ', salaryCalc: 'ശമ്പള കാൽക്കുലേറ്റർ', about: 'ഞങ്ങളെക്കുറിച്ച്',
    aboutUs: 'ഞങ്ങളെക്കുറിച്ച്', contact: 'ബന്ധപ്പെടുക', privacyPolicy: 'സ്വകാര്യതാ നയം',
    termsOfService: 'സേവന നിബന്ധനകൾ', disclaimer: 'നിരാകരണം', faq: 'പതിവ് ചോദ്യങ്ങൾ',
    getStarted: 'സൗജന്യമായി ആരംഭിക്കുക', subscribe: 'സബ്സ്ക്രൈബ് ചെയ്യുക', readMore: 'കൂടുതൽ വായിക്കുക',
    latestExams: 'ഏറ്റവും പുതിയ പരീക്ഷകൾ', successStories: 'വിജയ കഥകൾ', free: 'സൗജന്യം',
    students: 'വിദ്യാർത്ഥികൾ', categories: 'വിഭാഗങ്ങൾ', examCategories: 'പരീക്ഷ വിഭാഗങ്ങൾ',
    language: 'ഭാഷ', hindi: 'ഹിന്ദി', english: 'English', quickLinks: 'ദ്രുത ലിങ്കുകൾ',
    contactNewsletter: 'ബന്ധപ്പെടൽ & ന്യൂസ്‌ലെറ്റർ', weeklyUpdates: 'പ്രതിവാര പരീക്ഷ അപ്ഡേറ്റുകൾ നേടുക',
    yourEmail: 'നിങ്ങളുടെ ഇമെയിൽ', subscribedSuccess: 'വിജയകരമായി സബ്സ്ക്രൈബ് ചെയ്തു!',
    copyright: 'എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തമാണ്. ഇന്ത്യയുടെ ഭാവി സിവിൽ സേവകർക്കായി നിർമ്മിച്ചത്.',
    adminPanel: 'അഡ്മിൻ പാനൽ', policies: 'നയങ്ങൾ',
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
    const LANGUAGES = ['en', 'hi', 'te', 'kn', 'ta', 'ml'];
    setLanguage((prev) => {
      const idx = LANGUAGES.indexOf(prev);
      return LANGUAGES[(idx + 1) % LANGUAGES.length];
    });
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
