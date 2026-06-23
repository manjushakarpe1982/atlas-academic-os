export interface TopicItem {
  id: string; title: string; lastStudied: string; description?: string;
}

export interface FlashcardItem {
  id: number; front: string; back: string;
}

export interface QuizQuestion {
  id: number; question: string; options: string[]; correctIndex: number; explanation: string;
}

export const CLASSES = [
  { id: '1', name: 'Biology 1107', term: 'Spring 2026' },
  { id: '2', name: 'Calculus 251', term: 'Spring 2026' },
  { id: '3', name: 'English 201', term: 'Spring 2026' },
];

export const TOPICS: TopicItem[] = [
  { id: '1', title: 'Cell Structure', lastStudied: 'Today' },
  { id: '2', title: 'Cell Membrane', lastStudied: '2 days ago' },
  { id: '3', title: 'Mitosis', lastStudied: '3 days ago' },
  { id: '4', title: 'Genetics', lastStudied: 'Yesterday' },
  { id: '5', title: 'Evolution', lastStudied: 'Yesterday' },
];

export const MATERIALS = [
  { id: 'summary',   icon: '📝', title: 'Summary',           sub: 'Key concepts in easy words' },
  { id: 'flashcards', icon: '🗂️', title: 'Flashcards',        sub: 'Review important terms' },
  { id: 'quiz',      icon: '❓', title: 'Practice Quiz',      sub: 'Test your understanding' },
  { id: 'targeted',  icon: '🎯', title: 'Targeted Practice',  sub: 'Focus on weak areas' },
];

export const SUMMARY_POINTS = [
  { term: 'Gene', def: 'A unit of heredity that is transferred from parents to offspring.' },
  { term: 'DNA', def: 'The molecule that carries genetic information.' },
  { term: 'Chromosomes', def: 'Structures in cells that contain DNA.' },
  { term: 'Inheritance', def: 'The passing of traits from parents to offspring.' },
  { term: 'Variation', def: 'Differences in traits among organisms.' },
];

export const FLASHCARDS: FlashcardItem[] = [
  { id: 1, front: 'What is DNA?', back: 'DNA is the molecule that carries genetic information in all living organisms.' },
  { id: 2, front: 'What is a Gene?', back: 'A gene is a unit of heredity transferred from parent to offspring.' },
  { id: 3, front: 'What is Mitosis?', back: 'Mitosis is the process of cell division that results in two identical daughter cells.' },
  { id: 4, front: 'What are Chromosomes?', back: 'Chromosomes are thread-like structures made of DNA found in the nucleus.' },
  { id: 5, front: 'What is Natural Selection?', back: 'Natural selection is the process where organisms with favorable traits survive and reproduce.' },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  { id: 1, question: 'What is the basic unit of heredity?', options: ['A. Chromosome', 'B. Gene', 'C. DNA', 'D. Protein'], correctIndex: 1, explanation: 'A gene is the basic unit of heredity that carries information to produce a specific trait.' },
  { id: 2, question: 'What molecule carries genetic information?', options: ['A. RNA', 'B. Protein', 'C. DNA', 'D. Lipid'], correctIndex: 2, explanation: 'DNA (Deoxyribonucleic acid) is the molecule that stores genetic information.' },
  { id: 3, question: 'Where are chromosomes found?', options: ['A. Cytoplasm', 'B. Cell membrane', 'C. Nucleus', 'D. Ribosome'], correctIndex: 2, explanation: 'Chromosomes are found in the nucleus of eukaryotic cells.' },
  { id: 4, question: 'What is the process of cell division called?', options: ['A. Meiosis', 'B. Mitosis', 'C. Osmosis', 'D. Diffusion'], correctIndex: 1, explanation: 'Mitosis is cell division that produces two identical daughter cells.' },
  { id: 5, question: 'Which scientist proposed natural selection?', options: ['A. Mendel', 'B. Darwin', 'C. Watson', 'D. Crick'], correctIndex: 1, explanation: 'Charles Darwin proposed the theory of natural selection.' },
];

export const PROGRESS_DATA = {
  overall: 72,
  confidence: 45,
  materials: [
    { name: 'Summary', status: 'Completed', icon: '✅' },
    { name: 'Flashcards', progress: '18/25', icon: '🗂️' },
    { name: 'Practice Quiz', progress: '12/15', icon: '❓' },
    { name: 'Targeted Practice', status: 'In Progress', icon: '🎯' },
  ],
  weakAreas: [
    { name: 'Inheritance Patterns', pct: 45 },
    { name: 'Genetic Variation', pct: 60 },
  ],
  streak: 7,
};
