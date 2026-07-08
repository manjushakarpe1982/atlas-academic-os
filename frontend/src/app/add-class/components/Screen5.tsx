"use client";
// Screen 5 — Add Textbook (Optional): scan barcode or enter ISBN
import { useState, useRef } from "react";
import { Barcode, Hash, Loader2, XCircle } from "lucide-react";
import { Phone } from "./shared";
import { API_BASE, getToken } from "@/lib/api";

type Tab = "scan" | "isbn";

interface Props {
  onNext: () => void;
  onBack: () => void;
  onBookFound?: (book: any) => void;
}

export default function Screen5({ onNext, onBack, onBookFound }: Props) {
  const [tab, setTab] = useState<Tab>("scan");
  const [preview, setPreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [isbnInput, setIsbnInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
      // Auto-scan after capture
      doScan(reader.result as string);
    };
    reader.readAsDataURL(file);
    setError("");
  };

  const doScan = async (imageData: string) => {
    setScanning(true);
    setError("");
    try {
      const base64 = imageData.split(",")[1];
      const mediaType = imageData.split(";")[0].split(":")[1] || "image/jpeg";
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/classes/book/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ image: base64, media_type: mediaType }),
      });
      const data = await res.json();
      if (data.success && data.book) {
        onBookFound?.({ ...data.book, isbn: data.isbn });
      } else {
        setError(data.error || "Could not find book. Try again.");
        setPreview(null);
      }
    } catch {
      setError("Something went wrong. Try again.");
      setPreview(null);
    } finally {
      setScanning(false);
    }
  };

  const lookupIsbn = async () => {
    const isbn = isbnInput.replace(/[-\s]/g, "").trim();
    if (!isbn) return;
    setScanning(true);
    setError("");
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/classes/book/lookup`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isbn }),
      });
      const data = await res.json();
      if (data.success && data.book) {
        onBookFound?.({ ...data.book, isbn: data.isbn });
      } else {
        setError(data.error || "Book not found for this ISBN.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setScanning(false);
    }
  };

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
              onClick={() => { setTab(t); setError(""); }}
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

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 mb-4">
            <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}

        {/* Tab content */}
        {tab === "scan" ? (
          <>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleCapture} className="hidden" />
            <div
              onClick={() => !scanning && fileRef.current?.click()}
              className="bg-violet-50 border border-violet-200 rounded-3xl p-4 relative w-full max-w-[310px] mx-auto aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-violet-100 transition-all"
            >
              {/* Corner Brackets */}
              <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-blue-600 rounded-tl-2xl"></div>
              <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-blue-600 rounded-tr-2xl"></div>
              <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-blue-600 rounded-bl-2xl"></div>
              <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-blue-600 rounded-br-2xl"></div>

              {scanning ? (
                <>
                  {preview && <img src={preview} alt="Scanning" className="w-32 h-32 object-contain rounded-xl mb-3 opacity-60" />}
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
                  <p className="text-center text-sm font-bold text-indigo-700">Finding your book...</p>
                </>
              ) : (
                <>
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
                    Tap to scan the barcode
                    <br />
                    on the back of your book
                  </p>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <input
              value={isbnInput}
              onChange={(e) => setIsbnInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && lookupIsbn()}
              placeholder="Enter ISBN (e.g. 9780134710723)"
              className="w-full px-4 py-3 border-2 border-gray-200 focus:border-indigo-500 rounded-xl outline-none text-sm"
            />
            <button
              onClick={lookupIsbn}
              disabled={scanning || !isbnInput.trim()}
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              {scanning ? <><Loader2 className="w-4 h-4 animate-spin" /> Finding Book...</> : "🔍 Find Book"}
            </button>
          </div>
        )}
      </div>
    </Phone>
  );
}
