import type { Metadata } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import './globals.css';
import { WalletProvider } from './providers/WalletProvider';
import { ReduxProvider } from './providers/ReduxProvider';
import { ToastProvider } from './components/ToastNotifications';
// import { ThemeProvider } from './providers/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-orbitron',
});

export const metadata: Metadata = {
  title: 'DecentraMind',
  description: 'Decentralized AI Marketplace',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable} dark`} suppressHydrationWarning>
      <body className="m-0 p-0 bg-zinc-900 text-white min-h-screen">
                        <ReduxProvider>
                    <WalletProvider>
                      <ToastProvider>
                      {children}
                      </ToastProvider>
                    </WalletProvider>
                </ReduxProvider>
      </body>
    </html>
  );
} 