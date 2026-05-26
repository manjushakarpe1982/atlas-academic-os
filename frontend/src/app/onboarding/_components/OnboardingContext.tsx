'use client';

import {
  createContext, useContext, useEffect, useState, useCallback, ReactNode,
} from 'react';
import {
  OnboardingData, EMPTY_ONBOARDING, fetchOnboarding, saveOnboarding, completeOnboarding,
} from '@/lib/onboarding';
import { getToken } from '@/lib/api';

interface Ctx {
  data: OnboardingData;
  loading: boolean;
  update: (patch: Partial<OnboardingData>) => void;
  save: (complete?: boolean) => Promise<void>;
  skip: () => Promise<void>;
  saving: boolean;
}

const OnboardingContext = createContext<Ctx | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>(EMPTY_ONBOARDING);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      try {
        const remote = await fetchOnboarding();
        if (active && remote) {
          const rest: Partial<OnboardingData> = {
            role: remote.role,
            institution: remote.institution,
            field_of_study: remote.field_of_study,
            year_level: remote.year_level,
            target_gpa: remote.target_gpa,
            goals: remote.goals,
            top_priority: remote.top_priority,
            study_time: remote.study_time,
            session_length: remote.session_length,
            weekday_hours: remote.weekday_hours,
            weekend_hours: remote.weekend_hours,
            sleep_start: remote.sleep_start,
            sleep_end: remote.sleep_end,
            fixed_events: remote.fixed_events,
          };
          setData((prev) => ({
            ...prev,
            ...(Object.fromEntries(
              (Object.keys(rest) as (keyof OnboardingData)[])
                .filter((k) => rest[k] != null)
                .map((k) => [k, rest[k]]),
            ) as Partial<OnboardingData>),
          }));
        }
      } catch {
        // Silent — fall back to empty defaults.
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const update = useCallback((patch: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  }, []);

  const save = useCallback(
    async (complete = false) => {
      if (!getToken()) return;
      setSaving(true);
      try {
        await saveOnboarding(data, complete);
      } finally {
        setSaving(false);
      }
    },
    [data],
  );

  const skip = useCallback(async () => {
    if (!getToken()) return;
    setSaving(true);
    try {
      await completeOnboarding();
    } finally {
      setSaving(false);
    }
  }, []);

  return (
    <OnboardingContext.Provider value={{ data, loading, update, save, skip, saving }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error('useOnboarding must be used inside <OnboardingProvider>');
  }
  return ctx;
}
