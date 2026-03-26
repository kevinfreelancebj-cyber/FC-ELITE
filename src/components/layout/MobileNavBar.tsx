'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileNavBar() {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', icon: 'dashboard', label: 'Tableau' },
    { href: '/fixtures', icon: 'sports_score', label: 'Matchs' },
    { href: '/my-club', icon: 'shield', label: 'Mon Club', special: true },
    { href: '/mercato', icon: 'payments', label: 'Mercato' },
    { href: '/profile', icon: 'person', label: 'Profil' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-[#0e0e0e]/90 backdrop-blur-2xl shadow-[0_-8px_32px_rgba(0,0,0,0.5)] border-t border-white/5 rounded-t-[2rem]">
      {links.map((link) => {
        const isActive = pathname === link.href;
        
        if (link.special) {
          return (
            <Link key={link.href} href={link.href} className="relative -top-6">
              <div className="w-14 h-14 kinetic-gradient rounded-full flex items-center justify-center shadow-lg shadow-primary/20 ring-4 ring-background hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-on-primary-container text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {link.icon}
                </span>
              </div>
            </Link>
          );
        }

        return (
          <Link key={link.href} href={link.href} className={`flex flex-col items-center justify-center py-2 px-4 transition-all duration-300 ${isActive ? 'text-emerald-400' : 'text-neutral-500 hover:text-white/80'}`}>
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>{link.icon}</span>
            <span className="font-['Inter'] text-[10px] uppercase font-bold tracking-widest mt-1">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
