"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token,    setToken]    = useState<string | null>(null);
  const [tokenChecked, setTokenChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState(false);
  const [loading,  setLoading]  = useState(false);

  /* ── Parse the recovery token from the URL on mount ───────────
   * Supabase sends users here with the access token in the URL hash:
   *   /reset-password#access_token=…&type=recovery&…
   * (It also supports `?code=…` for newer flows, so we check both.)
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Hash params (Supabase implicit / recovery flow)
    const hash = window.location.hash.replace(/^#/, "");
    const hashParams = new URLSearchParams(hash);
    const hashToken  = hashParams.get("access_token");

    // 2. Query params (some configurations use ?token=…)
    const queryParams = new URLSearchParams(window.location.search);
    const queryToken  = queryParams.get("access_token") || queryParams.get("token");

    setToken(hashToken || queryToken || null);
    setTokenChecked(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("This reset link is invalid or has expired. Please request a new one.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: token, new_password: password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.detail || "Could not reset password. Please try again.");
        setLoading(false);
        return;
      }
      setSuccess(true);
      // Take them to the login page after a moment.
      setTimeout(() => router.push("/login"), 2500);
    } catch {
      setError("Cannot reach the server. Please check your connection.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F2FF] via-[#FAFAFE] to-[#EFEBFF] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        <div className="bg-white rounded-3xl border border-[#ECE9FF] shadow-xl p-7 md:p-9">

          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-[#534AB7] flex items-center justify-center shadow-md shadow-[#534AB7]/30">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-[22px] font-extrabold text-[#14142B] leading-tight">
                Set a new password
              </h1>
              <p className="text-[12.5px] text-[#6B6A8A]">Choose a strong one you&apos;ll remember.</p>
            </div>
          </div>

          {/* Token check — invalid / expired link */}
          {tokenChecked && !token && !success && (
            <div className="text-center py-2">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <ShieldAlert className="w-7 h-7 text-red-600" />
              </div>
              <p className="text-base font-extrabold text-[#14142B] mb-2">
                This link is invalid or has expired
              </p>
              <p className="text-sm text-[#6B6A8A] leading-relaxed mb-6">
                Reset links are only valid for 1 hour. Please request a fresh link.
              </p>
              <Link
                href="/forgot-password"
                className="inline-flex items-center justify-center w-full bg-[#534AB7] hover:bg-[#3C3489] text-white font-bold py-3 rounded-2xl text-sm shadow-lg shadow-[#534AB7]/20 transition-all"
              >
                Request a new reset link
              </Link>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="text-center py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
              <p className="text-base font-extrabold text-[#14142B] mb-2">
                Password updated!
              </p>
              <p className="text-sm text-[#6B6A8A] leading-relaxed mb-5">
                Taking you to the login page…
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center w-full bg-[#534AB7] hover:bg-[#3C3489] text-white font-bold py-3 rounded-2xl text-sm shadow-lg shadow-[#534AB7]/20 transition-all"
              >
                Log in now
              </Link>
            </div>
          )}

          {/* Form — only show when we have a token and not yet successful */}
          {tokenChecked && token && !success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[13px] font-bold text-[#3A3A52] mb-1.5">
                  New password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full h-12 px-4 pr-11 rounded-xl border border-[#E8E8F3] bg-[#FAFAFE] text-sm font-medium text-[#1A1A2E] placeholder:text-[#bbb9d4] outline-none transition-all hover:border-[#ABA9FA] focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7]/20 focus:bg-white"
                    autoFocus
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#85859b] hover:text-[#534AB7]"
                    tabIndex={-1}
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#3A3A52] mb-1.5">
                  Confirm new password
                </label>
                <input
                  type={showPass ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Type it again"
                  className="w-full h-12 px-4 rounded-xl border border-[#E8E8F3] bg-[#FAFAFE] text-sm font-medium text-[#1A1A2E] placeholder:text-[#bbb9d4] outline-none transition-all hover:border-[#ABA9FA] focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7]/20 focus:bg-white"
                  required
                  minLength={8}
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 text-[13px] text-red-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#534AB7] hover:bg-[#3C3489] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-2xl text-sm shadow-lg shadow-[#534AB7]/20 transition-all"
              >
                {loading ? "Updating…" : "Update password"}
              </button>

              <p className="text-center text-[12px] text-[#85859b]">
                Remembered it?{" "}
                <Link href="/login" className="font-semibold text-[#534AB7] hover:underline">
                  Log in
                </Link>
              </p>
            </form>
          )}

          {/* Initial state while token is being parsed */}
          {!tokenChecked && (
            <p className="text-sm text-[#6B6A8A] text-center py-4">Checking your reset link…</p>
          )}
        </div>
      </div>
    </div>
  );
}
