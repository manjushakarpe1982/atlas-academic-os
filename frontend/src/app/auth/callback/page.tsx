"use client";

/**
 * /auth/callback
 *
 * This page is where Google sends the user AFTER they sign in with Google.
 * Supabase handles the token exchange automatically.
 * We just wait for it and redirect to onboarding.
 *
 * You MUST add this URL to your Supabase dashboard:
 * Authentication → URL Configuration → Redirect URLs
 * Add: http://localhost:3000/auth/callback
 * Add: https://your-vercel-app.vercel.app/auth/callback  (when live)
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // Listen for the auth state change that Supabase fires
    // after processing the OAuth code in the URL
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          // Save user info to localStorage (same pattern as email login)
          localStorage.setItem("atlas_access_token",  session.access_token);
          localStorage.setItem("atlas_refresh_token", session.refresh_token ?? "");
          localStorage.setItem("atlas_user_id",       session.user.id);
          localStorage.setItem("atlas_email",         session.user.email ?? "");

          // Get full name from user metadata (Google provides this)
          const fullName =
            session.user.user_metadata?.full_name ||
            session.user.user_metadata?.name ||
            "";
          localStorage.setItem("atlas_full_name", fullName);
          localStorage.setItem("atlas_onboarding_completed", "false");

          // Redirect to onboarding
          router.push("/school-selection");
        }
      }
    );

    // Also check if there's already an active session (page reload case)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        localStorage.setItem("atlas_access_token",  session.access_token);
        localStorage.setItem("atlas_refresh_token", session.refresh_token ?? "");
        localStorage.setItem("atlas_user_id",       session.user.id);
        localStorage.setItem("atlas_email",         session.user.email ?? "");
        const fullName =
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name || "";
        localStorage.setItem("atlas_full_name", fullName);
        router.push("/school-selection");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#534AB7] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#534AB7]/25">
          <span className="text-white font-bold text-lg">A</span>
        </div>
        <div className="flex items-center gap-2 justify-center mb-2">
          <span className="w-4 h-4 border-2 border-[#534AB7]/30 border-t-[#534AB7] rounded-full animate-spin" />
          <p className="text-sm font-semibold text-[#1A1A2E]">Signing you in…</p>
        </div>
        <p className="text-xs text-[#9B9AB5]">Please wait, this takes a second.</p>
      </div>
    </main>
  );
}
