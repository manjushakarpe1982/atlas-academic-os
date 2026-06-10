// Step 1: Welcome / Auth Choice
'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Brain } from 'lucide-react';

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold">Atlas</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to Atlas</h1>
          <p className="text-gray-600">AI-ready coach for college students</p>
        </div>

        {/* Choice Buttons */}
        <div className="space-y-4">
          <Link href="/auth/signup" className="block">
            <Button className="w-full py-6 text-lg">
              Create Account
            </Button>
          </Link>

          <Link href="/auth/login" className="block">
            <Button variant="outline" className="w-full py-6 text-lg">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>By continuing, you agree to our</p>
          <Link href="/terms" className="text-blue-600 hover:underline">Terms and Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}
