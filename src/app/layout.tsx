import type { Metadata } from 'next';
import Navigation from '@/components/Navigation';
import './globals.css';

export const metadata: Metadata = {
  title: 'Severance - A Narrative RPG',
  description: 'A game of factions, choices, and reality itself',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-gray-100">
        <Navigation />
        {children}
      </body>
    </html>
  );
}