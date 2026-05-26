'use client';

import { api } from './api';

export interface FixedEvent {
  label: string;
  days: string[];
  time: string;
  emoji: string;
}

export interface OnboardingData {
  // Step 1
  role: string | null;
  // Step 2
  institution: string;
  field_of_study: string;
  year_level: string;
  target_gpa: number | null;
  // Step 3
  goals: string[];
  top_priority: string | null;
  // Step 4
  study_time: string;
  session_length: string;
  weekday_hours: number;
  weekend_hours: number;
  sleep_start: string;
  sleep_end: string;
  fixed_events: FixedEvent[];
}

export interface OnboardingResponse extends OnboardingData {
  completed: boolean;
}

export const EMPTY_ONBOARDING: OnboardingData = {
  role: null,
  institution: '',
  field_of_study: '',
  year_level: '',
  target_gpa: null,
  goals: [],
  top_priority: null,
  study_time: '',
  session_length: '',
  weekday_hours: 2.5,
  weekend_hours: 4.0,
  sleep_start: '',
  sleep_end: '',
  fixed_events: [],
};

/** Fetch the saved onboarding data for the logged-in user. */
export function fetchOnboarding() {
  return api<OnboardingResponse>('/api/onboarding');
}

/** Save (upsert) onboarding data. Pass complete=true on the final step. */
export function saveOnboarding(data: OnboardingData, complete = false) {
  return api<{ message: string; completed: boolean }>(
    `/api/onboarding?complete=${complete}`,
    { method: 'PUT', body: data },
  );
}

/** Mark onboarding complete without changing data (used by "Skip"). */
export function completeOnboarding() {
  return api<{ message: string; completed: boolean }>(
    '/api/onboarding/complete',
    { method: 'POST' },
  );
}
