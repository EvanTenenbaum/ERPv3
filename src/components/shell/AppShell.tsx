"use client";
import { usePathname } from 'next/navigation';
import Topbar from '@/components/nav/Topbar';
import SidebarNav from '@/components/nav/SidebarNav';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare = pathname?.startsWith('/login') || pathname?.startsWith('/quotes/share/');
  if (bare) return <>{children}</>;
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Topbar />
      <div className="flex flex-1">
        <SidebarNav />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}

