'use client';
import { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import BackHeader from '../BackHeader';

const HELP_ITEMS = [
  { icon: '🔧', color: 'bg-indigo-100', title: 'How Atlas Works',    sub: 'Learn how Atlas helps you study',    href: '/help'  },
  { icon: '❓', color: 'bg-purple-100', title: 'FAQ',               sub: 'Find answers to common questions'              },
  { icon: '💬', color: 'bg-blue-100',   title: 'Contact Support',   sub: 'Reach out to our support team'                },
  { icon: '🐛', color: 'bg-red-100',    title: 'Report a Problem',  sub: "Let us know about an issue"                   },
  { icon: '✨', color: 'bg-amber-100',  title: 'Feature Request',   sub: 'Suggest a new feature'                        },
];

export default function HelpSupportPage() {
  const [search, setSearch] = useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      <BackHeader title="Help & Support" />

      <div className="px-4 py-5 space-y-4">

        {/* Search */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search for help..."
            className="flex-1 text-sm outline-none bg-transparent text-gray-700 placeholder:text-gray-400" />
        </div>

        {/* Help items */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {HELP_ITEMS.map((item, i) => (
            <button key={item.title}
              className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-all text-left ${
                i < HELP_ITEMS.length - 1 ? 'border-b border-gray-50' : ''
              }`}>
              <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center text-lg flex-shrink-0`}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800">{item.title}</p>
                <p className="text-xs text-gray-400">{item.sub}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
            </button>
          ))}
        </div>

        {/* Contact card */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-center">
          <p className="text-sm font-extrabold text-gray-900 mb-1">Still need help?</p>
          <p className="text-xs text-gray-500 mb-3">Our support team is available Mon–Fri, 9AM–6PM</p>
          <button className="bg-indigo-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-indigo-700 transition-all">
            Email Support
          </button>
        </div>
      </div>
    </div>
  );
}
