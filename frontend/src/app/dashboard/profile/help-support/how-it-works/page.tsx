'use client';
import { Upload, CheckCircle2, Calendar, Zap, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BackHeader from '../../BackHeader';
import Image from 'next/image'; 

const FEATURES = [
  {
    icon: <Upload className="w-5 h-5" />,
    title: 'Upload Syllabus',
    description: 'Upload your syllabus and Atlas extracts important dates and topics.',
    color: 'text-indigo-600 bg-indigo-100',
  },
  {
    icon: <CheckCircle2 className="w-5 h-5" />,
    title: 'Add Your Grades',
    description: 'Add your current grades so Atlas can understand your progress.',
    color: 'text-green-600 bg-green-100',
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    title: 'Connect Calendar',
    description: 'Sync your calendar to track deadlines and important events.',
    color: 'text-yellow-600 bg-yellow-100',
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Get AI Study Plan',
    description: 'Atlas creates a personalized study plan to help you achieve your goals.',
    color: 'text-purple-600 bg-purple-100',
  },
];

export default function HowItWorksPage() {
  const router = useRouter();

  return (
    <div className="">
      <BackHeader title="How Atlas Works" />

      <div className="px-4 py-2">
        {/* Hero with Illustration */}
        <div className="flex flex-col items-center text-center">
          {/* Robot Illustration */}
         <Image
            src="https://res.cloudinary.com/mview/image/upload/atlas/supportpage1.webp"
            alt="Robot Illustration"    
        width={300}
        height={120}
            />

          <div className="flex flex-col items-center mb-4 ">
            <h1 className="text-2xl font-extrabold text-gray-900">How Atlas Works</h1>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed max-w-xs">
              Atlas is your AI study companion. Here's how it helps you succeed.
            </p>
          </div>
        </div>

        {/* Features List */}
        <div className="space-y-3 mb-4">
          {FEATURES.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-300 p-4 flex gap-3"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${feature.color}`}>
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
          className="w-full bg-indigo-600 text-white font-bold py-3 text-base rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
        >
          Got it! <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
