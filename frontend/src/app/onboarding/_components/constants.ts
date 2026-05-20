'use client';

import {
  Check, GraduationCap, BookOpen, Target, Sliders, User,
} from 'lucide-react';

export type Role = 'student' | 'teacher' | 'researcher' | 'professional' | null;

export const STEPS = [
  { n: 1, label: 'Welcome',           sub: "Let's get to know you",        icon: User,          href: '/onboarding/step1' },
  { n: 2, label: 'Academic Profile',  sub: 'Tell us about your studies',   icon: GraduationCap, href: '/onboarding/step2' },
  { n: 3, label: 'Goals & Interests', sub: 'What do you want to achieve?', icon: Target,        href: '/onboarding/step3' },
  { n: 4, label: 'Preferences',       sub: 'Customize your experience',    icon: Sliders,       href: '/onboarding/step4' },
  { n: 5, label: 'Complete',          sub: "You're all set!",              icon: Check,         href: '/onboarding/step5' },
];

export const INP =
  'w-full bg-white/80 border border-[#e0ddf5] hover:border-[#534AB7] focus:border-[#534AB7] ' +
  'focus:bg-white text-[#1A1A2E] placeholder:text-[#bbb9d4] rounded-2xl px-4 py-3 text-sm ' +
  'outline-none transition-all font-medium';

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export interface FixedEvent {
  id: number;
  label: string;
  days: string[];
  time: string;
  emoji: string;
}
