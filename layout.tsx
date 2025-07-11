import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SoulChain - Anonymous Emotional Journaling',
  description: 'Express your deepest thoughts anonymously on the blockchain. Join emotional communities and reflect with privacy-first Web3 technology.',
  keywords: ['Web3', 'journaling', 'blockchain', 'privacy', 'emotional', 'anonymous'],
  authors: [{ name: 'SoulChain Team' }],
  openGraph: {
    title: 'SoulChain - Anonymous Emotional Journaling',
    description: 'Express your deepest thoughts anonymously on the blockchain.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SoulChain - Anonymous Emotional Journaling',
    description: 'Express your deepest thoughts anonymously on the blockchain.',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}