'use client';
// Screen 6 — Textbook Found: shows real scanned book details
import { CheckCircle2, BookOpen } from 'lucide-react';
import { Phone } from './shared';

interface Props {
  onNext: () => void;
  onBack: () => void;
  book?: any;
}

export default function Screen6({ onNext, onBack, book }: Props) {
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

        {/* Description */}
        {book?.description && (
          <p className="text-xs text-gray-500 leading-relaxed mb-4 bg-gray-50 rounded-xl p-3 border border-gray-100">
            {book.description}...
          </p>
        )}

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
