export interface CalEvent {
  id: string; title: string; type: 'quiz' | 'assignment' | 'exam' | 'study' | 'class' | 'personal';
  className: string; date: number; month: string; time: string; endTime: string;
  location: string; description: string; weight: number; currentGrade: number | null;
  color: string; textColor: string;
}

export const EVENTS: CalEvent[] = [
  { id:'1', title:'Biology Quiz 1',       type:'quiz',       className:'Biology 1107',  date:16, month:'May', time:'10:00 AM', endTime:'11:00 AM', location:'Science Building, Room 304', description:'Covers Chapters 5, 6 & 7. Multiple choice (100 points).', weight:20, currentGrade:72, color:'bg-purple-100', textColor:'text-purple-700' },
  { id:'2', title:'Lab Report 3',          type:'assignment', className:'Biology 1107',  date:16, month:'May', time:'11:59 PM', endTime:'',         location:'',                          description:'Submit lab report on cellular respiration experiment.',    weight:10, currentGrade:72, color:'bg-green-100',  textColor:'text-green-700' },
  { id:'3', title:'Chemistry Quiz',        type:'quiz',       className:'Chemistry 101', date:17, month:'May', time:'9:30 AM',  endTime:'10:30 AM', location:'Chem Lab 201',              description:'Periodic table and chemical bonding quiz.',               weight:15, currentGrade:68, color:'bg-amber-100',  textColor:'text-amber-700' },
  { id:'4', title:'Chemistry Midterm',     type:'exam',       className:'Chemistry 101', date:22, month:'May', time:'9:00 AM',  endTime:'11:00 AM', location:'Main Hall',                 description:'Covers all chapters from weeks 1-8.',                     weight:30, currentGrade:68, color:'bg-red-100',    textColor:'text-red-600' },
  { id:'5', title:'Biology Lecture',       type:'class',      className:'Biology 1107',  date:16, month:'May', time:'12:00 PM', endTime:'1:00 PM',  location:'Science Building, Room 304', description:'Regular lecture session.',                                 weight:0,  currentGrade:null, color:'bg-blue-100', textColor:'text-blue-700' },
  { id:'6', title:'Study Session',         type:'study',      className:'Biology 1107',  date:17, month:'May', time:'3:00 PM',  endTime:'4:30 PM',  location:'Library',                   description:'Review inheritance patterns and practice questions.',      weight:0,  currentGrade:null, color:'bg-indigo-100', textColor:'text-indigo-700' },
  { id:'7', title:'Biology Midterm',       type:'exam',       className:'Biology 1107',  date:22, month:'May', time:'9:00 AM',  endTime:'11:00 AM', location:'Science Building, Room 304', description:'Covers all chapters from weeks 1-10.',                    weight:30, currentGrade:72, color:'bg-red-100',    textColor:'text-red-600' },
  { id:'8', title:'Personal Event',        type:'personal',   className:'',              date:18, month:'May', time:'6:00 PM',  endTime:'',         location:'',                          description:'Personal event.',                                          weight:0,  currentGrade:null, color:'bg-gray-100',   textColor:'text-gray-700' },
];

export const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
export const DATES: (number|null)[][] = [
  [27,28,29,30,1,2,3],
  [4,5,6,7,8,9,10],
  [11,12,13,14,15,16,17],
  [18,19,20,21,22,23,24],
  [25,26,27,28,29,30,31],
];

export const FILTER_CHIPS = ['All','Quiz','Assignment','Exam','Study','Class'];

export function getEventsForDate(d: number): CalEvent[] {
  return EVENTS.filter(e => e.date === d);
}

export function getTypeBadge(type: string): { text: string; color: string } {
  switch(type) {
    case 'quiz':       return { text:'Quiz',       color:'text-purple-700 bg-purple-100' };
    case 'assignment': return { text:'Assignment', color:'text-green-700 bg-green-100' };
    case 'exam':       return { text:'Exam',       color:'text-red-700 bg-red-100' };
    case 'study':      return { text:'Study',      color:'text-indigo-700 bg-indigo-100' };
    case 'class':      return { text:'Class',      color:'text-blue-700 bg-blue-100' };
    default:           return { text:'Personal',   color:'text-gray-700 bg-gray-100' };
  }
}

export function getTypeIcon(type: string): string {
  switch(type) {
    case 'quiz':       return '❓';
    case 'assignment': return '📝';
    case 'exam':       return '📋';
    case 'study':      return '📖';
    case 'class':      return '🏫';
    default:           return '📌';
  }
}
