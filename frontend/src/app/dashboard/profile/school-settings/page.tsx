'use client';
import { useEffect, useState } from 'react';
import { ChevronRight, Loader2, Building2, MapPin, Globe, BookOpen, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import BackHeader from '../BackHeader';

const SCHOOL_MAP: Record<string, { 
  name: string; 
  city?: string; 
  state?: string; 
  country?: string; 
  website?: string;
  learningPlatform: 'canvas' | 'blackboard';
  platformUrl?: string;
}> = {
  arkansas: {
    name: 'University of Arkansas',
    city: 'Fayetteville',
    state: 'Arkansas',
    country: 'USA',
    website: 'www.uark.edu',
    learningPlatform: 'blackboard',
    platformUrl: 'learn.uark.edu',
  },
  tamu: {
    name: 'Texas A&M University',
    city: 'College Station',
    state: 'Texas',
    country: 'USA',
    website: 'www.tamu.edu',
    learningPlatform: 'canvas',
    platformUrl: 'canvas.tamu.edu',
  },
};

const PLATFORM_INFO = {
  canvas: {
    name: 'Canvas',
    icon: '📚',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  blackboard: {
    name: 'Blackboard Learn',
    icon: '🎓',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
};

function getUser() {
  const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  return userStr ? JSON.parse(userStr) : null;
}

export default function SchoolSettings() {
  const router = useRouter();
  const [currentSchool, setCurrentSchool] = useState<any | null>(null);
  const [learningPlatform, setLearningPlatform] = useState<'canvas' | 'blackboard' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      const user = getUser();
      const schoolKey = user?.school || 'arkansas';
      const school = SCHOOL_MAP[schoolKey];
      setCurrentSchool(school);
      setLearningPlatform(school.learningPlatform);
    } catch (err) {
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChangeSchool = () => {
    router.push('/school-selection');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  const platformInfo = learningPlatform ? PLATFORM_INFO[learningPlatform] : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
       <BackHeader title="School Settings" />
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          <p className="text-gray-500 mt-1">Manage your school and learning platform</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Current School Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50">
            <h2 className="text-lg font-semibold text-gray-900">Current School</h2>
            <p className="text-sm text-gray-600 mt-1">This is the school associated with your Atlas account</p>
          </div>

          {currentSchool ? (
            <div className="px-6 py-6 space-y-4">
              {/* School Name */}
              <div className="flex items-start gap-3">
                <Building2 className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">School Name</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">{currentSchool.name}</p>
                </div>
              </div>

              {/* Location */}
              {(currentSchool.city || currentSchool.state || currentSchool.country) && (
                <div className="flex items-start gap-3 pt-4 border-t border-gray-100">
                  <MapPin className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</p>
                    <p className="text-base font-medium text-gray-900 mt-1">
                      {[currentSchool.city, currentSchool.state, currentSchool.country]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  </div>
                </div>
              )}

              {/* Website */}
              {currentSchool.website && (
                <div className="flex items-start gap-3 pt-4 border-t border-gray-100">
                  <Globe className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Website</p>
                    <a
                      href={`https://${currentSchool.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700 font-medium mt-1 inline-flex items-center gap-1"
                    >
                      {currentSchool.website}
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-600 mb-4">No school selected yet</p>
              <button
                onClick={handleChangeSchool}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Select a School
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Change School Section */}
        {currentSchool && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Change School</h3>
            <p className="text-gray-600 text-sm mb-4">
              Want to switch to a different school? You can select a new school and your account will be updated accordingly.
            </p>
            <button
              onClick={handleChangeSchool}
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Select Different School
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Learning Platform Section */}
        {platformInfo && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">Learning Platform</h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">Automatically assigned based on your school</p>
            </div>

            <div className="px-6 py-6">
              {/* Platform Display */}
              <div className={`p-5 rounded-lg border-2 ${platformInfo.bgColor} ${platformInfo.borderColor}`}>
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{platformInfo.icon}</span>
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold ${platformInfo.color}`}>{platformInfo.name}</h3>
                    {currentSchool?.platformUrl && (
                      <a
                        href={`https://${currentSchool.platformUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm ${platformInfo.color} hover:opacity-75 font-medium mt-2 inline-flex items-center gap-1`}
                      >
                        {currentSchool.platformUrl}
                        <ChevronRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Info Note */}
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-900">
                  Your learning platform is automatically selected based on your school. Atlas uses {platformInfo.name} to sync your courses, assignments, and grades.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Integration Info Box */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
          <BookOpen className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-green-900 text-sm leading-relaxed">
            💡 Atlas automatically detects your school's learning platform and syncs course data, assignments, and grades in real-time.
          </p>
        </div>
      </div>
    </div>
  );
}
