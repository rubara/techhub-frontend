// TechHub.bg - Root Layout
import type { Metadata } from 'next';
import { Russo_One, Raleway } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CompareBar } from '@/components/compare';

const russoOne = Russo_One({
  weight: '400',
  subsets: ['latin', 'cyrillic'],
  variable: '--font-russo',
  display: 'swap',
});

const raleway = Raleway({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-raleway',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TechHub.bg - Компютърен хардуер и периферия',
  description: 'Вашият доверен партньор за компютърен хардуер, видеокарти, процесори, дънни платки и периферия в България. Най-добрите цени и бърза доставка.',
  keywords: 'компютърен хардуер, видеокарти, процесори, RAM, SSD, геймърски компютри, България',
  authors: [{ name: 'TechHub.bg' }],
  openGraph: {
    title: 'TechHub.bg - Компютърен хардуер и периферия',
    description: 'Вашият доверен партньор за компютърен хардуер в България.',
    url: 'https://techhub.bg',
    siteName: 'TechHub.bg',
    locale: 'bg_BG',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bg" className={`${russoOne.variable} ${raleway.variable}`}>
      <body className="dark font-raleway">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          {/* Compare Bar - Floating at bottom */}
          <CompareBar />
        </Providers>
      </body>
    </html>
  );
}
