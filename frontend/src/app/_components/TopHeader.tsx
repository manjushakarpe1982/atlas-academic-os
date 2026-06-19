'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Home, BookOpen, Target, Calendar, User, Bell, ClipboardList, BarChart3, Brain, HelpCircle, Settings, LogOut } from 'lucide-react';

const MENU_ITEMS = [
  { href: '/dashboard',              icon: Home,          label: '1. Home (Dashboard)'  },
  { href: '/dashboard/classes',      icon: BookOpen,      label: '2. Classes'           },
 
  { href: '/dashboard/assignments',  icon: ClipboardList, label: '4. Assignments'       },
  { href: '/dashboard/quizzes',      icon: BarChart3,     label: '5. Quizzes'           },
  { href: '/dashboard/materials',    icon: BookOpen,      label: '6. Study Materials'   },
  { href: '/dashboard/study-plan',   icon: Target,        label: '7. Study Plan'        },
  { href: '/dashboard/calendar',     icon: Calendar,      label: '8. Calendar'          },
  { href: '/dashboard/grades',       icon: BarChart3,     label: '9. Grade Details'     },
 
  { href: '/dashboard/ai',           icon: Brain,         label: '11. AI Study Help'    },
 
];

interface Props { title?: string; showBack?: boolean; }

export default function TopHeader({ title, showBack }: Props) {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <header>
  <div className="px-4 h-14 flex items-center justify-between">
    
    {/* Left Side */}
    <div className="flex items-center gap-4">
      {/* Hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="w-8 h-8 flex flex-col justify-center gap-1.5 group"
      >
        <span className="w-5 h-0.5 bg-gray-700 rounded-full transition-all group-hover:w-6" />
        <span className="w-6 h-0.5 bg-gray-700 rounded-full" />
        <span className="w-4 h-0.5 bg-gray-700 rounded-full transition-all group-hover:w-6" />
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
          <span className="text-white text-xs font-extrabold">A</span>
        </div>
        <span className="font-extrabold text-gray-900">Atlas</span>
      </div>
    </div>

    {/* Right Side */}
    <Link href="/dashboard/notifications" className="relative">
      <Bell className="w-5 h-5 text-gray-600" />
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">
        3
      </span>
    </Link>
  </div>
</header>
      </header>

      {/* Drawer overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />

          {/* Drawer */}
          <div className="relative w-72 bg-white pb-14 h-full flex flex-col shadow-2xl">
            {/* Drawer header */}
            <div className="bg-indigo-600 px-5 pt-4 pb-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-white font-extrabold">A</span>
                  </div>
                  <div>
                    <p className="text-white font-extrabold text-base">Atlas</p>
                    <p className="text-indigo-200 text-xs">AI Study Assistant</p>
                  </div>
                </div>
                <button onClick={() => setOpen(false)}>
                  <X className="w-5 h-5 text-white/80 hover:text-white" />
                </button>
              </div>
              {/* User info */}
            
            </div>

            {/* Nav items */}
            <div className="flex-1 overflow-y-auto py-2">
              <p className="text-[14px] font-extrabold text-gray-400 uppercase tracking-widest px-5 py-2">ALL SCREENS</p>
              {MENU_ITEMS.map(item => {
                const active = path === item.href;
                return (
                  <Link key={item.href} href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-5 py-3 text-sm font-semibold transition-all ${
                      active ? 'bg-indigo-50 text-indigo-600 border-r-2 border-indigo-600' : 'text-gray-600 hover:bg-gray-50'
                    }`}>
                    <item.icon className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-gray-400'}`} />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 p-3 space-y-1">
              <Link href="/help" onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-xl font-semibold">
                <HelpCircle className="w-4 h-4 text-gray-400" /> Help & Support
              </Link>
              <Link href="/dashboard/profile" onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-xl font-semibold">
                <Settings className="w-4 h-4 text-gray-400" /> Settings
              </Link>
              <button className="w-full flex items-center gap-3 px-3 py-1 text-sm text-red-500 hover:bg-red-50 rounded-xl font-semibold">
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


// /dashboard/profile/help-support/report-problem

// please create this page function  create api and form validations 

// If a report-problem request is created, will it be visible in the supabase ? I need to know because I want to understand when a student has submitted a request.


// /dashboard/profile/help-support/feature-request

// please create this page function  create api and form validations 

// If a feature-request request is created, will it be visible in the supabase ? I need to know because I want to understand when a student has submitted a request.





// Remove the dynamic data that is currently coming on the dashboard chat page. I have shared an image for reference.
//  For now, I want to create a static UI exactly like the image. Please update the dashboard home page so that it looks the same as the image provided.




// If a school is being selected for the first time, then the selected school should be displayed on the calendar
//  screen before the "Add Class" section. It should be visible on the second calendar screen as well.



// The login icon should be displayed in the top header section of the dashboard page.

// click the notifaction bell icon on header sections nor redireti to notification page click one open notifiation panel not any page 

// /dashboard/profile/privacy-data/export-data this page show class list remove static data add api dynamic data 


// /dashboard/profile/privacy-data/delete-files this page show uploaded files remove static data add api dynamic data list of files and delete option for each file.

// /dashboard/profile/privacy-data/delete-class  this page show class list remove static data add api dynamic data

// /dashboard/profile this page logout button click should redirect to login page and clear all the local storage data and cookies student logout to the  wbsite


// click on atlas icon redidirect to the home page 