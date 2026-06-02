"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState("");
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = email.trim();
    if (!trimmed) {
      setError("Please enter your email address.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(trimmed)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.detail || "Could not send reset email. Please try again.");
        setLoading(false);
        return;
      }
      setSuccess(true);
    } catch {
      setError("Cannot reach the server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F2FF] via-[#FAFAFE] to-[#EFEBFF] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Back to login */}
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6B6A8A] hover:text-[#534AB7] mb-5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to login
        </Link>

        <div className="bg-white rounded-3xl border border-[#ECE9FF] shadow-xl p-7 md:p-9">

          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-[#534AB7] flex items-center justify-center shadow-md shadow-[#534AB7]/30">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-[22px] font-extrabold text-[#14142B] leading-tight">
                Forgot your password?
              </h1>
              <p className="text-[12.5px] text-[#6B6A8A]">No worries — we&apos;ll send you a reset link.</p>
            </div>
          </div>

          {success ? (
            /* ── Success state ──────────────────────────────── */
            <div className="text-center py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
              <p className="text-base font-extrabold text-[#14142B] mb-2">
                Check your inbox
              </p>
              <p className="text-sm text-[#6B6A8A] leading-relaxed mb-5">
                If an account exists for <span className="font-semibold text-[#534AB7]">{email}</span>,
                we&apos;ve sent a link to reset your password. The link expires in 1 hour.
              </p>

              {/* Step-by-step instructions so the flow is obvious */}
              <div className="text-left bg-[#F4F2FF] border border-[#E8E5FD] rounded-2xl p-4 mb-5">
                <p className="text-[11px] font-extrabold text-[#534AB7] uppercase tracking-widest mb-2.5">
                  Next steps
                </p>
                <ol className="space-y-2 text-[13px] text-[#3A3A52]">
                  <li className="flex gap-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#534AB7] text-white text-[10px] font-extrabold flex items-center justify-center">1</span>
                    <span>Open the email we just sent</span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#534AB7] text-white text-[10px] font-extrabold flex items-center justify-center">2</span>
                    <span>Click the <span className="font-semibold">reset password link</span> inside</span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#534AB7] text-white text-[10px] font-extrabold flex items-center justify-center">3</span>
                    <span>Set a new password on the page that opens</span>
                  </li>
                </ol>
              </div>

              <p className="text-[12px] text-[#85859b] mb-1.5">
                Didn&apos;t get it? Check your spam folder or
              </p>
              <button
                onClick={() => { setSuccess(false); }}
                className="text-[13px] font-bold text-[#534AB7] hover:underline mb-5"
              >
                try a different email
              </button>

              <div className="pt-4 border-t border-[#EEEDFE]">
                <Link
                  href="/login"
                  className="text-[12px] font-semibold text-[#85859b] hover:text-[#534AB7] transition-colors"
                >
                  ← Back to login
                </Link>
              </div>
            </div>
          ) : (
            /* ── Form ───────────────────────────────────────── */
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-[#6B6A8A] leading-relaxed">
                Enter the email address associated with your account
                and we&apos;ll send you a link to reset your password.
              </p>

              <div>
                <label className="block text-[13px] font-bold text-[#3A3A52] mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@school.edu"
                  className="w-full h-12 px-4 rounded-xl border border-[#E8E8F3] bg-[#FAFAFE] text-sm font-medium text-[#1A1A2E] placeholder:text-[#bbb9d4] outline-none transition-all hover:border-[#ABA9FA] focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7]/20 focus:bg-white"
                  autoFocus
                  required
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
                {loading ? "Sending…" : "Send reset link"}
              </button>

              <p className="text-center text-[12px] text-[#85859b]">
                Remembered it?{" "}
                <Link href="/login" className="font-semibold text-[#534AB7] hover:underline">
                  Log in
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
