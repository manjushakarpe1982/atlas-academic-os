// Calendar shared data, types, and helpers

export const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
export const DATES = [
  [null,1,2,3,4,5,6],
  [7,8,9,10,11,12,13],
  [14,15,16,17,18,19,20],
  [21,22,23,24,25,26,27],
  [28,29,30,null,null,null,null],
];

export interface CalEvent {
  id: string; title: string; category: string; className: string;
  date: number; time: string; endTime: string; source: string;
  description: string; color: string; dotColor: string; textColor: string;
}

export const EVENTS: CalEvent[] = [
  { id:'1', title:'Quiz',        category:'Quiz',       className:'Bio 101',     date:4,  time:'9:00 AM',  endTime:'10:00 AM', source:'Canvas',         description:'Chapter 3 quiz covering cellular biology and organelle functions.', color:'bg-amber-100', dotColor:'bg-amber-500', textColor:'text-amber-700' },
  { id:'2', title:'Lab Report',  category:'Lab',        className:'Chem 101',    date:5,  time:'2:00 PM',  endTime:'3:00 PM',  source:'Canvas',         description:'Submit lab report on titration experiment from Week 3.', color:'bg-red-100', dotColor:'bg-red-500', textColor:'text-red-600' },
  { id:'3', title:'Reading',     category:'Assignment', className:'English 201', date:10, time:'',         endTime:'',         source:'Google Calendar', description:'Complete chapters 5-7 of The Great Gatsby.', color:'bg-green-100', dotColor:'bg-green-500', textColor:'text-green-700' },
  { id:'4', title:'Exam',        category:'Exam',       className:'Calc 251',    date:17, time:'9:00 AM',  endTime:'11:00 AM', source:'Canvas',         description:'Final exam for Calculus 251. Covers Chapters 1-12 including integrals and applications.', color:'bg-red-100', dotColor:'bg-red-500', textColor:'text-red-600' },
  { id:'5', title:'Essay',       category:'Assignment', className:'English 201', date:19, time:'11:59 PM', endTime:'',         source:'Google Calendar', description:'Submit 5-page literary analysis essay on symbolism in The Great Gatsby.', color:'bg-purple-100', dotColor:'bg-purple-500', textColor:'text-purple-700' },
  { id:'6', title:'Project',     category:'Project',    className:'Bio 101',     date:23, time:'',         endTime:'',         source:'Canvas',         description:'Group presentation on genetics and hereditary patterns.', color:'bg-blue-100', dotColor:'bg-blue-500', textColor:'text-blue-700' },
  { id:'7', title:'Quiz',        category:'Quiz',       className:'Physics 201', date:25, time:'9:30 PM',  endTime:'',         source:'Study Planner',  description:'Quiz on Newton\'s laws of motion and momentum.', color:'bg-amber-100', dotColor:'bg-amber-500', textColor:'text-amber-700' },
];

export const SOURCES = [
  { name: 'Canvas Calendar',        sub: 'Connected',           icon: '🎓', connected: true },
  { name: 'Google Calendar',        sub: 'Connected',           icon: '📅', connected: true },
  { name: 'Study Planner (Manual)', sub: 'Your Personal Events', icon: '📖', connected: true },
];

export function getEventsForDate(d: number): CalEvent[] {
  return EVENTS.filter(e => e.date === d);
}

export function getCategoryIcon(cat: string): string {
  const c = cat.toLowerCase();
  if (c.includes('quiz')) return '❓';
  if (c.includes('exam')) return '📋';
  if (c.includes('lab')) return '🧪';
  if (c.includes('project')) return '📊';
  return '📝';
}

export function getCatColor(cat: string): { bg: string; text: string } {
  const c = cat.toLowerCase();
  if (c.includes('exam')) return { bg: 'bg-red-100', text: 'text-red-600' };
  if (c.includes('quiz')) return { bg: 'bg-amber-100', text: 'text-amber-600' };
  if (c.includes('lab')) return { bg: 'bg-blue-100', text: 'text-blue-600' };
  if (c.includes('project')) return { bg: 'bg-blue-100', text: 'text-blue-600' };
  return { bg: 'bg-green-100', text: 'text-green-600' };
}
