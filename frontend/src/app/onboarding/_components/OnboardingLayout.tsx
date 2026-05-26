"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Check,
  Shield,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  LayoutDashboard,
  AlertTriangle,
  X,
} from "lucide-react";
import { STEPS } from "./constants";

interface Props {
  children: React.ReactNode;
  step: number;
  disableNext?: boolean;
}

/* ─── Skip modal ─────────────────────────────────────────────── */
function SkipModal({
  onClose,
  onDashboard,
}: {
  onClose: () => void;
  onDashboard: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-[28px] shadow-2xl w-full max-w-md overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-[#534AB7] to-[#7B6FE8]" />
        <div className="p-8">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-5">
            <AlertTriangle className="w-7 h-7 text-amber-500" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#1A1A2E] mb-2">
            Skip setup?
          </h2>
          <p className="text-sm text-[#6B6A8A] font-light leading-relaxed mb-6">
            You can always complete your profile later in{" "}
            <strong className="text-[#534AB7] font-semibold">Settings</strong>.
            Without setup, Atlas will use default preferences.
          </p>
          <div className="bg-[#F8F7FF] border border-[#E8E5FD] rounded-2xl p-4 mb-6">
            <p className="text-[11px] font-extrabold text-[#534AB7] uppercase tracking-widest mb-3">
              What you&apos;ll miss
            </p>
            <ul className="space-y-2">
              {[
                "Personalised study plan based on your goals",
                "AI study guides calibrated to your field",
                "Sleep & schedule conflict detection",
                "Accurate grade predictions for your courses",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[9px] text-amber-600 font-bold">
                      !
                    </span>
                  </div>
                  <span className="text-[12px] text-[#6B6A8A]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 border-2 border-[#E8E5FD] hover:border-[#534AB7]/40 text-[#6B6A8A] hover:text-[#534AB7] font-semibold py-3 rounded-2xl text-sm transition-all hover:bg-[#F8F7FF]"
            >
              Continue setup
            </button>
            <button
              onClick={onDashboard}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#534AB7] to-[#6B5FE8] text-white font-bold py-3 rounded-2xl text-sm transition-all shadow-lg shadow-[#534AB7]/20"
            >
              <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingLayout({
  children,
  step,
  disableNext,
}: Props) {
  const router = useRouter();
  const [userName, setUserName] = useState("Student");
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    const n = localStorage.getItem("atlas_full_name");
    if (n) setUserName(n.split(" ")[0]);
  }, []);

  const pct = ((step - 1) / (STEPS.length - 1)) * 100;
  const prevHref = step > 1 ? STEPS[step - 2].href : null;
  const nextHref = step < 5 ? STEPS[step].href : null;

  return (
    <>
      {showSkip && (
        <SkipModal
          onClose={() => setShowSkip(false)}
          onDashboard={() => router.push("/home")}
        />
      )}

      <div className="h-screen flex flex-col overflow-hidden bg-[#F7F6FF]">
        {/* ── Top header ───────────────────────────────────────── */}
        <header className="h-14 flex-shrink-0 bg-white border-b border-[#EEEDFE] flex items-center px-5 justify-between z-40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#534AB7] flex items-center justify-center shadow-md shadow-[#534AB7]/30">
              <span className="text-white font-extrabold text-base">A</span>
            </div>
            <span className="text-base font-extrabold text-[#1A1A2E] tracking-tight">
              Atlas
            </span>
          </div>
          <a
            href="/help"
            className="text-sm font-medium text-[#6B6A8A] hover:text-[#534AB7] flex items-center gap-1.5 transition-colors"
          >
            <HelpCircle className="w-4 h-4" /> Need help?
          </a>
        </header>

        {/* ── Main row ─────────────────────────────────────────── */}
        <div className="flex flex-1 min-h-0">
          {/* ── Sidebar ──────────────────────────────────────────── */}
          <aside className="w-[270px] flex-shrink-0  flex-col bg-white border-r border-[#EEEDFE] px-5 py-6 overflow-y-auto hidden md:flex">
            {/* Progress title + bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-extrabold text-[#1A1A2E]">
                  Onboarding Progress
                </span>
                <span className="text-xs font-semibold text-[#9B9AB5]">
                  {step} of {STEPS.length}
                </span>
              </div>
              <div className="h-1.5 bg-[#EEEDFE] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#534AB7] rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {/* Step list */}
            <div className="flex flex-col gap-4 flex-1">
              {STEPS.map((s) => {
                const done = step > s.n;
                const active = step === s.n;
                const locked = !done && !active; // Future steps

                return (
                  <Link
                    key={s.n}
                    href={done ? s.href : "#"}
                    onClick={(e) => !done && !active && e.preventDefault()}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                      active
                        ? "bg-[#F0EEFF] border border-[#D5D0FF]"
                        : done
                          ? "hover:bg-[#F8F7FF]"
                          : "opacity-120 hover:bg-gray-50" // Removed heavy opacity
                    }`}
                  >
                    {/* Icon circle */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
                        active
                          ? "bg-[#534AB7] border-[#534AB7]"
                          : done
                            ? "bg-[#534AB7] border-[#534AB7]"
                            : "bg-white border-[#D5D3FD]"
                      }`}
                    >
                      {done ? (
                        <Check
                          className="w-5 h-5 text-white"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <s.icon
                          className={`w-5 h-5 ${
                            active ? "text-white" : "text-[#9B9AB5]"
                          }`}
                        />
                      )}
                    </div>

                    {/* Text */}
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-base font-bold leading-none mb-0.5 ${
                          active
                            ? "text-[#534AB7]"
                            : done
                              ? "text-[#1A1A2E]"
                              : "text-[#8F8DA6]" // Better gray for locked steps
                        }`}
                      >
                        {s.n}. {s.label}
                      </p>
                      <p
                        className={`text-[11px] truncate ${
                          active
                            ? "text-[#6B6A8A]"
                            : done
                              ? "text-[#9B9AB5]"
                              : "text-[#A9A7C2]" // Softer but visible gray
                        }`}
                      >
                        {s.sub}
                      </p>
                    </div>

                    {/* Active dot */}
                    {active && (
                      <div className="w-2 h-2 rounded-full bg-[#534AB7] flex-shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Your Data is Safe */}
            <div className="mt-6 flex-shrink-0 bg-[#F8F7FF] border border-[#E8E5FD] rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 rounded-xl bg-[#EEEDFE] flex items-center justify-center flex-shrink-0">
                  <Shield className="w-3.5 h-3.5 text-[#534AB7]" />
                </div>
                <span className="text-sm font-extrabold text-[#1A1A2E]">
                  Your Data is Safe
                </span>
              </div>
              <p className="text-[11px] text-[#6B6A8A] leading-relaxed">
                We use enterprise-grade security to protect your data and
                privacy.
              </p>
            </div>
          </aside>

          {/* ── Content ──────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col min-w-0 min-h-0">
            {/* Mobile progress strip */}
            <div className="md:hidden bg-white border-b border-[#EEEDFE] px-4 py-3 flex-shrink-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-extrabold text-[#1A1A2E]">
                  Step {step} of {STEPS.length}
                </span>
                <span className="text-xs text-[#9B9AB5]">
                  {STEPS[step - 1]?.label}
                </span>
              </div>
              <div className="h-1.5 bg-[#EEEDFE] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#534AB7] rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 max-w-[1500px] mx-auto overflow-y-auto p-4 md:p-6">
              {children}
            </div>

            {/* Sticky bottom nav */}
            {step < 5 && (
              <div className="flex-shrink-0 bg-white border-t border-[#EEEDFE] px-6 py-4 flex items-center justify-between">
                {/* LEFT — Skip for now */}
                <button
                  onClick={() => setShowSkip(true)}
                  className="text-base font-medium text-indigo-600 hover:text-[#534AB7] "
                >
                  Skip for now
                </button>

                {/* RIGHT — Back + Continue */}
                <div className="flex items-center gap-3">
                  {prevHref ? (
                    <Link
                      href={prevHref}
                      className="flex items-center gap-1.5 text-sm font-semibold text-[#6B6A8A] hover:text-[#534AB7] border border-[#E8E5FD] hover:border-[#534AB7]/40 px-5 py-2.5 rounded-xl hover:bg-[#F8F7FF] transition-all"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </Link>
                  ) : (
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-[#D5D3F0] px-5 py-2.5 rounded-xl border border-[#F0EFF8] cursor-not-allowed select-none">
                      <ArrowLeft className="w-4 h-4" /> Back
                    </span>
                  )}
                  {nextHref && (
                    <Link
                      href={disableNext ? "#" : nextHref}
                      onClick={(e) => disableNext && e.preventDefault()}
                      className={`flex items-center gap-2 font-extrabold px-8 py-2.5 rounded-xl text-sm shadow-lg transition-all ${
                        disableNext
                          ? "bg-[#534AB7]/30 text-white/60 cursor-not-allowed"
                          : "bg-[#534AB7] hover:bg-[#3C3489] text-white shadow-[#534AB7]/25"
                      }`}
                    >
                      Continue <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
