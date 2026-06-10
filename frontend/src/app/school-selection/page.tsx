'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { Building2, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface School {
  id: string;
  name: string;
  lms: string;
  logo: string;
  icon: React.ReactNode;
}

const schools: School[] = [
  {
    id: 'arkansas',
    name: 'University of Arkansas',
    lms: 'Blackboard',
    logo: '🏛️',
    icon: <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">UA</div>
  },
  {
    id: 'tamu',
    name: 'Texas A&M University',
    lms: 'Canvas',
    logo: '🏛️',
    icon: <div className="w-12 h-12 bg-red-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">AM</div>
  },
  {
    id: 'other',
    name: 'Other School',
    lms: 'Sakai or other LMS',
    logo: '🏛️',
    icon: <Building2 className="w-12 h-12 text-gray-400" />
  }
];

export default function SchoolSelectionPage() {
  const router = useRouter();
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/auth/login');
    }
  }, [router]);

  const handleContinue = async () => {
    if (!selectedSchool) return;

    setLoading(true);
    try {
      const selected = schools.find(s => s.id === selectedSchool);
      
      // Store selected school
      localStorage.setItem('selectedSchool', JSON.stringify({
        id: selected?.id,
        name: selected?.name,
        lms: selected?.lms
      }));

      // Redirect to acknowledgment
      router.push('/acknowledgment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md p-8">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h1 className="text-lg font-bold text-gray-900">School Selection</h1>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Which school do you use?
        </h2>
        <p className="text-center text-gray-600 text-sm mb-8">
          You'll be asked to provide more information about your school experience.
        </p>

        {/* School List */}
        <div className="space-y-3 mb-8">
          {schools.map(school => (
            <div
              key={school.id}
              onClick={() => setSelectedSchool(school.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                selectedSchool === school.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-4">
                {school.icon}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{school.name}</h3>
                  <p className="text-sm text-gray-600">{school.lms}</p>
                </div>
                {selectedSchool === school.id && (
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          disabled={!selectedSchool || loading}
          className="w-full"
          size="lg"
        >
          {loading ? 'Loading...' : 'Continue'}
        </Button>

        {/* Info Text */}
        <p className="text-center text-xs text-gray-500 mt-6">
          You can change your school later in settings
        </p>
      </Card>
    </div>
  );
}
