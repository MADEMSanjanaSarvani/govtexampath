import api from './api';
import { examsData } from '../data/examsData';

// Check if an ID is a MongoDB ObjectId (24 hex chars)
function isMongoId(id) {
  return /^[a-f\d]{24}$/i.test(id);
}

// Local bookmark helpers for static exams
function getLocalBookmarks() {
  try {
    return JSON.parse(localStorage.getItem('staticBookmarks') || '[]');
  } catch {
    return [];
  }
}

function toggleLocalBookmark(id) {
  const bookmarks = getLocalBookmarks();
  const index = bookmarks.indexOf(id);
  if (index > -1) {
    bookmarks.splice(index, 1);
  } else {
    bookmarks.push(id);
  }
  localStorage.setItem('staticBookmarks', JSON.stringify(bookmarks));
  return { success: true, data: { bookmarks } };
}

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

  // Mark locally bookmarked exams
  const localIds = getLocalBookmarks();
  const markedExams = exams.map(e => localIds.includes(e._id) ? { ...e, isBookmarked: true } : e);

  return { exams: markedExams, total, totalPages, page };
}

function getStaticExamById(id) {
  const exam = examsData.find(e => e._id === id);
  if (!exam) return null;
  const localIds = getLocalBookmarks();
  return { exam: localIds.includes(id) ? { ...exam, isBookmarked: true } : exam };
}

export const getExams = async (params = {}) => {
  try {
    const response = await api.get('/exams', { params });
    // Backend returns { success, data: { exams: [...], pagination: {...} } }
    const nested = response.data?.data;
    const apiExams = nested?.exams || response.data?.exams;
    if (apiExams && apiExams.length > 0) {
      // Normalize to { exams, totalPages, total } for consuming pages
      return {
        exams: apiExams,
        totalPages: nested?.pagination?.pages || response.data?.totalPages || 1,
        total: nested?.pagination?.total || response.data?.total || apiExams.length,
      };
    }
    return getStaticExams(params);
  } catch {
    return getStaticExams(params);
  }
};

export const getExamById = async (id) => {
  try {
    const response = await api.get(`/exams/${id}`);
    // Backend returns { success, data: examObject }
    const exam = response.data?.data || response.data?.exam;
    if (exam && exam._id) {
      return { exam };
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
  if (!isMongoId(id)) {
    return toggleLocalBookmark(id);
  }
  const response = await api.post(`/exams/${id}/bookmark`);
  return response.data;
};

export const getBookmarks = async () => {
  // Fetch API bookmarks
  let apiBookmarks = [];
  try {
    const response = await api.get('/exams/user/bookmarks');
    const data = response.data;
    const list = data?.data || data?.exams || data;
    apiBookmarks = Array.isArray(list) ? list : [];
  } catch {
    // API unavailable
  }

  // Merge with local static bookmarks
  const localIds = getLocalBookmarks();
  const localExams = examsData
    .filter(e => localIds.includes(e._id))
    .map(e => ({ ...e, isBookmarked: true }));

  const allBookmarks = [...apiBookmarks.map(e => ({ ...e, isBookmarked: true })), ...localExams];
  return { exams: allBookmarks };
};
