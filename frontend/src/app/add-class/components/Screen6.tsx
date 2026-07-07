'use client';
// Screen 6 — Textbook Found: real book details + Table of Contents
import { useState, useEffect } from 'react';
import { CheckCircle2, BookOpen, Loader2, List } from 'lucide-react';
import { Phone } from './shared';
import { API_BASE, getToken } from '@/lib/api';

interface Chapter { number: number; title: string; }

interface Props {
  onNext: () => void;
  onBack: () => void;
  book?: any;
}

export default function Screen6({ onNext, onBack, book }: Props) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loadingToc, setLoadingToc] = useState(false);

  useEffect(() => {
    if (!book?.title) return;
    const fetchToc = async () => {
      setLoadingToc(true);
      try {
        const token = getToken();
        const res = await fetch(`${API_BASE}/api/classes/book/toc`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            title: book.title,
            authors: book.authors || '',
            publisher: book.publisher || '',
            published_date: book.published_date || '',
          }),
        });
        const data = await res.json();
        if (data.success && data.chapters) setChapters(data.chapters);
      } catch {} finally { setLoadingToc(false); }
    };
    fetchToc();
  }, [book]);

  return (
    <Phone step={4} total={5}>
      <div className="flex flex-col bg-white overflow-hidden">

        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">We found your textbook!</h1>
        <p className="text-sm text-gray-400 mb-5">Is this the correct book?</p>

        {/* Book card */}
        <div className="flex gap-4 bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100">
          {book?.cover_url ? (
            <img src={book.cover_url} alt={book.title} className="w-20 h-28 object-cover rounded-xl shadow-md flex-shrink-0" />
          ) : (
            <div className="w-20 h-28 bg-indigo-900 rounded-xl flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-8 h-8 text-white opacity-70" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-extrabold text-gray-900 text-base leading-snug">{book?.title || 'Unknown Book'}</p>
            {book?.authors && <p className="text-sm text-gray-400 mt-1">Author: {book.authors}</p>}
            {book?.publisher && <p className="text-sm text-gray-400">Publisher: {book.publisher}{book?.published_date ? ` · ${book.published_date}` : ''}</p>}
            {book?.page_count && <p className="text-sm text-gray-400">{book.page_count} pages</p>}
            {book?.isbn && (
              <span className="inline-flex items-center gap-1 mt-2 bg-green-100 text-green-700 text-[12px] font-bold px-2 py-0.5 rounded-full font-mono">
                ISBN: {book.isbn}
              </span>
            )}
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
          <p className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
            <List className="w-4 h-4 text-indigo-600" /> Table of Contents
          </p>
          {loadingToc ? (
            <div className="flex flex-col items-center py-6 gap-2">
              <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
              <p className="text-xs text-gray-400">Loading chapters...</p>
            </div>
          ) : chapters.length > 0 ? (
            <div className="max-h-[220px] overflow-y-auto space-y-1 pr-1">
              {chapters.map((ch) => (
                <div key={ch.number} className="flex items-start gap-2.5 py-1.5 border-b border-gray-50 last:border-0">
                  <span className="w-6 h-6 bg-indigo-50 text-indigo-600 rounded-md flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                    {ch.number}
                  </span>
                  <p className="text-sm text-gray-700 leading-snug pt-0.5">{ch.title}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 text-center py-4">Table of contents not available for this book</p>
          )}
        </div>

        {/* Benefits */}
        <div className="bg-indigo-50 rounded-xl p-3 mb-5 border border-indigo-100">
          <p className="text-base font-bold text-indigo-800 mb-2">What we&apos;ll get for you:</p>
          {['Table of contents', 'Chapter topics', 'Better study recommendations'].map(t => (
            <div key={t} className="flex items-center gap-2 mt-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <span className="text-sm text-indigo-700">{t}</span>
            </div>
          ))}
        </div>

      </div>
    </Phone>
  );
}
