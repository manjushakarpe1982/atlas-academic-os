"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Clock, Layers, Play, ChevronRight } from "lucide-react";
import AppHeader from "../_components/AppHeader";

const STEPS = [
  { num: 1, title: "Choose Your School", icon: "🏫", color: "bg-orange-100" },
  { num: 2, title: "Add Your Classes", icon: "📚", color: "bg-green-100" },
  { num: 3, title: "Upload Your Syllabus", icon: "📄", color: "bg-blue-100" },
  {
    num: 4,
    title: "Atlas Reads Everything",
    icon: "🤖",
    color: "bg-purple-100",
  },
  { num: 5, title: "Review & Edit", icon: "✏️", color: "bg-indigo-100" },
  {
    num: 6,
    title: "Enter Current Grades (Optional)",
    icon: "📊",
    color: "bg-pink-100",
  },
  { num: 7, title: "Add Your Calendar", icon: "📅", color: "bg-amber-100" },
  { num: 8, title: "Get Smart Study Plans", icon: "🎯", color: "bg-teal-100" },
];

export default function HelpPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const from         = searchParams.get('from');

  const goBack = () => {
    if (from) router.push(from);
    else goBack();
  };

  return (
    <div className="min-h-screen bg-white max-w-md mx-auto flex flex-col">
      {/* ── Back link ── */}
      <AppHeader right="avatar" />

      {/* ── Hero — both images as bg, text overlaps ── */}
   <div className="w-full">
  {/* Image Section - Top */}
  <header className=" bg-white  px-4 py-2 flex items-center gap-3">
        <button  onClick={() => router.back()}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <span className="text-sm font-bold text-indigo-600">How Atlas Works</span>
      </header>

  {/* Text Content - Below Image */}
  <div className="bg-white rounded-b-3xl px-4 pb-3 ">
    <h1 className="text-2xl font-extrabold text-gray-900 leading-tight mb-3">
      How Atlas Works
    </h1>
    
    <p className="text-sm text-gray-600 leading-relaxed mb-3">
      Atlas uses AI to turn your syllabus, grades, and calendar into a personalized plan that helps you improve your grades.
    </p>

    {/* Stats Badges */}
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2">
        <Layers className="w-4 h-4 text-indigo-600" />
        <span className="text-xs font-bold text-indigo-700">8 Simple Steps</span>
      </div>
      
      <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2">
        <Clock className="w-4 h-4 text-indigo-600" />
        <span className="text-xs font-bold text-indigo-700">~8 min</span>
      </div>
    </div>
  </div>
    <div className="relative w-full overflow-hidden " style={{ height: "260px" }}>
    <Image
      src="https://res.cloudinary.com/mview/image/upload/atlas/needhelppage1.webp"
      alt="Student"
      fill
      className="object-cover"
      priority
    />

    {/* Optional light gradient at bottom of image */}
 

    {/* Sparkles on image */}
    <span className="absolute top-6 left-8 text-indigo-300 text-2xl select-none pointer-events-none">
      ✦
    </span>
    <span className="absolute top-12 right-10 text-purple-200 text-xl select-none pointer-events-none">
      ✦
    </span>
  </div>
</div>

      {/* ── Steps list with dotted connector line + numbers outside cards ── */}
      <div className="px-8 py-4 flex-1">
        <div className="relative">
          {/* Dotted vertical line — runs through all number circles */}
          <div
            className="absolute top-4 bottom-4 border-l-2 border-dashed border-indigo-200"
            style={{ left: 15 }}
          />

          <div className="space-y-3 ">
            {STEPS.map((s, i) => (
              <div key={s.num} className="flex items-center gap-3">
                {/* Number circle — sits ON the dotted line */}
                <div className="relative z-10 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm shadow-indigo-200">
                  <span className="text-white text-xs font-extrabold">
                    {s.num}
                  </span>
                </div>

                {/* Card — NO number inside, just icon + title + chevron */}
                <div className="flex-1 flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-all cursor-pointer">
                  <div
                    className={`w-9 h-9 ${s.color} rounded-xl flex items-center justify-center text-lg flex-shrink-0`}
                  >
                    {s.icon}
                  </div>
                  <p className="flex-1 text-sm font-bold text-gray-800">
                    {s.title}
                  </p>
                  <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA card ── */}
    <div className="relative w-full rounded-xl overflow-hidden h-[360px] md:h-[340px]">
  {/* Background Image */}
  <Image
    src="https://res.cloudinary.com/mview/image/upload/atlas/needhelppage2.webp"
    alt="Robot"
    fill
    className="object-cover"
    priority
  />

 
  {/* Content */}
  <div className="relative z-10 h-full flex flex-col justify-end p-2  text-center">
    <h2 className="text-xl font-extrabold text-black mb-1.5 leading-tight">
      Ready to improve your grades?
    </h2>
    <p className="text-sm text-black mb-6 o">
      Let&apos;s get you set up in just a few minutes
    </p>

    <button
      onClick={() => router.back()}
      className="flex items-center justify-center gap-2 w-full max-w-[280px] mx-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-sm shadow-md shadow-indigo-200 transition-all mb-3"
    >
      Continue Setup →
    </button>

    <button
      className="flex items-center justify-center gap-2 w-full max-w-[280px] mx-auto border-2 bg-white border-white/40 hover:border-white text-indigo-600 font-bold py-3 rounded-xl text-sm transition-all"
    >
      <Play className="w-3.5 h-3.5" />
      Watch Quick Tour
    </button>
  </div>
</div>
    </div>
  );
}
