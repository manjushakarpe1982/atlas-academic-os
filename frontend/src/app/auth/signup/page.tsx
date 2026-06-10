'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Brain, Eye, EyeOff, Check, X } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail]     = useState('');
  const [fullName, setFullName] = useState('');
  const [pw,    setPw]        = useState('');
  const [cpw,   setCpw]       = useState('');
  const [show,  setShow]      = useState(false);
  const [loading, setLoading] = useState(false);

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const hasUpper   = /[A-Z]/.test(pw);
  const hasLower   = /[a-z]/.test(pw);
  const hasNum     = /[0-9]/.test(pw);
  const long       = pw.length >= 8;
  const validPw    = hasUpper && hasLower && hasNum && long;
  const match      = pw === cpw && pw.length > 0;
  
  const validName = fullName.trim().length >= 2;
const formOk = validName && validEmail && validPw && match;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formOk) return;
    setLoading(true);
    // TODO: connect to backend
    setTimeout(() => {
      setLoading(false);
      router.push('/school-selection');
    }, 800);
  };

  const inp = (v?: boolean) =>
    `w-full px-4 py-3 border-2 rounded-xl outline-none text-sm transition-all ${
      v === true ? 'border-green-400' : v === false ? 'border-red-300' : 'border-gray-200 focus:border-indigo-500'
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="w-7 h-7 text-indigo-600" />
          <span className="text-xl font-extrabold text-gray-900">Atlas</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Create account</h1>
        <p className="text-sm text-gray-400 mb-6">
          Already have one?{' '}
          <Link href="/auth/login" className="text-indigo-600 font-semibold hover:underline">Sign in</Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
<div>
  <label className="text-xs font-bold text-gray-600 mb-1 block">
    Full Name
  </label>
  <input
    type="text"
    value={fullName}
    onChange={(e) => setFullName(e.target.value)}
    placeholder="John Doe"
    autoComplete="name"
    className={inp(fullName ? validName : undefined)}
  />
  {fullName && !validName && (
    <p className="text-red-500 text-xs mt-1">
      Enter your full name
    </p>
  )}
</div>
          {/* Email */}
          <div>
            <label className="text-xs font-bold text-gray-600 mb-1 block">Email address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@university.edu" autoComplete="email"
              className={inp(email ? validEmail : undefined)} />
            {email && !validEmail && <p className="text-red-500 text-xs mt-1">Enter a valid email</p>}
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-bold text-gray-600 mb-1 block">Password</label>
            <div className="relative">
              <input type={show ? 'text' : 'password'} value={pw} onChange={e => setPw(e.target.value)}
                placeholder="Min 8 chars" className={inp(pw ? validPw : undefined)} autoComplete="new-password" />
              <button type="button" onClick={() => setShow(!show)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {pw && (
              <div className="mt-2 grid grid-cols-2 gap-1">
                {[{ ok: hasUpper, l: 'Uppercase' }, { ok: hasLower, l: 'Lowercase' },
                  { ok: hasNum, l: 'Number' }, { ok: long, l: '8+ chars' }].map(r => (
                  <div key={r.l} className={`flex items-center gap-1 text-xs ${r.ok ? 'text-green-600' : 'text-gray-400'}`}>
                    {r.ok ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />} {r.l}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confirm */}
          <div>
            <label className="text-xs font-bold text-gray-600 mb-1 block">Confirm password</label>
            <div className="relative">
              <input type={show ? 'text' : 'password'} value={cpw} onChange={e => setCpw(e.target.value)}
                placeholder="Re-enter password" className={inp(cpw ? match : undefined)} autoComplete="new-password" />
              {cpw && (
                <div className="absolute right-3 top-3">
                  {match ? <Check className="w-5 h-5 text-green-500" /> : <X className="w-5 h-5 text-red-400" />}
                </div>
              )}
            </div>
          </div>

          <button type="submit" disabled={!formOk || loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-all shadow-md">
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>
      </div>
    </div>
  );
}
