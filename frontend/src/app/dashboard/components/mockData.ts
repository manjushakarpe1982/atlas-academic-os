export const CLASSES = [
  { id: '1', name: 'Biology 1107', sub: 'Life Sciences',     grade: 84, color: 'bg-green-500',  icon: '🌿', next: 'Quiz Tomorrow'          },
  { id: '2', name: 'Calculus 251', sub: 'Engineering Math',  grade: 90, color: 'bg-blue-500',   icon: 'fx', next: 'Homework Fri, May 17'   },
  { id: '3', name: 'Chemistry 101',sub: 'General Chemistry', grade: 76, color: 'bg-purple-500', icon: '⚗️', next: 'Lab Report Sun, May 19' },
  { id: '4', name: 'English 101',  sub: 'Composition 1',     grade: 88, color: 'bg-orange-500', icon: '📝', next: 'Essay Wed, May 22'       },
];

export const ASSIGNMENTS = [
  { id: '1', title: 'Biology Homework',     sub: 'Chapter 5 & 6',           due: 'May 14, 11:59 PM', priority: 'High',   status: 'pending',   class: 'Biology'   },
  { id: '2', title: 'Calculus Assignment 2',sub: 'Integration Problems',    due: 'May 17, 11:59 PM', priority: 'Medium', status: 'pending',   class: 'Calculus'  },
  { id: '3', title: 'Chemistry Lab Report', sub: 'Experiment Writeup',      due: 'May 19, 11:59 PM', priority: 'Medium', status: 'pending',   class: 'Chemistry' },
  { id: '4', title: 'English Essay 1',      sub: 'The Nature of Love',      due: 'May 8, 11:59 PM',  priority: 'Low',    status: 'completed', class: 'English'   },
];

export const QUIZZES = [
  { id: '1', title: 'Biology Quiz 1',   sub: 'Chapter 1 - Cell Structure', date: 'May 14, Tomorrow', score: 20, color: 'bg-green-500'  },
  { id: '2', title: 'Calculus Quiz 2',  sub: 'Derivatives',                date: 'May 21, Wed',      score: 15, color: 'bg-blue-500'   },
  { id: '3', title: 'Chemistry Quiz 1', sub: 'Atomic Structure',           date: 'May 24, Sat',      score: 15, color: 'bg-purple-500' },
];

export const STUDY_PLAN = [
  { day: 'Mon, May 13', sessions: [
    { class: 'Biology 1107',  mins: 45, done: true  },
    { class: 'Calculus 251',  mins: 30, done: true  },
  ]},
  { day: 'Tue, May 14', sessions: [
    { class: 'Chemistry 101', mins: 40, done: false },
    { class: 'English 101',   mins: 25, done: false },
  ]},
  { day: 'Wed, May 15', sessions: [
    { class: 'Biology 1107',  mins: 30, done: false },
    { class: 'CS 150',        mins: 40, done: false },
  ]},
];

export const NOTIFICATIONS = [
  { id: '1', title: 'Biology Quiz is tomorrow',       time: '9:00 AM',  type: 'warning',  when: 'Today'     },
  { id: '2', title: "Study reminder — don't forget to complete today's study plan.", time: '8:00 AM', type: 'info', when: 'Today' },
  { id: '3', title: 'New material added — Chapter 4 notes are now available.', time: '7:30 AM', type: 'success', when: 'Today' },
  { id: '4', title: 'Calculus Homework due soon — Due on Fri, May 17', time: 'Yesterday', type: 'warning', when: 'Yesterday' },
  { id: '5', title: 'Weekly goal achieved 🎉 — 10 study sessions this week.', time: 'Yesterday', type: 'success', when: 'Yesterday' },
];

export const STUDY_MATERIALS = [
  { id: '1', title: 'Notes',              sub: '12 Notes',       icon: '📄', color: 'bg-blue-100'   },
  { id: '2', title: 'Flashcards',         sub: '48 Cards',       icon: '🃏', color: 'bg-purple-100' },
  { id: '3', title: 'Practice Questions', sub: '120+ Questions', icon: '✏️', color: 'bg-green-100'  },
  { id: '4', title: 'Chapter Summaries',  sub: '8 Summaries',    icon: '📋', color: 'bg-orange-100' },
  { id: '5', title: 'Past Papers',        sub: '5 Papers',       icon: '📁', color: 'bg-pink-100'   },
];

export const CALENDAR_EVENTS = [
  { date: '2024-05-13', title: 'Biology Quiz',       class: 'Biology 1107',  priority: 'High',   due: 'Due Tomorrow'   },
  { date: '2024-05-13', title: 'Calculus Homework',  class: 'Calculus 251',  priority: 'Medium', due: 'Due Fri, May 17' },
  { date: '2024-05-15', title: 'Chem Lab Report',    class: 'Chemistry 101', priority: 'Medium', due: 'Due Sun, May 19' },
];
