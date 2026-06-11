import type { Metadata } from 'next';
import { Lexend_Deca } from 'next/font/google';
import './globals.css';

const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-lexend-deca',
});

export const metadata: Metadata = {
  title: 'Atlas Academic OS',
  description: 'AI-powered study planner',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={lexendDeca.variable}>
      <body className={lexendDeca.className}>
        {children}
      </body>
    </html>
  );
}