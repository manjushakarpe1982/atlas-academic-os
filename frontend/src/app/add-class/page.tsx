'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { BookOpen, Camera, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AddClassPage() {
  const router = useRouter();
  const [className, setClassName] = useState('');
  const [syllabus, setSyllabus] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'name' | 'syllabus' | 'confirm'>('name');
  const [classNameSource, setClassNameSource] = useState<'typed' | 'syllabus'>('typed');

  useEffect(() => {
    const user = localStorage.getItem('user');
    const ack = localStorage.getItem('acknowledgment');
    
    if (!user || !ack) {
      router.push('/auth/login');
    }
  }, [router]);

  const handleNameSubmit = () => {
    if (className.trim()) {
      setStep('syllabus');
    }
  };

  const handleSyllabusUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSyllabus(e.target.files[0]);
      setStep('confirm');
    }
  };

  const handleAddClass = async () => {
    if (!className.trim()) return;

    setLoading(true);
    try {
      // Store class info
      const classes = JSON.parse(localStorage.getItem('classes') || '[]');
      classes.push({
        id: Date.now(),
        name: className,
        syllabus: syllabus?.name || null,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('classes', JSON.stringify(classes));

      // If user doesn't want to add more classes, go to dashboard
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnother = () => {
    setClassName('');
    setSyllabus(null);
    setStep('name');
    setClassNameSource('typed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Add Your First Class</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex gap-2 mb-8">
          <div className={`flex-1 h-1 rounded ${step === 'name' || step === 'syllabus' || step === 'confirm' ? 'bg-blue-600' : 'bg-gray-200'}`} />
          <div className={`flex-1 h-1 rounded ${step === 'syllabus' || step === 'confirm' ? 'bg-blue-600' : 'bg-gray-200'}`} />
          <div className={`flex-1 h-1 rounded ${step === 'confirm' ? 'bg-blue-600' : 'bg-gray-200'}`} />
        </div>

        {/* Step 1: Class Name */}
        {step === 'name' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Step 1: Name Your Class</h2>
            <p className="text-gray-600 mb-6">
              Enter your class name (e.g., "BIOL 1107 - Intro Biology")
            </p>
            
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="BIOL 1107 - Intro Biology"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
              autoFocus
            />

            <Button
              onClick={handleNameSubmit}
              disabled={!className.trim()}
              className="w-full"
              size="lg"
            >
              Next: Upload Syllabus
            </Button>
          </div>
        )}

        {/* Step 2: Upload Syllabus */}
        {step === 'syllabus' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Step 2: Upload Syllabus</h2>
            <p className="text-gray-600 mb-6">
              Take a photo or upload a PDF of your syllabus. Our AI will extract the course information.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Camera Option */}
              <label className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center cursor-pointer hover:bg-blue-50 transition">
                <Camera className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-900">Take Photo</span>
                <input type="file" accept="image/*" capture className="hidden" />
              </label>

              {/* File Upload Option */}
              <label className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center cursor-pointer hover:bg-blue-50 transition">
                <Upload className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-900">Upload PDF</span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleSyllabusUpload}
                  className="hidden"
                />
              </label>
            </div>

            <Button
              onClick={() => setStep('confirm')}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Skip for Now
            </Button>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 'confirm' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Review Your Class</h2>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6 space-y-4">
              <div>
                <label className="text-sm text-gray-600">Class Name</label>
                <p className="text-lg font-semibold text-gray-900">{className}</p>
              </div>
              
              {syllabus && (
                <div>
                  <label className="text-sm text-gray-600">Syllabus</label>
                  <p className="text-gray-900">✓ {syllabus.name}</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleAddClass}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? 'Adding...' : 'Add Class & Go to Dashboard'}
              </Button>

              <Button
                onClick={handleAddAnother}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Add Another Class
              </Button>
            </div>
          </div>
        )}

        {/* Progress Info */}
        <div className="text-center text-xs text-gray-500 mt-8">
          You can add more classes anytime from your dashboard
        </div>
      </Card>
    </div>
  );
}
