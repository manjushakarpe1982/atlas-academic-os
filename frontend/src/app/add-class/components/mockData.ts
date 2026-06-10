// ── All hardcoded data used across screens ─────────────────────────────────

export const MOCK_COURSE = {
  name:       'BIOL 1107 - Intro Biology',
  instructor: 'Dr. Sarah Wilson',
  credits:    4,
  weights: [
    { category: 'Exams',    pct: 40, confidence: 'High'   },
    { category: 'Homework', pct: 25, confidence: 'High'   },
    { category: 'Labs',     pct: 20, confidence: 'Medium' },
    { category: 'Final',    pct: 15, confidence: 'High'   },
  ],
  dates: [
    { title: 'Midterm Exam',   date: 'Oct 10, 2026', confidence: 'High'   },
    { title: 'Lab Quiz 1',     date: 'Sep 15, 2026', confidence: 'Medium' },
    { title: 'Homework 1 Due', date: 'Aug 28, 2026', confidence: 'High'   },
    { title: 'Final Exam',     date: 'Dec 12, 2026', confidence: 'High'   },
  ],
  topics: [
    { week: 1, title: 'Introduction to Biology'      },
    { week: 2, title: 'Chemistry of Life'            },
    { week: 3, title: 'Cells: Structure & Function'  },
  ],
};

export const MOCK_TEXTBOOK = {
  title:     'Campbell Biology',
  edition:   '12th Edition',
  author:    'Jane B. Reece',
  publisher: 'Pearson',
  match:     95,
};

export const MOCK_GRADES = [
  { assessment: 'Exam 1',     score: 84, total: 100, pct: 84 },
  { assessment: 'Quiz 1',     score: 18, total: 20,  pct: 90 },
  { assessment: 'Homework 1', score: 45, total: 50,  pct: 90 },
  { assessment: 'Lab 1',      score: 19, total: 20,  pct: 95 },
];

export const MOCK_CLASSES_ADDED = [
  { name: 'BIOL 1107', full: 'Intro Biology',     status: 'Added' },
  { name: 'MATH 251',  full: 'Calculus III',      status: 'Added' },
  { name: 'CHEM 101',  full: 'General Chemistry', status: 'Added' },
];

export const STEP_LABELS = [
  '1. Add Class Intro',
  '2. Class Name',
  '3. Upload Syllabus',
  '4. AI Parsing',
  '5. Review What We Found',
  '6. Important Dates',
  '7. Add Textbook (Optional)',
  '8. Textbook Found',
  '9. Enter Grades (Optional)',
  '10. Class Added',
  '11. Add More Classes',
];
