"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, ShieldCheck, AlertCircle } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/* ── Password strength bar ────────────────────────────────────── */
function StrengthBar({ password }: { password: string }) {
  const score =
    (password.length >= 8           ? 1 : 0) +
    (/[A-Z]/.test(password)         ? 1 : 0) +
    (/[0-9]/.test(password)         ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(password)  ? 1 : 0);

  const barColors = ["bg-red-400","bg-orange-400","bg-yellow-400","bg-green-500"];
  const labels    = ["Weak","Fair","Good","Strong"];
  const textClr   = ["text-red-500","text-orange-500","text-yellow-600","text-green-600"];

  if (!password) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[0,1,2,3].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < score ? barColors[score-1] : "bg-[#EEEDFE]"}`} />
        ))}
      </div>
      <p className={`text-[11px] font-semibold ${score > 0 ? textClr[score-1] : "text-[#9B9AB5]"}`}>
        {score > 0 ? labels[score-1] : "Too short"}
      </p>
    </div>
  );
}

export default function SignupPage() {
  const [showPass,  setShowPass]  = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [error,     setError]     = useState("");
  const [success,   setSuccess]   = useState("");
  const [loading,   setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ── client-side validation ─────────────────────────────────────
    if (!firstName.trim())  { setError("Please enter your first name."); return; }
    if (!email.trim())      { setError("Please enter your email address."); return; }
    if (!password)          { setError("Please enter a password."); return; }
    if (password.length < 8){ setError("Password must be at least 8 characters."); return; }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // ── call backend ───────────────────────────────────────────────
      const res = await fetch(`${API}/api/auth/signup`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          first_name: firstName.trim(),
          last_name:  lastName.trim(),
          email:      email.trim(),
          password,
        }),
      });

      let data: Record<string, string>;
      try {
        data = await res.json();
      } catch {
        setError("Server returned an unexpected response. Is the backend running?");
        return;
      }

      if (!res.ok) {
        setError(data.detail || "Sign up failed. Please try again.");
        return;
      }

      // ── success ────────────────────────────────────────────────────
      setSuccess("Account created! Redirecting you now…");
      setTimeout(() => { window.location.href = "/onboarding"; }, 1200);

    } catch {
      setError(
        "Cannot connect to the server. Make sure the backend is running on port 8000.\n" +
        "Run: uvicorn app.main:app --reload --port 8000"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-[#FAFAFE] border border-[#D5D3FD] hover:border-[#ABA9FA] " +
    "focus:border-[#534AB7] focus:bg-white text-[#18172B] placeholder:text-[#C5C3E8] " +
    "rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200 font-medium";

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Logo + heading */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-2xl btn-primary flex items-center justify-center shadow-lg shadow-[#534AB7]/25">
              <span className="text-white font-bold text-base">A</span>
            </div>
            <span className="text-[#18172B] font-bold text-xl tracking-tight">Atlas</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-[#18172B] mb-2">Create your account</h1>
          <p className="text-[#6B6A8A] text-sm font-light">Your semester, on autopilot.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 border border-[#EEEDFE]"
          style={{ boxShadow: "0 8px 40px rgba(83,74,183,0.08)" }}>

          {/* Google SSO — visual only */}
          <button type="button"
            className="w-full flex items-center justify-center gap-3 bg-[#FAFAFE] hover:bg-[#EEEDFE] border border-[#D5D3FD] text-[#18172B] text-sm font-semibold py-3.5 rounded-xl transition-all duration-200 mb-5">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-[#EEEDFE]" />
            <span className="text-xs font-medium text-[#9B9AB5]">or sign up with email</span>
            <div className="flex-1 h-px bg-[#EEEDFE]" />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-red-600 whitespace-pre-line">{error}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-center gap-2.5 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4">
              <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
              <p className="text-sm font-medium text-green-700">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#6B6A8A] mb-1.5 uppercase tracking-wide">First name</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jordan" autoComplete="given-name" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#6B6A8A] mb-1.5 uppercase tracking-wide">Last name</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                  placeholder="Patel" autoComplete="family-name" className={inputCls} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-[#6B6A8A] mb-1.5 uppercase tracking-wide">University email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu" autoComplete="email" className={inputCls} />
              <p className="text-[11px] font-medium text-[#9B9AB5] mt-1">Use your .edu address to verify student status</p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-[#6B6A8A] mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters" autoComplete="new-password"
                  className={inputCls + " pr-11"} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C5C3E8] hover:text-[#534AB7] transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <StrengthBar password={password} />
            </div>

            {/* Privacy */}
            <div className="flex items-start gap-2.5 bg-green-50 border border-green-100 rounded-xl p-3">
              <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] font-medium text-green-700 leading-relaxed">
                No ads. No data selling. Your academic content is never used to train other students&apos; models.
              </p>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="btn-primary w-full text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#534AB7]/20 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading
                ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <>Create account — it&apos;s free <ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>

          <p className="text-center text-xs font-medium text-[#9B9AB5] mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-[#534AB7] hover:text-[#3C3489] font-bold transition-colors">
              Log in
            </Link>
          </p>
        </div>

        {/* Dev helper */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3">
            <p className="text-[11px] font-bold text-amber-700 mb-1">DEV — fix rate limit</p>
            <p className="text-[11px] text-amber-600 leading-relaxed">
              Supabase → Authentication → Settings → disable{" "}
              <strong>&quot;Enable email confirmations&quot;</strong> to bypass the 3 emails/hour limit.
            </p>
          </div>
        )}

        <p className="text-center text-xs font-medium text-[#9B9AB5] mt-4">
          By signing up you agree to our{" "}
          <a href="#" className="text-[#6B6A8A] hover:text-[#534AB7] transition-colors">Terms of Service</a>
        </p>
      </div>
    </main>
  );
}
