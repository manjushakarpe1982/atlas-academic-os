'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Brain, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]     = useState('');
  const [pw,    setPw]        = useState('');
  const [show,  setShow]      = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: connect to backend
    setTimeout(() => {
      setLoading(false);
      router.push('/classes');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-7 h-7 text-indigo-600" />
          <span className="text-xl font-extrabold text-gray-900">Atlas</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Welcome back</h1>
        <p className="text-sm text-gray-400 mb-6">
          No account?{' '}
          <Link href="/auth/signup" className="text-indigo-600 font-semibold hover:underline">Create one</Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-600 mb-1 block">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@university.edu" required autoComplete="email"
              className="w-full px-4 py-3 border-2 border-gray-200 focus:border-indigo-500 rounded-xl outline-none text-sm transition-all" />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 mb-1 block">Password</label>
            <div className="relative">
              <input type={show ? 'text' : 'password'} value={pw} onChange={e => setPw(e.target.value)}
                placeholder="••••••••" required autoComplete="current-password"
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-indigo-500 rounded-xl outline-none text-sm transition-all" />
              <button type="button" onClick={() => setShow(!show)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="text-right mt-1">
              <Link href="/auth/forgot-password" className="text-xs text-indigo-600 hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>

          <button type="submit" disabled={!email || !pw || loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-md">
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>
      </div>
    </div>
  );
}
