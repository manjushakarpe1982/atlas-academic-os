'use client';
import { useState } from 'react';
import { ChevronRight, HelpCircle, MessageCircle, AlertCircle, BookOpen, Clock, Lightbulb } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BackHeader from '../BackHeader';

interface HelpSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  path: string;
  comingSoon?: boolean;
}

const HELP_SECTIONS: HelpSection[] = [
  {
    id: 'how-it-works',
    title: 'How Atlas Works',
    description: 'Learn how Atlas helps with your study companion',
    icon: <BookOpen className="w-6 h-6" />,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    path: '/dashboard/profile/help-support/how-it-works',
  },
  {
    id: 'faq',
    title: 'FAQ',
    description: 'Find answers to common questions',
    icon: <HelpCircle className="w-6 h-6" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    path: '/dashboard/profile/help-support/faq',
  },
  {
    id: 'contact-support',
    title: 'Contact Support',
    description: "We're here to help! Send us a message",
    icon: <MessageCircle className="w-6 h-6" />,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    path: '/dashboard/profile/help-support/contact-support',
  },
  {
    id: 'report-problem',
    title: 'Report a Problem',
    description: 'Let us know what happened',
    icon: <AlertCircle className="w-6 h-6" />,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    path: '/dashboard/profile/help-support/report-problem',
  },
  {
    id: 'feature-request',
    title: 'Feature Request',
    description: 'Suggest a new feature or improvement',
    icon: <Lightbulb className="w-6 h-6" />,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    path: '/dashboard/profile/help-support/feature-request',
    comingSoon: true,
  },
];

export default function HelpSupportPage() {
  const router = useRouter();

  const handleNavigate = (section: HelpSection) => {
    if (!section.comingSoon) {
      router.push(section.path);
    } else {
      router.push(section.path);
    }
  };

  return (
    <div className="">
      <BackHeader title="Help & Support" />

      <div className="px-4 py-6 ">
        {/* Help Grid */}
        <div className="space-y-3">
          {HELP_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => handleNavigate(section)}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                section.comingSoon
                  ? `${section.bgColor} border-transparent hover:border-gray-300 active:scale-95`
                  : `${section.bgColor} border-transparent hover:border-gray-300 active:scale-95`
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Icon and Text */}
                <div className="flex items-start gap-3 flex-1">
                  <div className={`${section.color} flex-shrink-0 mt-1`}>
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">{section.title}</h3>
                    
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-6 h-6 text-gray-600 flex-shrink-0 mt-1" />
              </div>
            </button>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-10 bg-blue-50 border border-blue-200 rounded-xl border-dashed  p-4 flex gap-3">
          <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-blue-900 text-sm leading-relaxed">
            Can't find what you're looking for? Check our FAQ section or contact our support team and we'll get back to you soon.
          </p>
        </div>

      
      </div>
    </div>
  );
}
