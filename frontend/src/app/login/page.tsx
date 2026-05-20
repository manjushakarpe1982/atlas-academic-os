"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, AlertCircle, CalendarCheck, Bell, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function LoginPage() {
  const router = useRouter();
  const [showPass,      setShowPass]      = useState(false);
  const [email,         setEmail]         = useState("");
  const [password,      setPassword]      = useState("");
  const [error,         setError]         = useState("");
  const [loading,       setLoading]       = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  /* ── Google sign-in ─────────────────────────────────────────── */
  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      const supabase = createClient();

      // signInWithOAuth redirects the browser to Google.
      // After Google login, Google sends user back to /auth/callback.
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError("Could not start Google sign-in. Please try again.");
        setGoogleLoading(false);
      }
      // If no error, browser is being redirected to Google — no more code runs here
    } catch {
      setError("Could not start Google sign-in. Please try again.");
      setGoogleLoading(false);
    }
  };

  /* ── Email + password login ─────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError("Please enter your email address."); return; }
    if (!password)     { setError("Please enter your password."); return; }
    setError("");
    setLoading(true);

    try {
      const res  = await fetch(`${API}/api/auth/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.detail || "Login failed. Please try again.");
        return;
      }

      localStorage.setItem("atlas_access_token",  data.access_token);
      localStorage.setItem("atlas_refresh_token", data.refresh_token);
      localStorage.setItem("atlas_user_id",       data.user_id);
      localStorage.setItem("atlas_full_name",     data.full_name || "");
      localStorage.setItem("atlas_email",         data.email || email);
      router.push("/onboarding");
    } catch {
      setError("Cannot connect to the server. Make sure the backend is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  const inp    = "w-full bg-white border border-[#dddaf5] hover:border-[#ABA9FA] focus:border-[#534AB7] text-[#1A1A2E] placeholder:text-[#C5C3E8] rounded-xl px-4 py-3 text-sm outline-none transition-all font-medium";
  const inpErr = "w-full bg-white border-2 border-red-400 focus:border-red-500 text-[#1A1A2E] placeholder:text-[#C5C3E8] rounded-xl px-4 py-3 text-sm outline-none font-medium";
  const hasPassError = error.toLowerCase().includes("password") || error.toLowerCase().includes("incorrect");

  return (
  <main className="min-h-screen flex items-center justify-center px-4 py-8">
  <div
    className="w-full max-w-[1000px] bg-white border border-[#e6e5e7] rounded-[32px] overflow-hidden shadow-2xl shadow-black/10 flex flex-col lg:flex-row"
    style={{ minHeight: 620 }}
  >
    {/* LEFT PANEL */}
    <div
      className="lg:w-[50%] relative p-8 lg:p-10 flex flex-col justify-between text-black"
      style={{
        backgroundImage:
          " url('https://res.cloudinary.com/mview/image/upload/atlas/signup.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div>
        <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-[#534AB7] flex items-center justify-center shadow-md shadow-[#534AB7]/30">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-bold text-xl tracking-wide">Atlas</span>
        </div>

        <h2 className="text-4xl font-extrabold  leading-tight mb-4">
          Welcome back.
          <br />
          <p className="text-[#534AB7]"> Your plan is waiting.</p>
         
        </h2>

        <p className="text-sm text-black leading-relaxed max-w-sm mb-5">
          Everything Atlas learned about your classes, grades, and mastery is
          right where you left it.
        </p>

      <div className="space-y-3">
  {[
    {
      icon: CalendarCheck,
      text: "Today's plan",
      sub: "updates the moment you log in",
      bg: "bg-violet-200",
      iconColor: "text-violet-600",
    },
    {
      icon: Bell,
      text: "Exam alerts",
      sub: "and deadline warnings ready",
      bg: "bg-amber-100",
      iconColor: "text-amber-500",
    },
    {
      icon: ShieldCheck,
      text: "Your data",
      sub: "encrypted and private, always",
      bg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
  ].map((f) => (
    <div key={f.text} className="flex items-start gap-3">
      {/* Icon Box */}
      <div
        className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center flex-shrink-0 shadow-sm`}
      >
        <f.icon className={`w-5 h-5 ${f.iconColor}`} />
      </div>

      {/* Text */}
      <p className="text-[15px] text-black leading-relaxed pt-1">
        <span className="font-bold text-black">{f.text}</span> {f.sub}
      </p>
    </div>
  ))}
</div>
      </div>
      <div className="pb-3">
  <div className="rounded-2xl  border border-[#baaff7] px-3 py-4 shadow-sm max-w-[260px]">
    
    <p className="text-[13px] italic text-black leading-relaxed mb-3">
      &ldquo;It predicted I&apos;d score 87 on Exam 2. <br />
      I scored 89. It&apos;s right enough that <br />
      I trust it for the next one.&rdquo;
    </p>

    <p className="text-[11px] font-semibold text-[#534AB7]">
      — Biology student, Fall 2026
    </p>

  </div>
</div>
     
    </div>

    {/* RIGHT PANEL */}
    <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center bg-white">
      <div className="max-w-[420px] w-full mx-auto">
        <h2 className="text-3xl font-extrabold text-[#1A1A2E] mb-2">
          Log in to Atlas
        </h2>

        <p className="text-[13px] text-[#8786a1] mb-7">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-[#534AB7] font-semibold hover:underline"
          >
            Sign up free
          </Link>
        </p>

        {/* GOOGLE BUTTON */}
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

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-[#F0EFF8]" />
          <span className="text-[13px] font-medium text-[#4d4d4e]">
            or continue with email
          </span>
          <div className="flex-1 h-px bg-[#F0EFF8]" />
        </div>

        {/* ERRORS */}
        {error && !hasPassError && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3.5 py-3 mb-4">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-[13px] font-medium text-red-600 whitespace-pre-line">
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-[13px] font-bold text-gray-500 mb-2 uppercase tracking-wide">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jordan@university.edu"
              autoComplete="email"
              className={inp}
            />
          </div>

          <div>
            <label className="block text-[13px] font-bold text-gray-500 mb-2 uppercase tracking-wide">
              Password
            </label>

            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className={hasPassError ? inpErr + " pr-11" : inp + " pr-11"}
              />

              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C5C3E8] hover:text-[#534AB7] transition-colors"
              >
                {showPass ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {hasPassError && (
              <div className="flex items-center gap-1.5 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                <p className="text-[12px] text-red-500 font-medium">
                  Incorrect password.{" "}
                  <a
                    href="#"
                    className="text-[#534AB7] font-semibold hover:underline"
                  >
                    Reset it
                  </a>
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end -mt-1">
            <a
              href="#"
              className="text-[12px] font-semibold text-[#85859b] hover:text-[#534AB7] transition-colors"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#534AB7] hover:bg-[#3C3489] disabled:opacity-60 text-white font-bold py-4 rounded-2xl text-[14px] flex items-center justify-center gap-2 shadow-lg shadow-[#534AB7]/20 transition-all"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>→ Log in</>
            )}
          </button>
        </form>

        <p className="text-center text-[11px] text-gray-600 mt-5">
          Protected by{" "}
          <a
            href="#"
            className="underline hover:text-[#534AB7] transition-colors"
          >
            privacy policy
          </a>
          . No ads. No data selling.
        </p>
      </div>
    </div>
  </div>
</main>
  );
}
