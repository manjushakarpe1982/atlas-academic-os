"use client";
// Screen 7 — Add Textbook (Optional)
import { useState } from "react";
import { ArrowLeft, Barcode, Hash } from "lucide-react";
import { Phone } from "./shared";
import { ScreenProps } from "./types";

type Tab = "scan" | "isbn";

export default function Screen7({ onNext, onBack }: ScreenProps) {
  const [tab, setTab] = useState<Tab>("scan");

  return (
    <Phone step={4} total={5}>
      <div className=" py-2">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
          Add your textbook?
        </h1>
        <p className="text-base text-gray-400 mb-5 leading-relaxed">
          This helps Atlas give you chapter-level recommendations.
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 bg-gray-100 rounded-2xl p-1">
          {(["scan", "isbn"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                tab === t
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-500"
              }`}
            >
              {t === "scan" ? (
                <span className="flex items-center justify-center gap-1">
                  <Barcode className="w-3.5 h-3.5" /> Scan Barcode
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1">
                  <Hash className="w-3.5 h-3.5" /> Enter ISBN
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "scan" ? (
          <div className="bg-violet-50 border border-violet-200 rounded-3xl p-4 relative w-full max-w-[310px] mx-auto aspect-square flex flex-col items-center justify-center">
            {/* Corner Brackets */}
            <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-blue-600 rounded-tl-2xl"></div>
            <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-blue-600 rounded-tr-2xl"></div>
            <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-blue-600 rounded-bl-2xl"></div>
            <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-blue-600 rounded-br-2xl"></div>

            {/* Barcode */}
            <div className="mb-3">
              <div className="w-40 h-12 text-black rounded flex items-center justify-center gap-1 px-3">
                {Array.from({ length: 15 }).map((_, i) => (
                  <div
                    key={i}
                    className={`bg-black w-[3px] ${i % 3 === 0 ? "h-8" : i % 2 === 0 ? "h-6" : "h-10"}`}
                  />
                ))}
              </div>
            </div>

            {/* Text */}
            <p className="text-center text-sm font-medium text-gray-700 leading-snug">
              Position barcode within
              <br />
              the frame to scan
            </p>
          </div>
        ) : (
          <input
            placeholder="Enter ISBN (e.g. 9780134710723)"
            className="w-full px-4 py-3 border-2 border-gray-200 focus:border-indigo-500 rounded-xl outline-none text-sm mb-5"
          />
        )}
      </div>
    </Phone>
  );
}
