import api from './api';
import { examsData } from '../data/examsData';

// Client-side filtering/pagination over static data
function getStaticExams(params = {}) {
  let filtered = [...examsData];

  if (params.category) {
    filtered = filtered.filter(e => e.category === params.category);
  }

  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      (e.conductingBody && e.conductingBody.toLowerCase().includes(q)) ||
      (e.category && e.category.toLowerCase().includes(q))
    );
  }

  if (params.sort === '-createdAt') {
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  const page = params.page || 1;
  const limit = params.limit || 9;
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const start = (page - 1) * limit;
  const exams = filtered.slice(start, start + limit);

  return { exams, total, totalPages, page };
}

function getStaticExamById(id) {
  const exam = examsData.find(e => e._id === id);
  return exam ? { exam } : null;
}

export const getExams = async (params = {}) => {
  try {
    const response = await api.get('/exams', { params });
    const apiExams = response.data?.exams || response.data?.data;
    // Only use API data if it actually returned exams; otherwise use static data
    if (apiExams && apiExams.length > 0) {
      return response.data;
    }
    return getStaticExams(params);
  } catch {
    return getStaticExams(params);
  }
};

export const getExamById = async (id) => {
  try {
    const response = await api.get(`/exams/${id}`);
    const apiExam = response.data?.exam || response.data?.data;
    if (apiExam && (Array.isArray(apiExam) ? apiExam.length > 0 : true)) {
      return response.data;
    }
    return getStaticExamById(id);
  } catch {
    return getStaticExamById(id);
  }
};

export const createExam = async (data) => {
  const response = await api.post('/exams', data);
  return response.data;
};

export const updateExam = async (id, data) => {
  const response = await api.put(`/exams/${id}`, data);
  return response.data;
};

export const deleteExam = async (id) => {
  const response = await api.delete(`/exams/${id}`);
  return response.data;
};

export const bookmarkExam = async (id) => {
  const response = await api.post(`/exams/${id}/bookmark`);
  return response.data;
};

export const getBookmarks = async () => {
  const response = await api.get('/exams/user/bookmarks');
  return response.data;
};
