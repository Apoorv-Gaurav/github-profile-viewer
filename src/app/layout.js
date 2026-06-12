import { Outfit, JetBrains_Mono } from 'next/font/google';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: 'GitView - GitHub Profile Viewer',
  description:
    'Explore, compare, and bookmark GitHub profiles with beautiful visualizations',
  keywords: 'GitHub, profile, viewer, developer, portfolio, compare',
  openGraph: {
    title: 'GitView - GitHub Profile Viewer',
    description:
      'Explore, compare, and bookmark GitHub profiles with beautiful visualizations',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${jetbrains.variable}`}>
      <body>
        <Navbar />
        <main className="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
