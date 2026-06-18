'use client';
import { useState } from 'react';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BackHeader from '../../BackHeader';

const FAQ_DATA = [
  {
    category: 'All',
    questions: [
      {
        q: 'How do I upload my syllabus?',
        a: 'Go to your dashboard, click "Add Class", and upload your syllabus PDF. Atlas will automatically extract important dates and topics.',
      },
      {
        q: 'How does calendar sync work?',
        a: 'Connect your calendar feed to Atlas to automatically sync deadlines and important events from your syllabus.',
      },
      {
        q: 'Can I update or delete my grades?',
        a: 'Yes, you can edit your grades anytime in the Grades section. Just click on a grade to update it.',
      },
      {
        q: 'How does Atlas create my study plan?',
        a: 'Atlas analyzes your syllabus, grades, and deadlines to create a personalized study plan.',
      },
      {
        q: 'Is my data safe with Atlas?',
        a: 'Yes, your data is encrypted and private. We never share your information with third parties.',
      },
      {
        q: 'Can I export or delete my data?',
        a: 'Yes, you can export all your data or request complete deletion from account settings.',
      },
      {
        q: 'How do I change my university or major?',
        a: 'Go to Profile > School Settings to change your school and academic information.',
      },
      {
        q: "I'm having trouble syncing my calendar. What should I do?",
        a: 'Check that your calendar feed URL is correct and try disconnecting and reconnecting. Contact support if issues persist.',
      },
    ],
  },
  {
    category: 'General',
    questions: [
      {
        q: 'What is Atlas?',
        a: 'Atlas is an AI-powered study companion that helps you manage classes, track grades, and create study plans.',
      },
      {
        q: 'How does Atlas work?',
        a: 'Upload your syllabus, add grades, connect your calendar, and let Atlas create a personalized study plan.',
      },
    ],
  },
  {
    category: 'Account',
    questions: [
      {
        q: 'How do I change my password?',
        a: 'Click "Forgot Password" on login or go to Account Settings > Change Password.',
      },
      {
        q: 'Can I delete my account?',
        a: 'Yes, go to Account Settings > Delete Account. This will permanently remove all your data.',
      },
    ],
  },
  {
    category: 'Study Plan',
    questions: [
      {
        q: 'Can I customize my study plan?',
        a: 'Yes, you can adjust your study plan anytime based on your preferences and schedule.',
      },
      {
        q: 'How often does my study plan update?',
        a: 'Your study plan updates whenever you add grades, classes, or change your goals.',
      },
    ],
  },
];

export default function FAQPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFAQ = FAQ_DATA.filter((cat) => cat.category === selectedCategory);
  const questions = filteredFAQ[0]?.questions || [];
  
  const filtered = questions.filter((q) =>
    q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.a.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = ['All', 'General', 'Account', 'Study Plan'];

  return (
    <div className="">
      <BackHeader title="FAQ" />

      <div className="px-4 py-6 ">
        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for help..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:border-indigo-500 bg-white"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 custom-scroll">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSearchTerm('');
              }}
              className={`px-4 py-1.5 rounded-lg font-semibold text-sm transition-all flex-shrink-0 ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {filtered.length > 0 ? (
            filtered.map((item, idx) => {
              const itemId = `${selectedCategory}-${idx}`;
              const isExpanded = expandedId === itemId;

              return (
                <button
                  key={itemId}
                  onClick={() => setExpandedId(isExpanded ? null : itemId)}
                  className="w-full text-left bg-white border border-gray-200 rounded-lg p-3.5 hover:border-indigo-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-gray-900 text-sm flex-1">
                      {item.q}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </div>

                  {isExpanded && (
                    <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                      {item.a}
                    </p>
                  )}
                </button>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No FAQ items found</p>
            </div>
          )}
        </div>

        {/* Still Need Help */}
        <div className="mt-8 bg-indigo-50 rounded-lg border border-indigo-200 p-4 flex items-start gap-3">
          <HelpCircle className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-gray-800">Still have questions?</h3>
            <button
              onClick={() => router.push('/dashboard/profile/help-support/contact-support')}
              className="text-indigo-600 font-semibold text-sm  flex items-center gap-1"
            >
              Contact our support team. →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
