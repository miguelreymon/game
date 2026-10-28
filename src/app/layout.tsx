
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/CartContext';
import { getContent } from '@/lib/data';
import { siteContent as defaultContent } from '@/lib/content';
import { AppLayout } from './AppLayout';
import { ExternalScripts } from '@/components/ExternalScripts';
import { Metadata } from 'next';

import { Montserrat, Mouse_Memoirs, Poppins, Work_Sans } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-montserrat',
});

const mouseMemoirs = Mouse_Memoirs({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mouse-memoirs',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-poppins',
});

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-work-sans',
});

export const metadata: Metadata = {
  title: 'Gameover - Emuladores Retro',
  description: 'Tienda oficial de Gameover v1.6 - Consolas y emuladores retro',
  openGraph: {
    title: 'Gameover - Emuladores Retro',
    description: 'Tienda oficial de Gameover v1.6 - Consolas y emuladores retro',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getContent() || defaultContent;
  const theme = config?.theme || {};

  return (
    <html lang="es" className={cn('h-full', montserrat.variable, mouseMemoirs.variable, poppins.variable, workSans.variable)}>
      <body className={cn('min-h-screen bg-background font-body antialiased')}>
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            ${theme.primary ? `--primary: ${theme.primary}; --ring: ${theme.primary};` : ''}
            ${theme.accent ? `--accent: ${theme.accent};` : ''}
            ${theme.background ? `--background: ${theme.background};` : ''}
            ${theme.foreground ? `--foreground: ${theme.foreground};` : ''}
          }
        `}} />
        <ExternalScripts />
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img height="1" width="1" style={{display: 'none'}}
          src="https://www.facebook.com/tr?id=3966676673555416&ev=PageView&noscript=1"
          alt=""
          />
        </noscript>
        <CartProvider>
          <AppLayout initialConfig={config}>{children}</AppLayout>
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
