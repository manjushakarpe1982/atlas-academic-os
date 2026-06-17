'use client';
import { Lightbulb, Clock, ArrowLeft, Zap, Star, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BackHeader from '../../BackHeader';

export default function FeatureRequestPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <BackHeader title="Feature Request" />

      <div className="px-4 py-6">
        {/* Coming Soon Container */}
        <div className="min-h-[500px] flex items-center justify-center">
          <div className="text-center space-y-6 w-full max-w-sm">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center animate-pulse">
                <Clock className="w-10 h-10 text-yellow-600" />
              </div>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                Coming Soon
              </h1>
              <p className="text-gray-600 leading-relaxed">
                We're building a better way for you to request features. This feature will be available very soon!
              </p>
            </div>

            {/* Feature Preview */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-2xl p-5 text-left space-y-3">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                What's coming:
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Request new features and improvements</span>
                </li>
                <li className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Vote on features you want to see</span>
                </li>
                <li className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">See the most requested features</span>
                </li>
                <li className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">Get updates when features launch</span>
                </li>
              </ul>
            </div>

            {/* Alternative Action */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <p className="text-sm text-gray-600 mb-4">
                Have a feature idea? Let us know in the Contact Support section!
              </p>
              <button
                onClick={() => router.push('/dashboard/profile/help-support/contact-support')}
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <Lightbulb className="w-4 h-4" /> Share Your Idea
              </button>
            </div>

            {/* Stats Preview */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl border border-gray-200 p-3">
                <p className="text-2xl font-bold text-indigo-600">🎯</p>
                <p className="text-xs text-gray-600 mt-1">Public Roadmap</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-3">
                <p className="text-2xl font-bold text-green-600">👥</p>
                <p className="text-xs text-gray-600 mt-1">Community Votes</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-3">
                <p className="text-2xl font-bold text-yellow-600">⚡</p>
                <p className="text-xs text-gray-600 mt-1">Quick Requests</p>
              </div>
            </div>

            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
