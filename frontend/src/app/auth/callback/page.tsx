"use client";

/**
 * /auth/callback — Google sends the user here after sign-in.
 * Flow:
 *   1. Supabase processes the OAuth code and gives us a Supabase session
 *   2. We send that Supabase token to OUR backend (/api/auth/google)
 *   3. Backend verifies it, finds/creates the user, returns OUR app JWT
 *   4. We save it with saveAuth() (same keys as email login) and route
 *
 * Supabase dashboard → Authentication → URL Configuration → Redirect URLs:
 *   http://localhost:3000/auth/callback
 *   https://ai-atlas-gray.vercel.app/auth/callback
 */

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { API_BASE, saveAuth } from "@/lib/api";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const exchangedRef = useRef(false);

  useEffect(() => {
    const supabase = createClient();

    const exchange = async (supabaseToken: string) => {
      if (exchangedRef.current) return;
      exchangedRef.current = true;
      try {
        // 2. Exchange the Supabase token for OUR app JWT
        const res = await fetch(`${API_BASE}/api/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ supabase_token: supabaseToken }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.detail || "Google sign-in failed. Please try again.");
          return;
        }

        // 3. Save token + user with the SAME keys email login uses
        saveAuth(data.access_token, data.user);

        // 4. Route based on onboarding state (same as email login)
        if (!data.user?.school) {
          router.push("/school-selection");
        } else if (!data.user?.acknowledged_at) {
          router.push("/acknowledgment");
        } else {
          router.push("/dashboard");
        }
      } catch {
        setError("Could not complete sign-in. Please try again.");
      }
    };

    // 1. Wait for Supabase to process the OAuth code
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) exchange(session.access_token);
      }
    );
    // Page-reload case: session may already exist
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) exchange(session.access_token);
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center px-6">
        <div className="w-12 h-12 rounded-2xl bg-[#534AB7] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#534AB7]/25">
          <span className="text-white font-bold text-lg">A</span>
        </div>
        {error ? (
          <>
            <p className="text-sm font-semibold text-red-600 mb-3">{error}</p>
            <button
              onClick={() => router.push("/auth/login")}
              className="text-sm font-bold text-[#534AB7] underline"
            >
              Back to Login
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 justify-center mb-2">
              <span className="w-4 h-4 border-2 border-[#534AB7]/30 border-t-[#534AB7] rounded-full animate-spin" />
              <p className="text-sm font-semibold text-[#1A1A2E]">Signing you in…</p>
            </div>
            <p className="text-xs text-[#9B9AB5]">Please wait, this takes a second.</p>
          </>
        )}
      </div>
    </main>
  );
}
