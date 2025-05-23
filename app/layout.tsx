import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { AppContextProvider } from '@/context/app-context';
import { GET_METHOD } from '@/lib/req';
import { API_URL } from '@/lib/utils';
import { IConfig } from '@/interfaces/config.interface';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Laundry Management',
  description: 'Powered by NextJS - Author Kot',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const config: IConfig = await GET_METHOD(`${API_URL}/config`);
  metadata.title = config.title
  metadata.description = config.description
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Toaster />
          <AppContextProvider config={config}>
            {children}
          </AppContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
