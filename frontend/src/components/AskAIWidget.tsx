'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquare, X } from 'lucide-react';

interface Message { role: 'user' | 'ai'; text: string; }

interface Props {
  context: 'upload-summary' | 'study-plan';
}

const SUGGESTIONS: Record<Props['context'], string[]> = {
  'upload-summary': [
    'Why is Mitosis ranked #1 urgency?',
    'Did Atlas find all my exam dates?',
    'Which topics are missing?',
    'How many hours should I study this week?',
  ],
  'study-plan': [
    'Why is this task ranked first?',
    'Can I skip Statistics today?',
    'What happens if I miss today\'s session?',
    'How do I improve my weakest topic fastest?',
  ],
};

const ANSWERS: Record<Props['context'], Record<string, string>> = {
  'upload-summary': {
    default:    'Based on your uploaded materials, Atlas found 12 topics, 8 key dates, and 3 upcoming exams. Mitosis is flagged as highest urgency because your mastery is only 28% and your Biology midterm is in 3 days.',
    mitosis:    'Mitosis is ranked #1 urgency because: your mastery score is only 28% (very low), Professor Smith mentioned it 6 times in lectures (high emphasis), and your Biology midterm is in just 3 days (high proximity). The combination of all three factors puts it at the top.',
    exam:       'Atlas detected 3 exam dates from your syllabus: Biology Midterm on May 22, Statistics Quiz on May 24, and English Essay due May 26. If any are wrong, you can edit them in the Calendar.',
    missing:    'Atlas could not find clear topic coverage for: Lab Report 3 instructions, and your Statistics Week 9 slides (not uploaded yet). Upload those files to complete your study plan.',
    hours:      'Based on your 3 upcoming assessments and current mastery scores, Atlas recommends 14.5 hours this week: Biology (6h), Statistics (5h), English (3.5h). Your schedule has 16h available after sleep and classes.',
  },
  'study-plan': {
    default:    'Your study plan is ranked by urgency = emphasis × mastery_gap × proximity. Cell Division is #1 because it combines your lowest mastery (28%) with the highest professor emphasis and the closest exam date.',
    rank:       'Cell Division is ranked first because it scores highest on all 3 engine signals: mastery gap (72 points below target), professor emphasis (95% — mentioned most in lectures), and proximity (Biology exam in 3 days). Skipping it would directly lower your predicted exam score.',
    skip:       'You can skip Statistics today, but Atlas recommends against it — your PS#4 is due Friday and you\'re currently at 65% mastery, 15 points below your target. If you skip today, you\'d need 2× the time on Thursday to catch up.',
    miss:       'Missing today\'s session would push Cell Division to tomorrow, compressing your Biology prep to 2 days before the exam. Atlas would reduce your predicted score from 86 to ~79. It\'s better to do even a 20-min focused session tonight.',
    improve:    'The fastest way to improve Cell Division (28%) is: 1) Study Guide Read mode tonight (40 min), 2) Flashcards tomorrow morning (15 min), 3) Practice Quiz before the exam (20 min). This sequence targets retrieval, not re-reading, which is 3× more effective.',
  },
};

function getAnswer(context: Props['context'], q: string): string {
  const lower = q.toLowerCase();
  const answers = ANSWERS[context];

  if (context === 'upload-summary') {
    if (lower.includes('mitosis') || lower.includes('rank') || lower.includes('urgency')) return answers.mitosis;
    if (lower.includes('exam') || lower.includes('date') || lower.includes('found')) return answers.exam;
    if (lower.includes('missing') || lower.includes('not find') || lower.includes('which topic')) return answers.missing;
    if (lower.includes('hour') || lower.includes('how long') || lower.includes('how much')) return answers.hours;
  } else {
    if (lower.includes('rank') || lower.includes('first') || lower.includes('why')) return answers.rank;
    if (lower.includes('skip') || lower.includes('statistic')) return answers.skip;
    if (lower.includes('miss') || lower.includes('today') || lower.includes('what happen')) return answers.miss;
    if (lower.includes('improve') || lower.includes('weak') || lower.includes('fastest')) return answers.improve;
  }
  return answers.default;
}

export default function AskAIWidget({ context }: Props) {
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (q?: string) => {
    const question = q || input.trim();
    if (!question) return;
    setInput('');
    setMessages((p) => [...p, { role: 'user', text: question }]);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setMessages((p) => [...p, { role: 'ai', text: getAnswer(context, question) }]);
    setLoading(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const label = context === 'upload-summary' ? 'Ask about your upload' : 'Ask about your plan';
  const placeholder = context === 'upload-summary'
    ? 'e.g. Why is Mitosis ranked #1?'
    : 'e.g. Why is this task first?';

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

      {/* Header — toggle */}
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-all">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <p className="text-xs font-extrabold text-gray-900">{label}</p>
          {messages.length > 0 && (
            <span className="text-[9px] font-bold bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full">
              {messages.filter((m) => m.role === 'user').length}
            </span>
          )}
        </div>
        <span className={`text-[10px] font-semibold transition-all ${open ? 'text-indigo-500' : 'text-gray-400'}`}>
          {open ? '▲ Close' : '▼ Open'}
        </span>
      </button>

      {/* Expanded panel */}
      {open && (
        <div className="border-t border-gray-100">

          {/* Chat messages */}
          <div className="px-4 py-3 space-y-3 max-h-64 overflow-y-auto">

            {/* Empty state with suggestions */}
            {messages.length === 0 && !loading && (
              <div>
                <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2">
                  Suggested questions
                </p>
                <div className="space-y-1.5">
                  {SUGGESTIONS[context].map((q) => (
                    <button key={q} onClick={() => send(q)}
                      className="w-full flex items-center gap-2 text-left px-3 py-2 bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-300 rounded-xl text-[11px] font-medium text-gray-700 hover:text-indigo-700 transition-all group">
                      <span className="text-indigo-400 group-hover:text-indigo-600 flex-shrink-0">→</span>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'ai' && (
                  <div className="w-5 h-5 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-sm'
                    : 'bg-gray-50 border border-gray-100 text-gray-800 rounded-bl-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-2">
                <div className="w-5 h-5 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <div className="bg-gray-50 border border-gray-100 px-3 py-2 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1 items-center h-3">
                    {[0,1,2].map((i) => (
                      <div key={i} className="w-1 h-1 bg-indigo-400 rounded-full animate-bounce"
                        style={{ animationDelay:`${i*0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-4 pb-3 pt-1 border-t border-gray-50">
            <div className="flex gap-1.5">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder={placeholder}
                className="flex-1 bg-gray-50 border border-gray-200 hover:border-indigo-300 focus:border-indigo-500 focus:bg-white rounded-xl px-3 py-2 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition-all"
              />
              <button onClick={() => send()}
                disabled={!input.trim() || loading}
                className="w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white flex items-center justify-center flex-shrink-0 transition-all">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            {messages.length > 0 && (
              <button onClick={() => setMessages([])}
                className="text-[10px] text-gray-400 hover:text-gray-600 mt-1.5 transition-colors">
                Clear chat
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Inline full-width version for top of page ─────────────── */
export function AskAIInline({ context }: Props) {
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const bottomRef    = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const send = async (q?: string) => {
    const question = q || input.trim();
    if (!question) return;
    setInput('');
    setOpen(true);
    setMessages((p) => [...p, { role: 'user', text: question }]);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setMessages((p) => [...p, { role: 'ai', text: getAnswer(context, question) }]);
    setLoading(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const label       = context === 'upload-summary' ? 'Ask about what Atlas found' : 'Ask about your study plan';
  const placeholder = context === 'upload-summary' ? 'e.g. Why is Mitosis ranked #1 urgency?' : 'e.g. Can I skip Statistics today?';

  return (
    <div ref={containerRef} className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200 rounded-2xl mb-4 overflow-hidden">

      {/* Always-visible prompt bar */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-7 h-7 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <p className="text-sm font-extrabold text-indigo-900 flex-shrink-0">{label}</p>
          <span className="text-[10px] text-indigo-400 hidden sm:block">· Grounded in your uploaded files</span>
        </div>
        {messages.length > 0 && (
          <button onClick={() => { setMessages([]); setOpen(false); }}
            className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-600 flex-shrink-0 transition-colors">
            Clear
          </button>
        )}
      </div>

      {/* Input row — always visible */}
      <div className="px-4 pb-3 flex gap-2">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none flex-1 min-w-0">
          {!open && messages.length === 0 && SUGGESTIONS[context].slice(0, 3).map((q) => (
            <button key={q} onClick={() => send(q)}
              className="text-[11px] font-medium bg-white border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl whitespace-nowrap flex-shrink-0 transition-all">
              {q}
            </button>
          ))}
          {(open || messages.length > 0) && (
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={placeholder}
              className="flex-1 min-w-0 bg-white border border-indigo-200 hover:border-indigo-400 focus:border-indigo-600 rounded-xl px-3.5 py-1.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-all"
              autoFocus={open}
            />
          )}
        </div>
        {(open || messages.length > 0) ? (
          <button onClick={() => send()}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white flex items-center justify-center flex-shrink-0 transition-all self-center">
            <Send className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button onClick={() => setOpen(true)}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex-shrink-0 whitespace-nowrap transition-colors self-center">
            Ask anything →
          </button>
        )}
      </div>

      {/* Chat messages — shown after first question */}
      {(messages.length > 0 || loading) && (
        <div className="border-t border-indigo-100 px-4 py-3 space-y-3 max-h-52 overflow-y-auto bg-white/60">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'ai' && (
                <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              )}
              <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-sm'
                  : 'bg-white border border-indigo-100 text-gray-800 rounded-bl-sm shadow-sm'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
              <div className="bg-white border border-indigo-100 px-3.5 py-2.5 rounded-2xl rounded-bl-sm shadow-sm">
                <div className="flex gap-1 items-center h-4">
                  {[0,1,2].map((i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"
                      style={{ animationDelay:`${i*0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}
