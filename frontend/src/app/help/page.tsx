"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Clock, Layers, Play, ChevronRight, ChevronDown, Lightbulb } from "lucide-react";
import AppHeader from "../_components/AppHeader";
import { Suspense, useState } from "react";

const STEPS = [
  {
    num: 1, title: "Choose Your School", icon: "🏫", color: "bg-orange-100",
    desc: "We use your school to customize your academic calendar, grading rules, and resources.",
    listLabel: "",
    items: ["Search for your school", "Select your campus", "Tap Continue"],
    img: "https://res.cloudinary.com/mview/image/upload/atlas/helppage1.webp",
    time: "~30 seconds",
    why: "Accurate calendar, dates, holidays & grading info.",
  },
  {
    num: 2, title: "Add Your Classes", icon: "📚", color: "bg-green-100",
    desc: "Add the classes you're taking this term so Atlas can organize everything for you.",
    listLabel: "",
    items: ["Enter course names or codes", "Add instructor (optional)", "Set class schedule (optional)"],
    img: "https://res.cloudinary.com/mview/image/upload/atlas/helppage2.webp",
    time: "~1 minute",
    why: "Helps Atlas track your assignments, exams & grades by class.",
  },
  {
    num: 3, title: "Upload Your Syllabus", icon: "📄", color: "bg-blue-100",
    desc: "Upload your syllabus so Atlas can extract important details automatically.",
    listLabel: "You can upload",
    items: ["PDF documents", "Word files (.docx)", "Images (.jpg, .png)"],
    img: "https://res.cloudinary.com/mview/image/upload/atlas/helppage3.webp",
    time: "~1 minute",
    why: "Atlas pulls assignments, exams, weights & key dates.",
  },
  {
    num: 4, title: "Atlas Reads Everything", icon: "🤖", color: "bg-purple-100",
    desc: "Our AI reads and understands your syllabus in just a few seconds.",
    listLabel: "Atlas automatically finds",
    items: ["Assignments & due dates", "Exams & quizzes", "Grade weights", "Course topics & schedule", "Important deadlines"],
    img: "https://res.cloudinary.com/mview/image/upload/atlas/helppage4.webp",
    time: "~10–20 seconds",
    why: "Saves hours of manual work and ensures nothing is missed.",
  },
  {
    num: 5, title: "Review & Edit", icon: "✏️", color: "bg-indigo-100",
    desc: "Review the information extracted by Atlas and make any corrections if needed.",
    listLabel: "You can",
    items: ["Review all assignments, exams & dates", "Edit or delete incorrect items", "Add missing items manually", "Confirm and save"],
    img: "https://res.cloudinary.com/mview/image/upload/atlas/helppage5.webp",
    time: "~2–3 minutes",
    why: "You stay in control and get 100% accurate results.",
  },
  {
    num: 6, title: "Enter Current Grades (Optional)", icon: "📊", color: "bg-pink-100",
    desc: "Add your current grades to get a clear picture of where you stand.",
    listLabel: "You can",
    items: ["Enter grades manually", "Scan graded paper", "Upload LMS screenshot / PDF", "Atlas calculates your current grade in each class"],
    img: "https://res.cloudinary.com/mview/image/upload/atlas/helppage6.webp",
    time: "~2–5 minutes",
    why: "Helps Atlas build a more accurate study plan.",
  },
  {
    num: 7, title: "Add Your Calendar", icon: "📅", color: "bg-amber-100",
    desc: "Connect your calendar so Atlas can keep track of your schedule and deadlines.",
    listLabel: "You can",
    items: ["Connect Google Calendar", "Connect Outlook Calendar", "Import from Canvas / Blackboard", "Or skip for now"],
    img: "https://res.cloudinary.com/mview/image/upload/atlas/helppage7.webp",
    time: "~1–2 minutes",
    why: "Keeps everything in sync and prevents missed deadlines.",
  },
  {
    num: 8, title: "Get Smart Study Plans", icon: "🎯", color: "bg-teal-100",
    desc: "Atlas creates a personalized study plan to help you achieve your goals.",
    listLabel: "You get",
    items: ["Personalized weekly plan", "Priority recommendations", "Flashcards, quizzes & summaries", "Daily study reminders", "Track progress & improve"],
    img: "https://res.cloudinary.com/mview/image/upload/atlas/helppage8.webp",
    time: "Ongoing",
    why: "Helps you study smarter, stay consistent & succeed.",
  },
];

function HelpPageContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const from         = searchParams.get('from');
  const [openStep, setOpenStep] = useState<number | null>(null);

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
            {STEPS.map((s) => {
              const isOpen = openStep === s.num;
              return (
                <div key={s.num} className="flex items-start gap-3">
                  {/* Number circle — sits ON the dotted line */}
                  <div className="relative z-10 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm shadow-indigo-200 mt-1.5">
                    <span className="text-white text-xs font-extrabold">
                      {s.num}
                    </span>
                  </div>

                  {/* Card — expandable */}
                  <div className={`flex-1 border rounded-xl shadow-sm transition-all overflow-hidden ${isOpen ? 'bg-white border-indigo-200 shadow-md' : 'bg-white border-gray-100 hover:shadow-md'}`}>
                    <div
                      onClick={() => setOpenStep(isOpen ? null : s.num)}
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                    >
                      <div className={`w-9 h-9 ${s.color} rounded-xl flex items-center justify-center text-lg flex-shrink-0`}>
                        {s.icon}
                      </div>
                      <p className="flex-1 text-sm font-bold text-gray-800">
                        {s.title}
                      </p>
                      {isOpen ? (
                        <ChevronDown className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                      )}
                    </div>

                    {/* Expanded detail */}
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 border-t border-gray-50">
                        <p className="text-[13px] text-gray-600 leading-relaxed mb-3">
                          {s.desc}
                        </p>

                        {s.listLabel && (
                          <p className="text-xs font-bold text-gray-900 mb-1.5">{s.listLabel}</p>
                        )}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex-1 space-y-1.5">
                            {s.items.map((it) => (
                              <div key={it} className="flex items-start gap-2">
                                <span className="text-green-600 text-xs mt-0.5">✅</span>
                                <span className="text-[13px] text-gray-700 leading-snug">{it}</span>
                              </div>
                            ))}
                          </div>
                          {(s as any).img && (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={(s as any).img}
                              alt={s.title}
                              className="w-24 h-24 object-contain flex-shrink-0"
                            />
                          )}
                        </div>

                        {/* Time + Why boxes */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="border border-indigo-100 bg-indigo-50/50 rounded-xl p-2.5">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Clock className="w-3.5 h-3.5 text-indigo-600" />
                              <span className="text-[10px] font-bold text-indigo-600">Time Required</span>
                            </div>
                            <p className="text-[11px] font-semibold text-gray-700">{s.time}</p>
                          </div>
                          <div className="border border-amber-100 bg-amber-50/50 rounded-xl p-2.5">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                              <span className="text-[10px] font-bold text-amber-600">Why it matters</span>
                            </div>
                            <p className="text-[11px] text-gray-600 leading-snug">{s.why}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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

export default function HelpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <HelpPageContent />
    </Suspense>
  );
}
