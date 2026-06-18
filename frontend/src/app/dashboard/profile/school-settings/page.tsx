"use client";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  CheckCircle2,
  GraduationCap,
  MapPin,
  Globe,
  BookOpen,
  ClipboardCheck,
  BarChart3,
} from "lucide-react";
import { useRouter } from "next/navigation";
import BackHeader from "../BackHeader";
import { useState } from "react";

// Keep existing SCHOOL_MAP data
const SCHOOL_MAP: Record<
  string,
  {
    name: string;
    location: string;
    website: string;
    platform: string;
    platformUrl: string;
  }
> = {
  arkansas: {
    name: "University of Arkansas",
    location: "Fayetteville, Arkansas, USA",
    website: "uark.edu",
    platform: "Blackboard Learn",
    platformUrl: "learn.uark.edu",
  },
  tamu: {
    name: "Texas A&M University",
    location: "College Station, Texas, USA",
    website: "tamu.edu",
    platform: "Canvas",
    platformUrl: "canvas.tamu.edu",
  },
};

export default function SchoolSettingsPage() {
  const router = useRouter();
  const [expandSchoolDetails, setExpandSchoolDetails] = useState(true);
  const [expandLearningPlatform, setExpandLearningPlatform] = useState(true);

  // Keep existing logic
  const userSchool = "arkansas";
  const school = SCHOOL_MAP[userSchool];

  return (
    <div className="">
      <BackHeader title="School Settings" />

      <div className="px-4 py-6 space-y-5">
        {/* Subtitle */}
        <p className="text-sm text-gray-600">
          Manage your school connection and learning platform.
        </p>

        {/* Current School Card WITH BACKGROUND IMAGE */}
        <div
          className="rounded-lg p-4  border border-purple-100  overflow-hidden"
          style={{
            backgroundImage: `url('https://res.cloudinary.com/mview/image/upload/v1781759088/atlas/schoolsettingpage.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Content - positioned over background */}
          <div className="z-10 flex items-start gap-4">
            {/* School Icon */}
            <div className="w-12 h-12 bg-purple-200 rounded-2xl flex items-center justify-center flex-shrink-0">
  <GraduationCap className="w-7 h-7 text-purple-700" />
</div>

            {/* School Info */}
            <div className="flex-1">
              <p className="text-xs text-indigo-600 font-bold uppercase tracking-wide">
                Current School
              </p>
              <h2 className="text-xl font-bold text-gray-900 mt-1">
                {school?.name}
              </h2>

              {/* Platform with Icon */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm">🎓</span>
                <p className="text-sm text-gray-700">{school?.platform}</p>
              </div>

              {/* Connected Badge */}
              <div className="flex items-center gap-1.5 mt-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-sm font-bold text-green-600">
                  Connected
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Change School + LMS Info Grid */}
        <div className="">
          {/* Change School */}
          <button
            onClick={() => router.push("/school-selection")}
            className="w-full bg-white border border-gray-200 rounded-lg p-3 hover:border-indigo-300 transition-all text-left"
          >
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-xl">🏫</span>
              </div>

              {/* Text */}
              <div>
                <p className="font-bold text-sm text-indigo-600 underline">Change School</p>
                <p className="text-xs text-gray-600 mt-1">
                  Switch to a different school
                </p>
              </div>
            </div>
          </button>

        
        </div>

        {/* School Details Collapsible */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <button
            onClick={() => setExpandSchoolDetails(!expandSchoolDetails)}
            className="w-full flex items-center justify-between px-5 mt-4 hover:bg-gray-50 transition-all"
          >
            <h3 className="font-bold text-gray-900">School Details</h3>
            {expandSchoolDetails ? (
              <ChevronUp className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {expandSchoolDetails && (
            <div className="px-4">
              {/* School Name */}
              <div className="flex items-start gap-4 py-2.5 border-b border-gray-200">
                <div className="bg-indigo-100 rounded-xl flex items-center p-2 justify-center shrink-0">
                  <GraduationCap className="w-5 h-5 text-indigo-500  shrink-0" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 font-bold uppercase">
                    School Name
                  </p>
                  <p className="text-sm font-bold text-gray-900 mt-1">
                    {school?.name}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4 py-2.5 border-b border-gray-200">
                <div className="bg-red-100 rounded-xl flex items-center p-2 justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-red-500  shrink-0" />
                </div>
                <div>
                  <p className="text-[11px] text-gray-500 font-bold uppercase">
                    Location
                  </p>
                  <p className="text-sm font-bold text-gray-900 mt-1">
                    {school?.location}
                  </p>
                </div>
              </div>

              {/* Website */}
              <div className="flex items-start gap-4 py-2.5">
                <div className="bg-blue-100 rounded-xl flex items-center p-2 justify-center shrink-0">
                  <Globe className="w-5 h-5 text-blue-500  shrink-0" />
                </div>
                <div className="w-full">
                  <p className="text-[11px] text-gray-500 font-bold uppercase">
                    Website
                  </p>

                  <a
                    href={`https://${school?.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between mt-0.5  hover:text-indigo-600"
                  >
                    <span className="text-sm font-bold underline text-blue-500 truncate">
                      {school?.website}
                    </span>
                    <ExternalLink className="w-4 h-4 shrink-0 ml-auto" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Learning Platform Collapsible */}
        <div className="bg-green-50 rounded-lg border border-green-200 overflow-hidden">
           
          <div className=" p-3">
             <h3 className="font-bold text-gray-900 mb-3">Learning Platform</h3>
            {/* Platform Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-yellow-900 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">Bb</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">
                    {school?.platform}
                  </p>
                  <p className="text-xs text-gray-600">{school?.platformUrl}</p>
                </div>
              </div>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                Connected
              </span>
            </div>

            {/* Description */}
            <p className="text-[13px] text-gray-600 mb-3">
              Atlas uses {school?.platform} to sync your courses, assignments,
              and grades.
            </p>

            {/* Sync Status Grid */}
            <div className="grid grid-cols-3 mb-3 gap-2">
              <div className="p-1.5 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center justify-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                  <p className="text-xs font-bold text-gray-900">Courses</p>
                </div>
                <div className="flex justify-center mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
              </div>

              <div className="p-1.5 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center justify-center gap-1">
                  <ClipboardCheck className="w-4 h-4 text-blue-500" />
                  <p className="text-xs font-bold text-gray-900">Assignm..</p>
                </div>
                <div className="flex justify-center mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
              </div>

              <div className="p-1.5 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center justify-center gap-2">
                  <BarChart3 className="w-4 h-4 text-purple-500" />
                  <p className="text-xs font-bold text-gray-900">Grades</p>
                </div>
                <div className="flex justify-center mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-2">
              <p className="text-[13px] text-blue-900">
                ℹ️ Atlas automatically imports your courses, assignments, and
                grades in real-time from your learning platform.
              </p>
            </div>
          </div>
        </div>

        {/* School Connection - Disconnect */}
        <div className=" bg-red-50 rounded-lg border border-red-200 p-3 pb-6">
          <h3 className="font-bold text-red-600 text-base mb-2">
            School Connection
          </h3>
          <p className="text-sm text-gray-600 mb-1.5">
            Disconnect your school account from Atlas.
          </p>
          <button className="w-full border-2 border-red-600 text-red-600 font-bold py-2.5 rounded-xl hover:bg-red-50 transition-all">
            🔌 Disconnect School
          </button>
        </div>
      </div>
    </div>
  );
}
