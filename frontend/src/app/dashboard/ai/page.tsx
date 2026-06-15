'use client';
import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

const SUGGESTIONS = [
  'Create a quiz on Cell Structure',
  'Summarize Chapter 5 Biology',
  "Explain Newton's 2nd Law",
];

const INITIAL_MESSAGES = [
  {
    role: 'user' as const,
    text: 'Explain photosynthesis in simple words',
    time: '9:41 AM',
  },
  {
    role: 'ai' as const,
    text: 'Photosynthesis is how plants make their own food using sunlight, water and carbon dioxide. They convert these into glucose (food) and release oxygen. 🌿',
    time: '9:41 AM',
  },
];

export default function AIPage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    setMessages(p => [...p, { role: 'user', text: input, time: 'Now' }]);
    setInput('');
    setTimeout(() => {
      setMessages(p => [...p, { role: 'ai', text: 'I\'m thinking about that... Atlas AI is ready to help you study smarter! 🤖', time: 'Now' }]);
    }, 800);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100 bg-white">
        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-extrabold text-gray-900">Atlas AI</p>
          <p className="text-xs text-gray-400">Your study assistant</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'ai' && (
              <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
              m.role === 'user'
                ? 'bg-indigo-600 text-white rounded-br-sm'
                : 'bg-gray-100 text-gray-800 rounded-bl-sm'
            }`}>
              {m.text}
              <p className={`text-[9px] mt-1 ${m.role === 'user' ? 'text-indigo-200' : 'text-gray-400'}`}>{m.time}</p>
            </div>
          </div>
        ))}

        {/* Suggestions */}
        <div>
          <p className="text-xs text-gray-400 mb-2">Try these</p>
          <div className="flex flex-col gap-2">
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => setInput(s)}
                className="text-left bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-2 rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-all">
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-gray-100">
        <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-2.5">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask anything..."
            className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
          />
          <button onClick={send} className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
