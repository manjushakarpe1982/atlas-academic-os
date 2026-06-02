"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-200 bg-white"
      style={{
        borderBottom: scrolled
          ? "1px solid rgba(83,74,183,0.12)"
          : "1px solid #F0EFF8",
        boxShadow: scrolled ? "0 1px 16px rgba(83,74,183,0.07)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#534AB7] flex items-center justify-center shadow-md shadow-[#534AB7]/25">
            <span className="text-white font-extrabold text-sm">A</span>
          </div>
          <span className="font-extrabold text-[#18172B] text-base tracking-tight">
            Atlas
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Features", href: "#features" },
            { label: "How it works", href: "#how-it-works" },
            { label: "For students", href: "#testimonials" },
            { label: "Pricing", href: "/pricing" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm font-medium text-[#6B6A8A] hover:text-[#534AB7] transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-semibold text-[#6B6A8A] hover:text-[#534AB7] px-4 py-2 rounded-xl hover:bg-[#EEEDFE] transition-all"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="bg-[#534AB7] hover:bg-[#3C3489] text-white text-sm font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-[#534AB7]/20 transition-all"
          >
            Get started free <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <button
          className="md:hidden p-2 rounded-lg text-[#6B6A8A] hover:bg-[#EEEDFE]"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-[#EEEDFE] px-6 py-5 space-y-3 shadow-lg">
          {["Features", "How it works", "For students"].map((l) => (
            <a
              key={l}
              href="#"
              className="block text-sm font-medium text-[#6B6A8A] py-1.5"
              onClick={() => setOpen(false)}
            >
              {l}
            </a>
          ))}
          <a
            href="/pricing"
            className="block text-sm font-medium text-[#6B6A8A] py-1.5"
            onClick={() => setOpen(false)}
          >
            Pricing
          </a>
          <div className="pt-3 flex flex-col gap-2 border-t border-[#EEEDFE]">
            <Link
              href="/login"
              className="text-sm font-semibold text-center text-[#6B6A8A] py-2"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="bg-[#534AB7] text-white text-sm font-bold px-5 py-2.5 rounded-xl text-center"
            >
              Get started free
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
