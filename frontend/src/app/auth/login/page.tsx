"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Brain, Eye, EyeOff, HelpCircle, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { API_BASE, saveAuth } from "@/lib/api";
import { createClient } from "@/lib/supabase";


function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  /* ── Google sign-in ── */
  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setError('Could not start Google sign-in. Please try again.');
        setGoogleLoading(false);
      }
    } catch {
      setError('Could not start Google sign-in. Please try again.');
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pw) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: pw }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Invalid email or password");
        return;
      }
      // Save token + user, then route based on onboarding state
      saveAuth(data.access_token, data.user);
      if (!data.user?.school) {
        router.push("/school-selection");
      } else if (!data.user?.acknowledged_at) {
        router.push("/acknowledgment");
      } else {
        router.push("/classes");
      }
    } catch {
      setError("Cannot reach server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col ">
      {/* ── FIXED HEADER ── */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
        <div className="px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-gray-900 text-base">
              Atlas
            </span>
          </div>
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            Need Help?
          </a>
        </div>
      </header>

      {/* ── SCROLLABLE CONTENT ── */}
      <main className="flex-1 overflow-y-auto pb-28">
        {/* Hero image — full width, not cropped */}
       
        <div className="px-5 pt-2">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1 flex items-center gap-2">
  Welcome back
  <span className="text-3xl">👋</span>
</h1>
          <p className="text-sm text-gray-400 mb-1">
            No account?{" "}
            <Link
              href="/auth/signup"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Create one free
            </Link>
          </p>

           <div className="relative w-full mb-4" style={{ paddingBottom: "65%" }}>
          <Image
            src="https://res.cloudinary.com/mview/image/upload/v1781155922/atlas/loginpage.png"
            alt="Login illustration"
            fill
            className="object-cover object-center"
            priority
          />
         
        </div>


          {/* Continue with Google */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 border-2 border-gray-300 hover:border-gray-300 bg-white text-gray-700 font-semibold py-3 rounded-xl text-sm transition-all shadow-sm mb-4"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-500 font-medium">
              or sign in with email
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-red-700 text-sm">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[15px] font-bold text-gray-600 mb-1 block">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                required
                autoComplete="email"
                className="w-full px-4 py-3 border-2 border-gray-300 focus:border-indigo-500 rounded-xl outline-none text-base transition-all"
              />
            </div>

            <div>
              <label className="text-[15px] font-bold text-gray-600 mb-1 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 border-2 border-gray-300 focus:border-indigo-500 rounded-xl outline-none text-base transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {show ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="text-right mt-1.5">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-indigo-600 font-semibold hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={!email || !pw || loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-md text-base mt-2"
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>
        </div>
      </main>

      {/* ── FIXED FOOTER ── */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-100 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <div className="max-w-md mx-auto px-5 py-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-base font-semibold text-gray-700 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
      </footer>
    </div>
  );
}
