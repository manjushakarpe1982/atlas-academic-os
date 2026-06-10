import "./globals.css";
import type { ReactNode } from "react";
import { Lexend_Deca } from "next/font/google";

const lexendDeca = Lexend_Deca({
  variable: "--font-lexend-deca",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

export const metadata = {
  title: "Atlas - AI-Powered Study Planner",
  description: "Get personalized study recommendations ranked by grade impact.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className={lexendDeca.variable}>
        {children}
      </body>
    </html>
  );
}