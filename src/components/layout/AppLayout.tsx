'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import SideNavBar from './SideNavBar';
import TopNavBar from './TopNavBar';
import MobileNavBar from './MobileNavBar';

const authRoutes = ['/login', '/signup', '/onboarding'];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, isLoading } = useAuth();
  const isAuthRoute = authRoutes.includes(pathname);

  // Enforce Onboarding
  useEffect(() => {
    if (!isLoading && user && profile && !profile.onboarding_completed && pathname !== '/onboarding') {
      router.push('/onboarding');
    }
  }, [isLoading, user, profile, pathname, router]);

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
