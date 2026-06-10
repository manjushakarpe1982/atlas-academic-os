import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Atlas - AI-Powered Study Planner",
  description: "Get personalized study recommendations ranked by grade impact.",
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}