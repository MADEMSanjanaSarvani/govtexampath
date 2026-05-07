import React, { useState } from 'react';
import { FiSearch, FiCalendar, FiDownload, FiGlobe, FiExternalLink, FiLock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/common/SEO';
import toast from 'react-hot-toast';

const currentAffairsData = [
  {
    id: 132, title: 'India-Japan Sign Pacts on Quantum Technology & Health Research',
    category: 'International', date: '2026-05-06',
    source: 'Ministry of S&T', sourceUrl: 'https://www.business-standard.com/',
    examRelevance: ['UPSC', 'SSC CGL', 'Banking', 'All Exams'],
    content: 'India and Japan exchanged agreements on quantum science, medical devices, and health research on May 5-6, 2026. Union Minister Dr Jitendra Singh and Japanese Minister Kimi Onoda signed a Memorandum of Cooperation in health and medical devices and a Letter of Intent on quantum science and technology. Collaboration will be under India\'s National Quantum Mission covering quantum computing, communication, sensing, and materials research. Both sides agreed to expand researcher exchange programmes, joint innovation platforms, and industry internships. The partnership builds on PM Modi\'s August 2025 visit to Japan.'
  },
  {
    id: 131, title: 'IIT Madras Opens First US Deep-Tech Centre in Menlo Park, California',
    category: 'Science', date: '2026-05-06',
    source: 'IIT Madras Global', sourceUrl: 'https://telanganatoday.com/',
    examRelevance: ['UPSC', 'SSC', 'All Exams'],
    content: 'IIT Madras Global Research Foundation established its first United States centre in Menlo Park, California on May 6, 2026 at the SelectUSA Investment Summit in Maryland. The $7.5 million facility (including $4.5 million greenfield funding) near Silicon Valley will serve as a launchpad for Indian deep-tech startups, providing access to capital, markets, and mentorship. The centre focuses on deep-tech research, commercialization, and startup incubation. IITM Global also announced plans for a second centre on the US East Coast.'
  },
  {
    id: 130, title: 'BRO Project Deepak Celebrates 66th Raising Day at Shimla',
    category: 'National', date: '2026-05-04',
    source: 'Ministry of Defence', sourceUrl: 'https://www.tribuneindia.com/',
    examRelevance: ['UPSC', 'NDA', 'CDS', 'Defence'],
    content: 'Border Roads Organisation\'s Project Deepak celebrated its 66th Raising Day on May 4, 2026 at Shimla. Raised in 1961, Project Deepak develops and maintains strategic road infrastructure in the Western Himalayas, spanning key districts of Himachal Pradesh including Shimla, Kinnaur, Kullu, and Lahaul-Spiti. The project built the historic Hindustan-Tibet Road and key stretches of the Manali-Leh axis, contributing significantly to national security and connectivity in remote border areas.'
  },
  {
    id: 129, title: 'US Returns 657 Stolen Antiquities Worth $14 Million to India',
    category: 'International', date: '2026-04-30',
    source: 'Manhattan DA / PIB', sourceUrl: 'https://www.newsonair.gov.in/',
    examRelevance: ['UPSC', 'SSC', 'All Exams'],
    content: 'Manhattan District Attorney Alvin Bragg announced the return of 657 antiquities valued at nearly $14 million to India in late April 2026. The pieces were recovered from investigations into alleged trafficker Subash Kapoor and convicted trafficker Nancy Wiener. Notable artifacts include a bronze Avalokiteshvara sculpture ($2 million) from Raipur\'s Mahant Ghasidas Museum, a red sandstone Buddha ($7.5 million), and a dancing Ganesha stolen from a Madhya Pradesh temple. The DA\'s Antiquities Trafficking Unit has now recovered over 6,200 cultural treasures worth $485 million.'
  },
  {
    id: 128, title: 'India Deploys Aarogya Maitri Health Cube in Jamaica',
    category: 'International', date: '2026-04-30',
    source: 'DD News', sourceUrl: 'https://www.newsonair.gov.in/',
    examRelevance: ['UPSC', 'SSC CGL', 'All Exams'],
    content: 'India deployed its flagship Aarogya Maitri portable healthcare infrastructure (BHISHM Cube) in Jamaica on April 30, 2026. The BHISHM (Bharat Health Initiative for Sahyog, Hita, and Maitri) Cube is the world\'s first modular, portable hospital designed to bridge the "Golden Hour" gap after disasters. Deployment was coordinated under India\'s HADR framework by the National Security Council Secretariat and MEA. RailTel and Green Genome India are implementation partners. This strengthens India\'s outreach to CARICOM countries through healthcare and disaster resilience.'
  },
  {
    id: 127, title: 'TRAI Releases Consultation Paper on V2X Communication Framework',
    category: 'Science', date: '2026-04-30',
    source: 'TRAI', sourceUrl: 'https://trai.gov.in/',
    examRelevance: ['UPSC', 'SSC', 'All Exams'],
    content: 'TRAI released a Consultation Paper on the Regulatory Framework for Vehicle-to-Everything (V2X) Communication on April 30, 2026. V2X allows vehicles to communicate in real time with other vehicles, traffic signals, and pedestrians using wireless networks. The paper seeks inputs on spectrum allocation (5.9 GHz band), licensing models, interoperability standards, and security frameworks. Cellular-V2X (C-V2X) leveraging 4G/5G networks is preferred over DSRC technology. The initiative aims to improve road safety, reduce congestion, and support autonomous driving in India.'
  },
  {
    id: 126, title: 'Sabastian Sawe Runs First Sub-2-Hour Marathon at London Marathon',
    category: 'Sports', date: '2026-04-26',
    source: 'World Athletics', sourceUrl: 'https://worldathletics.org/',
    examRelevance: ['UPSC', 'SSC', 'Railways', 'All Exams'],
    content: 'Kenya\'s Sabastian Sawe became the first athlete to run a sub-two-hour marathon in legal race conditions at the 2026 London Marathon on April 26, finishing in 1:59:30. He improved on the late Kelvin Kiptum\'s record (2:00:35) by 1 minute 5 seconds. Ethiopia\'s Yomif Kejelcha also broke 2 hours, finishing second in 1:59:41. Sawe reached halfway in 60:29 and ran the second half in 59:01. While Eliud Kipchoge had broken 2 hours in the 2019 INEOS challenge (1:59:40), that was not in legal race conditions.'
  },
  {
    id: 125, title: 'Mazagon Dock Acquires 51% Stake in Colombo Dockyard: India\'s First Overseas Shipyard Acquisition',
    category: 'National', date: '2026-04-13',
    source: 'PIB', sourceUrl: 'https://www.pib.gov.in/',
    examRelevance: ['UPSC', 'NDA', 'CDS', 'Defence', 'All Exams'],
    content: 'Mazagon Dock Shipbuilders Limited (MDL) completed the acquisition of a 51% controlling stake in Colombo Dockyard PLC (CDPLC), Sri Lanka\'s largest shipbuilding and ship repair facility, for $26.8 million (~Rs 249.5 crore). This is India\'s first-ever international shipyard acquisition. The deal was executed through a Tripartite Agreement with Onomichi Dockyard Co. Ltd of Japan. MDL CMD Captain Jagmohan (Retd.) was appointed Non-Executive Chairman of CDPLC. The acquisition supports India\'s Maritime Amrit Kaal Vision 2047 to become a top-5 global shipbuilding nation.'
  },
  {
    id: 124, title: 'Kalai-II Hydro Electric Project Approved: 1,200 MW, Rs 14,105 Crore in Arunachal Pradesh',
    category: 'National', date: '2026-04-09',
    source: 'PIB', sourceUrl: 'https://www.pib.gov.in/',
    examRelevance: ['UPSC', 'SSC', 'Railways', 'All Exams'],
    content: 'The CCEA approved Rs 14,105.83 crore for the 1,200 MW Kalai-II Hydro Electric Project on the Lohit River in Anjaw District, Arunachal Pradesh. The project will have six units of 190 MW and one unit of 60 MW, generating 4,852.95 MU of energy annually. It will be implemented by a JV of THDC India Limited and the Arunachal Pradesh government within 78 months. The state will receive 12% free power plus 1% for the Local Area Development Fund. The Centre will provide Rs 5.99 billion for infrastructure and Rs 7.5 billion towards the state\'s equity share.'
  },
  {
    id: 123, title: 'India\'s PFBR Nuclear Reactor Attains First Criticality at Kalpakkam',
    category: 'Science', date: '2026-04-07',
    source: 'DAE / PIB', sourceUrl: 'https://dae.gov.in/',
    examRelevance: ['UPSC', 'SSC', 'Railways', 'All Exams'],
    content: 'India\'s 500 MWe Prototype Fast Breeder Reactor (PFBR) successfully attained first criticality on April 6, 2026 at Kalpakkam, Tamil Nadu — a landmark milestone in India\'s three-stage nuclear programme. Built by the Indira Gandhi Centre for Atomic Research (IGCAR), the reactor uses liquid sodium coolant and a closed fuel cycle. Its Uranium-238 blanket converts into fissile Plutonium-239, enabling the reactor to produce more fuel than it consumes. This bridges India\'s current pressurized heavy water reactors and future thorium-based reactors. Commercial operations expected by September 2026.'
  },
  {
    id: 122, title: 'Mission Karmayogi: First Governance Training Programme for Scientists Launched',
    category: 'National', date: '2026-04-05',
    source: 'PIB', sourceUrl: 'https://www.devdiscourse.com/',
    examRelevance: ['UPSC', 'SSC', 'All Exams'],
    content: 'Union Minister Dr Jitendra Singh launched India\'s first dedicated "Administrative Capacity Building for Scientists and Academicians" programme under Mission Karmayogi on April 5, 2026. Jointly organised by the Indian National Science Academy (INSA) and the Capacity Building Commission (CBC), the inaugural training brought together 23 scientists from leading research institutions. The minister also launched the upgraded UNNATI portal and unveiled the roadmap for nationwide rollout of the Karmayogi Kartavya Karyakram. An MoU was signed between CBC and Research and Information System for Developing Countries.'
  },
  {
    id: 121, title: 'Western Dedicated Freight Corridor Fully Completed: 1,506 km JNPT to Dadri',
    category: 'National', date: '2026-04-01',
    source: 'Ministry of Railways', sourceUrl: 'https://dfccil.com/',
    examRelevance: ['UPSC', 'RRB NTPC', 'Railways', 'All Exams'],
    content: 'The 1,506 km Western Dedicated Freight Corridor (WDFC) from Jawaharlal Nehru Port Terminal (JNPT) in Maharashtra to Dadri in Uttar Pradesh was fully completed on March 31, 2026. The final JNPT-New Saphale electrified double-line section was commissioned after a successful trial run. This establishes India\'s first direct high-capacity rail freight link between its largest container port and the northern freight network. Double-stacked container trains can now operate at higher speeds, drastically reducing transit times and logistics costs across western India.'
  },
  {
    id: 120, title: 'India Launches Population Census 2026: World\'s Largest Data Collection Exercise',
    category: 'National', date: '2026-04-01',
    source: 'Census of India', sourceUrl: 'https://censusindia.gov.in/',
    examRelevance: ['UPSC', 'SSC CGL', 'State PSC', 'All Exams'],
    content: 'India commenced the long-delayed Population Census on April 1, 2026, deploying over 3 million officials to count 1.4 billion people. The census will be conducted digitally for the first time using smartphone-based mobile applications. Phase 1 (House Listing, April-September 2026) covers household composition and access to amenities like fuel, water, electricity, and internet. Phase 2 (Population Enumeration, February 2027) will gather socioeconomic data including education, migration, fertility, and caste. The entire exercise is scheduled to conclude by March 31, 2027.'
  },
  {
    id: 119, title: 'Gen Upendra Dwivedi Inducted into US Army War College Hall of Fame',
    category: 'National', date: '2026-04-15',
    source: 'Indian Army', sourceUrl: 'https://www.joinindianarmy.nic.in/',
    examRelevance: ['UPSC', 'NDA', 'CDS', 'Defence'],
    content: 'General Upendra Dwivedi, Chief of Army Staff of the Indian Army, was inducted into the International Hall of Fame of the United States Army War College in April 2026. This prestigious recognition honours distinguished international military leaders who have made significant contributions to their nation\'s defence and international security cooperation. Gen Dwivedi is an alumnus of the US Army War College. This is a notable achievement in India-US defence ties and reflects the growing strategic partnership between the two nations.'
  },
  {
    id: 118, title: 'NEET UG 2026 Conducted on May 3: 23 Lakh Students Appeared',
    category: 'National', date: '2026-05-03',
    source: 'NTA Official', sourceUrl: 'https://neet.nta.nic.in/',
    examRelevance: ['NEET UG', 'Healthcare'],
    content: 'The National Testing Agency (NTA) successfully conducted NEET UG 2026 on May 3, 2026 (Sunday) in pen-and-paper mode from 2:00 PM to 5:00 PM. Approximately 23 lakh medical aspirants appeared for the exam at over 5,000 centres across 556 cities in India and 14 cities abroad. The answer key is expected within 2 weeks. Results will determine admissions to approximately 1.1 lakh MBBS, BDS, AYUSH, and nursing seats across India. NEET PG 2026 is separately scheduled for August 30, 2026.'
  },
  {
    id: 117, title: 'India Launches First AI-Powered Orbital Data Centre Satellite',
    category: 'Science', date: '2026-05-03',
    source: 'ISRO / Pixxel', sourceUrl: 'https://www.isro.gov.in/',
    examRelevance: ['UPSC', 'SSC', 'Railways', 'All Exams'],
    content: 'Indian space-tech companies Pixxel and Sarvam announced Pathfinder on May 3, 2026 — India\'s first AI-powered orbital data centre satellite. The satellite will process earth observation data directly in orbit using AI, reducing latency and enabling real-time applications in agriculture, disaster management, and urban planning. This marks India\'s growing leadership in the global commercial space sector alongside ISRO\'s Gaganyaan program.'
  },
  {
    id: 116, title: 'Assembly Election Results 2026: Four States Declared on May 4',
    category: 'National', date: '2026-05-04',
    source: 'Election Commission of India', sourceUrl: 'https://eci.gov.in/',
    examRelevance: ['UPSC', 'State PSC', 'SSC', 'Polity'],
    content: 'The Election Commission of India declared results for Assembly elections in 4 states on May 4, 2026. This is significant for government exam aspirants as questions on recent elections, political parties, and constitutional processes regularly appear in UPSC Prelims, SSC CGL, State PSC, and Banking exams. Key topics: Article 324 (ECI), Anti-Defection Law, EVM-VVPAT, and Model Code of Conduct.'
  },
  {
    id: 115, title: 'RRB NTPC Under Graduate CBT-1 Begins May 7: 11,558 Vacancies',
    category: 'National', date: '2026-05-01',
    source: 'RRB Official', sourceUrl: 'https://www.rrbcdg.gov.in/',
    examRelevance: ['RRB NTPC', 'Railways'],
    content: 'The Railway Recruitment Board NTPC Under Graduate (12th Level) CBT-1 examination begins on May 7, 2026 with Phase 1 from May 7-9 and Phase 2 from June 13-21. A total of 11,558 vacancies are available for posts including Commercial Clerk, Trains Clerk, and Junior Account Assistant. Candidates should download admit cards from their respective RRB zone websites. The Graduate Level NTPC CBT-1 has already been completed (March 16-27, 2026) with 8,868 vacancies.'
  },
  {
    id: 114, title: 'SSC CGL 2026 Notification Released on April 30: Applications Open',
    category: 'National', date: '2026-04-30',
    source: 'SSC Official', sourceUrl: 'https://ssc.gov.in/',
    examRelevance: ['SSC CGL', 'SSC'],
    content: 'The Staff Selection Commission has released the SSC CGL 2026 notification on April 30, 2026 with over 15,000 vacancies across Group B and Group C posts. Online registration begins May 1, 2026 and the last date to apply is May 30, 2026. Tier-I CBT exam is expected in August 2026. Eligible candidates must hold a Bachelor\'s degree from a recognized university. Posts include Tax Assistant, Auditor, Sub-Inspector, and Inspector in various central government departments.'
  },
  {
    id: 113, title: 'UPSC CSE Prelims 2026 on May 24: Final Preparation Tips',
    category: 'National', date: '2026-04-28',
    source: 'UPSC Official', sourceUrl: 'https://upsc.gov.in/',
    examRelevance: ['UPSC CSE', 'IAS', 'IPS'],
    content: 'With less than a month remaining for UPSC CSE Prelims 2026 on May 24, candidates should focus on revision of key topics, solving previous year papers, and taking full-length mock tests. A total of 933 vacancies have been notified. Admit cards are available on upsc.gov.in. Candidates should verify their exam center details. The Mains exam is scheduled for August 21, 2026.'
  },
  {
    id: 101, title: 'SSC Selection Post Phase XIV: Applications Ongoing',
    category: 'National', date: '2026-04-12',
    source: 'SSC Official', sourceUrl: 'https://ssc.gov.in/',
    examRelevance: ['SSC Selection Post', 'SSC'],
    content: 'The Staff Selection Commission Selection Post Phase XIV notification is open with applications ongoing until May 15, 2026. Various Group B and Group C posts are available at Matriculation, Higher Secondary, and Graduation levels across central government departments. The exam is expected in July 2026.'
  },
  {
    id: 102, title: 'RBI Cuts Repo Rate to 5.75%: Impact on Banking Exams and Economy',
    category: 'Economy', date: '2026-04-10',
    source: 'RBI Official', sourceUrl: 'https://www.rbi.org.in/',
    examRelevance: ['IBPS PO', 'SBI PO', 'RBI Grade B', 'Banking'],
    content: 'The Reserve Bank of India\'s Monetary Policy Committee reduced the repo rate by 25 basis points to 5.75% in its April 2026 meeting, the third consecutive cut this year. The standing deposit facility rate now stands at 5.50% and the marginal standing facility rate at 6.00%. RBI Governor cited easing inflation at 3.8% and projected GDP growth at 6.8% for FY27. Banking exam aspirants should note the updated rates as RBI monetary policy is a frequently asked topic in IBPS, SBI, and RBI exams.'
  },
  {
    id: 103, title: 'UPSC CSE Prelims 2026: Exam Date May 24 - 933 Vacancies',
    category: 'National', date: '2026-04-08',
    source: 'UPSC Official', sourceUrl: 'https://upsc.gov.in/',
    examRelevance: ['UPSC CSE', 'IAS', 'IPS'],
    content: 'UPSC has confirmed the Civil Services Preliminary Examination 2026 date as May 24, 2026. Admit cards are available on the official UPSC website. A total of 933 vacancies have been notified for IAS, IPS, IFS, and other services. The exam will follow the standard pattern: General Studies Paper I (200 marks) and CSAT Paper II (200 marks, qualifying). Candidates should focus on revision and mock tests. Mains examination is scheduled for August 21, 2026.'
  },
  {
    id: 104, title: 'India and EU Sign Free Trade Agreement After 16 Years of Negotiations',
    category: 'International', date: '2026-04-05',
    source: 'Ministry of Commerce', sourceUrl: 'https://commerce.gov.in/',
    examRelevance: ['UPSC', 'SSC CGL', 'Banking'],
    content: 'India and the European Union signed a comprehensive Free Trade Agreement (FTA) covering goods, services, and investment. The deal eliminates tariffs on 90% of goods traded between the two partners over the next 10 years. Key sectors benefiting include textiles, pharmaceuticals, IT services, and agriculture. The EU committed to invest €50 billion in Indian manufacturing under the Make in India initiative. This is India\'s largest trade deal and is expected to boost bilateral trade from $120 billion to $200 billion by 2030.'
  },
  {
    id: 105, title: 'ISRO\'s Gaganyaan Uncrewed Mission Scheduled for May 2026',
    category: 'Science', date: '2026-04-14',
    source: 'ISRO Official', sourceUrl: 'https://www.isro.gov.in/',
    examRelevance: ['UPSC', 'SSC', 'Railways', 'All Exams'],
    content: 'ISRO has announced that the second uncrewed Gaganyaan mission (G2) is scheduled for launch in May 2026 from Sriharikota. The mission will test the crew escape system, life support, and re-entry module in orbital conditions. The Vyommitra humanoid robot will simulate astronaut functions during the mission. The first crewed Gaganyaan mission is targeted for late 2026, which will make India the 4th country to independently send humans to space. ISRO Chairman confirmed that three astronaut candidates have completed training at the Gaganyaan Training Facility.'
  },
  {
    id: 106, title: 'IBPS PO 2026: Prelims Aug 22-23, Mains Oct 4',
    category: 'National', date: '2026-04-11',
    source: 'IBPS Official', sourceUrl: 'https://www.ibps.in/',
    examRelevance: ['IBPS PO', 'Banking'],
    content: 'IBPS has announced the CRP PO/MT XVI (IBPS PO 2026) schedule. Notification expected in June 2026 with applications closing in July. Prelims examination is scheduled for August 22-23, 2026 and Mains for October 4, 2026. A total of 4,000+ vacancies are expected across 11 participating banks. The Mains exam will consist of Reasoning & Computer Aptitude, Data Analysis, General/Economy/Banking Awareness, and English Language sections. IBPS Clerk Prelims is scheduled for October 10-11 and Mains for December 27.'
  },
  {
    id: 107, title: 'India\'s UPI Crosses 20 Billion Monthly Transactions in March 2026',
    category: 'Economy', date: '2026-04-03',
    source: 'NPCI Official', sourceUrl: 'https://www.npci.org.in/',
    examRelevance: ['IBPS PO', 'SBI PO', 'Banking'],
    content: 'The Unified Payments Interface (UPI) recorded over 20 billion transactions worth Rs 24 lakh crore in March 2026, a new all-time high. NPCI data shows 45% year-on-year growth in transaction volume. UPI is now operational in 12 countries including Singapore, UAE, France, and Sri Lanka. The government plans to expand UPI to 25 countries by 2027. PhonePe leads with 47% market share followed by Google Pay at 34%. This topic is important for banking awareness sections in IBPS and SBI exams.'
  },
  {
    id: 108, title: 'Cabinet Approves 8th Pay Commission: Implementation from January 2027',
    category: 'National', date: '2026-04-01',
    source: 'PIB', sourceUrl: 'https://pib.gov.in/',
    examRelevance: ['UPSC', 'SSC', 'All Exams'],
    content: 'The Union Cabinet has approved the constitution of the 8th Central Pay Commission, which will revise salaries and pensions of approximately 50 lakh central government employees and 65 lakh pensioners. The Commission will be headed by a retired Supreme Court judge and will submit recommendations by October 2026 for implementation from January 1, 2027. The expected fitment factor of 2.57x could raise the minimum basic pay from Rs 18,000 to Rs 46,260. This directly impacts salary structures of posts filled through SSC, UPSC, and Banking exams.'
  },
  {
    id: 109, title: 'Asian Games 2026 Nagoya: India Targets 120+ Medals',
    category: 'Sports', date: '2026-04-09',
    source: 'Olympic Council of Asia', sourceUrl: 'https://ocasia.org/',
    examRelevance: ['UPSC', 'SSC', 'Railways', 'All Exams'],
    content: 'The 20th Asian Games will be held in Nagoya, Japan from September 19 to October 4, 2026. India aims to surpass its Hangzhou 2022 record of 107 medals. The Indian Olympic Association has announced a 650-member contingent across 40 sports. Key medal hopes include athletics, shooting, wrestling, boxing, and badminton. The government has allocated Rs 500 crore under the TOPS scheme for athlete preparation. Important for general knowledge sections in all competitive exams.'
  },
  {
    id: 110, title: 'Supreme Court Upholds Reservation in Promotions for SC/ST Employees',
    category: 'National', date: '2026-04-07',
    source: 'Supreme Court of India', sourceUrl: 'https://main.sci.gov.in/',
    examRelevance: ['UPSC', 'State PSC', 'Polity'],
    content: 'The Supreme Court of India, in a landmark 5-judge Constitution Bench ruling, upheld the validity of reservation in promotions for SC/ST employees in government services. The court held that Article 16(4A) provides adequate constitutional basis for the policy. The ruling clarified that states must demonstrate backwardness through quantifiable data and ensure the "creamy layer" concept applies. This judgment is significant for polity and governance sections in UPSC, State PSC, and other competitive exams.'
  },
  {
    id: 111, title: 'Railway Budget 2026-27: 500 New Vande Bharat Routes Announced',
    category: 'National', date: '2026-04-02',
    source: 'Ministry of Railways', sourceUrl: 'https://indianrailways.gov.in/',
    examRelevance: ['RRB NTPC', 'Railway Group D', 'Railways'],
    content: 'The Railway Ministry announced plans to launch 500 new Vande Bharat Express routes by March 2027 as part of the Amrit Bharat Station Scheme. Capital expenditure for railways increased to Rs 3.2 lakh crore. 10 lakh new jobs to be created in railway infrastructure projects. The Bullet Train project between Mumbai and Ahmedabad is 65% complete with commercial operations expected by 2028. Candidates appearing for RRB NTPC and Group D exams should note these developments.'
  },
  {
    id: 112, title: 'India Becomes World\'s 4th Largest Economy, Overtakes Japan',
    category: 'Economy', date: '2026-04-13',
    source: 'IMF', sourceUrl: 'https://www.imf.org/',
    examRelevance: ['UPSC', 'SSC CGL', 'Banking', 'All Exams'],
    content: 'India has officially overtaken Japan to become the world\'s 4th largest economy by nominal GDP at $4.2 trillion. The IMF confirmed the ranking in its April 2026 World Economic Outlook. India is now behind only the US ($28.5T), China ($19.8T), and Germany ($4.5T). India\'s GDP per capita stands at $2,900. The government targets becoming the 3rd largest economy by 2028. Key growth drivers include services sector (55% of GDP), manufacturing expansion, and digital economy growth.'
  },
  // Older articles
  {
    id: 1, title: 'Union Budget 2025-26: Key Highlights for Government Exam Aspirants',
    category: 'Economy', date: '2025-02-01',
    source: 'Ministry of Finance', sourceUrl: 'https://www.indiabudget.gov.in/',
    examRelevance: ['UPSC', 'SSC', 'Banking', 'All Exams'],
    content: 'Finance Minister presented the Union Budget with focus on infrastructure development, digital economy, and employment generation. The fiscal deficit target set at 4.4% of GDP. New tax slabs under the new regime: No tax up to Rs 12 lakh. Capital expenditure allocation increased to Rs 11.21 lakh crore. PM Gati Shakti extended with Rs 75,000 crore allocation for road infrastructure.'
  },
  {
    id: 2, title: 'India Successfully Tests Agni-5 Missile with MIRV Technology',
    category: 'National', date: '2025-01-15',
    source: 'DRDO Official', sourceUrl: 'https://www.drdo.gov.in/',
    examRelevance: ['UPSC', 'NDA', 'CDS', 'Defence'],
    content: 'India conducted a successful test of the Agni-5 ballistic missile equipped with Multiple Independently Targetable Re-entry Vehicle (MIRV) technology under Mission Divyastra. This makes India the 6th country to develop MIRV capability, joining the US, Russia, UK, France, and China. Range of Agni-5 is over 5,000 km.'
  },
  {
    id: 5, title: 'RBI Monetary Policy: Repo Rate Cut After 4 Years',
    category: 'Economy', date: '2025-02-07',
    source: 'RBI Official', sourceUrl: 'https://www.rbi.org.in/',
    examRelevance: ['IBPS PO', 'SBI PO', 'RBI Grade B', 'Banking'],
    content: 'The Reserve Bank of India\'s Monetary Policy Committee (MPC) reduced the repo rate by 25 basis points to 6.25%, the first cut since May 2020. The standing deposit facility rate adjusted to 6%, and the marginal standing facility rate to 6.50%. GDP growth projected at 6.7% for FY26. CPI inflation forecast at 4.2%.'
  },
  {
    id: 6, title: 'Chandrayaan-4 Mission: ISRO Announces Moon Sample Return Plan',
    category: 'Science', date: '2025-01-25',
    source: 'ISRO Official', sourceUrl: 'https://www.isro.gov.in/',
    examRelevance: ['UPSC', 'SSC', 'Railways', 'All Exams'],
    content: 'ISRO announced the Chandrayaan-4 mission plan to collect and return lunar soil samples to Earth by 2028. The mission will involve two launches using LVM-3 and PSLV rockets. This will make India the 4th country to achieve lunar sample return after US, Russia, and China. Budget allocation of Rs 2,104 crore approved.'
  },
];

const categoryList = ['All', 'National', 'International', 'Economy', 'Science', 'Sports'];

const categoryBadgeColors = {
  National: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  International: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Economy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Science: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Sports: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const CurrentAffairs = () => {
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const handleWeeklyPdfDownload = () => {
    try {
      // Generate a text-based PDF-like summary of current affairs
      const header = 'GovtExamPath - Weekly Current Affairs Digest\n' +
        '='.repeat(50) + '\n' +
        `Generated on: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}\n` +
        '='.repeat(50) + '\n\n';

      const body = currentAffairsData.map((item, idx) => {
        return `${idx + 1}. [${item.category}] ${item.title}\n` +
          `   Date: ${new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}\n` +
          `   ${item.content}\n`;
      }).join('\n');

      const footer = '\n' + '='.repeat(50) +
        '\nPrepared by GovtExamPath - India\'s Free Career Guidance Platform' +
        '\nVisit: govtexampath.com for more resources\n';

      const content = header + body + footer;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `GovtExamPath-CurrentAffairs-Weekly-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Weekly Current Affairs downloaded!');
    } catch (err) {
      console.error('[GovtExamPath] PDF download error:', err);
      toast.error('Download failed. Please try again.');
    }
  };

  const filtered = currentAffairsData.filter(item => {
    const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.content.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO title="Current Affairs" path="/current-affairs" description="Daily current affairs for government exam preparation. National, international, economy, science, and sports updates for UPSC, SSC, Banking, and Railways exams." />
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/25">
          <FiGlobe className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
          Current <span className="gradient-text">Affairs</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400">Stay updated with the latest events relevant to government exams</p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search current affairs..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none shadow-sm"
          />
        </div>
      </div>

      {/* Category pills & download */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex gap-2 overflow-x-auto">
          {categoryList.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === cat ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-md' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-teal-400'}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <button
          onClick={handleWeeklyPdfDownload}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          <FiDownload className="w-4 h-4" /> Weekly PDF
        </button>
      </div>

      {/* Login gate */}
      {!isAuthenticated ? (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg">
            <FiLock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Login to Access Current Affairs</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Sign in to read detailed current affairs articles with source links, exam relevance tags, and weekly PDF downloads.</p>
            <div className="flex gap-3 justify-center">
              <Link to="/login" className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all">
                Login
              </Link>
              <Link to="/register" className="px-6 py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl border border-gray-200 dark:border-gray-600 hover:border-teal-400 transition-all">
                Create Account
              </Link>
            </div>
          </div>
          {/* Show headlines only (blurred content) */}
          <div className="mt-8 space-y-3 relative">
            <p className="text-sm text-gray-400 mb-4">Preview — login to read full articles</p>
            {filtered.slice(0, 5).map(item => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 opacity-60">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${categoryBadgeColors[item.category]}`}>{item.category}</span>
                  <span className="text-xs text-gray-400">{formatDate(item.date)}</span>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <FiGlobe className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No current affairs found matching your search.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(item => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden card-hover"
            >
              <div
                className="p-5 cursor-pointer"
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-medium ${categoryBadgeColors[item.category]}`}>
                        {item.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <FiCalendar className="w-3 h-3" /> {formatDate(item.date)}
                      </span>
                      {item.source && (
                        <span className="text-xs text-teal-600 dark:text-teal-400 font-medium">
                          {item.source}
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 transition-colors">
                      {item.title}
                    </h3>
                    {expandedId !== item.id && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{item.content}</p>
                    )}
                  </div>
                </div>

                {expandedId === item.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{item.content}</p>
                    <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-gray-400">Important for:</span>
                        {(item.examRelevance || ['UPSC', 'SSC', 'Banking']).map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-300">{tag}</span>
                        ))}
                      </div>
                      {item.sourceUrl && (
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all"
                        >
                          <FiExternalLink className="w-3 h-3" /> Read on {item.source || 'Official Source'}
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrentAffairs;
