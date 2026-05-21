'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import {
  Search, ChevronRight, ChevronDown, BookOpen,
  Upload, Brain, BarChart2, Calendar, Shield,
  Zap, HelpCircle, MessageCircle, Mail,
} from 'lucide-react';

const CATEGORIES = [
  {
    icon: Upload, color: 'bg-indigo-500', label: 'Getting Started',
    topics: [
      { q: 'How do I add a class?',                      a: 'Go to Classes → click "Add class". Enter your class name, professor, and credits. Then upload your syllabus — Atlas will automatically parse topics, deadlines, and grade weights.' },
      { q: 'What files can I upload?',                   a: 'PDF, DOCX, PPTX (slides), MP3/MP4 (lectures), and images. Atlas auto-detects whether it\'s a syllabus, lecture, review sheet, or graded work.' },
      { q: 'How long does parsing take?',                a: 'Text files (PDF, DOCX) take under 30 seconds. Audio transcription takes roughly 1× the recording length. You\'ll get a notification when it\'s ready.' },
      { q: 'Can I use Atlas without uploading anything?',a: 'Yes — but your study plan will be much less personalised. Without a syllabus, Atlas can\'t extract topics, deadlines, or grade weights. Even just one PDF unlocks the full plan.' },
    ],
  },
  {
    icon: Brain, color: 'bg-violet-500', label: 'Study Plan',
    topics: [
      { q: 'How does Atlas decide what to study first?',  a: 'The engine ranks tasks using 4 signals: Mastery (how well you know the topic), Emphasis (how much your professor weighted it in lectures), Proximity (how soon you\'re tested), and Urgency (overall class pressure). priority = emphasis × mastery_gap × proximity.' },
      { q: 'Why did my #1 task change overnight?',       a: 'Atlas recomputes your plan every time you complete a session, upload a file, log a grade, or a deadline moves closer. The ranking is always live.' },
      { q: 'Can I manually reorder my tasks?',           a: 'You can skip a task to push it down the list, but Atlas will always re-surface it when the engine determines it\'s critical. Full manual override is coming in V2.' },
      { q: 'What does "Why this task?" show me?',        a: 'A breakdown of the 4 engine scores for that specific task: your mastery %, emphasis from professor signals, days until next assessment, and class urgency score.' },
    ],
  },
  {
    icon: BookOpen, color: 'bg-blue-500', label: 'Study Guides',
    topics: [
      { q: 'What makes Atlas study guides different?',   a: 'Every sentence is grounded in YOUR uploaded materials — not the internet. Each claim cites the exact lecture timestamp, slide number, or page. If your professor said "this is the part I love testing", that\'s preserved.' },
      { q: 'What are the 4 study modes?',                a: 'Read (static prose with citations), Listen (audio narration — use while walking), Quiz me (retrieval practice — answer before reading), and Teach back (explain in your own words — highest retention).' },
      { q: 'What does "87% primary · 13% supplementary" mean?', a: '87% of the guide content came directly from your uploaded files. The remaining 13% is general subject knowledge flagged as supplementary — useful context not found in your specific materials.' },
      { q: 'Why is a section flagged as "not covered"?', a: 'Your professor only briefly mentioned this topic, or it wasn\'t in any of your uploaded files. Atlas is honest about gaps rather than making things up.' },
    ],
  },
  {
    icon: BarChart2, color: 'bg-emerald-500', label: 'Grades & Predictions',
    topics: [
      { q: 'How accurate is the exam score prediction?', a: 'V1 targets ±8 points vs actual. In testing: predicted 87, student scored 89. Accuracy improves as you log more quiz grades and do more study sessions — the model calibrates to you.' },
      { q: 'How do I log a grade?',                      a: 'Go to Grades → click "Add grade" → select the assignment type, enter your score. Atlas immediately updates your GPA projection and study plan priority.' },
      { q: 'What is the "grade gap" shown in urgency?',  a: 'The difference between your current grade and your target grade for that class. A larger gap → higher urgency → more study time allocated by the engine.' },
      { q: 'Can Atlas predict my final semester GPA?',   a: 'Yes — the Analytics tab shows your projected GPA based on current grades and predicted exam scores. It also shows what grades you\'d need on remaining assessments to hit your target.' },
    ],
  },
  {
    icon: Zap, color: 'bg-amber-500', label: 'Exam Mode',
    topics: [
      { q: 'What is Exam Mode?',                         a: 'A timed simulation of your actual exam. You select which topics to include, choose question type (MCQ, Written, or Solve), and work through questions under exam conditions. Answers are hidden until you submit.' },
      { q: 'How is Exam Mode different from a Practice Quiz?', a: 'Practice Quiz: immediate answer feedback, no timer, 5 questions — use to learn. Exam Mode: strict timer, no feedback until end, 10+ questions — use to simulate the real thing.' },
      { q: 'What happens after I submit in Exam Mode?',  a: 'You see your score, time taken, and a full answer review with explanations. For written/solve questions, you self-grade each answer based on the correct solution shown.' },
    ],
  },
  {
    icon: Calendar, color: 'bg-teal-500', label: 'Calendar & Schedule',
    topics: [
      { q: 'How does Atlas schedule study blocks?',      a: 'It reads your fixed events (classes, gym, sleep window) from Settings → Schedule, then fills available slots with study blocks ranked by engine priority. It never schedules over your blocked times.' },
      { q: 'What are Month, Week, and Day views?',       a: 'Month shows your full semester at a glance. Week shows Mon–Sun with event pills per day. Day shows an hour-by-hour timeline — click any hour to add an event.' },
      { q: 'Can I add events manually?',                 a: 'Yes — click "+ Add event" on any view. Enter a title, type (class/exam/deadline/study/personal), date, time, and location. It appears immediately across all views.' },
    ],
  },
  {
    icon: Shield, color: 'bg-rose-500', label: 'Privacy & Data',
    topics: [
      { q: 'Does Atlas train AI on my files?',           a: 'No — unless you explicitly opt in under Settings → Privacy → "Allow training on my academic content". It\'s off by default. Your files are never used without your consent.' },
      { q: 'How is my data stored?',                     a: 'All data is encrypted at rest (AES-256) and in transit (TLS 1.3). Atlas is FERPA compliant and GDPR compliant. We never sell your data or show ads.' },
      { q: 'How do I export all my data?',               a: 'Settings → Privacy → Export all data. You\'ll receive a ZIP containing your files, study guides, flashcards, grades, and settings within 5 minutes via email.' },
      { q: 'How do I delete my account?',                a: 'Settings → Privacy → Danger Zone → Delete my account. Type DELETE to confirm. This permanently removes all data and cannot be undone.' },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border-b border-gray-100 last:border-0`}>
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 py-4 text-left hover:text-indigo-600 transition-colors group">
        <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-700 flex-1">{q}</p>
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${open ? 'rotate-180 text-indigo-500' : ''}`} />
      </button>
      {open && (
        <div className="pb-4 pr-7">
          <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
  const [search,      setSearch]      = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = CATEGORIES.map((cat) => ({
    ...cat,
    topics: cat.topics.filter(
      (t) =>
        !search ||
        t.q.toLowerCase().includes(search.toLowerCase()) ||
        t.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.topics.length > 0);

  const display = activeCategory
    ? filtered.filter((c) => c.label === activeCategory)
    : filtered;

  return (
    <AppLayout>
      <div className="p-4 md:p-6 max-w-[900px] mx-auto">

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-500/25">
            <HelpCircle className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900">Help Center</h1>
          <p className="text-sm text-gray-400 mt-1">Find answers to common questions about Atlas</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search help articles…"
            className="w-full bg-white border-2 border-gray-200 hover:border-indigo-300 focus:border-indigo-500 rounded-2xl pl-11 pr-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all shadow-sm" />
        </div>

        {/* Category chips */}
        {!search && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button onClick={() => setActiveCategory(null)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 text-xs font-semibold transition-all ${
                !activeCategory ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-500 hover:border-indigo-200'
              }`}>
              All topics
            </button>
            {CATEGORIES.map((cat) => (
              <button key={cat.label} onClick={() => setActiveCategory(cat.label === activeCategory ? null : cat.label)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 text-xs font-semibold transition-all ${
                  activeCategory === cat.label ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-500 hover:border-indigo-200'
                }`}>
                <cat.icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* FAQ sections */}
        <div className="space-y-4">
          {display.map((cat) => (
            <div key={cat.label} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50">
                <div className={`w-8 h-8 rounded-xl ${cat.color} flex items-center justify-center flex-shrink-0`}>
                  <cat.icon className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm font-extrabold text-gray-900">{cat.label}</p>
                <span className="text-[10px] font-bold text-gray-400 ml-auto">{cat.topics.length} articles</span>
              </div>
              <div className="px-5">
                {cat.topics.map((t) => <FAQItem key={t.q} q={t.q} a={t.a} />)}
              </div>
            </div>
          ))}

          {display.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">No results for "{search}"</p>
              <p className="text-xs mt-1">Try a different keyword or browse categories above</p>
            </div>
          )}
        </div>

        {/* Contact support */}
        <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-extrabold text-indigo-900">Still need help?</p>
              <p className="text-xs text-indigo-600 mt-0.5">Our support team replies within 24 hours.</p>
            </div>
          </div>
          <a href="mailto:support@atlas.app"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-indigo-500/20 flex-shrink-0">
            <Mail className="w-4 h-4" /> Contact support
          </a>
        </div>
      </div>
    </AppLayout>
  );
}
