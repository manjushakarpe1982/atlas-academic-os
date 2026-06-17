'use client';
import { Upload, CheckCircle2, Calendar, Zap, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BackHeader from '../../BackHeader';

const FEATURES = [
  {
    icon: <Upload className="w-6 h-6" />,
    title: 'Upload Syllabus',
    description: 'Upload your syllabus and Atlas extracts important dates and topics.',
    color: 'text-indigo-600 bg-indigo-100',
  },
  {
    icon: <CheckCircle2 className="w-6 h-6" />,
    title: 'Add Your Grades',
    description: 'Add your current grades so Atlas can understand your progress.',
    color: 'text-green-600 bg-green-100',
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: 'Connect Calendar',
    description: 'Sync your calendar to track deadlines and important events.',
    color: 'text-yellow-600 bg-yellow-100',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Get AI Study Plan',
    description: 'Atlas creates a personalized study plan to help you achieve your goals.',
    color: 'text-purple-600 bg-purple-100',
  },
];

export default function HowItWorksPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <BackHeader title="How Atlas Works" />

      <div className="px-4 py-6 space-y-6">
        {/* Hero with Illustration */}
        <div className="flex flex-col items-center text-center space-y-3">
          {/* Robot Illustration */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            <div className="absolute w-16 h-16 bg-purple-200 rounded-3xl flex items-center justify-center">
              <div className="w-4 h-4 bg-purple-600 rounded-full absolute top-3 left-3"></div>
              <div className="w-4 h-4 bg-purple-600 rounded-full absolute top-3 right-3"></div>
              <div className="w-2 h-2 bg-purple-600 rounded-full absolute bottom-4 left-1/2 transform -translate-x-1/2"></div>
            </div>
            {/* Decorative icons around */}
            <div className="absolute -top-2 -left-2 text-2xl">🎓</div>
            <div className="absolute -top-2 -right-2 text-2xl">💡</div>
            <div className="absolute -bottom-2 -left-2 text-2xl">✅</div>
            <div className="absolute -bottom-2 -right-2 text-2xl">📚</div>
            <div className="absolute top-2 left-0 text-xl">📅</div>
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">How Atlas Works</h1>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed max-w-xs">
              Atlas is your AI study companion. Here's how it helps you succeed.
            </p>
          </div>
        </div>

        {/* Features List */}
        <div className="space-y-3">
          {FEATURES.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border-2 border-gray-200 p-4 flex gap-3"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${feature.color}`}>
                {feature.icon}
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={() => router.push('/dashboard/profile/help-support')}
          className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
        >
          Got it! <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
