import React, { useState, useMemo } from 'react';
import { FiSearch, FiCalendar, FiDownload, FiGlobe, FiExternalLink, FiClock, FiTrendingUp, FiChevronDown, FiChevronUp, FiBookOpen } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/common/SEO';
import Breadcrumb from '../components/common/Breadcrumb';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

// ─── Article Data ────────────────────────────────────────────────────────────
const currentAffairsData = [
  // June 2026
  {
    id: 170, title: 'India Census 2026 Phase-1 Reaches 50% Completion: 700 Million Enumerated Digitally',
    category: 'National', date: '2026-06-09',
    source: 'Census of India', sourceUrl: 'https://censusindia.gov.in/',
    examRelevance: ['UPSC', 'SSC CGL', 'State PSC', 'All Exams'],
    content: 'India\'s Census 2026 Phase-1 (House Listing) has reached the 50% completion milestone with over 700 million people enumerated digitally using smartphone apps. Registrar General and Census Commissioner reported that 1.8 million enumerators are working across 36 states and UTs. This is India\'s first fully digital census, replacing paper forms. Data on housing, amenities, and household composition is being collected in 22 scheduled languages. Phase 2 (Population Enumeration) begins February 2027.'
  },
  {
    id: 169, title: 'G20 Summit 2026 in Johannesburg: India Pushes for Global South Representation in UNSC',
    category: 'International', date: '2026-06-09',
    source: 'MEA', sourceUrl: 'https://www.mea.gov.in/',
    examRelevance: ['UPSC', 'SSC', 'Banking', 'All Exams'],
    content: 'PM Modi at the G20 Johannesburg Summit proposed a concrete roadmap for expanding the UN Security Council to include permanent seats for India, Brazil, and an African nation by 2030. India also pushed for reforms in multilateral development banks, climate finance of $500 billion annually, and digital public infrastructure standards. The G20 Leaders\' Declaration adopted India\'s proposal on AI governance framework.'
  },
  {
    id: 168, title: 'Sensex Crosses 90,000 for the First Time: India\'s Market Cap Hits $6 Trillion',
    category: 'Economy', date: '2026-06-08',
    source: 'BSE', sourceUrl: 'https://www.bseindia.com/',
    examRelevance: ['UPSC', 'IBPS PO', 'SBI PO', 'Banking'],
    content: 'BSE Sensex crossed the historic 90,000 mark for the first time on June 8, 2026, driven by strong FII inflows of $8 billion in Q1 FY27 and robust corporate earnings. India\'s total market capitalisation reached $6 trillion, making it the 4th largest stock market globally. Nifty50 closed at 27,150. Banking, IT, and defence sectors led the rally. SEBI data shows retail investor base crossed 15 crore demat accounts.'
  },
  {
    id: 167, title: '8th Pay Commission Draft Report Submitted: Fitment Factor of 2.57x Proposed',
    category: 'National', date: '2026-06-08',
    source: 'PIB', sourceUrl: 'https://pib.gov.in/',
    examRelevance: ['UPSC', 'SSC', 'Railways', 'All Exams'],
    content: 'The 8th Central Pay Commission submitted its draft report to the Finance Ministry proposing a fitment factor of 2.57x. Minimum basic pay proposed to increase from Rs 18,000 to Rs 46,260. Maximum basic pay for Cabinet Secretary level proposed at Rs 4.5 lakh. Pension revision with enhanced family pension from 30% to 40% of last drawn pay recommended. Implementation expected from January 1, 2027. Over 50 lakh central government employees and 65 lakh pensioners will benefit.'
  },
  {
    id: 166, title: 'India-US Defence Deal: 31 MQ-9B Predator Drones Worth $3.1 Billion Delivered',
    category: 'Defence', date: '2026-06-07',
    source: 'Ministry of Defence', sourceUrl: 'https://mod.gov.in/',
    examRelevance: ['UPSC', 'NDA', 'CDS', 'AFCAT', 'Defence'],
    content: 'The first batch of 8 MQ-9B Sea Guardian drones from the $3.1 billion India-US deal arrived at INS Rajali naval air station in Tamil Nadu. The armed drones will enhance maritime surveillance across the Indian Ocean Region. All 31 drones (16 Sea Guardian for Navy, 15 Sky Guardian for Army and IAF) will be delivered by December 2027. The drones have 40-hour endurance and can carry precision-guided munitions. India is the first non-NATO nation to receive armed MQ-9B drones.'
  },
  {
    id: 165, title: 'Lok Sabha Passes Waqf (Amendment) Bill 2026 After 10-Hour Debate',
    category: 'National', date: '2026-06-07',
    source: 'Lok Sabha Secretariat', sourceUrl: 'https://loksabha.nic.in/',
    examRelevance: ['UPSC', 'SSC', 'State PSC', 'Polity'],
    content: 'Lok Sabha passed the Waqf (Amendment) Bill 2026 after a 10-hour debate with 235 votes in favour and 143 against. Key provisions include mandatory registration of Waqf properties on a digital portal within 6 months, inclusion of non-Muslim members in Waqf Boards, and a centralized Waqf Management System. The Bill amends the Waqf Act, 1995 and will now be taken up by Rajya Sabha in the ongoing Monsoon Session.'
  },
  {
    id: 164, title: 'BRICS New Development Bank Admits 5 New Members Including Saudi Arabia and Nigeria',
    category: 'International', date: '2026-06-06',
    source: 'NDB', sourceUrl: 'https://www.ndb.int/',
    examRelevance: ['UPSC', 'SSC', 'Banking', 'All Exams'],
    content: 'The BRICS New Development Bank (NDB) admitted Saudi Arabia, Nigeria, Indonesia, Turkey, and Argentina as new members at its 9th Annual Meeting in Shanghai. Total NDB membership now stands at 14 countries. India\'s shareholding remains at 20%. NDB approved $12 billion in new loans for infrastructure projects across member nations. The bank also launched a local currency lending facility to reduce dollar dependence in developing economies.'
  },
  {
    id: 163, title: 'ISRO Successfully Tests CE-20 Mk-II Cryogenic Engine for Gaganyaan Crewed Mission',
    category: 'Science', date: '2026-06-06',
    source: 'ISRO Official', sourceUrl: 'https://www.isro.gov.in/',
    examRelevance: ['UPSC', 'SSC', 'Railways', 'All Exams'],
    content: 'ISRO completed the final qualification test of the human-rated CE-20 Mk-II cryogenic engine at its Mahendragiri facility. The engine ran for 600 seconds continuously, validating all parameters for the crewed Gaganyaan mission. The engine generates 200 kN thrust and uses LOX-LH2 propellants. With this test, the HLVM3 (Human-rated LVM3) launch vehicle is fully qualified for the first crewed mission targeted for December 2026. Astronauts Prasanth Nair, Angad Pratap, and Ajit Krishnan are in final training phase.'
  },
  {
    id: 162, title: 'ICC Champions Trophy 2026 Final: India vs Australia at Dubai on June 15',
    category: 'Sports', date: '2026-06-05',
    source: 'ICC', sourceUrl: 'https://www.icc-cricket.com/',
    examRelevance: ['UPSC', 'SSC', 'Railways', 'All Exams'],
    content: 'India qualified for the ICC Champions Trophy 2026 final after defeating England by 7 wickets in the semi-final at Dubai. Virat Kohli scored an unbeaten 94 and Jasprit Bumrah took 4 wickets. India will face Australia in the final on June 15, 2026. The tournament is being held across UAE venues after the hybrid hosting model. India are seeking their third Champions Trophy title after 2002 and 2013.'
  },
  {
    id: 161, title: 'IMD Monsoon Update: Southwest Monsoon Arrives in Kerala 3 Days Early on May 28',
    category: 'Environment', date: '2026-06-05',
    source: 'IMD', sourceUrl: 'https://mausam.imd.gov.in/',
    examRelevance: ['UPSC', 'SSC', 'Agriculture', 'All Exams'],
    content: 'IMD reported that the Southwest Monsoon arrived in Kerala on May 28, 2026, three days ahead of the normal June 1 onset date. Monsoon has now advanced to cover all of South India and eastern coast. IMD forecasts 104% of Long Period Average rainfall (98 cm) for June-September 2026. La Nina conditions in the Pacific are expected to support above-normal rainfall. Kharif sowing has begun in major producing states. Agriculture Ministry expects record food grain production of 340 million tonnes.'
  },
  {
    id: 160, title: 'India\'s EV Sales Cross 3 Million Units in FY2026: 15% of Total Vehicle Sales',
    category: 'Environment', date: '2026-06-04',
    source: 'FADA', sourceUrl: 'https://www.fada.in/',
    examRelevance: ['UPSC', 'SSC', 'Economy', 'All Exams'],
    content: 'India\'s electric vehicle sales crossed 3 million units in FY2026, achieving 15% market penetration. Two-wheelers accounted for 65% (1.95 million), followed by three-wheelers (20%), and cars (12%). Tata Motors leads the EV car segment with 65% share. Government\'s FAME-III scheme provided Rs 10,000 crore in subsidies. India now has 12,500 public charging stations across 500 cities. The PM E-Drive scheme targets 30% EV penetration by 2030.'
  },
  {
    id: 159, title: 'Tejas MK2 Medium Weight Fighter Completes First Flight: Made-in-India 5th Gen Fighter',
    category: 'Defence', date: '2026-06-04',
    source: 'HAL / DRDO', sourceUrl: 'https://hal-india.co.in/',
    examRelevance: ['UPSC', 'NDA', 'CDS', 'AFCAT', 'Defence'],
    content: 'HAL\'s Tejas MK2 medium weight fighter aircraft completed its maiden flight from HAL airport in Bengaluru. The aircraft with GE-F414 engine flew for 25 minutes reaching a speed of Mach 1.2. Tejas MK2 is a 4.5-generation fighter with AESA radar, 6,500 kg payload, and 3,000 km range. IAF has ordered 108 Tejas MK2 at Rs 67,000 crore. The aircraft will replace the aging MiG-29 and Mirage-2000 fleet. First squadron delivery expected by 2028.'
  },
  {
    id: 158, title: 'India Announces Climate Pledge at Bonn: Net Zero by 2065 with 65% Renewable Energy by 2035',
    category: 'Environment', date: '2026-06-03',
    source: 'MoEFCC', sourceUrl: 'https://moef.gov.in/',
    examRelevance: ['UPSC', 'SSC', 'Environment', 'All Exams'],
    content: 'India updated its Nationally Determined Contributions (NDC) at the Bonn Climate Change Conference, pledging 65% renewable energy in the power mix by 2035 (up from current 45%) and Net Zero emissions by 2065. India also committed to creating 50 million green jobs by 2030. Current installed renewable capacity stands at 225 GW. India demanded $200 billion annually in climate finance from developed nations as part of the New Collective Quantified Goal.'
  },
  {
    id: 157, title: 'INS Vikrant Carrier Battle Group Completes First Trans-Pacific Naval Exercise',
    category: 'Defence', date: '2026-06-03',
    source: 'Indian Navy', sourceUrl: 'https://www.indiannavy.nic.in/',
    examRelevance: ['UPSC', 'NDA', 'CDS', 'Defence'],
    content: 'India\'s indigenous aircraft carrier INS Vikrant (IAC-1) completed its first trans-Pacific deployment, conducting a bilateral exercise with the US Navy\'s USS Ronald Reagan carrier strike group near Guam. The exercise involved air combat drills with MiG-29K fighters, anti-submarine warfare, and joint maritime surveillance. INS Vikrant carried 26 aircraft including MiG-29Ks and MH-60R Seahawk helicopters. The deployment signals India\'s blue water naval capability and expanding Indo-Pacific role.'
  },
  {
    id: 156, title: 'Digital India 3.0 Launched: AI Governance Platform and 10 Lakh Digital Villages by 2028',
    category: 'Science', date: '2026-06-02',
    source: 'MeitY', sourceUrl: 'https://www.meity.gov.in/',
    examRelevance: ['UPSC', 'SSC', 'Railways', 'All Exams'],
    content: 'PM launched Digital India 3.0 with focus on AI-powered governance, digital public infrastructure, and rural connectivity. Key components: BharatGPT AI platform for government services in 22 languages, target of 10 lakh digital villages by 2028, and Rs 25,000 crore investment in semiconductor manufacturing. India Stack 2.0 will integrate Aadhaar, DigiLocker, ONDC, and UPI into a unified digital ecosystem. India now has 950 million internet users with 85% smartphone penetration.'
  },
  {
    id: 155, title: 'Indian Athletes Win 5 Medals at World Para Athletics Championships in Kobe',
    category: 'Sports', date: '2026-06-02',
    source: 'Paralympic Committee of India', sourceUrl: 'https://www.paralympicindia.org/',
    examRelevance: ['UPSC', 'SSC', 'Railways', 'All Exams'],
    content: 'Indian para athletes won 5 medals (2 gold, 1 silver, 2 bronze) at the World Para Athletics Championships 2026 in Kobe, Japan. Sumit Antil defended his javelin gold with a world record throw of 73.82m in the F64 category. Bhagyashri Jadhav won gold in women\'s shot put. India\'s para sports programme has seen massive growth with 75 training centres under the Khelo India Para Games initiative. India targets 15+ medals at the 2028 Los Angeles Paralympics.'
  },
  {
    id: 154, title: 'RBI GDP Growth Forecast for FY2027 Raised to 7.2%: Manufacturing Sector Leads',
    category: 'Economy', date: '2026-06-01',
    source: 'RBI Official', sourceUrl: 'https://www.rbi.org.in/',
    examRelevance: ['IBPS PO', 'SBI PO', 'RBI Grade B', 'Banking', 'UPSC'],
    content: 'RBI raised India\'s GDP growth forecast for FY2027 to 7.2% from earlier 7.0%, citing robust manufacturing PMI at 58.2, strong exports growth of 14% YoY, and healthy corporate balance sheets. Quarterly projections: Q1 7.4%, Q2 7.3%, Q3 7.1%, Q4 7.0%. Manufacturing sector grew 9.5% in Q4 FY26, the fastest in 5 years. India\'s share in global manufacturing output rose to 3.2% from 2.8% in FY25.'
  },
  {
    id: 153, title: 'India-US iCET 2.0: Joint Development of 6G Technology and Quantum Computing',
    category: 'International', date: '2026-06-01',
    source: 'MEA / NSA', sourceUrl: 'https://www.mea.gov.in/',
    examRelevance: ['UPSC', 'SSC', 'All Exams'],
    content: 'India and US launched iCET 2.0 (Initiative on Critical and Emerging Technologies) at the NSA-level dialogue in Washington. Key agreements: joint development of 6G telecommunications standards, $500 million US investment in India\'s quantum computing ecosystem, semiconductor supply chain collaboration, and joint AI safety research. GE Aerospace will set up a jet engine R&D centre in Bengaluru. India-US bilateral trade reached $200 billion in FY26.'
  },
  // Earlier June articles
  {
    id: 150, title: 'India\'s GDP Growth Accelerates to 7.2% in Q4 FY2026: RBI Maintains Positive Outlook',
    category: 'Economy', date: '2026-06-08',
    source: 'RBI Official', sourceUrl: 'https://www.rbi.org.in/',
    examRelevance: ['UPSC', 'IBPS PO', 'SBI PO', 'RBI Grade B', 'Banking'],
    content: 'India\'s economy grew 7.2% in Q4 FY2026 (Jan-Mar), bringing full-year growth to 6.8%. RBI Governor projected 7.0% growth for FY2027, citing strong domestic consumption and manufacturing. Agriculture sector rebounded with 4.1% growth after two weak quarters.'
  },
  {
    id: 149, title: 'India Successfully Test-Fires BrahMos-II Hypersonic Cruise Missile from INS Visakhapatnam',
    category: 'Defence', date: '2026-06-07',
    source: 'DRDO Official', sourceUrl: 'https://www.drdo.gov.in/',
    examRelevance: ['UPSC', 'NDA', 'CDS', 'AFCAT', 'All Exams'],
    content: 'DRDO and BrahMos Aerospace successfully tested the BrahMos-II hypersonic missile travelling at Mach 7 speed. Launched from destroyer INS Visakhapatnam in the Bay of Bengal, it hit its target 400 km away with precision. India becomes the third country after Russia and China to deploy a hypersonic cruise missile.'
  },
  {
    id: 148, title: 'UPSC CSE 2026 Prelims Answer Key Released: Expected Cut-off 95-105 for General Category',
    category: 'Education', date: '2026-06-06',
    source: 'UPSC Official', sourceUrl: 'https://upsc.gov.in/',
    examRelevance: ['UPSC CSE', 'IAS', 'IPS'],
    content: 'UPSC released the unofficial answer key for Civil Services Prelims 2026 held on June 1. Coaching institutes estimate General category cut-off between 95-105 marks. Over 13 lakh candidates appeared for 933 vacancies. Mains exam scheduled for September 2026.'
  },
  {
    id: 147, title: 'Cabinet Approves One Nation One Election Bill: Simultaneous Elections from 2029',
    category: 'National', date: '2026-06-05',
    source: 'PIB', sourceUrl: 'https://pib.gov.in/',
    examRelevance: ['UPSC', 'SSC', 'State PSC', 'All Exams'],
    content: 'Union Cabinet approved the One Nation One Election Constitutional Amendment Bill for simultaneous Lok Sabha and State Assembly elections starting 2029. Bill to be tabled in Parliament\'s Monsoon Session. High-level committee headed by former President Ram Nath Kovind had recommended the framework.'
  },
  {
    id: 146, title: 'ISRO\'s Chandrayaan-4 Successfully Enters Lunar Orbit: Sample Collection in July 2026',
    category: 'Science', date: '2026-06-04',
    source: 'ISRO Official', sourceUrl: 'https://www.isro.gov.in/',
    examRelevance: ['UPSC', 'SSC', 'Railways', 'All Exams'],
    content: 'Chandrayaan-4 spacecraft entered lunar orbit after a 35-day journey. ISRO confirmed all systems nominal. The mission will attempt India\'s first lunar sample return from the South Pole region. Sample collection rover deployment planned for July 15, 2026.'
  },
  {
    id: 145, title: 'India Wins Historic Gold in Asian Athletics Championships 4x400m Relay in Bangkok',
    category: 'Sports', date: '2026-06-03',
    source: 'Asian Athletics Association', sourceUrl: 'https://www.asianathletics.org/',
    examRelevance: ['UPSC', 'SSC', 'Railways', 'All Exams'],
    content: 'Indian relay team of Amoj Jacob, Muhammed Ajmal, Rajesh Ramesh, and Muhammed Anas won gold in 4x400m relay at Bangkok Asian Athletics Championships with a time of 3:00.12, breaking the Asian record. India finished the championship with 8 gold, 12 silver, and 6 bronze medals.'
  },
  {
    id: 144, title: 'India Elected Non-Permanent Member of UN Security Council for 2027-28 Term',
    category: 'International', date: '2026-06-03',
    source: 'United Nations', sourceUrl: 'https://www.un.org/',
    examRelevance: ['UPSC', 'SSC', 'State PSC', 'All Exams'],
    content: 'India was elected as non-permanent member of UNSC for the 2027-28 term with 184 out of 193 votes in the General Assembly. External Affairs Minister stated India will push for reformed multilateralism and permanent UNSC seat for developing nations.'
  },
  {
    id: 143, title: 'WHO Certifies India Malaria-Free in 12 States: National Elimination Target 2030 on Track',
    category: 'Health', date: '2026-06-02',
    source: 'WHO', sourceUrl: 'https://www.who.int/',
    examRelevance: ['UPSC', 'SSC', 'Railways', 'All Exams'],
    content: 'WHO certified 12 Indian states and UTs as malaria-free, including Kerala, Goa, Puducherry, Lakshadweep, and 8 northeastern states. India\'s malaria cases dropped 78% since 2015. National target of complete elimination by 2030 is on track with new insecticide-treated bed net distribution.'
  },
  {
    id: 142, title: 'SSC CHSL 2026 Result Declared: 5,000+ Candidates Qualify for Tier-II',
    category: 'Education', date: '2026-06-01',
    source: 'SSC Official', sourceUrl: 'https://ssc.gov.in/',
    examRelevance: ['SSC CHSL', 'SSC'],
    content: 'Staff Selection Commission declared SSC CHSL 2026 Tier-I result. Over 5,000 candidates qualified for Tier-II exam scheduled for August 2026. Total 4,500 vacancies for LDC, PA, DEO posts. Category-wise cut-off: General 140, OBC 130, SC 120, ST 110.'
  },
  {
    id: 141, title: 'RBI Monetary Policy June 2026: Repo Rate Held at 5.75%, Inflation Forecast Revised to 4.2%',
    category: 'Economy', date: '2026-06-01',
    source: 'RBI Official', sourceUrl: 'https://www.rbi.org.in/',
    examRelevance: ['IBPS PO', 'SBI PO', 'RBI Grade B', 'Banking', 'UPSC'],
    content: 'RBI maintained repo rate at 5.75% in June 2026 policy review, keeping accommodation stance. CPI inflation forecast revised down to 4.2% for FY2027. GDP growth forecast maintained at 7.0%. Governor highlighted robust credit growth and stable rupee as positive indicators.'
  },
  // May 2026
  {
    id: 140, title: 'UPSC CSE Prelims 2026 Conducted on May 24: 933 Vacancies',
    category: 'National', date: '2026-05-22',
    source: 'UPSC Official', sourceUrl: 'https://upsc.gov.in/',
    examRelevance: ['UPSC CSE', 'IAS', 'IPS'],
    content: 'The UPSC Civil Services Preliminary Examination 2026 is scheduled for May 24, 2026 (Sunday). Approximately 12 lakh candidates are expected to appear for 933 vacancies across IAS, IPS, IFS, and allied services. Paper I (General Studies) will be held from 9:30 AM to 11:30 AM and Paper II (CSAT) from 2:30 PM to 4:30 PM. Candidates must carry their admit card and a valid photo ID. The Mains examination is scheduled for August 21, 2026.'
  },
  {
    id: 139, title: 'India Successfully Launches Gaganyaan G2 Uncrewed Mission from Sriharikota',
    category: 'Science', date: '2026-05-18',
    source: 'ISRO Official', sourceUrl: 'https://www.isro.gov.in/',
    examRelevance: ['UPSC', 'SSC', 'Railways', 'All Exams'],
    content: 'ISRO successfully launched the Gaganyaan G2 uncrewed orbital mission from SDSC SHAR, Sriharikota on May 18, 2026. The spacecraft carrying humanoid robot Vyommitra completed orbital insertion and tested the crew module, life support systems, and re-entry sequence. The mission validates critical technologies for India\'s first crewed spaceflight targeted for late 2026. India will become the 4th country after the US, Russia, and China to independently send humans to space.'
  },
  {
    id: 138, title: 'SSC CGL 2026: Last Date to Apply May 30 — Over 15,000 Vacancies',
    category: 'National', date: '2026-05-15',
    source: 'SSC Official', sourceUrl: 'https://ssc.gov.in/',
    examRelevance: ['SSC CGL', 'SSC'],
    content: 'The Staff Selection Commission reminds candidates that the last date to apply for SSC CGL 2026 is May 30, 2026. Over 15,000 vacancies are available for Group B and Group C posts including Tax Assistant, Auditor, Sub-Inspector (CBI), Inspector (Preventive Officer), and Statistical Investigator. Online registration began on May 1, 2026. Application fee is Rs 100 (exempted for women, SC/ST, PwBD, and ESM candidates). Tier-I CBT examination is expected in August 2026.'
  },
  {
    id: 137, title: 'WHO Declares India Eliminated Trachoma as a Public Health Problem',
    category: 'International', date: '2026-05-14',
    source: 'WHO', sourceUrl: 'https://www.who.int/',
    examRelevance: ['UPSC', 'SSC', 'All Exams'],
    content: 'The World Health Organization certified India as having eliminated Trachoma as a public health problem on May 14, 2026. India becomes the third most populous country to achieve this milestone after China and Indonesia. Trachoma, a bacterial eye infection spread through contact, was the leading infectious cause of blindness globally. India\'s National Trachoma Control Programme, active since 1963, combined mass drug administration with the SAFE strategy (Surgery, Antibiotics, Facial cleanliness, Environmental improvement).'
  },
  {
    id: 136, title: 'RBI Launches Digital Rupee (e-Rupee) for Cross-Border Payments',
    category: 'Economy', date: '2026-05-12',
    source: 'RBI Official', sourceUrl: 'https://www.rbi.org.in/',
    examRelevance: ['IBPS PO', 'SBI PO', 'RBI Grade B', 'Banking'],
    content: 'The Reserve Bank of India announced the expansion of the Digital Rupee (e₹) pilot for cross-border remittances with UAE and Singapore on May 12, 2026. The CBDC retail pilot, launched in December 2022, now covers 50 cities and 15 banks with over 5 million users. Cross-border transactions will use interlinked CBDC platforms, reducing remittance costs from 5-6% to under 1%. Banking exam aspirants should note the distinction between wholesale CBDC (e₹-W) for interbank settlements and retail CBDC (e₹-R) for public use.'
  },
  {
    id: 135, title: 'Neeraj Chopra Wins Gold at Diamond League Shanghai with 92.15m Javelin Throw',
    category: 'Sports', date: '2026-05-10',
    source: 'World Athletics', sourceUrl: 'https://worldathletics.org/',
    examRelevance: ['UPSC', 'SSC', 'Railways', 'All Exams'],
    content: 'Olympic champion Neeraj Chopra won gold at the 2026 Diamond League Shanghai meet on May 10 with a throw of 92.15 metres, his personal best and the second-longest throw in javelin history. Chopra now holds the Olympic gold (Paris 2024, 89.45m), World Championship gold (Budapest 2023), and Asian Games gold. The Diamond League is a premier annual athletics competition organized by World Athletics across 14 cities worldwide.'
  },
  {
    id: 134, title: 'Cabinet Approves National Green Hydrogen Mission Phase-II: Rs 50,000 Crore',
    category: 'Environment', date: '2026-05-09',
    source: 'Ministry of New & Renewable Energy', sourceUrl: 'https://mnre.gov.in/',
    examRelevance: ['UPSC', 'SSC CGL', 'All Exams'],
    content: 'The Union Cabinet approved Phase-II of the National Green Hydrogen Mission with an outlay of Rs 50,000 crore on May 9, 2026. The phase targets production of 10 million metric tonnes of green hydrogen annually by 2030. Key components include electrolyzer manufacturing incentives, green hydrogen purchase obligations for fertilizer and refinery sectors, and pilot projects for hydrogen-powered railways and shipping. India aims to become a global hub for green hydrogen production and export, reducing dependence on fossil fuel imports.'
  },
  {
    id: 133, title: 'RRB NTPC UG CBT-1 Phase 1 Completed: 11,558 Vacancies',
    category: 'National', date: '2026-05-09',
    source: 'RRB Official', sourceUrl: 'https://www.rrbcdg.gov.in/',
    examRelevance: ['RRB NTPC', 'Railways'],
    content: 'The Railway Recruitment Board successfully completed Phase 1 of RRB NTPC Under Graduate (12th Level) CBT-1 examination from May 7-9, 2026. A total of 11,558 vacancies are available for posts including Commercial Clerk, Trains Clerk, and Junior Account Assistant. Phase 2 is scheduled from June 13-21, 2026. Candidates who appeared in Phase 1 can check their response sheets on the official RRB website within 7 days. The RRB NTPC Graduate Level CBT-1 (8,868 vacancies) was completed in March 2026.'
  },
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
    category: 'Defence', date: '2026-04-13',
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
    category: 'Defence', date: '2026-04-15',
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
    id: 112, title: 'India Becomes World\'s 4th Largest Economy, Overtakes Japan',
    category: 'Economy', date: '2026-04-13',
    source: 'IMF', sourceUrl: 'https://www.imf.org/',
    examRelevance: ['UPSC', 'SSC CGL', 'Banking', 'All Exams'],
    content: 'India has officially overtaken Japan to become the world\'s 4th largest economy by nominal GDP at $4.2 trillion. The IMF confirmed the ranking in its April 2026 World Economic Outlook. India is now behind only the US ($28.5T), China ($19.8T), and Germany ($4.5T). India\'s GDP per capita stands at $2,900. The government targets becoming the 3rd largest economy by 2028. Key growth drivers include services sector (55% of GDP), manufacturing expansion, and digital economy growth.'
  },
  {
    id: 111, title: 'Railway Budget 2026-27: 500 New Vande Bharat Routes Announced',
    category: 'National', date: '2026-04-02',
    source: 'Ministry of Railways', sourceUrl: 'https://indianrailways.gov.in/',
    examRelevance: ['RRB NTPC', 'Railway Group D', 'Railways'],
    content: 'The Railway Ministry announced plans to launch 500 new Vande Bharat Express routes by March 2027 as part of the Amrit Bharat Station Scheme. Capital expenditure for railways increased to Rs 3.2 lakh crore. 10 lakh new jobs to be created in railway infrastructure projects. The Bullet Train project between Mumbai and Ahmedabad is 65% complete with commercial operations expected by 2028. Candidates appearing for RRB NTPC and Group D exams should note these developments.'
  },
  {
    id: 110, title: 'Supreme Court Upholds Reservation in Promotions for SC/ST Employees',
    category: 'National', date: '2026-04-07',
    source: 'Supreme Court of India', sourceUrl: 'https://main.sci.gov.in/',
    examRelevance: ['UPSC', 'State PSC', 'Polity'],
    content: 'The Supreme Court of India, in a landmark 5-judge Constitution Bench ruling, upheld the validity of reservation in promotions for SC/ST employees in government services. The court held that Article 16(4A) provides adequate constitutional basis for the policy. The ruling clarified that states must demonstrate backwardness through quantifiable data and ensure the "creamy layer" concept applies. This judgment is significant for polity and governance sections in UPSC, State PSC, and other competitive exams.'
  },
  {
    id: 109, title: 'Asian Games 2026 Nagoya: India Targets 120+ Medals',
    category: 'Sports', date: '2026-04-09',
    source: 'Olympic Council of Asia', sourceUrl: 'https://ocasia.org/',
    examRelevance: ['UPSC', 'SSC', 'Railways', 'All Exams'],
    content: 'The 20th Asian Games will be held in Nagoya, Japan from September 19 to October 4, 2026. India aims to surpass its Hangzhou 2022 record of 107 medals. The Indian Olympic Association has announced a 650-member contingent across 40 sports. Key medal hopes include athletics, shooting, wrestling, boxing, and badminton. The government has allocated Rs 500 crore under the TOPS scheme for athlete preparation. Important for general knowledge sections in all competitive exams.'
  },
  {
    id: 108, title: 'Cabinet Approves 8th Pay Commission: Implementation from January 2027',
    category: 'National', date: '2026-04-01',
    source: 'PIB', sourceUrl: 'https://pib.gov.in/',
    examRelevance: ['UPSC', 'SSC', 'All Exams'],
    content: 'The Union Cabinet has approved the constitution of the 8th Central Pay Commission, which will revise salaries and pensions of approximately 50 lakh central government employees and 65 lakh pensioners. The Commission will be headed by a retired Supreme Court judge and will submit recommendations by October 2026 for implementation from January 1, 2027. The expected fitment factor of 2.57x could raise the minimum basic pay from Rs 18,000 to Rs 46,260. This directly impacts salary structures of posts filled through SSC, UPSC, and Banking exams.'
  },
  {
    id: 107, title: 'India\'s UPI Crosses 20 Billion Monthly Transactions in March 2026',
    category: 'Economy', date: '2026-04-03',
    source: 'NPCI Official', sourceUrl: 'https://www.npci.org.in/',
    examRelevance: ['IBPS PO', 'SBI PO', 'Banking'],
    content: 'The Unified Payments Interface (UPI) recorded over 20 billion transactions worth Rs 24 lakh crore in March 2026, a new all-time high. NPCI data shows 45% year-on-year growth in transaction volume. UPI is now operational in 12 countries including Singapore, UAE, France, and Sri Lanka. The government plans to expand UPI to 25 countries by 2027. PhonePe leads with 47% market share followed by Google Pay at 34%. This topic is important for banking awareness sections in IBPS and SBI exams.'
  },
  {
    id: 106, title: 'IBPS PO 2026: Prelims Aug 22-23, Mains Oct 4',
    category: 'National', date: '2026-04-11',
    source: 'IBPS Official', sourceUrl: 'https://www.ibps.in/',
    examRelevance: ['IBPS PO', 'Banking'],
    content: 'IBPS has announced the CRP PO/MT XVI (IBPS PO 2026) schedule. Notification expected in June 2026 with applications closing in July. Prelims examination is scheduled for August 22-23, 2026 and Mains for October 4, 2026. A total of 4,000+ vacancies are expected across 11 participating banks. The Mains exam will consist of Reasoning & Computer Aptitude, Data Analysis, General/Economy/Banking Awareness, and English Language sections. IBPS Clerk Prelims is scheduled for October 10-11 and Mains for December 27.'
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
    id: 102, title: 'RBI Cuts Repo Rate to 5.75%: Impact on Banking Exams and Economy',
    category: 'Economy', date: '2026-04-10',
    source: 'RBI Official', sourceUrl: 'https://www.rbi.org.in/',
    examRelevance: ['IBPS PO', 'SBI PO', 'RBI Grade B', 'Banking'],
    content: 'The Reserve Bank of India\'s Monetary Policy Committee reduced the repo rate by 25 basis points to 5.75% in its April 2026 meeting, the third consecutive cut this year. The standing deposit facility rate now stands at 5.50% and the marginal standing facility rate at 6.00%. RBI Governor cited easing inflation at 3.8% and projected GDP growth at 6.8% for FY27. Banking exam aspirants should note the updated rates as RBI monetary policy is a frequently asked topic in IBPS, SBI, and RBI exams.'
  },
  {
    id: 101, title: 'SSC Selection Post Phase XIV: Applications Ongoing',
    category: 'National', date: '2026-04-12',
    source: 'SSC Official', sourceUrl: 'https://ssc.gov.in/',
    examRelevance: ['SSC Selection Post', 'SSC'],
    content: 'The Staff Selection Commission Selection Post Phase XIV notification is open with applications ongoing until May 15, 2026. Various Group B and Group C posts are available at Matriculation, Higher Secondary, and Graduation levels across central government departments. The exam is expected in July 2026.'
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
    category: 'Defence', date: '2025-01-15',
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

// ─── Constants ───────────────────────────────────────────────────────────────
const categoryList = ['All', 'National', 'International', 'Economy', 'Science', 'Sports', 'Environment', 'Defence'];

const categoryBadgeColors = {
  National: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  International: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Economy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Science: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  Sports: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Environment: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Defence: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Education: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  Health: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  Government: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
};

const categoryGradients = {
  All: 'from-gray-500 to-gray-600',
  National: 'from-blue-500 to-indigo-600',
  International: 'from-purple-500 to-violet-600',
  Economy: 'from-green-500 to-emerald-600',
  Science: 'from-orange-500 to-amber-600',
  Sports: 'from-red-500 to-rose-600',
  Environment: 'from-emerald-500 to-teal-600',
  Defence: 'from-amber-500 to-yellow-600',
};

const dateFilters = ['Today', 'This Week', 'This Month', 'All'];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getRelativeTime = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Upcoming';
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return '1 week ago';
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 60) return '1 month ago';
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`;
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const filterByDate = (articles, filter) => {
  const now = new Date();
  if (filter === 'All') return articles;

  return articles.filter(item => {
    const date = new Date(item.date);
    if (filter === 'Today') {
      return date.toDateString() === now.toDateString();
    }
    if (filter === 'This Week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    }
    if (filter === 'This Month') {
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }
    return true;
  });
};

// Sort articles by date (newest first)
const sortedArticles = [...currentAffairsData].sort((a, b) => new Date(b.date) - new Date(a.date));

// ─── Component ───────────────────────────────────────────────────────────────
const CurrentAffairs = () => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dateFilter, setDateFilter] = useState('This Month');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  // Get counts per category
  const categoryCounts = useMemo(() => {
    const dateFiltered = filterByDate(sortedArticles, dateFilter);
    const counts = { All: dateFiltered.length };
    categoryList.forEach(cat => {
      if (cat !== 'All') {
        counts[cat] = dateFiltered.filter(a => a.category === cat).length;
      }
    });
    return counts;
  }, [dateFilter]);

  // Filter articles
  const filtered = useMemo(() => {
    let result = filterByDate(sortedArticles, dateFilter);
    if (selectedCategory !== 'All') {
      result = result.filter(item => item.category === selectedCategory);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [selectedCategory, dateFilter, search]);

  // Top 3 most recent are "trending"
  const trendingIds = useMemo(() => {
    return sortedArticles.slice(0, 3).map(a => a.id);
  }, []);

  // Top 5 most recent articles for Daily Digest
  const dailyDigest = useMemo(() => {
    return sortedArticles.slice(0, 5);
  }, []);

  const handleWeeklyPdfDownload = () => {
    try {
      const now = new Date();
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weeklyArticles = sortedArticles.filter(a => new Date(a.date) >= weekAgo);
      const articlesToUse = weeklyArticles.length > 0 ? weeklyArticles : sortedArticles.slice(0, 20);
      const dateStr = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

      const articlesHtml = articlesToUse.map((item, idx) => `
        <div style="margin-bottom:20px;padding:16px;background:#f8fafc;border-left:4px solid #2563eb;border-radius:4px;page-break-inside:avoid;">
          <div style="font-size:11px;color:#2563eb;font-weight:600;text-transform:uppercase;margin-bottom:4px;">${item.category} &bull; ${formatDate(item.date)}</div>
          <div style="font-size:15px;font-weight:700;color:#1e293b;margin-bottom:8px;">${idx + 1}. ${item.title}</div>
          <div style="font-size:13px;color:#475569;line-height:1.6;">${item.content}</div>
          <div style="font-size:10px;color:#94a3b8;margin-top:6px;">Source: ${item.source || 'Official'}</div>
        </div>`).join('');

      const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
        <title>GovtExamPath Weekly Digest - ${dateStr}</title>
        <style>
          body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;padding:0 20px;color:#1e293b;}
          @media print{body{margin:20px;} @page{margin:15mm;size:A4;}}
        </style>
      </head><body>
        <div style="text-align:center;padding:24px 0;border-bottom:2px solid #2563eb;margin-bottom:24px;">
          <h1 style="color:#2563eb;font-size:22px;margin:0;">GovtExamPath</h1>
          <h2 style="font-size:16px;color:#475569;margin:6px 0 0;">Weekly Current Affairs Digest</h2>
          <p style="font-size:12px;color:#94a3b8;margin:4px 0 0;">Generated on ${dateStr} &bull; ${articlesToUse.length} articles</p>
        </div>
        ${articlesHtml}
        <div style="text-align:center;margin-top:32px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;">
          Prepared by GovtExamPath &bull; govtexampath.com &bull; India's Free Career Guidance Platform
        </div>
        <script>window.onload=function(){window.print();}</script>
      </body></html>`;

      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        toast.success('PDF print dialog opened. Choose "Save as PDF" to download.');
      } else {
        toast.error('Pop-up blocked. Please allow pop-ups and try again.');
      }
    } catch (err) {
      console.error('[GovtExamPath] digest download error:', err);
      toast.error('Download failed. Please try again.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO title="Current Affairs" path="/current-affairs" description="Daily current affairs for government exam preparation. National, international, economy, science, and sports updates for UPSC, SSC, Banking, and Railways exams." />
      <Breadcrumb items={[{ label: 'Current Affairs' }]} />

      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/25">
          <FiGlobe className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
          {t('currentAffairs').split(' ')[0]} <span className="gradient-text">{t('currentAffairs').split(' ').slice(1).join(' ') || 'Affairs'}</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-3">{t('currentAffairsDesc')}</p>

        {/* Live badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span className="text-xs font-semibold text-green-700 dark:text-green-400">Updated Daily</span>
          <span className="text-xs text-green-600 dark:text-green-500">|</span>
          <span className="text-xs text-green-600 dark:text-green-500">{sortedArticles.length} articles</span>
        </div>
      </motion.div>

      {/* ─── Daily Digest ───────────────────────────────────────────────── */}
      {dailyDigest.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 bg-gradient-to-br from-teal-500/10 via-cyan-500/5 to-blue-500/10 dark:from-teal-900/30 dark:via-cyan-900/20 dark:to-blue-900/30 border border-teal-200/60 dark:border-teal-800/40 rounded-2xl p-6 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md">
              <FiBookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t('dailyDigest')}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Today's top stories for exam aspirants</p>
            </div>
            <div className="ml-auto hidden sm:flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 font-medium">
              <FiCalendar className="w-3.5 h-3.5" />
              {formatDate(new Date().toISOString().split('T')[0])}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dailyDigest.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.15 + idx * 0.05 }}
                className={`flex gap-3 p-3 bg-white/70 dark:bg-gray-800/70 rounded-xl border border-gray-100 dark:border-gray-700/50 hover:border-teal-300 dark:hover:border-teal-700 transition-all cursor-pointer ${idx === 0 ? 'md:col-span-2' : ''}`}
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              >
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${categoryBadgeColors[item.category] || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                      {item.category}
                    </span>
                    {idx === 0 && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                        TOP STORY
                      </span>
                    )}
                  </div>
                  <h3 className={`font-semibold text-gray-900 dark:text-gray-100 ${idx === 0 ? 'text-sm' : 'text-xs'} line-clamp-2 leading-snug`}>
                    {item.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ─── Search ─────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="max-w-2xl mx-auto mb-6"
      >
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchCurrentAffairs')}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none shadow-sm"
          />
        </div>
      </motion.div>

      {/* ─── Category Tabs ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-thin"
      >
        {categoryList.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count = categoryCounts[cat] || 0;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                isSelected
                  ? `bg-gradient-to-r ${categoryGradients[cat] || 'from-teal-500 to-cyan-600'} text-white shadow-lg`
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-teal-400 hover:text-teal-600 dark:hover:text-teal-400 hover:shadow-md'
              }`}
            >
              {cat}
              <span className={`text-xs px-1.5 py-0.5 rounded-md font-semibold ${
                isSelected
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* ─── Date Filter + Download ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="flex items-center justify-between mb-8 flex-wrap gap-3"
      >
        <div className="flex items-center gap-2">
          <FiClock className="w-4 h-4 text-gray-400" />
          <div className="flex gap-1.5">
            {dateFilters.map(df => (
              <button
                key={df}
                onClick={() => setDateFilter(df)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  dateFilter === df
                    ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border border-teal-300 dark:border-teal-700'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent'
                }`}
              >
                {df}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={handleWeeklyPdfDownload}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          <FiDownload className="w-4 h-4" /> Weekly Digest
        </button>
      </motion.div>

      {/* ─── Results Count ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing <span className="font-semibold text-gray-700 dark:text-gray-300">{filtered.length}</span> article{filtered.length !== 1 ? 's' : ''}
          {selectedCategory !== 'All' && <> in <span className="font-semibold text-gray-700 dark:text-gray-300">{selectedCategory}</span></>}
          {dateFilter !== 'All' && <> for <span className="font-semibold text-gray-700 dark:text-gray-300">{dateFilter.toLowerCase()}</span></>}
        </p>
      </div>

      {/* ─── Articles List ──────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <FiGlobe className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-2">No current affairs found matching your filters.</p>
          <button
            onClick={() => { setSelectedCategory('All'); setDateFilter('All'); setSearch(''); }}
            className="text-sm text-teal-600 dark:text-teal-400 font-medium hover:underline"
          >
            Clear all filters
          </button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, idx) => {
              const isTrending = trendingIds.includes(item.id);
              const isExpanded = expandedId === item.id;
              const relTime = getRelativeTime(item.date);
              const isToday = relTime === 'Today';

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.3) }}
                  className={`bg-white dark:bg-gray-800 rounded-2xl border overflow-hidden transition-all duration-200 ${
                    isToday
                      ? 'border-teal-200 dark:border-teal-800 shadow-md shadow-teal-500/5'
                      : 'border-gray-200 dark:border-gray-700'
                  } hover:shadow-lg hover:border-teal-300 dark:hover:border-teal-700`}
                >
                  <div
                    className="p-5 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Badges row */}
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold ${categoryBadgeColors[item.category] || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                            {item.category}
                          </span>

                          {isTrending && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 text-orange-600 dark:text-orange-400">
                              <FiTrendingUp className="w-3 h-3" /> TRENDING
                            </span>
                          )}

                          {isToday && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
                              NEW
                            </span>
                          )}

                          {item.source && (
                            <span className="text-xs text-teal-600 dark:text-teal-400 font-medium hidden sm:inline">
                              {item.source}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 leading-snug mb-2">
                          {item.title}
                        </h3>

                        {/* Date row */}
                        <div className="flex items-center gap-3 mb-2">
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <FiCalendar className="w-3 h-3" /> {formatDate(item.date)}
                          </span>
                          <span className={`text-xs font-medium ${
                            isToday ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400'
                          }`}>
                            {relTime}
                          </span>
                        </div>

                        {/* Preview (when collapsed) */}
                        {!isExpanded && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{item.content}</p>
                        )}

                        {/* Exam tags (always visible) */}
                        {!isExpanded && (
                          <div className="flex items-center gap-2 mt-3 flex-wrap">
                            <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Important for:</span>
                            {(item.examRelevance || ['UPSC', 'SSC', 'Banking']).slice(0, 4).map(tag => (
                              <span key={tag} className="px-2 py-0.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700 rounded-md text-[10px] text-gray-500 dark:text-gray-400 font-medium">{tag}</span>
                            ))}
                            {(item.examRelevance || []).length > 4 && (
                              <span className="text-[10px] text-gray-400">+{item.examRelevance.length - 4} more</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Expand/collapse indicator */}
                      <div className="flex-shrink-0 mt-1">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                          isExpanded
                            ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                        }`}>
                          {isExpanded ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {/* ─── Expanded Content ──────────────────────────────── */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{item.content}</p>

                            <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Important for:</span>
                                {(item.examRelevance || ['UPSC', 'SSC', 'Banking']).map(tag => (
                                  <span key={tag} className="px-2.5 py-1 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-xs text-gray-600 dark:text-gray-300 font-medium">{tag}</span>
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
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default CurrentAffairs;
