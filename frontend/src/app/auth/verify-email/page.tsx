'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { Brain } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0 && !canResend) {
      setCanResend(true);
    }
  }, [resendTimer, canResend]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (code.length !== 6) {
      setError('❌ Enter 6-digit code');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(`❌ ${data.detail || 'Verification failed'}`);
        return;
      }

      window.location.href = '/auth/login';
    } catch (err) {
      setError('❌ Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setCanResend(false);
    setResendTimer(60);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resend: true }),
      });

      if (response.ok) {
        // Code resent
      } else {
        setError('❌ Resend failed. Try again.');
        setCanResend(true);
      }
    } catch {
      setError('❌ Network error.');
      setCanResend(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Brain className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold">Atlas</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Check your email</h1>
        <p className="text-gray-600 text-center mb-8">Step 3 of 4</p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-900">
            📧 We sent a verification code to:<br />
            <strong>{email}</strong>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter 6-digit code
            </label>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="123456"
              className="w-full px-4 py-3 text-center text-2xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              autoFocus
            />
            <p className="text-xs text-gray-600 mt-1">{code.length}/6 digits</p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={code.length !== 6 || loading}
          >
            {loading ? 'Verifying...' : 'Verify Email →'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-3">Didn't receive the code?</p>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={!canResend || loading}
            onClick={handleResend}
          >
            {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
          </Button>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          Wrong email?{' '}
          <a href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-medium">
            Create new account
          </a>
        </p>
      </Card>
    </div>
  );
}
