'use client';

import { useRouter } from 'next/navigation';
import { Upload, Plus, BookOpen, BarChart2, Calendar } from 'lucide-react';

interface Props {
  type: 'no-classes' | 'no-uploads' | 'no-grades' | 'no-sessions' | 'error';
  onAction?: () => void;
  error?: string;
}

const CONFIG = {
  'no-classes': {
    emoji: '📚',
    title: "You haven't added any classes yet",
    desc:  'Add your first class and upload your syllabus — Atlas will build your study plan in under 60 seconds.',
    cta:   'Add your first class',
    icon:  Plus,
    href:  '/classes',
  },
  'no-uploads': {
    emoji: '📄',
    title: 'No files uploaded yet',
    desc:  'Drop your syllabus, lecture slides, or notes here. Atlas reads them and builds a personalised study plan automatically.',
    cta:   'Upload your first file',
    icon:  Upload,
    href:  '/upload',
  },
  'no-grades': {
    emoji: '🎓',
    title: 'No grades logged yet',
    desc:  'Add your first grade to unlock GPA tracking, exam score predictions, and grade optimisation tips.',
    cta:   'Add a grade',
    icon:  Plus,
    href:  null,
  },
  'no-sessions': {
    emoji: '⏱',
    title: 'No study sessions yet',
    desc:  "You haven't completed any study sessions. Start a session from your study plan and Atlas will track your progress.",
    cta:   'Go to study plan',
    icon:  BookOpen,
    href:  '/study-plan',
  },
  'error': {
    emoji: '⚠️',
    title: 'Something went wrong',
    desc:  'Atlas couldn\'t load this content. This is usually temporary — try refreshing the page.',
    cta:   'Refresh',
    icon:  BarChart2,
    href:  null,
  },
};

export default function EmptyState({ type, onAction, error }: Props) {
  const router = useRouter();
  const cfg    = CONFIG[type];
  const Icon   = cfg.icon;

  const handleClick = () => {
    if (onAction)  { onAction(); return; }
    if (cfg.href)  { router.push(cfg.href); return; }
    if (type === 'error') { window.location.reload(); }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="text-5xl mb-4">{cfg.emoji}</div>
      <h3 className="text-base font-extrabold text-gray-900 mb-2">{cfg.title}</h3>
      <p className="text-sm text-gray-400 max-w-sm leading-relaxed mb-6">
        {error || cfg.desc}
      </p>
      <button onClick={handleClick}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-2xl text-sm transition-all shadow-md shadow-indigo-500/20 active:scale-95">
        <Icon className="w-4 h-4" /> {cfg.cta}
      </button>
      {type === 'error' && (
        <p className="text-[11px] text-gray-400 mt-3">
          If this keeps happening, visit <a href="/help" className="text-indigo-500 hover:underline">Help Center</a>
        </p>
      )}
    </div>
  );
}
