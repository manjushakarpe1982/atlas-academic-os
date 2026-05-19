"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle2, Upload, BarChart2, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function StrengthBar({ password }: { password: string }) {
  const score =
    (password.length >= 8          ? 1 : 0) +
    (/[A-Z]/.test(password)        ? 1 : 0) +
    (/[0-9]/.test(password)        ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(password) ? 1 : 0);
  const colors    = ["bg-red-400","bg-orange-400","bg-yellow-400","bg-green-500"];
  const labels    = ["Weak","Fair","Good","Strong"];
  const textColors = ["text-red-500","text-orange-500","text-yellow-600","text-green-600"];
  if (!password) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[0,1,2,3].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < score ? colors[score-1] : "bg-[#E8E7F5]"}`} />
        ))}
      </div>
      <p className={`text-[11px] font-semibold ${score > 0 ? textColors[score-1] : "text-[#9B9AB5]"}`}>
        {score > 0 ? labels[score-1] : ""}
      </p>
    </div>
  );
}

export default function SignupPage() {
  const [showPass,      setShowPass]      = useState(false);
  const [firstName,     setFirstName]     = useState("");
  const [lastName,      setLastName]      = useState("");
  const [email,         setEmail]         = useState("");
  const [password,      setPassword]      = useState("");
  const [error,         setError]         = useState("");
  const [success,       setSuccess]       = useState("");
  const [loading,       setLoading]       = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  /* ── Google sign-up ─────────────────────────────────────────── */
  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      const supabase = createClient();

      // signInWithOAuth works for both sign-in AND sign-up.
      // If the Google account doesn't exist in Supabase yet, it creates it.
      // If it already exists, it logs them in.
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError("Could not start Google sign-up. Please try again.");
        setGoogleLoading(false);
      }
      // Browser is being redirected to Google — no more code runs here
    } catch {
      setError("Could not start Google sign-up. Please try again.");
      setGoogleLoading(false);
    }
  };

  /* ── Email + password signup ────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) { setError("Please enter your first name."); return; }
    if (!email.trim())     { setError("Please enter your email."); return; }
    if (!password)         { setError("Please enter a password."); return; }
    if (password.length < 8){ setError("Password must be at least 8 characters."); return; }
    setError(""); setSuccess(""); setLoading(true);

    try {
      const res  = await fetch(`${API}/api/auth/signup`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          first_name: firstName.trim(),
          last_name:  lastName.trim(),
          email:      email.trim(),
          password,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setError(data.detail || "Sign up failed. Please try again."); return; }
      setSuccess("Account created! Taking you to onboarding…");
      setTimeout(() => { window.location.href = "/onboarding"; }, 1200);
    } catch {
      setError("Cannot connect to the server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const inp = "w-full bg-white border border-[#E8E7F5] hover:border-[#ABA9FA] focus:border-[#534AB7] text-[#1A1A2E] placeholder:text-[#C5C3E8] rounded-xl px-4 py-3 text-sm outline-none transition-all font-medium";

  return (
    <main className="min-h-screen bg-[#F5F4F0] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[900px] bg-white rounded-3xl overflow-hidden shadow-2xl shadow-black/8 flex"
        style={{ minHeight: 560 }}>

        {/* ── Left panel ──────────────────────────────────────── */}
        <div className="w-[340px] flex-shrink-0 bg-[#F5F4F0] p-8 flex flex-col">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-xl bg-[#534AB7] flex items-center justify-center shadow-md shadow-[#534AB7]/30">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-[#1A1A2E] font-bold text-base">Atlas</span>
          </div>

          <h2 className="text-3xl font-extrabold text-[#1A1A2E] leading-tight mb-3">
            Your semester,<br />on autopilot.
          </h2>
          <p className="text-[#6B6A8A] text-sm font-light leading-relaxed mb-8">
            Drop your syllabus. Atlas reads it, builds your plan, and tells you what to study — calibrated to your exact class, your grades, and your schedule.
          </p>

          <div className="space-y-4 flex-1">
            {[
              { icon: Upload,    color: "text-[#534AB7]", bg: "bg-[#EEF0FF]", text: "Upload any file",    sub: "— syllabus, lecture audio, notes, quizzes" },
              { icon: BarChart2, color: "text-[#059669]", bg: "bg-[#E8FAF2]", text: "Predict your grade", sub: "before the exam happens"                   },
              { icon: Clock,     color: "text-[#D97706]", bg: "bg-[#FFF4E5]", text: "60 seconds",         sub: "from sign-up to your first study plan"      },
            ].map((f) => (
              <div key={f.text} className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-lg ${f.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <f.icon className={`w-3.5 h-3.5 ${f.color}`} />
                </div>
                <p className="text-[13px] text-[#6B6A8A] leading-relaxed">
                  <span className="font-bold text-[#1A1A2E]">{f.text}</span> {f.sub}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-[#E8E7F5]">
            <p className="text-[12px] text-[#6B6A8A] italic leading-relaxed mb-2">
              &ldquo;It told me to study mitosis because Smith mentioned it three times this week and I missed two of three enzyme questions on Quiz 3. It&apos;s not guessing.&rdquo;
            </p>
            <p className="text-[11px] font-bold text-[#9B9AB5]">— Pre-med student, Fall 2026</p>
          </div>
        </div>

        {/* ── Right panel ─────────────────────────────────────── */}
        <div className="flex-1 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-extrabold text-[#1A1A2E] mb-1">Create your account</h2>
          <p className="text-[13px] text-[#9B9AB5] mb-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#534AB7] font-semibold hover:underline">Log in</Link>
          </p>

          {/* ── Google button — WORKING ──────────────────────────── */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 border border-[#E8E7F5] hover:border-[#ABA9FA] hover:bg-[#FAFAFE] text-[#1A1A2E] text-[13px] font-semibold py-3.5 rounded-xl transition-all mb-5 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-[#534AB7]/30 border-t-[#534AB7] rounded-full animate-spin" />
                Redirecting to Google…
              </>
            ) : (
              <>
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-[#F0EFF8]" />
            <span className="text-[11px] font-medium text-[#C5C3E8]">or sign up with email</span>
            <div className="flex-1 h-px bg-[#F0EFF8]" />
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3.5 py-3 mb-4">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-[13px] font-medium text-red-600">{error}</p>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3.5 py-3 mb-4">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              <p className="text-[13px] font-medium text-green-700">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#9B9AB5] mb-1.5 uppercase tracking-wide">First name</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jordan" autoComplete="given-name" className={inp} />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#9B9AB5] mb-1.5 uppercase tracking-wide">Last name</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                  placeholder="Patel" autoComplete="family-name" className={inp} />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#9B9AB5] mb-1.5 uppercase tracking-wide">University email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="jordan@university.edu" autoComplete="email" className={inp} />
              <p className="text-[11px] text-[#C5C3E8] mt-1 font-medium">Use your .edu address to verify student status</p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#9B9AB5] mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters" autoComplete="new-password"
                  className={inp + " pr-11"} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C5C3E8] hover:text-[#534AB7] transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <StrengthBar password={password} />
            </div>

            <div className="flex items-start gap-2.5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-3">
              <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-green-800 leading-relaxed font-medium">
                No ads. No data selling. Your academic content is never used to train other students&apos; models.{" "}
                <a href="#" className="underline">Read our privacy policy.</a>
              </p>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-[#534AB7] hover:bg-[#3C3489] disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-[14px] flex items-center justify-center gap-2 shadow-lg shadow-[#534AB7]/20 transition-all">
              {loading
                ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <>→ Create account — it&apos;s free</>
              }
            </button>
          </form>

          <p className="text-center text-[11px] text-[#C5C3E8] mt-4">
            By signing up you agree to our{" "}
            <a href="#" className="underline hover:text-[#534AB7] transition-colors">terms of service</a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-[#534AB7] transition-colors">privacy policy</a>.
          </p>
        </div>
      </div>
    </main>
  );
}
