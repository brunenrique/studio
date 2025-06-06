"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import { AppHeader } from '@/components/layout/Header';
import { SidebarProvider } from '@/components/ui/sidebar';


export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    // You can render a loading spinner here
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <main className="flex-1 overflow-y-auto bg-background p-8 md:p-12">
          {children}
        </main>
      </div>
      <SidebarProvider defaultOpen={true}>
        {/* Assuming RightSidebar content will be handled within the main content or a different component */}
      </SidebarProvider>
    </div>
  );
}
