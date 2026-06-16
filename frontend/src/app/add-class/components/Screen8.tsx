'use client';
// Screen 10 — Class Added Successfully
import { useEffect, useState } from 'react';
import { CheckCircle2, Calendar, TrendingUp, Bell, Sparkles } from 'lucide-react';
import { Phone } from './shared';
import { api } from '@/lib/api';

interface Props { onNext: () => void; onBack: () => void; classId: string | null; }

const FEATURES = [
  {
    icon: Calendar,
    title: 'Weekly study plan enabled',
    subtitle: 'Get a personalized plan every week',
  },
  {
    icon: TrendingUp,
    title: 'Grade tracking enabled',
    subtitle: 'Track your progress and improvement',
  },
  {
    icon: Bell,
    title: 'Deadlines will be tracked',
    subtitle: 'Never miss an important deadline',
  },
];

export default function Screen10({ classId }: Props) {
  const [className, setClassName] = useState('Your class');

  // Load real class name
  useEffect(() => {
    if (!classId) return;
    api<{ name: string }>(`/api/classes/${classId}`)
      .then(d => { if (d?.name) setClassName(d.name); })
      .catch(() => {});
  }, [classId]);

  return (
    <Phone>
      <div className=" py-3 flex flex-col">
        {/* Success Icon with decorative elements */}
        <div className="relative flex justify-center mb-4">
          {/* Decorative sparkles */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Top left sparkle */}
            <div className="absolute -top-3 left-20 text-purple-300">
              <Sparkles className="w-4 h-4" />
            </div>
            {/* Top right sparkle */}
            <div className="absolute top-5 right-20 text-teal-400">
              <div className="w-2 h-2 rounded-full bg-teal-400" />
            </div>
             <div className="absolute top-6 left-12 text-purple-300">
              <Sparkles className="w-4 h-4" />
            </div>
            {/* Left sparkle */}
            <div className="absolute top-12 left-20 text-yellow-400">
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
            </div>
            <div className="absolute top-6 right-12 text-purple-300">
              <Sparkles className="w-4 h-4" />
            </div>
            {/* Right sparkle */}
            <div className="absolute top-16 right-16 text-purple-300">
              <div className="w-2 h-2 rounded-full bg-purple-300" />
            </div>
             <div className="absolute top-24 right-20 text-yellow-400">
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
            </div>
          </div>

  <div className="relative w-28 h-28 flex items-center justify-center animate-pulse">
  {/* Glow layers */}
  <div className="absolute w-[138px] h-[138px] bg-green-100/60 rounded-full"></div>
  <div className="absolute w-[118px] h-[118px] bg-green-100/80 rounded-full"></div>
  
  <div className="relative w-[76px] h-[76px] bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-xl ring-8 ring-green-50">
    <CheckCircle2 className="w-11 h-11 text-white" />
  </div>
</div>
        </div>

        {/* Heading */}
        <div className="text-center ">
          <h1 className="text-3xl font-extrabold text-gray-900 ">
          {className}  Class added
          </h1>
          <p className="text-3xl font-extrabold text-green-500 mb-1">
            successfully!
          </p>
        </div>

        {/* Subtitle */}
        <p className="text-center text-gray-600 mb-4 text-sm leading-relaxed">
          You're one step closer to<br />a smarter study plan.
        </p>

        {/* Feature Cards */}
        <div className="space-y-3 mb-4">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Icon container */}
                <div className="flex-shrink-0 w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  <Icon className="w-5 h-5 text-green-600" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-bold text-gray-900">
                    {feature.title}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {feature.subtitle}
                  </p>
                </div>

                {/* Checkmark */}
                <div className="flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Atlas Ready Section */}
        <div className="flex-1" />
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-5 border border-purple-100 flex gap-3">
          <Sparkles className="w-7 h-7 text-purple-600 flex-shrink-0" />
          <div>
            <p className="text-base font-bold text-gray-900">
              Atlas is ready to help you
            </p>
            <p className="text-sm text-gray-600 mt-1">
              We'll use your class info to create smart recommendations and save you time.
            </p>
          </div>
        </div>
      </div>
    </Phone>
  );
}
