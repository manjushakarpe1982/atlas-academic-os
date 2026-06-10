'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AcknowledgmentPage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    const school = localStorage.getItem('selectedSchool');
    
    if (!user || !school) {
      router.push('/auth/login');
    }
  }, [router]);

  const handleAgree = async () => {
    if (!checked) return;

    setLoading(true);
    try {
      // Store acknowledgment with timestamp
      const acknowledgment = {
        timestamp: new Date().toISOString(),
        agreed: true,
        version: '1.0'
      };
      
      localStorage.setItem('acknowledgment', JSON.stringify(acknowledgment));

      // Redirect to add first class
      router.push('/add-class');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <AlertCircle className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Important Agreement</h1>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Please review and acknowledge
        </h2>

        {/* Content Box */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 space-y-4">
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Your Rights</h3>
            <p className="text-gray-700 text-sm">
              You retain full rights to all materials you upload and create through Atlas. 
              We do not claim ownership over your syllabi, notes, or study materials.
            </p>
          </div>

          <hr className="border-gray-300" />

          <div>
            <h3 className="font-bold text-gray-900 mb-2">Academic Integrity</h3>
            <p className="text-gray-700 text-sm">
              You agree to use Atlas in compliance with your institution's academic integrity 
              policies. Atlas is a study tool to help you learn, not to facilitate cheating 
              or plagiarism.
            </p>
          </div>

          <hr className="border-gray-300" />

          <div>
            <h3 className="font-bold text-gray-900 mb-2">No Authorization</h3>
            <p className="text-gray-700 text-sm">
              Atlas is not officially authorized by or affiliated with your school. 
              We are an independent third-party study tool. Use at your own discretion 
              and in accordance with your institution's policies.
            </p>
          </div>
        </div>

        {/* Checkbox */}
        <div className="mb-8">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="w-5 h-5 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">
              I acknowledge and agree to the above terms. I understand Atlas is 
              not officially authorized by my school and agree to use it responsibly 
              in accordance with my institution's policies.
            </span>
          </label>
        </div>

        {/* Timestamp Info */}
        <div className="text-xs text-gray-500 mb-6 p-3 bg-gray-100 rounded">
          ✓ Your acknowledgment will be logged with a timestamp for record-keeping purposes.
        </div>

        {/* Button */}
        <Button
          onClick={handleAgree}
          disabled={!checked || loading}
          className="w-full"
          size="lg"
        >
          {loading ? 'Processing...' : 'I Agree & Continue'}
        </Button>

        {/* Info */}
        <p className="text-center text-xs text-gray-500 mt-6">
          You can review this agreement anytime in your account settings
        </p>
      </Card>
    </div>
  );
}
