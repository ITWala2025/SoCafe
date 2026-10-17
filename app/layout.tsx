import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/Toast';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif-loaded',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans-loaded',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://socoffee.ie'),
  title: 'So Coffee — Coffee, Comfort & Good Food | Lucan Community Centre',
  description:
    'A cosy little café inside Lucan Community Centre — serving great coffee, tasty bites and something for every kind of coffee break.',
  keywords: [
    'So Coffee',
    'Lucan cafe',
    'Lucan Community Centre',
    'coffee Dublin',
    'specialty coffee Lucan',
    'community cafe Ireland',
  ],
  authors: [{ name: 'So Coffee Team' }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>☕</text></svg>",
  },
  openGraph: {
    title: 'So Coffee — Coffee, Comfort & Good Food',
    description:
      'A cosy little café inside Lucan Community Centre — serving great coffee, tasty bites and something for every kind of coffee break.',
    url: 'https://socoffee.ie',
    siteName: 'So Coffee',
    images: [
      {
        url: '/images/hero-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'So Coffee Cafe Lucan',
      },
    ],
    locale: 'en_IE',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#2C2418',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
