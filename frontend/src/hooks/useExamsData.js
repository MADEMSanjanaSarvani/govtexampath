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
    api.get('/exams', { params: { limit: 200 } })
      .then((res) => {
        const nested = res.data?.data;
        const apiExams = nested?.exams || res.data?.exams;
        if (!cancelled && apiExams && apiExams.length > 0) {
          cachedApiExams = apiExams;
          setExams(apiExams);
          setIsFromApi(true);
        }
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, []);

  return { exams, isFromApi };
};

export default useExamsData;
