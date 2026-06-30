export interface CalEvent {
  id: string; title: string; type: string;
  className: string; classId: string; date: string;
  time: string; endTime: string; location: string;
  description: string; weight: number;
  currentGrade: number | null; source: string;
  date_note?: string;
}

export const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
export const FILTER_CHIPS = ['All','Quiz','Assignment','Exam','Study','Class'];

export function getEventsForDate(events: CalEvent[], year: number, month: number, day: number): CalEvent[] {
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return events.filter(e => e.date === dateStr);
}

export function getTypeBadge(type: string): { text: string; color: string } {
  switch(type) {
    case 'quiz':       return { text:'Quiz',       color:'text-purple-700 bg-purple-100' };
    case 'assignment': return { text:'Assignment', color:'text-green-700 bg-green-100' };
    case 'exam':       return { text:'Exam',       color:'text-red-700 bg-red-100' };
    case 'study':      return { text:'Study',      color:'text-indigo-700 bg-indigo-100' };
    case 'class':      return { text:'Class',      color:'text-blue-700 bg-blue-100' };
    default:           return { text:'Event',      color:'text-gray-700 bg-gray-100' };
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

export function getTypeDotColor(type: string): string {
  switch(type) {
    case 'quiz':       return 'bg-purple-500';
    case 'assignment': return 'bg-green-500';
    case 'exam':       return 'bg-red-500';
    case 'study':      return 'bg-indigo-500';
    case 'class':      return 'bg-blue-500';
    default:           return 'bg-gray-500';
  }
}

export function getTypeBgColor(type: string): string {
  switch(type) {
    case 'quiz':       return 'bg-purple-100';
    case 'assignment': return 'bg-green-100';
    case 'exam':       return 'bg-red-100';
    case 'study':      return 'bg-indigo-100';
    case 'class':      return 'bg-blue-100';
    default:           return 'bg-gray-100';
  }
}

export function getTypeTextColor(type: string): string {
  switch(type) {
    case 'quiz':       return 'text-purple-700';
    case 'assignment': return 'text-green-700';
    case 'exam':       return 'text-red-700';
    case 'study':      return 'text-indigo-700';
    case 'class':      return 'text-blue-700';
    default:           return 'text-gray-700';
  }
}

export function formatEventDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return dateStr; }
}
