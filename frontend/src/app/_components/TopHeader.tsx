"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X, Home, BookOpen, Target, Calendar, User,
  Bell, ClipboardList, BarChart3, Brain, HelpCircle,
  Settings, LogOut, BookOpenCheck, FileText, AlertTriangle,
  Clock, Lightbulb, CheckCircle2, Loader2, Archive,
} from "lucide-react";
import UserAvatar from "./UserAvatar";
import { clearAuth, API_BASE, getToken } from "@/lib/api";

const MENU_ITEMS = [
  { href: "/dashboard", icon: Home, label: "1. Home (Dashboard)" },
  { href: "/dashboard/classes", icon: BookOpen, label: "2. Classes" },
  { href: "/dashboard/materials", icon: BookOpen, label: "3. Study Materials" },
  { href: "/dashboard/study-plan", icon: Target, label: "4. Study Plan" },
  { href: "/dashboard/calendar", icon: Calendar, label: "5. Calendar" },
];

const TYPE_ICONS: Record<string, { icon: any; bg: string; color: string }> = {
  quiz_reminder:    { icon: AlertTriangle, bg: "bg-red-100",    color: "text-red-600"    },
  assignment_alert: { icon: FileText,      bg: "bg-amber-100",  color: "text-amber-600"  },
  study_reminder:   { icon: Clock,         bg: "bg-blue-100",   color: "text-blue-600"   },
  weekly_summary:   { icon: BarChart3,     bg: "bg-purple-100", color: "text-purple-600" },
  new_grades:       { icon: BookOpenCheck, bg: "bg-green-100",  color: "text-green-600"  },
  tips_updates:     { icon: Lightbulb,     bg: "bg-yellow-100", color: "text-yellow-600" },
};

interface Notification {
  id: string; type: string; title: string; body: string;
  read: boolean; created_at: string;
}

interface Props { title?: string; showBack?: boolean; }

export default function TopHeader({ title, showBack }: Props) {
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifTab, setNotifTab] = useState<'inbox' | 'archive'>('inbox');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifs, setLoadingNotifs] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const path = usePathname();
  const generatedRef = useRef(false);

  // Request browser notification permission + register service worker
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    const setupPush = async () => {
      try {
        // Register service worker
        const reg = await navigator.serviceWorker.register('/sw.js');

        // Request permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') return;

        // Get VAPID key
        const token = getToken();
        if (!token) return;
        const vapidRes = await fetch(`${API_BASE}/api/notifications/vapid-key`);
        const vapidData = await vapidRes.json();
        if (!vapidData.key) return;

        // Convert VAPID key
        const urlBase64ToUint8Array = (base64String: string) => {
          const padding = '='.repeat((4 - base64String.length % 4) % 4);
          const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
          const raw = window.atob(base64);
          return new Uint8Array([...raw].map(c => c.charCodeAt(0)));
        };

        // Subscribe to push
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidData.key),
        });

        // Send subscription to backend
        const subJson = sub.toJSON();
        await fetch(`${API_BASE}/api/notifications/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            endpoint: subJson.endpoint,
            keys: subJson.keys,
          }),
        });
      } catch (e) {
        console.log('Push setup skipped:', e);
      }
    };

    setupPush();
  }, []);

  // Show browser notification (stays until user dismisses)
  const showBrowserNotif = (title: string, body: string) => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/atlas-icon.png',
        tag: title,
        requireInteraction: true,
      });
    }
  };

  // Generate + fetch notifications on mount
  useEffect(() => {
    const token = getToken();
    if (!token || generatedRef.current) return;
    generatedRef.current = true;

    const load = async () => {
      try {
        await fetch(`${API_BASE}/api/notifications/generate`, {
          method: "POST", headers: { Authorization: `Bearer ${token}` },
        });
        const res = await fetch(`${API_BASE}/api/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.notifications) {
          setNotifications(data.notifications);
          setUnreadCount(data.unread_count || 0);
          // Show browser notification for new unread
          const unread = (data.notifications as Notification[]).filter((n: Notification) => !n.read);
          if (unread.length > 0 && unread.length <= 3) {
            unread.forEach((n: Notification) => showBrowserNotif(n.title, n.body));
          } else if (unread.length > 3) {
            showBrowserNotif('Atlas', `You have ${unread.length} new notifications`);
          }
        }
      } catch {}
    };
    load();
  }, []);

  // Refresh notifications on custom event
  const refreshNotifications = async () => {
    const token = getToken();
    if (!token) return;
    try {
      await fetch(`${API_BASE}/api/notifications/generate`, {
        method: "POST", headers: { Authorization: `Bearer ${token}` },
      });
      const res = await fetch(`${API_BASE}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.notifications) {
        const prevUnread = unreadCount;
        setNotifications(data.notifications);
        setUnreadCount(data.unread_count || 0);
        if (data.unread_count > prevUnread) {
          const newest = (data.notifications as Notification[]).find((n: Notification) => !n.read);
          if (newest) showBrowserNotif(newest.title, newest.body);
        }
      }
    } catch {}
  };

  useEffect(() => {
    window.addEventListener("atlas-refresh-notifications", refreshNotifications);
    return () => window.removeEventListener("atlas-refresh-notifications", refreshNotifications);
  }, []);

  // Close panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Format time ago
  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  // Mark all as read
  const markAllRead = async () => {
    const token = getToken();
    try {
      await fetch(`${API_BASE}/api/notifications/read-all`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {}
  };

  // Mark single as read
  const markRead = async (id: string) => {
    const token = getToken();
    try {
      await fetch(`${API_BASE}/api/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {}
  };

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="px-4 h-14 flex items-center justify-between">
          {/* Left Side */}
          <div className="flex items-center gap-4">
            <button onClick={() => setOpen(true)} className="w-8 h-8 flex flex-col justify-center gap-1.5 group">
              <span className="w-5 h-0.5 bg-gray-700 rounded-full transition-all group-hover:w-6" />
              <span className="w-6 h-0.5 bg-gray-700 rounded-full" />
              <span className="w-4 h-0.5 bg-gray-700 rounded-full transition-all group-hover:w-6" />
            </button>
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xs font-extrabold">A</span>
              </div>
              <span className="font-extrabold text-gray-900">Atlas</span>
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Bell */}
            <div className="relative" ref={notifRef}>
              <button onClick={() => setNotifOpen(!notifOpen)} className="relative">
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Panel */}
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="fixed left-4 right-4 top-12 bg-white rounded-lg shadow-2xl border border-gray-300 overflow-hidden z-50">
                    {/* Panel Header with tabs */}
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button onClick={() => setNotifTab('inbox')}
                            className={`text-sm font-bold pb-1 transition-all ${notifTab === 'inbox' ? 'text-gray-900 border-b-2 border-indigo-600' : 'text-gray-500'}`}>
                            Inbox {unreadCount > 0 && <span className="ml-1 bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
                          </button>
                          <button onClick={() => setNotifTab('archive')}
                            className={`text-sm font-bold pb-1 transition-all ${notifTab === 'archive' ? 'text-gray-900 border-b-2 border-indigo-600' : 'text-gray-500'}`}>
                            Archive
                          </button>
                        </div>
                        <Link href="/dashboard/profile/notification-settings" onClick={() => setNotifOpen(false)}>
                          <Settings className="w-4 h-4 text-gray-600 hover:text-gray-600" />
                        </Link>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                      {notifTab === 'inbox' ? (
                        notifications.filter(n => !n.read).length === 0 && notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center">
                            <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-sm text-gray-400 font-medium">No notifications yet</p>
                          </div>
                        ) : (
                          (notifTab === 'inbox' ? notifications.filter(n => !n.read) : []).length === 0 ? (
                            <div className="px-4 py-8 text-center">
                              <CheckCircle2 className="w-8 h-8 text-green-300 mx-auto mb-2" />
                              <p className="text-sm text-gray-400 font-medium">All caught up!</p>
                            </div>
                          ) : (
                            notifications.filter(n => !n.read).map(n => {
                              const t = TYPE_ICONS[n.type] || TYPE_ICONS.study_reminder;
                              const Icon = t.icon;
                              return (
                                <div key={n.id} className="px-4 py-3 flex items-start gap-3 transition-colors hover:bg-gray-50 bg-indigo-50/40 group relative">
                                  <div className={`w-9 h-9 ${t.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                    <Icon className={`w-4 h-4 ${t.color}`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-bold text-gray-900 truncate">{n.title}</p>
                                      <span className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0" />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.body}</p>
                                    <p className="text-[10px] text-gray-400 mt-1">{timeAgo(n.created_at)}</p>
                                  </div>
                                  <button onClick={(e) => { e.stopPropagation(); markRead(n.id); }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-3 top-3 w-7 h-7 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-300"
                                    title="Archive">
                                    <Archive className="w-3.5 h-3.5 text-gray-400 hover:text-indigo-600" />
                                  </button>
                                </div>
                              );
                            })
                          )
                        )
                      ) : (
                        notifications.filter(n => n.read).length === 0 ? (
                          <div className="px-4 py-8 text-center">
                            <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-sm text-gray-400 font-medium">No archived notifications</p>
                          </div>
                        ) : (
                          notifications.filter(n => n.read).map(n => {
                            const t = TYPE_ICONS[n.type] || TYPE_ICONS.study_reminder;
                            const Icon = t.icon;
                            return (
                              <div key={n.id} className="px-4 py-3 flex items-start gap-3 transition-colors hover:bg-gray-50 cursor-pointer">
                                <div className={`w-9 h-9 ${t.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                  <Icon className={`w-4 h-4 ${t.color}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-gray-900 truncate">{n.title}</p>
                                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.body}</p>
                                  <p className="text-[10px] text-gray-400 mt-1">{timeAgo(n.created_at)}</p>
                                </div>
                              </div>
                            );
                          })
                        )
                      )}
                    </div>

                    {/* Footer */}
                    {unreadCount > 0 && notifTab === 'inbox' && (
                      <div className="border-t border-gray-100 px-4 py-2.5">
                        <button onClick={markAllRead}
                          className="w-full text-center text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                          Mark all as read
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <UserAvatar />
          </div>
        </div>
      </header>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative w-64 bg-white pb-14 h-full flex flex-col shadow-2xl">
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
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              <p className="text-[14px] font-extrabold text-gray-400 uppercase tracking-widest px-5 py-2">ALL SCREENS</p>
              {MENU_ITEMS.map((item) => {
                const active = path === item.href;
                return (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-5 py-3 text-sm font-semibold transition-all ${
                      active ? "bg-indigo-50 text-indigo-600 border-r-2 border-indigo-600" : "text-gray-600 hover:bg-gray-50"
                    }`}>
                    <item.icon className={`w-4 h-4 ${active ? "text-indigo-600" : "text-gray-400"}`} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <div className="border-t border-gray-100 p-3 space-y-1">
              <Link href="/help" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-xl font-semibold">
                <HelpCircle className="w-4 h-4 text-gray-400" /> Help & Support
              </Link>
              <Link href="/dashboard/profile" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-xl font-semibold">
                <Settings className="w-4 h-4 text-gray-400" /> Settings
              </Link>
              <button onClick={() => { clearAuth(); window.location.href = "/auth/login"; }}
                className="w-full flex items-center gap-3 px-3 py-1 text-sm text-red-500 hover:bg-red-50 rounded-xl font-semibold">
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
