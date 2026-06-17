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
    icon: <BookOpen className="w-8 h-8" />,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    path: '/dashboard/profile/help-support/how-it-works',
  },
  {
    id: 'faq',
    title: 'FAQ',
    description: 'Find answers to common questions',
    icon: <HelpCircle className="w-8 h-8" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    path: '/dashboard/profile/help-support/faq',
  },
  {
    id: 'contact-support',
    title: 'Contact Support',
    description: "We're here to help! Send us a message",
    icon: <MessageCircle className="w-8 h-8" />,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    path: '/dashboard/profile/help-support/contact-support',
  },
  {
    id: 'report-problem',
    title: 'Report a Problem',
    description: 'Let us know what happened',
    icon: <AlertCircle className="w-8 h-8" />,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    path: '/dashboard/profile/help-support/report-problem',
  },
  {
    id: 'feature-request',
    title: 'Feature Request',
    description: 'Suggest a new feature or improvement',
    icon: <Lightbulb className="w-8 h-8" />,
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
    <div className="min-h-screen bg-gray-50">
      <BackHeader title="Help & Support" />

      <div className="px-4 py-6 space-y-4">
        {/* Help Grid */}
        <div className="space-y-3">
          {HELP_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => handleNavigate(section)}
              className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${
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
                      {section.comingSoon && (
                        <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-2 py-1 rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Coming Soon
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{section.description}</p>
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
              </div>
            </button>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
          <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-blue-900 text-sm leading-relaxed">
            Can't find what you're looking for? Check our FAQ section or contact our support team and we'll get back to you soon.
          </p>
        </div>

        {/* Support Channels */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="font-bold text-gray-900 mb-4">Other Ways to Get Help</h3>
          <div className="space-y-3">
            <a
              href="mailto:support@atlasacademic.com"
              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-sm font-medium text-gray-900">Email Support</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </a>
            <a
              href="https://twitter.com/atlasacademic"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-sm font-medium text-gray-900">Twitter/X Support</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </a>
            <a
              href="https://discord.gg/atlasacademic"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-sm font-medium text-gray-900">Discord Community</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
