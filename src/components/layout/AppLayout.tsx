'use client';

import { usePathname } from 'next/navigation';
import SideNavBar from './SideNavBar';
import TopNavBar from './TopNavBar';
import MobileNavBar from './MobileNavBar';

const authRoutes = ['/login', '/signup'];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = authRoutes.includes(pathname);

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <TopNavBar />
      <SideNavBar />
      <main className="lg:ml-64 pt-24 px-4 md:px-10 pb-32 max-w-7xl mx-auto min-h-screen">
        {children}
      </main>
      <MobileNavBar />
    </>
  );
}
