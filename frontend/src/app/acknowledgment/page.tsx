'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';

export default function AcknowledgmentPage() {
  const router  = useRouter();
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAgree = () => {
    if (!checked) return;
    setLoading(true);
    // TODO: connect to backend POST /api/ack
    setTimeout(() => { setLoading(false); router.push('/classes'); }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Before you start</h1>
        </div>

        <div className="space-y-3 mb-6">
          {[
            { title: 'Your rights',             text: 'You retain full ownership of all materials you upload. Atlas does not claim ownership over your content.' },
            { title: 'Academic integrity',      text: 'Atlas is a study tool. Use it in compliance with your institution\'s academic integrity policies.' },
            { title: 'Not officially authorized', text: 'Atlas is an independent tool, not affiliated with or endorsed by any institution.' },
            { title: 'AI recommendations',      text: 'Study plans are AI-generated and may not always be accurate. Always verify with your actual course requirements.' },
          ].map(item => (
            <div key={item.title} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <p className="text-sm font-bold text-gray-800 mb-1">{item.title}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        <label className="flex items-start gap-3 mb-6 cursor-pointer">
          <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)}
            className="w-5 h-5 mt-0.5 flex-shrink-0 accent-indigo-600" />
          <span className="text-sm text-gray-700 leading-relaxed">
            I have read and understood the above. I agree to use Atlas responsibly.
          </span>
        </label>

        <button onClick={handleAgree} disabled={!checked || loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all shadow-md text-base">
          {loading ? 'Recording...' : 'I Agree — Continue to Atlas →'}
        </button>
      </div>
    </div>
  );
}
