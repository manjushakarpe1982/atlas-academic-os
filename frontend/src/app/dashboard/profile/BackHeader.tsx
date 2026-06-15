'use client';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackHeader({ title }: { title: string }) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 sticky top-14 z-10">
      <button onClick={() => router.back()}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
        <ArrowLeft className="w-5 h-5 text-gray-600" />
      </button>
      <h1 className="text-base font-extrabold text-gray-900">{title}</h1>
    </div>
  );
}
