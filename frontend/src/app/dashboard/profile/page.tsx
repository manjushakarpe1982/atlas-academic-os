"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  LogOut,
  Bell,
  GraduationCap,
  Pencil,
  CalendarDays,
  Trophy,
  UserIcon,
} from "lucide-react";
import { getUser, clearAuth } from "@/lib/api";
import Image from "next/image";

const SETTINGS = [
  {
    label: "Account Settings",
    sub: "Personal information",
    icon: "👤",
    href: "/dashboard/profile/account-settings",
  },
  {
    label: "School Settings",
    sub: "Connected school & LMS",
    icon: "🏫",
    href: "/dashboard/profile/school-settings",
  },
  {
    label: "Calendar Sync",
    sub: "Manage calendar connection",
    icon: "📅",
    href: "/dashboard/profile/calendar-sync",
  },
  {
    label: "Notification Settings",
    sub: "Manage your notifications",
    icon: "🔔",
    href: "/dashboard/profile/notification-settings",
  },
  {
    label: "Dark Mode",
    sub: "App UI preferences",
    icon: "🌙",
    href: "/dashboard/profile/dark-mode",
    toggle: true,
  },
  {
    label: "Help & Support",
    sub: "Get help and contact us",
    icon: "❓",
    href: "/dashboard/profile/help-support",
  },
  {
    label: "Privacy & Data",
    sub: "Manage your privacy settings",
    icon: "🔒",
    href: "/dashboard/profile/privacy-data",
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);
  // const user = getUser();

  const handleLogout = () => {
    clearAuth();
    router.push("/auth/login");
  };

  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const userData = getUser() as any;
    setUser(userData);
  }, []);

  return (
    <div className="px-4 py-4">
      {/* ── Profile card ── */}

      <div className="relative w-full h-[180px] rounded-xl mb-5 overflow-hidden">
        {/* Background Image */}
        <Image
          src="https://res.cloudinary.com/mview/image/upload/v1781777396/atlas/accountpage.png"
          alt="Profile Card"
          fill
          className="object-cover"
        />

        {/* Optional Overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />

        {/* Content */}
        <div className="absolute inset-0 p-3 flex flex-col justify-between">
          {/* Top Section */}
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white">
                {user?.profile_picture_url ? (
                  <img
                    src={user.profile_picture_url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <UserIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  {user?.full_name || "Pooja"}
                </h2>

                <p className="text-sm text-slate-600">
                  {user?.email || "pooja25@gmail.com"}
                </p>

                <span className="inline-flex mt-2 px-3 py-1 text-xs font-semibold text-purple-600 bg-purple-100 rounded-full">
                  Student
                </span>
              </div>
            </div>

            {/* Edit Button */}
            <Link
              href="/dashboard/profile/account-settings"
            >
            <button className="w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center">
              <Pencil className="w-4 h-4 text-purple-600" />
            </button>
            </Link>
          </div>

          {/* Bottom Stats */}
          <div className="bg-white rounded-2xl px-2 py-3 shadow-sm">
            <div className="grid grid-cols-3 divide-x divide-gray-100">
              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-purple-600" />
                </div>

                <div>
                  <p className="font-bold text-gray-900 leading-none">5</p>
                  <p className="text-[11px] text-gray-500 mt-1">Classes</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <CalendarDays className="w-4 h-4 text-green-600" />
                </div>

                <div>
                  <p className="font-bold text-gray-900 leading-none">23</p>
                  <p className="text-[11px] text-gray-500 mt-1">Tasks</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-amber-600" />
                </div>

                <div>
                  <p className="font-bold text-gray-900 leading-none">7</p>
                  <p className="text-[11px] text-gray-500 mt-1">Achieve..</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Settings list ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
        {SETTINGS.map((s, i) => (
          <Link
            key={s.label}
            href={s.href}
            className={`flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-all ${
              i < SETTINGS.length - 1 ? "border-b border-gray-50" : ""
            }`}
          >
            <span className="text-xl w-9 text-center">{s.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold text-gray-800">{s.label}</p>
              <p className="text-xs text-gray-400">{s.sub}</p>
            </div>
            {s.toggle ? (
              <div className="w-10 h-5 bg-gray-200 rounded-full relative flex-shrink-0">
                <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm" />
              </div>
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            )}
          </Link>
        ))}
      </div>

      {/* ── Logout ── */}
      <button
        onClick={() => setShowLogout(true)}
        className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-bold py-2.5 rounded-xl text-base border border-red-100 hover:bg-red-100 transition-all"
      >
        <LogOut className="w-5 h-5" /> Log Out
      </button>

      {/* ── Logout confirmation modal ── */}
      {showLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowLogout(false)}
          />
          <div className="relative bg-white rounded-xl p-6 w-full max-w-xs shadow-2xl">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
                <LogOut className="w-7 h-7 text-red-600" />
              </div>
            </div>
            <h2 className="text-lg font-extrabold text-gray-900 text-center mb-1">
              Log out from Atlas?
            </h2>
            <p className="text-sm text-gray-500 text-center mb-5">
              You can sign in again anytime.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogout(false)}
                className="flex-1 border border-gray-200 text-gray-700 font-bold py-2 rounded-lg text-base hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg text-base shadow-md"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
