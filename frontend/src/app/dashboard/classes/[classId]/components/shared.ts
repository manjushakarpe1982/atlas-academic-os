// Shared data, types, and helpers for class detail page

export const WEIGHTS = [
  { label: 'Homework', pct: 25, color: '#6366f1' },
  { label: 'Labs', pct: 20, color: '#8b5cf6' },
  { label: 'Exams', pct: 40, color: '#ec4899' },
  { label: 'Participation', pct: 15, color: '#f59e0b' },
];

export const GRADE_HISTORY = [
  { id: '1', title: 'Quiz 1',  category: 'Quiz', date: 'May 10, 2026', score: 85,  max: 100 },
  { id: '2', title: 'Quiz 2',  category: 'Quiz', date: 'May 17, 2026', score: 92,  max: 100 },
  { id: '3', title: 'Exam 1',  category: 'Exam', date: 'May 28, 2026', score: 78,  max: 100 },
  { id: '4', title: 'Lab 1',   category: 'Lab',  date: 'Jun 2, 2026',  score: 90,  max: 100 },
];

export const PROGRESS_ITEMS = [
  { label: 'Classes', done: 32, total: 36 },
  { label: 'Assignments', done: 19, total: 22 },
  { label: 'Quizzes', done: 7, total: 8 },
  { label: 'Labs', done: 5, total: 6 },
];

export const CHAPTERS = [
  { num:1, title:'Introduction to Biology', done:true },
  { num:2, title:'Chemistry of Life', done:true },
  { num:3, title:'Cell Structure and Function', done:true },
  { num:4, title:'Cell Transport', done:true },
  { num:5, title:'Energy and Metabolism', done:true },
  { num:6, title:'Photosynthesis', done:true },
  { num:7, title:'Cell Division', done:false },
  { num:8, title:'Genetics', done:false },
];

export const UPCOMING = [
  { title:'Biology Quiz 1', date:'Tomorrow', priority:'High', icon:'❓', color:'bg-red-100' },
  { title:'Lab Report', date:'Sun, May 19', priority:'Medium', icon:'🧪', color:'bg-orange-100' },
  { title:'Chapter 4 Reading', date:'Wed, May 22', priority:'Low', icon:'📖', color:'bg-green-100' },
];

export const COMPLETED = [
  { title:'Homework 1', date:'May 1', icon:'📝' },
  { title:'Lab 1', date:'Apr 28', icon:'🧪' },
  { title:'Quiz 1', date:'Apr 30', icon:'❓' },
];

export const LATE = [{ title:'Homework 0', date:'Apr 10', icon:'📝' }];

export const PC: Record<string,string> = {
  High:'text-red-600 bg-red-50',
  Medium:'text-amber-600 bg-amber-50',
  Low:'text-green-600 bg-green-50',
};

export const CATEGORIES = ['Quiz', 'Exam', 'Homework', 'Lab', 'Project', 'Midterm', 'Final', 'Participation'];

export interface GradeItem {
  id: string; title: string; category: string; date: string; score: number; max: number;
}

export function getCategoryIcon(cat: string): string {
  const c = (cat || '').toLowerCase();
  if (c.includes('quiz')) return '❓';
  if (c.includes('exam') || c.includes('midterm') || c.includes('final')) return '📋';
  if (c.includes('lab')) return '🧪';
  if (c.includes('homework') || c.includes('hw')) return '📝';
  return '📄';
}

export function getCategoryColor(cat: string): string {
  const c = (cat || '').toLowerCase();
  if (c.includes('quiz')) return 'bg-blue-100';
  if (c.includes('exam')) return 'bg-red-100';
  if (c.includes('lab')) return 'bg-green-100';
  if (c.includes('homework')) return 'bg-indigo-100';
  return 'bg-gray-100';
}
