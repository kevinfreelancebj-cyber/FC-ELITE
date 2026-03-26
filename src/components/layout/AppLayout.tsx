import SideNavBar from './SideNavBar';
import TopNavBar from './TopNavBar';
import MobileNavBar from './MobileNavBar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
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
