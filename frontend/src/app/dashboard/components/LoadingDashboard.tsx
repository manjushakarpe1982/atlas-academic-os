"use client";
import Image from "next/image";

interface Props {
  isVisible?: boolean;
}

export default function LoadingDashboard({ isVisible = true }: Props) {
  if (!isVisible) return null;

  return (
    <div className="px-5 py-3 flex flex-col  bg-white">
      {/* HEADER ANIMATION */}
      <div className="flex justify-center mb-6">
        <div className="relative w-24 h-24">
          {/* Circle background */}
          <div className="absolute inset-0 bg-purple-100 rounded-full flex items-center justify-center">
          <div className="absolute -bottom-1 right-0 w-2 h-2 bg-indigo-400 rounded-full"></div>
       <Image
              src="https://res.cloudinary.com/mview/image/upload/v1781604268/atlas/loadingpage.png"
              alt="Loading robot"
              width={100}
              height={150}
              className="object-contain"
              priority
            />

          </div>

          {/* Animated circle border */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 border-r-indigo-600 animate-spin"></div>

          {/* Decorative dots */}
          <div className="absolute -top-2 -left-2 w-2 h-2 bg-purple-300 rounded-full"></div>
          <div className="absolute -top-1 -right-3 w-2 h-2 bg-yellow-300 rounded-full"></div>
          <div className="absolute -bottom-3 -left-1 w-2 h-2 bg-purple-400 rounded-full"></div>
          <div className="absolute -bottom-1 right-0 w-2 h-2 bg-indigo-400 rounded-full"></div>
        </div>
      </div>

      {/* TITLE */}
      <h1 className="text-center text-lg font-extrabold text-gray-900 mb-2">
        Preparing your dashboard...
      </h1>
      <p className="text-center text-xs text-gray-600 mb-6">
        This will just take a few seconds
      </p>

      {/* PROGRESS BAR */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full"
            style={{ width: "65%" }}
          ></div>
        </div>
        <span className="text-xs font-bold text-gray-600">65%</span>
      </div>

      {/* TASK LIST */}
      <div className="space-y-5 mb-6">
        {/* Task 1 - Complete */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span>📚</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900">
              Loading your classes
            </p>
            <p className="text-sm text-gray-500">Getting your class info</p>
          </div>
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs">✓</span>
          </div>
        </div>

        {/* Task 2 - In Progress */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span>📅</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900">
              Fetching deadlines
            </p>
            <p className="text-sm text-gray-500">Syncing your calendar</p>
          </div>
          <div className="w-5 h-5 rounded-full border-2 border-transparent border-t-indigo-600 animate-spin flex-shrink-0"></div>
        </div>

        {/* Task 3 - Pending */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span>⏱️</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900">
              Calculating progress
            </p>
            <p className="text-sm text-gray-500">Analyzing your data</p>
          </div>
          <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
        </div>

        {/* Task 4 - Pending */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span>✨</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900">
              Personalizing recommendations
            </p>
            <p className="text-sm text-gray-500">Creating your study plan</p>
          </div>
          <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0"></div>
        </div>
      </div>

      {/* ALMOST THERE SECTION */}
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-4 flex gap-3">
        <div className="text-4xl flex-shrink-0">🤖</div>
        <div>
          <p className="text-base font-bold text-purple-900">Almost there!</p>
          <p className="text-sm text-purple-700 mt-1">
            Atlas is putting everything together for your personalized
            experience.
          </p>
        </div>
      </div>

      {/* TIP SECTION */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex gap-3">
        <span className="text-xl flex-shrink-0">💡</span>
        <p className="text-sm text-yellow-800">
          <strong>Tip:</strong> You can keep the app open while we set up your
          dashboard.
        </p>
      </div>
    </div>
  );
}
