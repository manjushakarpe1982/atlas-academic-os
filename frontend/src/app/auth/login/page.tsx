'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useState } from 'react';
import { Brain, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isEmailValid || !password) {
      setError('❌ Please enter valid email and password');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          remember_me: rememberMe,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(`❌ ${data.detail || 'Login failed'}`);
        return;
      }

      // Store tokens
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to school selection
      router.push('/school-selection');
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

        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Welcome back!</h1>
        <p className="text-gray-600 text-center mb-8">Step 4 of 4</p>

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
              required
            />
            {isEmailValid && email && <p className="text-green-600 text-xs mt-1">✅ Valid email</p>}
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
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="remember" className="text-sm text-gray-700">
              Remember me
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={!isEmailValid || !password || loading}
          >
            {loading ? 'Signing in...' : 'Log In →'}
          </Button>
        </form>

        {/* Links */}
        <div className="mt-6 space-y-3 text-center text-sm">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-medium">
              Create one
            </Link>
          </p>
          <Link href="/auth/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium block">
            Forgot password?
          </Link>
        </div>
      </Card>
    </div>
  );
}
