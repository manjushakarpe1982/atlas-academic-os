'use client';
import { useState } from 'react';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';
import BackHeader from '../../BackHeader';

const ISSUE_CATEGORIES = [
  { id: 'bug', label: 'Bug', icon: '🐛' },
  { id: 'billing', label: 'Billing', icon: '💳' },
  { id: 'account', label: 'Account', icon: '👤' },
  { id: 'calendar', label: 'Calendar', icon: '📅' },
  { id: 'ai-study', label: 'AI / Study Plan', icon: '✨' },
  { id: 'other', label: 'Other', icon: '⭕' },
];

export default function ContactSupportPage() {
  const [selectedCategory, setSelectedCategory] = useState('bug');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      alert('Please fill in all fields');
      return;
    }

    setSending(true);

    // Simulate sending
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setSubject('');
      setMessage('');
      setSelectedCategory('bug');

      // Reset success message after 3 seconds
      setTimeout(() => setSent(false), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BackHeader title="Contact Support" />

      <div className="px-4 py-6 space-y-6">
        {/* Hero Section with Illustration */}
        <div className="flex flex-col items-center text-center space-y-4 py-4">
          {/* Illustration */}
          <div className="relative w-24 h-24">
            {/* Chat bubble */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-indigo-200 rounded-2xl flex items-center justify-center">
                <div className="w-3 h-3 bg-indigo-600 rounded-full absolute top-3 left-3"></div>
                <div className="w-3 h-3 bg-indigo-600 rounded-full absolute top-3 left-7"></div>
                <div className="w-3 h-3 bg-indigo-600 rounded-full absolute top-3 left-11"></div>
              </div>
            </div>
            {/* Checkmark */}
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">✓</span>
            </div>
          </div>

          {/* Title and Description */}
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">We're here to help!</h1>
            <p className="text-gray-600 text-sm mt-2 leading-relaxed max-w-xs">
              Send us a message and our team will get back to you soon.
            </p>
          </div>
        </div>

        {/* Success Message */}
        {sent && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-green-900">Message sent!</h3>
              <p className="text-sm text-green-700 mt-1">
                Thank you for reaching out. We'll get back to you within 24 hours.
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Issue Category */}
          <div>
            <label className="text-sm font-bold text-gray-900 block mb-3">
              What is your issue about?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ISSUE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-100 border-2 border-indigo-500'
                      : 'bg-gray-100 border-2 border-transparent hover:bg-gray-200'
                  }`}
                >
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="text-xs font-semibold text-gray-900 text-center">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="text-sm font-bold text-gray-900 block mb-2">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-indigo-500 bg-white text-sm placeholder:text-gray-400"
            />
          </div>

          {/* Message */}
          <div>
            <label className="text-sm font-bold text-gray-900 block mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              required
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-indigo-500 bg-white text-sm placeholder:text-gray-400 resize-none"
            />
            <p className="text-xs text-gray-400 mt-2 text-right">{message.length}/500</p>
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={sending}
            className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-2xl hover:bg-indigo-700 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Sending...
              </>
            ) : (
              <>
                Send Message <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
