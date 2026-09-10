import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Free Fire Tournament Platform | Compete. Dominate. Win.',
  description: 'Premium esports tournament platform for Free Fire featuring live brackets, match rooms, atomic wallet ledger, automated scoring engine, team management, and dedicated admin controls.',
  openGraph: {
    title: 'Free Fire Tournament Platform | Compete. Dominate. Win.',
    description: 'Premium esports tournament platform for Free Fire featuring live brackets, match rooms, atomic wallet ledger, automated scoring engine, team management, and dedicated admin controls.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Fire Tournament Platform',
    description: 'Competitive Free Fire esports tournaments, custom match rooms, and instant wallet payouts.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:ital,wght@0,400;0,600;0,700;1,700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#080A0F] text-[#E2E8F0] antialiased selection:bg-[#FF2A4D]/30 selection:text-white min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
