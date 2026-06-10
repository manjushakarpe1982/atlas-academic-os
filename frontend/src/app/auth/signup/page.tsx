'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useState } from 'react';
import { Brain, Eye, EyeOff, Check, X } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email);

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordValid = password.length >= 8 && hasUppercase && hasLowercase && hasNumber;

  const passwordsMatch = password === confirmPassword && password.length > 0;
  const isFormValid = isEmailValid && isPasswordValid && passwordsMatch && termsAccepted;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isFormValid) {
      setError('❌ Please fill all fields correctly');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          password_confirm: confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(`❌ ${data.detail || 'Signup failed'}`);
        return;
      }

      window.location.href = `/auth/verify-email?email=${encodeURIComponent(email)}`;
    } catch (err) {
      setError('❌ Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Brain className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold">Atlas</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Create account</h1>
        <p className="text-gray-600 text-center mb-8">Step 2 of 4</p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@university.edu"
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                isEmailValid && email ? 'border-green-500 focus:ring-green-500' : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {isEmailValid && email && <p className="text-green-600 text-xs mt-1">✅ Valid email</p>}
            {!isEmailValid && email && <p className="text-red-600 text-xs mt-1">❌ Enter valid email</p>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password Requirements */}
            {password && (
              <div className="mt-2 space-y-1 text-xs">
                <div className={hasUppercase ? 'text-green-600' : 'text-gray-500'}>
                  {hasUppercase ? '✓' : '○'} Uppercase letter
                </div>
                <div className={hasLowercase ? 'text-green-600' : 'text-gray-500'}>
                  {hasLowercase ? '✓' : '○'} Lowercase letter
                </div>
                <div className={hasNumber ? 'text-green-600' : 'text-gray-500'}>
                  {hasNumber ? '✓' : '○'} Number
                </div>
                <div className={password.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                  {password.length >= 8 ? '✓' : '○'} 8+ characters
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  passwordsMatch && confirmPassword ? 'border-green-500 focus:ring-green-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {confirmPassword && (
                <div className="absolute right-3 top-2.5">
                  {passwordsMatch ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <X className="w-5 h-5 text-red-600" />
                  )}
                </div>
              )}
            </div>
            {passwordsMatch && confirmPassword && <p className="text-green-600 text-xs mt-1">✅ Passwords match</p>}
            {!passwordsMatch && confirmPassword && <p className="text-red-600 text-xs mt-1">❌ Passwords don't match</p>}
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I agree to the{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={!isFormValid || loading}
          >
            {loading ? 'Creating account...' : 'Create Account →'}
          </Button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}
