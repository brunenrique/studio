import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from "@/components/ui/toaster";
import AssistantWidget from "@/components/AssistantWidget";
import { TooltipProvider } from '@radix-ui/react-tooltip';

export const metadata: Metadata = {
  title: 'PsiGuard',
  description: 'Secure platform for psychologists',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Montserrat:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-body antialiased min-h-screen bg-background">
        <TooltipProvider>
          <ThemeProvider>
            <AuthProvider>
              <SettingsProvider>
                <NotificationProvider>
                  {children}
                  <Toaster />
                  <AssistantWidget />
                </NotificationProvider>
              </SettingsProvider>
            </AuthProvider>
          </ThemeProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
