import { useState, useEffect } from 'react';
import { examsData } from '../data/examsData';
import api from '../services/api';

let cachedApiExams = null;

const useExamsData = () => {
  const [exams, setExams] = useState(cachedApiExams || examsData);
  const [isFromApi, setIsFromApi] = useState(!!cachedApiExams);

  useEffect(() => {
    if (cachedApiExams) return;

    let cancelled = false;

    async function fetchAll() {
      try {
        const [activeRes, inactiveRes] = await Promise.all([
          api.get('/exams', { params: { limit: 300, active: 'true' } }),
          api.get('/exams', { params: { limit: 300, active: 'false' } }),
        ]);

        const activeExams = activeRes.data?.data?.exams || [];
        const inactiveExams = inactiveRes.data?.data?.exams || [];
        const allExams = [...activeExams, ...inactiveExams];

        if (!cancelled && allExams.length > 0) {
          cachedApiExams = allExams;
          setExams(allExams);
          setIsFromApi(true);
        }
      } catch {
        // Fallback to static data (already set as default)
      }
    }

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  return { exams, isFromApi };
};

export default useExamsData;
