'use client';
import BackHeader from '../BackHeader';

const PROTECTIONS = [
  "We never share your LMS passwords",
  "Your calendar data is encrypted",
  "Your files and grades are secure",
  "We don't sell your personal data",
  "You're in control of your data",
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <BackHeader title="Privacy Policy" />

      <div className="px-4 py-5 space-y-4">

        {/* Hero */}
        <div className="bg-indigo-600 rounded-3xl p-6 text-center text-white">
          <div className="text-5xl mb-3">🔒</div>
          <h2 className="text-xl font-extrabold mb-2">Your Privacy Matters</h2>
          <p className="text-indigo-200 text-sm leading-relaxed">
            At Atlas, we&apos;re committed to protecting your data and your privacy.
          </p>
        </div>

        {/* How we protect you */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h3 className="text-sm font-extrabold text-gray-900 mb-3">How We Protect You</h3>
          <div className="space-y-2.5">
            {PROTECTIONS.map(p => (
              <div key={p} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 text-xs font-bold">✓</span>
                </div>
                <p className="text-sm text-gray-700">{p}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sections */}
        {[
          { title: 'Data Collection',  body: 'We collect only the data necessary to provide Atlas services, including your course information, grades, and calendar data. We never collect sensitive personal information beyond what you provide.' },
          { title: 'Data Usage',       body: 'Your data is used exclusively to generate personalized study plans and recommendations. We do not use your academic data for advertising or share it with third parties.' },
          { title: 'Data Deletion',    body: 'You can request deletion of all your data at any time by contacting our support team. We will process your request within 30 days.' },
        ].map(s => (
          <div key={s.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <h3 className="text-sm font-extrabold text-gray-900 mb-2">{s.title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{s.body}</p>
          </div>
        ))}

        <p className="text-xs text-gray-400 text-center pb-2">Last updated: May 15, 2024</p>
      </div>
    </div>
  );
}
