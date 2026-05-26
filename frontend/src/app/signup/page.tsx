"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle2,
  Upload, BarChart2, Brain, TrendingUp,
} from "lucide-react";
import { createClient } from "@/lib/supabase";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function StrengthBar({ password }: { password: string }) {
  const score =
    (password.length >= 8          ? 1 : 0) +
    (/[A-Z]/.test(password)        ? 1 : 0) +
    (/[0-9]/.test(password)        ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(password) ? 1 : 0);
  const colors     = ["bg-red-400","bg-orange-400","bg-yellow-400","bg-green-500"];
  const labels     = ["Weak","Fair","Good","Strong"];
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

  const handleGoogle = async () => {
    setGoogleLoading(true); setError("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) { setError("Could not start Google sign-up. Please try again."); setGoogleLoading(false); }
    } catch {
      setError("Could not start Google sign-up. Please try again.");
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) { setError("Please enter your first name."); return; }
    if (!email.trim())     { setError("Please enter your email."); return; }
    if (!password)         { setError("Please enter a password."); return; }
    if (password.length < 8){ setError("Password must be at least 8 characters."); return; }
    setError(""); setSuccess(""); setLoading(true);
    try {
      const res  = await fetch(`${API}/api/auth/signup`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name: firstName.trim(), last_name: lastName.trim(), email: email.trim(), password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setError(data.detail || "Sign up failed. Please try again."); return; }

      setSuccess("Account created! Taking you to onboarding…");

      // Auto-login so the new user has a session token and onboarding can save.
      try {
        const loginRes = await fetch(`${API}/api/auth/login`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), password }),
        });
        const loginData = await loginRes.json().catch(() => ({}));
        if (loginRes.ok && loginData.access_token) {
          localStorage.setItem("atlas_access_token",  loginData.access_token);
          localStorage.setItem("atlas_refresh_token", loginData.refresh_token);
          localStorage.setItem("atlas_user_id",       loginData.user_id);
          localStorage.setItem("atlas_full_name",     loginData.full_name || `${firstName.trim()} ${lastName.trim()}`.trim());
          localStorage.setItem("atlas_email",         loginData.email || email.trim());
          localStorage.setItem("atlas_onboarding_completed", "false");
        }
      } catch {
        /* If auto-login fails (e.g. email confirmation required), the user
           can still log in manually later; proceed to onboarding regardless. */
      }

      setTimeout(() => { window.location.href = "/onboarding"; }, 1000);
    } catch {
      setError("Cannot connect to the server. Make sure the backend is running.");
    } finally { setLoading(false); }
  };

  /* Exact same inp class as login page */
  const inp = "w-full bg-white border border-[#dddaf5] hover:border-[#ABA9FA] focus:border-[#534AB7] text-[#1A1A2E] placeholder:text-[#C5C3E8] rounded-xl px-4 py-3 text-sm outline-none transition-all font-medium";

  return (
    /* Exact same outer wrapper as login */
    <main className="min-h-screen flex items-center justify-center px-4 py-6 md:py-8 bg-gray-50 lg:bg-white">
      <div
        className="w-full max-w-[1000px] bg-white border-0 lg:border border-[#e6e5e7] rounded-none lg:rounded-[32px] overflow-hidden shadow-none lg:shadow-2xl lg:shadow-black/10 flex flex-col lg:flex-row"
        style={{ minHeight: 620 }}
      >

        {/* LEFT PANEL — same structure as login, only bg image changed to login.webp */}
        <div
          className="hidden lg:flex lg:w-[50%] relative p-8 lg:p-10 flex-col justify-between text-black"
          style={{
            backgroundImage: "url('https://res.cloudinary.com/mview/image/upload/atlas/login.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div>
            {/* Logo — identical to login */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#534AB7] flex items-center justify-center shadow-md shadow-[#534AB7]/30">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-xl tracking-wide">Atlas</span>
            </div>

            {/* Headline — signup version, same font sizes as login */}
            <h2 className="text-4xl font-extrabold leading-tight mb-4">
              Your semester,
              <br />
              <p className="text-[#534AB7]">on autopilot.</p>
            </h2>

            <p className="text-sm text-black leading-relaxed max-w-sm mb-5">
              Drop your syllabus. Atlas reads it, builds your plan, and tells
              you what to study — calibrated to your exact class, your grades,
              and your schedule.
            </p>

            {/* Feature bullets — same w-10 h-10 icon size, same text-[15px] as login */}
            <div className="space-y-3">
              {[
                { icon: Upload,    text: "Upload any file",         sub: "— syllabus, lecture audio, notes, quizzes",  bg: "bg-violet-200", iconColor: "text-violet-600" },
                { icon: BarChart2, text: "Predict your grade",      sub: "before the exam happens",                    bg: "bg-amber-100",  iconColor: "text-amber-500"  },
                { icon: Brain,     text: "AI-powered study guides", sub: "generated from your own uploaded materials", bg: "bg-blue-100",   iconColor: "text-blue-600"   },
                { icon: TrendingUp,text: "Track mastery & GPA",     sub: "across all your classes in one place",       bg: "bg-emerald-100",iconColor: "text-emerald-600"},
              ].map((f) => (
                <div key={f.text} className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <f.icon className={`w-5 h-5 ${f.iconColor}`} />
                  </div>
                  <p className="text-[15px] text-black leading-relaxed pt-1">
                    <span className="font-bold text-black">{f.text}</span> {f.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial — identical to login */}
          <div className="pb-3">
            <div className="rounded-2xl border border-[#baaff7] px-3 py-4 shadow-sm max-w-[260px]">
              <p className="text-[13px] italic text-black leading-relaxed mb-3">
                &ldquo;It told me to study mitosis because Smith mentioned it
                three times this week and I missed two of three enzyme
                questions on Quiz 3. It&apos;s not guessing.&rdquo;
              </p>
              <p className="text-[11px] font-semibold text-[#534AB7]">
                — Pre-med student, Fall 2026
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — same padding, bg, max-width as login */}
        <div className="flex-1 p-6 md:p-8 lg:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-[420px] w-full mx-auto">

            {/* Heading — same font sizes as login */}
            <h2 className="text-3xl font-extrabold text-[#1A1A2E] mb-2">
              Create your account
            </h2>
            <p className="text-[13px] text-[#8786a1] mb-7">
              Already have an account?{" "}
              <Link href="/login" className="text-[#534AB7] font-semibold hover:underline">
                Log in
              </Link>
            </p>

            {/* Google button — identical to login */}
            <button
              type="button"
              onClick={handleGoogle}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 border border-[#dddaf5] hover:border-[#ABA9FA] hover:bg-[#FAFAFE] text-[#1A1A2E] text-[14px] font-semibold py-3 rounded-2xl transition-all mb-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#534AB7]/30 border-t-[#534AB7] rounded-full animate-spin" />
                  Redirecting to Google…
                </>
              ) : (
                <>
                  <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>

            {/* Divider — identical to login */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-[#F0EFF8]" />
              <span className="text-[13px] font-medium text-[#4d4d4e]">or sign up with email</span>
              <div className="flex-1 h-px bg-[#F0EFF8]" />
            </div>

            {/* Errors / success */}
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

            {/* Form — label style identical to login: text-[13px] font-bold text-gray-500 mb-2 uppercase tracking-wide */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-bold text-gray-500 mb-2 uppercase tracking-wide">
                    First name
                  </label>
                  <input type="text" value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Jordan" autoComplete="given-name" className={inp} />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-gray-500 mb-2 uppercase tracking-wide">
                    Last name
                  </label>
                  <input type="text" value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Patel" autoComplete="family-name" className={inp} />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-gray-500 mb-2 uppercase tracking-wide">
                  University email
                </label>
                <input type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jordan@university.edu" autoComplete="email" className={inp} />
                <p className="text-[11px] text-[#C5C3E8] mt-1 font-medium">
                  Use your .edu address to verify student status
                </p>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-gray-500 mb-2 uppercase tracking-wide">
                  Password
                </label>
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

              {/* Privacy badge */}
              <div className="flex items-start gap-2.5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-3">
                <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-green-800 leading-relaxed font-medium">
                  No ads. No data selling. Your academic content is never used to train other
                  students&apos; models.{" "}
                  <a href="#" className="underline">Read our privacy policy.</a>
                </p>
              </div>

              {/* Submit button — identical style to login */}
              <button type="submit" disabled={loading}
                className="w-full bg-[#534AB7] hover:bg-[#3C3489] disabled:opacity-60 text-white font-bold py-4 rounded-2xl text-[14px] flex items-center justify-center gap-2 shadow-lg shadow-[#534AB7]/20 transition-all">
                {loading
                  ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  : <>→ Create account — it&apos;s free</>
                }
              </button>
            </form>

            {/* Footer — same style as login */}
            <p className="text-center text-[11px] text-gray-600 mt-5">
              By signing up you agree to our{" "}
              <a href="#" className="underline hover:text-[#534AB7] transition-colors">terms of service</a>
              {" "}and{" "}
              <a href="#" className="underline hover:text-[#534AB7] transition-colors">privacy policy</a>.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
