import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiAlertTriangle, FiXCircle, FiSearch } from 'react-icons/fi';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import SEO from '../components/common/SEO';
import { useLanguage } from '../context/LanguageContext';

const eligibilityData = [
  { name: 'UPSC Civil Services (IAS/IPS)', category: 'UPSC', minAge: 21, maxAge: 32, ageSC: 37, ageOBC: 35, ageEWS: 32, qualification: 'Graduation', minQualLevel: 3, attempts: 'Gen: 6, OBC: 9, SC/ST: Unlimited', nationality: 'Indian citizen', physicalReq: 'Medical fitness required' },
  { name: 'SSC CGL', category: 'SSC', minAge: 18, maxAge: 32, ageSC: 37, ageOBC: 35, ageEWS: 32, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'SSC CHSL', category: 'SSC', minAge: 18, maxAge: 27, ageSC: 32, ageOBC: 30, ageEWS: 27, qualification: '12th', minQualLevel: 2, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'SSC MTS', category: 'SSC', minAge: 18, maxAge: 25, ageSC: 30, ageOBC: 28, ageEWS: 25, qualification: '10th', minQualLevel: 1, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'SSC GD Constable', category: 'SSC', minAge: 18, maxAge: 23, ageSC: 28, ageOBC: 26, ageEWS: 23, qualification: '10th', minQualLevel: 1, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'Height: 170cm(M)/157cm(F), Chest: 80cm(M)' },
  { name: 'IBPS PO', category: 'Banking', minAge: 20, maxAge: 30, ageSC: 35, ageOBC: 33, ageEWS: 30, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen / Nepal / Bhutan subjects', physicalReq: 'None' },
  { name: 'IBPS Clerk', category: 'Banking', minAge: 20, maxAge: 28, ageSC: 33, ageOBC: 31, ageEWS: 28, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'SBI PO', category: 'Banking', minAge: 21, maxAge: 30, ageSC: 35, ageOBC: 33, ageEWS: 30, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'SBI Clerk', category: 'Banking', minAge: 20, maxAge: 28, ageSC: 33, ageOBC: 31, ageEWS: 28, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'RBI Grade B', category: 'Banking', minAge: 21, maxAge: 30, ageSC: 35, ageOBC: 33, ageEWS: 30, qualification: 'Graduation (60%)', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'RRB NTPC (Graduate)', category: 'Railways', minAge: 18, maxAge: 33, ageSC: 38, ageOBC: 36, ageEWS: 33, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'Medical fitness, Vision standards' },
  { name: 'RRB NTPC (12th Level)', category: 'Railways', minAge: 18, maxAge: 30, ageSC: 35, ageOBC: 33, ageEWS: 30, qualification: '12th', minQualLevel: 2, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'Medical fitness' },
  { name: 'Railway Group D', category: 'Railways', minAge: 18, maxAge: 33, ageSC: 38, ageOBC: 36, ageEWS: 33, qualification: '10th', minQualLevel: 1, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'PET: 35kg lift(M)/20kg(F), 1000m run' },
  { name: 'CDS (Combined Defence Services)', category: 'Defence', minAge: 19, maxAge: 25, ageSC: 25, ageOBC: 25, ageEWS: 25, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen (unmarried)', physicalReq: 'Strict medical & physical standards' },
  { name: 'NDA (National Defence Academy)', category: 'Defence', minAge: 16, maxAge: 19, ageSC: 19, ageOBC: 19, ageEWS: 19, qualification: '12th', minQualLevel: 2, attempts: 'No limit (within age)', nationality: 'Indian citizen (unmarried)', physicalReq: 'Strict physical & medical standards, SSB' },
  { name: 'AFCAT', category: 'Defence', minAge: 20, maxAge: 26, ageSC: 26, ageOBC: 26, ageEWS: 26, qualification: 'Graduation (60%)', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'Strict medical standards, AFSB' },
  { name: 'Indian Army Soldier GD', category: 'Defence', minAge: 17, maxAge: 21, ageSC: 21, ageOBC: 21, ageEWS: 21, qualification: '10th', minQualLevel: 1, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: '1600m run (5 min 30 sec), Pull-ups, Balance' },
  { name: 'CTET (Central Teacher)', category: 'Teaching', minAge: 18, maxAge: 65, ageSC: 65, ageOBC: 65, ageEWS: 65, qualification: 'Graduation + B.Ed/D.El.Ed', minQualLevel: 3, attempts: 'No limit', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'UGC NET (JRF & Asst Prof)', category: 'Teaching', minAge: 18, maxAge: 65, ageSC: 65, ageOBC: 65, ageEWS: 65, qualification: 'Post Graduation (55%)', minQualLevel: 4, attempts: 'No limit (JRF age: 31)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'KVS TGT/PGT', category: 'Teaching', minAge: 21, maxAge: 40, ageSC: 45, ageOBC: 43, ageEWS: 40, qualification: 'Graduation + B.Ed', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'State PSC (PCS)', category: 'State PSC', minAge: 21, maxAge: 40, ageSC: 45, ageOBC: 43, ageEWS: 40, qualification: 'Graduation', minQualLevel: 3, attempts: 'Varies by state', nationality: 'Indian citizen + State domicile', physicalReq: 'Medical fitness for some posts' },
  { name: 'UPPSC PCS', category: 'State PSC', minAge: 21, maxAge: 40, ageSC: 45, ageOBC: 43, ageEWS: 40, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen + UP domicile', physicalReq: 'None' },
  { name: 'SSC CPO (Sub-Inspector)', category: 'Police', minAge: 20, maxAge: 25, ageSC: 30, ageOBC: 28, ageEWS: 25, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'Height: 170cm(M)/157cm(F), PET required' },
  { name: 'Delhi Police SI', category: 'Police', minAge: 20, maxAge: 25, ageSC: 30, ageOBC: 28, ageEWS: 25, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'Height, Chest, PET required' },
  { name: 'Delhi Police Constable', category: 'Police', minAge: 18, maxAge: 25, ageSC: 30, ageOBC: 28, ageEWS: 25, qualification: '12th', minQualLevel: 2, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'Height: 170cm(M)/157cm(F), 1600m run' },
  { name: 'State Police Constable', category: 'Police', minAge: 18, maxAge: 25, ageSC: 30, ageOBC: 28, ageEWS: 25, qualification: '10th/12th (varies)', minQualLevel: 1, attempts: 'No limit (within age)', nationality: 'Indian citizen + State domicile', physicalReq: 'PET: Running, Long Jump, Shot Put' },
  { name: 'LIC AAO', category: 'Insurance', minAge: 21, maxAge: 30, ageSC: 35, ageOBC: 33, ageEWS: 30, qualification: 'Graduation (60%)', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'NIACL AO', category: 'Insurance', minAge: 21, maxAge: 30, ageSC: 35, ageOBC: 33, ageEWS: 30, qualification: 'Graduation (60%)', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'UIIC AO', category: 'Insurance', minAge: 21, maxAge: 30, ageSC: 35, ageOBC: 33, ageEWS: 30, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'GATE (PSU Recruitment)', category: 'Miscellaneous', minAge: 0, maxAge: 99, ageSC: 99, ageOBC: 99, ageEWS: 99, qualification: 'B.E./B.Tech/M.Sc', minQualLevel: 3, attempts: 'No limit', nationality: 'Indian citizen / Foreign nationals', physicalReq: 'None' },
  { name: 'UPSC EPFO (EO/AO)', category: 'UPSC', minAge: 21, maxAge: 30, ageSC: 35, ageOBC: 33, ageEWS: 30, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'UPSC ESE (Engineering)', category: 'UPSC', minAge: 21, maxAge: 30, ageSC: 35, ageOBC: 33, ageEWS: 30, qualification: 'B.E./B.Tech', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'UPSC CMS (Medical)', category: 'UPSC', minAge: 21, maxAge: 32, ageSC: 37, ageOBC: 35, ageEWS: 32, qualification: 'MBBS', minQualLevel: 4, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'Medical fitness' },
  { name: 'SEBI Grade A', category: 'Banking', minAge: 21, maxAge: 30, ageSC: 35, ageOBC: 33, ageEWS: 30, qualification: 'Graduation (60%)', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'NABARD Grade A', category: 'Banking', minAge: 21, maxAge: 30, ageSC: 35, ageOBC: 33, ageEWS: 30, qualification: 'Graduation (60%)', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'IBPS RRB PO', category: 'Banking', minAge: 18, maxAge: 30, ageSC: 35, ageOBC: 33, ageEWS: 30, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'IBPS SO (Specialist)', category: 'Banking', minAge: 20, maxAge: 30, ageSC: 35, ageOBC: 33, ageEWS: 30, qualification: 'Graduation/PG in specialization', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'RPF Constable', category: 'Police', minAge: 18, maxAge: 25, ageSC: 30, ageOBC: 28, ageEWS: 25, qualification: '10th', minQualLevel: 1, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'PET: 1600m run, Long Jump, High Jump' },
  { name: 'RPF Sub-Inspector', category: 'Police', minAge: 20, maxAge: 25, ageSC: 30, ageOBC: 28, ageEWS: 25, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'PET: 1600m run, Long Jump, High Jump' },
  { name: 'IB ACIO (Intelligence)', category: 'Police', minAge: 18, maxAge: 27, ageSC: 32, ageOBC: 30, ageEWS: 27, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'DSSSB TGT (Delhi)', category: 'Teaching', minAge: 18, maxAge: 32, ageSC: 37, ageOBC: 35, ageEWS: 32, qualification: 'Graduation + B.Ed + CTET', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'SUPER TET (UP)', category: 'Teaching', minAge: 21, maxAge: 40, ageSC: 45, ageOBC: 43, ageEWS: 40, qualification: 'Graduation + B.Ed + CTET/UPTET', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen + UP domicile', physicalReq: 'None' },
  { name: 'ESIC UDC', category: 'Insurance', minAge: 18, maxAge: 27, ageSC: 32, ageOBC: 30, ageEWS: 27, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'Indian Coast Guard', category: 'Defence', minAge: 18, maxAge: 22, ageSC: 22, ageOBC: 22, ageEWS: 22, qualification: '10th/12th/Diploma', minQualLevel: 1, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'PFT mandatory, Vision standards' },
  { name: 'SSC JE (Engineering)', category: 'SSC', minAge: 18, maxAge: 32, ageSC: 37, ageOBC: 35, ageEWS: 32, qualification: 'Diploma/Degree in Engineering', minQualLevel: 2, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'SSC Stenographer', category: 'SSC', minAge: 18, maxAge: 30, ageSC: 35, ageOBC: 33, ageEWS: 30, qualification: '12th', minQualLevel: 2, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'Stenography skill test (80/100 wpm)' },
  { name: 'TNPSC Group 1', category: 'State PSC', minAge: 21, maxAge: 32, ageSC: 37, ageOBC: 35, ageEWS: 32, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'TNPSC Group 2', category: 'State PSC', minAge: 21, maxAge: 32, ageSC: 37, ageOBC: 35, ageEWS: 32, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'TNPSC Group 4', category: 'State PSC', minAge: 18, maxAge: 32, ageSC: 37, ageOBC: 35, ageEWS: 32, qualification: '10th/Graduation (post-wise)', minQualLevel: 1, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'MPSC Rajyaseva', category: 'State PSC', minAge: 19, maxAge: 38, ageSC: 43, ageOBC: 41, ageEWS: 38, qualification: 'Graduation + Marathi', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'MPSC Group B (PSI/STI/ASO)', category: 'State PSC', minAge: 19, maxAge: 38, ageSC: 43, ageOBC: 41, ageEWS: 38, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'Physical test for PSI post' },
  { name: 'NEET PG', category: 'Healthcare', minAge: 0, maxAge: 99, ageSC: 99, ageOBC: 99, ageEWS: 99, qualification: 'MBBS with internship', minQualLevel: 4, attempts: 'No limit', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'MAHA TET', category: 'Teaching', minAge: 18, maxAge: 40, ageSC: 45, ageOBC: 43, ageEWS: 40, qualification: 'Graduation + B.Ed/D.El.Ed', minQualLevel: 3, attempts: 'No limit', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'BARC Scientific Officer', category: 'PSU', minAge: 21, maxAge: 26, ageSC: 31, ageOBC: 29, ageEWS: 26, qualification: 'B.E./B.Tech (60%) or M.Sc (60%)', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'BEL Engineer', category: 'PSU', minAge: 21, maxAge: 25, ageSC: 30, ageOBC: 28, ageEWS: 25, qualification: 'B.E./B.Tech (60%)', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'NPCIL Executive Trainee', category: 'PSU', minAge: 21, maxAge: 26, ageSC: 31, ageOBC: 29, ageEWS: 26, qualification: 'B.E./B.Tech (60%) + GATE', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'Medical fitness' },
  { name: 'WB Police Constable', category: 'Police', minAge: 18, maxAge: 27, ageSC: 32, ageOBC: 30, ageEWS: 27, qualification: '10th (Madhyamik)', minQualLevel: 1, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'Height, Chest, PET required' },
  // Police SI (State)
  { name: 'UP Police Sub-Inspector', category: 'Police', minAge: 21, maxAge: 28, ageSC: 33, ageOBC: 31, ageEWS: 28, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen + UP domicile', physicalReq: 'Height, PET required' },
  { name: 'Rajasthan Police SI', category: 'Police', minAge: 18, maxAge: 25, ageSC: 30, ageOBC: 28, ageEWS: 25, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen + RJ domicile', physicalReq: 'PET required' },
  { name: 'Bihar Police SI', category: 'Police', minAge: 20, maxAge: 37, ageSC: 40, ageOBC: 40, ageEWS: 37, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen + Bihar domicile', physicalReq: 'PET required' },
  { name: 'MP Police Sub-Inspector', category: 'Police', minAge: 21, maxAge: 28, ageSC: 33, ageOBC: 31, ageEWS: 28, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen + MP domicile', physicalReq: 'PET required' },
  { name: 'Odisha Police SI', category: 'Police', minAge: 21, maxAge: 25, ageSC: 30, ageOBC: 28, ageEWS: 25, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen + Odisha domicile', physicalReq: 'PET required' },
  // Defence (Paramilitary)
  { name: 'BSF Head Constable Ministerial', category: 'Defence', minAge: 18, maxAge: 25, ageSC: 30, ageOBC: 28, ageEWS: 25, qualification: '12th', minQualLevel: 2, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'Medical fitness required' },
  { name: 'ITBP Constable (GD)', category: 'Defence', minAge: 18, maxAge: 23, ageSC: 28, ageOBC: 26, ageEWS: 23, qualification: '10th', minQualLevel: 1, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'PET: Height 170cm(M)/157cm(F), Running' },
  { name: 'CRPF Constable (GD)', category: 'Defence', minAge: 18, maxAge: 23, ageSC: 28, ageOBC: 26, ageEWS: 23, qualification: '10th', minQualLevel: 1, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'PET required: Running, long jump, high jump' },
  { name: 'Army JAG Entry (Law)', category: 'Defence', minAge: 21, maxAge: 27, ageSC: 27, ageOBC: 27, ageEWS: 27, qualification: 'LLB (55%)', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'SSB Interview, strict medical' },
  { name: 'Indian Navy SSC Officer', category: 'Defence', minAge: 19, maxAge: 25, ageSC: 25, ageOBC: 25, ageEWS: 25, qualification: 'B.E./B.Tech (60%)', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen (unmarried)', physicalReq: 'SSB Interview, strict medical & vision' },
  // PSU (new entries)
  { name: 'ISRO Scientist/Engineer SC', category: 'PSU', minAge: 22, maxAge: 35, ageSC: 40, ageOBC: 38, ageEWS: 35, qualification: 'B.E./B.Tech (65%)', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'Medical fitness' },
  { name: 'HAL Management Trainee', category: 'PSU', minAge: 21, maxAge: 28, ageSC: 33, ageOBC: 31, ageEWS: 28, qualification: 'B.E./B.Tech (60%)', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'NHPC Executive Trainee', category: 'PSU', minAge: 21, maxAge: 28, ageSC: 33, ageOBC: 31, ageEWS: 28, qualification: 'B.E./B.Tech (60%) + GATE', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'Medical fitness' },
  { name: 'GAIL Management Trainee', category: 'PSU', minAge: 21, maxAge: 28, ageSC: 33, ageOBC: 31, ageEWS: 28, qualification: 'B.E./B.Tech (65%) + GATE', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'Medical fitness' },
  { name: 'HPCL Officer (Engineering)', category: 'PSU', minAge: 21, maxAge: 25, ageSC: 30, ageOBC: 28, ageEWS: 25, qualification: 'B.E./B.Tech (60%)', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'Medical fitness' },
  { name: 'ONGC Graduate Trainee', category: 'PSU', minAge: 21, maxAge: 30, ageSC: 35, ageOBC: 33, ageEWS: 30, qualification: 'B.E./B.Tech or M.Sc (60%)', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'Medical fitness' },
  // Banking (new)
  { name: 'SIDBI Grade A Officer', category: 'Banking', minAge: 21, maxAge: 28, ageSC: 33, ageOBC: 31, ageEWS: 28, qualification: 'Graduation (60%)', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'NABARD Assistant Manager', category: 'Banking', minAge: 21, maxAge: 30, ageSC: 35, ageOBC: 33, ageEWS: 30, qualification: 'Graduation (60%)', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  // Judiciary
  { name: 'Civil Judge (State Judiciary)', category: 'Judiciary', minAge: 22, maxAge: 35, ageSC: 40, ageOBC: 38, ageEWS: 35, qualification: 'LLB (45%)', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  // Miscellaneous
  { name: 'EPFO Enforcement Officer', category: 'Miscellaneous', minAge: 21, maxAge: 30, ageSC: 35, ageOBC: 33, ageEWS: 30, qualification: 'Graduation', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'FCI Junior Engineer', category: 'Miscellaneous', minAge: 18, maxAge: 28, ageSC: 33, ageOBC: 31, ageEWS: 28, qualification: 'Diploma/B.E./B.Tech', minQualLevel: 2, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
  { name: 'DRDO Junior Research Fellow', category: 'PSU', minAge: 21, maxAge: 28, ageSC: 33, ageOBC: 31, ageEWS: 28, qualification: 'B.E./B.Tech or M.Sc (65%)', minQualLevel: 3, attempts: 'No limit (within age)', nationality: 'Indian citizen', physicalReq: 'None' },
];

const qualLevelMap = { '10th': 1, '12th': 2, Diploma: 2, 'Graduation': 3, 'Post Graduation': 4 };

const EligibilityChecker = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState({ age: '', qualification: '', category: 'General' });
  const [results, setResults] = useState(null);
  const [checked, setChecked] = useState(false);
  const [showAllNotEligible, setShowAllNotEligible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const age = parseInt(form.age);
    if (isNaN(age) || age < 14 || age > 60) return;

    const userQualLevel = qualLevelMap[form.qualification] || 0;
    const cat = form.category;

    const eligible = [];
    const almostEligible = [];
    const notEligible = [];

    eligibilityData.forEach((exam) => {
      const maxAge = cat === 'SC' || cat === 'ST' ? exam.ageSC : cat === 'OBC' ? exam.ageOBC : cat === 'EWS' ? (exam.ageEWS || exam.maxAge) : exam.maxAge;
      const qualMet = userQualLevel >= exam.minQualLevel;
      const ageMet = age >= exam.minAge && age <= maxAge;
      const ageAlmost = age >= exam.minAge - 1 && age <= maxAge + 2;

      const details = {
        ageRange: `${exam.minAge}-${maxAge} years`,
        attempts: exam.attempts || 'No limit',
        nationality: exam.nationality || 'Indian citizen',
        relaxation: cat === 'SC' || cat === 'ST' ? '+5 years' : cat === 'OBC' ? '+3 years' : cat === 'EWS' ? 'No relaxation' : 'N/A',
      };

      if (qualMet && ageMet) {
        eligible.push({ ...exam, ...details, reason: `Age ${age} within ${exam.minAge}-${maxAge} years, ${form.qualification} meets ${exam.qualification} requirement` });
      } else if (qualMet && ageAlmost && !ageMet) {
        const reason = age > maxAge ? `You are ${age - maxAge} year(s) above the max age (${maxAge})` : `You are ${exam.minAge - age} year(s) below minimum age (${exam.minAge})`;
        almostEligible.push({ ...exam, ...details, reason });
      } else if (!qualMet && ageMet) {
        almostEligible.push({ ...exam, ...details, reason: `Age eligible, but requires ${exam.qualification} (you have ${form.qualification})` });
      } else {
        const reasons = [];
        if (!qualMet) reasons.push(`Requires ${exam.qualification}`);
        if (!ageMet) reasons.push(`Age limit: ${exam.minAge}-${maxAge} years`);
        notEligible.push({ ...exam, ...details, reason: reasons.join('. ') });
      }
    });

    setResults({ eligible, almostEligible, notEligible });
    setChecked(true);
  };

  const categoryBadgeColors = {
    UPSC: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    SSC: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    Banking: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    Railways: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    Defence: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'State PSC': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    Teaching: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    Police: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    Insurance: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO title="Eligibility Checker" path="/eligibility-checker" description="Instantly check which government exams you're eligible for based on your age, education, and category. Covers UPSC, SSC, Banking, Railways, Defence, and more." />
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/25">
          <FiCheckCircle className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
          {t('eligTitle')} <span className="gradient-text">{t('eligTitleHighlight')}</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400">{t('eligCheckerDesc')}</p>
      </div>

      {/* Form */}
      <div className="max-w-xl mx-auto mb-10">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 shadow-lg">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('eligYourAge')}</label>
              <input
                type="number"
                min="14"
                max="60"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                placeholder={t('eligEnterAge')}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('eligHighestQual')}</label>
              <select
                value={form.qualification}
                onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="">{t('eligSelectQual')}</option>
                <option value="10th">{t('eligQual10')}</option>
                <option value="12th">{t('eligQual12')}</option>
                <option value="Diploma">{t('eligQualDiploma')}</option>
                <option value="Graduation">{t('eligQualGrad')}</option>
                <option value="Post Graduation">{t('eligQualPG')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t('eligCatLabel')}</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="General">{t('eligCatGeneral')}</option>
                <option value="EWS">{t('eligCatEWS')}</option>
                <option value="OBC">{t('eligCatOBC')}</option>
                <option value="SC">{t('eligCatSC')}</option>
                <option value="ST">{t('eligCatST')}</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25 flex items-center justify-center gap-2"
            >
              <FiSearch className="w-5 h-5" /> {t('eligCheckBtn')}
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {checked && results && (
        <div className="space-y-8">
          {/* Summary Banner */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
              {t('eligResultsFor')} {form.age}, {form.qualification}, {form.category}
            </h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm">
                <p className="text-2xl font-extrabold text-green-600">{results.eligible.length}</p>
                <p className="text-xs text-gray-500 mt-1">{t('eligEligibleLabel')}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm">
                <p className="text-2xl font-extrabold text-yellow-600">{results.almostEligible.length}</p>
                <p className="text-xs text-gray-500 mt-1">{t('eligAlmostLabel')}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm">
                <p className="text-2xl font-extrabold text-gray-400">{results.notEligible.length}</p>
                <p className="text-xs text-gray-500 mt-1">{t('eligNotEligibleLabel')}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
              {t('eligOutOf')} {eligibilityData.length} {t('eligExamsChecked')}, <strong className="text-green-600">{results.eligible.length}</strong> {t('eligExamsLabel')}.
            </p>

            {/* Donut Chart */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 text-center">Eligibility Breakdown</p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Eligible', value: results.eligible.length },
                      { name: 'Almost Eligible', value: results.almostEligible.length },
                      { name: 'Not Eligible', value: results.notEligible.length },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    <Cell fill="#22c55e" />
                    <Cell fill="#eab308" />
                    <Cell fill="#d1d5db" />
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} exams`, name]} />
                  <Legend iconType="circle" iconSize={10} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Eligible */}
          {results.eligible.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FiCheckCircle className="w-6 h-6 text-green-500" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {t('eligEligibleLabel')} ({results.eligible.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.eligible.map((exam, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border-2 border-green-200 dark:border-green-800 p-5 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{exam.name}</h3>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${categoryBadgeColors[exam.category] || 'bg-gray-100 text-gray-600'}`}>{exam.category}</span>
                    </div>
                    <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1.5">
                      <FiCheckCircle className="w-4 h-4 flex-shrink-0" /> {exam.reason}
                    </p>
                    <div className="mt-3 space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded text-green-700 dark:text-green-400">{t('eligAgeLabel')}: {exam.ageRange}</span>
                        <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded text-blue-700 dark:text-blue-400">{t('eligQualLabel')}: {exam.qualification}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded">{t('eligAttemptsLabel')}: {exam.attempts}</span>
                        <span className="px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded">{t('eligNationalityLabel')}: {exam.nationality}</span>
                      </div>
                      {form.category !== 'General' && (
                        <div className="px-2 py-1 bg-orange-50 dark:bg-orange-900/20 rounded text-orange-700 dark:text-orange-400 inline-block">
                          {form.category} {t('eligRelaxationLabel')}: {exam.relaxation}
                        </div>
                      )}
                      {exam.physicalReq && exam.physicalReq !== 'None' && (
                        <div className="px-2 py-1 bg-red-50 dark:bg-red-900/20 rounded text-red-700 dark:text-red-400 inline-block">
                          {t('eligPhysicalLabel')}: {exam.physicalReq}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Almost Eligible */}
          {results.almostEligible.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FiAlertTriangle className="w-6 h-6 text-yellow-500" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {t('eligAlmostLabel')} ({results.almostEligible.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.almostEligible.map((exam, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border-2 border-yellow-200 dark:border-yellow-800 p-5 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{exam.name}</h3>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${categoryBadgeColors[exam.category] || 'bg-gray-100 text-gray-600'}`}>{exam.category}</span>
                    </div>
                    <p className="text-sm text-yellow-600 dark:text-yellow-400 flex items-center gap-1.5">
                      <FiAlertTriangle className="w-4 h-4 flex-shrink-0" /> {exam.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Not Eligible */}
          {results.notEligible.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FiXCircle className="w-6 h-6 text-gray-400" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {t('eligNotEligibleLabel')} ({results.notEligible.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(showAllNotEligible ? results.notEligible : results.notEligible.slice(0, 6)).map((exam, i) => (
                  <div key={i} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-5 opacity-70">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-700 dark:text-gray-300">{exam.name}</h3>
                      <span className="px-2 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500">{exam.category}</span>
                    </div>
                    <p className="text-sm text-gray-500 flex items-center gap-1.5">
                      <FiXCircle className="w-4 h-4 flex-shrink-0" /> {exam.reason}
                    </p>
                  </div>
                ))}
              </div>
              {results.notEligible.length > 6 && (
                <button
                  onClick={() => setShowAllNotEligible(!showAllNotEligible)}
                  className="mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  {showAllNotEligible ? t('eligShowLess') : `${t('eligShowAllBtn')} ${results.notEligible.length} ${t('eligNotEligibleExams')}`}
                </button>
              )}
            </div>
          )}

          {/* CTA */}
          <div className="text-center pt-6">
            <Link to="/ai-guide" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all">
              {t('eligGetRecommend')}
            </Link>
          </div>
        </div>
      )}

      {/* Informational Content Section */}
      <div className="mt-16 space-y-10">
        {/* Main Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">
            {t('eligUnderstandingTitle')}
          </h2>
          <div className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4 leading-relaxed">
            <p>
              Every year, millions of aspirants across India prepare for government examinations conducted by bodies such as UPSC, SSC, IBPS, RRB, and various State Public Service Commissions. Before investing months or even years of dedicated preparation, the very first step every candidate must take is verifying whether they meet the eligibility requirements for their target exam. Eligibility criteria act as the gateway: no matter how well you prepare, failing to meet even one criterion can disqualify your application entirely.
            </p>
            <p>
              Government exam eligibility in India rests on three fundamental pillars: <strong>age limits</strong>, <strong>educational qualifications</strong>, and <strong>category or nationality requirements</strong>. Each recruiting organization sets its own specific thresholds for these three parameters, and they can vary significantly even between exams conducted by the same body. For instance, SSC CGL and SSC CHSL are both conducted by the Staff Selection Commission, yet they have different age upper limits and different minimum qualification requirements.
            </p>
            <p>
              Age limits define the minimum and maximum age a candidate must fall within on a specified cut-off date, usually the closing date of the application window. Educational qualification refers to the minimum academic degree or certificate a candidate must hold, such as a 10th pass certificate, a 12th pass certificate, a bachelor's degree, or a post-graduate degree. Category and nationality requirements determine whether reservation-based age relaxations apply and whether the candidate holds the correct citizenship or domicile status. Understanding the interplay between these three pillars is essential because relaxations in one area, such as age, are often tied to the candidate's category.
            </p>
            <p>
              Our eligibility checker tool above cross-references your age, highest qualification, and category against the official requirements of over 50 major government exams. It instantly tells you which exams you are fully eligible for, which ones you are close to qualifying for, and which ones fall outside your current eligibility window. This saves you hours of manual research and helps you build a focused preparation strategy around exams you can actually apply for.
            </p>
          </div>
        </div>

        {/* Age Limits Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-10">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {t('eligAgeLimitsTitle')}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            Age limits are one of the most critical eligibility factors because, unlike educational qualifications which you can acquire over time, age is a diminishing resource. Missing the age window for an exam means permanent disqualification for that particular recruitment cycle. Below is a comparative overview of the general category age limits for the five major exam sectors. Note that these are base limits for unreserved candidates; relaxations for reserved categories are discussed in the next section.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">{t('eligExamSector')}</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">{t('eligRepExam')}</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">{t('eligMinAge')}</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">{t('eligMaxAgeGen')}</th>
                  <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider text-xs">{t('eligKeyNotes')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-4 py-3 font-medium text-purple-700 dark:text-purple-400">UPSC</td>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-200">Civil Services (IAS/IPS)</td>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-200">21 years</td>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-200">32 years</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Age counted on August 1 of exam year; 6 attempts for General</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-4 py-3 font-medium text-blue-700 dark:text-blue-400">SSC</td>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-200">SSC CHSL / SSC MTS</td>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-200">18 years</td>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-200">25-27 years</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Varies by post; SSC CGL allows up to 32 for certain posts</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-4 py-3 font-medium text-green-700 dark:text-green-400">Banking</td>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-200">IBPS PO / SBI PO</td>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-200">20 years</td>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-200">30 years</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Clerk posts may have 28 upper limit; RBI Grade B also 30</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-4 py-3 font-medium text-red-700 dark:text-red-400">Railways</td>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-200">RRB NTPC / Group D</td>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-200">18 years</td>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-200">33 years</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Among the most generous age limits in government exams</td>
                </tr>
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-4 py-3 font-medium text-amber-700 dark:text-amber-400">Defence</td>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-200">NDA / CDS / AFCAT</td>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-200">16-20 years</td>
                  <td className="px-4 py-3 text-gray-800 dark:text-gray-200">19-26 years</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">Strictest age limits; NDA requires candidates to be 16.5-19.5</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            The table above highlights a key strategic insight: if you are in your early twenties, the maximum number of exam options are open to you. As you cross 27, defence exams begin closing off, followed by many SSC posts. Banking and UPSC remain accessible into your early thirties, while railway exams offer the widest window up to 33 years for general category candidates.
          </p>
        </div>

        {/* Educational Qualification Requirements */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-10">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {t('eligEduQualTitle')}
          </h3>
          <div className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4 leading-relaxed">
            <p>
              Government exams in India are structured into four broad tiers based on the minimum educational qualification required. Each tier opens the door to a different set of job roles, salary brackets, and career trajectories. Understanding which tier you belong to helps you identify every exam you can currently apply for, and also shows you what additional qualifications you might pursue to unlock higher-tier opportunities.
            </p>
            <p>
              <strong>10th Pass (Matriculation):</strong> This is the entry-level tier and includes positions such as SSC MTS (Multi-Tasking Staff), SSC GD Constable, Railway Group D, RPF Constable, Indian Army Soldier GD, and various State Police Constable posts. These roles typically offer salaries in the range of Rs 18,000 to Rs 25,000 per month (before 7th Pay Commission benefits) and provide job security along with government benefits like pension, medical facilities, and housing allowance. Many candidates use these as stepping stones, preparing for higher-level exams while serving in these roles.
            </p>
            <p>
              <strong>12th Pass (Intermediate):</strong> Completing your 12th standard opens up exams like SSC CHSL (Combined Higher Secondary Level), RRB NTPC 12th-level posts, NDA (National Defence Academy), SSC Stenographer, and Delhi Police Constable. These positions generally offer better pay scales and more diverse job profiles compared to the 10th-pass tier. NDA is particularly notable because it provides a path to becoming a commissioned officer in the Indian Armed Forces through a prestigious training program.
            </p>
            <p>
              <strong>Graduation (Bachelor's Degree):</strong> A graduation degree unlocks the vast majority of competitive exams in India. This tier includes UPSC Civil Services, SSC CGL, all IBPS and SBI banking exams, RBI Grade B, SEBI Grade A, CDS, AFCAT, State PSC exams, SSC CPO (Sub-Inspector), LIC AAO, and many more. Importantly, for most of these exams, the specific discipline of your degree does not matter. Whether you hold a B.A., B.Sc., B.Com., or B.Tech., you are eligible. Some specialist posts like IBPS SO or UPSC ESE do require degrees in specific fields.
            </p>
            <p>
              <strong>Post Graduation (Master's Degree):</strong> A post-graduate qualification is mandatory for relatively fewer government exams, but it is required for important ones like UGC NET (for Junior Research Fellowship and Assistant Professorship), NEET PG (for medical post-graduation), and UPSC CMS. Some State PSC positions and university teaching roles also require a master's degree. Additionally, a post-graduate qualification can provide extra marks in exams that award bonus points for higher education.
            </p>
          </div>
        </div>

        {/* Age Relaxation Rules */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-10">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {t('eligAgeRelaxTitle')}
          </h3>
          <div className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4 leading-relaxed">
            <p>
              The Indian government provides age relaxations to candidates from various reserved categories and special backgrounds. These relaxations are designed to ensure equitable access to government employment for communities and groups that have historically faced socio-economic disadvantages. Age relaxation is added to the upper age limit, effectively extending the window during which a candidate can apply.
            </p>
            <p>
              <strong>SC/ST (Scheduled Caste / Scheduled Tribe) — 5 years relaxation:</strong> Candidates belonging to Scheduled Castes and Scheduled Tribes receive the most generous age relaxation of 5 years across virtually all central government exams. For example, if the upper age limit for UPSC Civil Services is 32 years for general candidates, an SC/ST candidate can apply up to the age of 37. This relaxation is consistent across UPSC, SSC, IBPS, RRB, and most state-level examinations. Candidates must possess a valid caste certificate issued by the competent authority to avail this benefit.
            </p>
            <p>
              <strong>OBC (Other Backward Classes) — 3 years relaxation:</strong> OBC candidates who fall under the non-creamy layer receive a 3-year relaxation in the upper age limit. Using the UPSC example, an OBC candidate can appear up to the age of 35. The non-creamy layer criterion is crucial: candidates whose family income exceeds the prescribed threshold (currently Rs 8 lakh per annum, though this is periodically revised) are not eligible for OBC reservation benefits. OBC certificates must be recently issued and in the format prescribed by the central government.
            </p>
            <p>
              <strong>PwBD (Persons with Benchmark Disabilities) — 10 years relaxation:</strong> Candidates with benchmark disabilities of 40% or more receive the highest age relaxation of 10 years. This substantial relaxation recognizes the additional challenges faced by persons with disabilities in the education system and during exam preparation. The relaxation is available over and above the category-based relaxation; thus, an SC/ST candidate with a disability can receive up to 15 years of total relaxation.
            </p>
            <p>
              <strong>Ex-Servicemen — varies (typically 3-5 years):</strong> Former members of the armed forces receive age relaxation that typically equals the length of their military service plus an additional 3 years. The exact formula varies by recruiting organization, but the general principle is to account for the years they spent serving the nation in the military. This ensures that ex-servicemen can transition to civilian government roles after completing their military tenure.
            </p>
            <p>
              <strong>J&K Domicile / Affected Areas:</strong> Candidates who were domiciled in the erstwhile state of Jammu and Kashmir during the period 1980-1989 receive a 5-year age relaxation in central government exams. Some exams also provide relaxations for candidates from areas affected by civil disturbance, such as certain districts in the northeastern states. These provisions are reviewed periodically and candidates should verify current applicability.
            </p>
          </div>
        </div>

        {/* Common Myths */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-10">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {t('eligMythsTitle')}
          </h3>
          <div className="prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-5 leading-relaxed">
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <p className="font-semibold text-red-700 dark:text-red-400 mb-1">Myth 1: "I am too old to appear for government exams."</p>
              <p>
                This is one of the most common misconceptions. While defence exams do have strict upper age limits in the early to mid-twenties, several major exams remain accessible well into your thirties. UPSC Civil Services allows general candidates up to age 32, with SC/ST candidates eligible up to age 37. Railway exams go up to 33 years (38 for SC/ST), and many State PSC exams permit applications up to age 40 or beyond. Teaching exams like CTET have virtually no upper age limit, allowing candidates up to age 65 to appear.
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <p className="font-semibold text-red-700 dark:text-red-400 mb-1">Myth 2: "Only candidates with specific degrees like B.A. or B.Sc. can apply."</p>
              <p>
                For the vast majority of government exams, the requirement is simply a bachelor's degree from a recognized university. Whether you studied arts, science, commerce, engineering, law, or any other discipline, you are equally eligible. Exams like UPSC Civil Services, SSC CGL, IBPS PO, SBI PO, and RRB NTPC do not restrict applicants by degree discipline. The only exams where specific degrees matter are specialist recruitment drives, such as IBPS Specialist Officers (which requires relevant degrees for IT, Law, or Agriculture roles) or UPSC ESE (which requires an engineering degree).
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <p className="font-semibold text-red-700 dark:text-red-400 mb-1">Myth 3: "I need to complete my degree before I can start preparing."</p>
              <p>
                While you must hold the required qualification at the time of applying (or by a specified date mentioned in the notification), you can and should start preparing well in advance. In fact, many UPSC toppers begin their preparation during the final year of graduation. For exams like SSC CGL, IBPS PO, and RRB NTPC, candidates appearing in their final year of graduation are often allowed to apply provisionally, subject to producing their degree certificate at the time of document verification.
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <p className="font-semibold text-red-700 dark:text-red-400 mb-1">Myth 4: "General category candidates have fewer opportunities."</p>
              <p>
                While reserved category candidates do receive age relaxations and reserved seats, the absolute number of vacancies available to general category candidates remains substantial. In SSC CGL, for example, thousands of vacancies are earmarked for the unreserved category every year. Moreover, general category candidates can also benefit from the EWS (Economically Weaker Sections) reservation if they meet the income criteria, which provides 10% reservation along with age relaxation in some exams. The key is to focus on preparation quality rather than worrying about category-based competition ratios.
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <p className="font-semibold text-red-700 dark:text-red-400 mb-1">Myth 5: "Percentage or marks in degree affect eligibility for all exams."</p>
              <p>
                Most government exams, including UPSC Civil Services, SSC CGL, SSC CHSL, IBPS PO, IBPS Clerk, and RRB NTPC, do not prescribe a minimum percentage in your qualifying degree. As long as you hold a valid degree from a recognized university, you are eligible regardless of whether you scored 50% or 90%. However, a few exams do specify minimum percentage requirements: RBI Grade B typically requires 60% in graduation, SEBI Grade A requires 60%, and certain PSU recruitment through GATE may require a minimum CGPA. Always check the specific exam notification to confirm whether a percentage threshold applies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EligibilityChecker;
