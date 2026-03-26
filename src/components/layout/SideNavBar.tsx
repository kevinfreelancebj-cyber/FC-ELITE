'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SideNavBar() {
  const pathname = usePathname();

  const links = [
    { href: '/', icon: 'home', label: 'Home' },
    { href: '/standings', icon: 'leaderboard', label: 'Standings' },
    { href: '/mercato', icon: 'payments', label: 'Mercato' },
    { href: '/tactics', icon: 'strategy', label: 'Tactics' },
    { href: '/profile', icon: 'person', label: 'Profile' },
    { href: '/admin', icon: 'dashboard', label: 'Admin ' },
  ];

  return (
    <aside className="hidden lg:flex flex-col h-screen w-64 fixed left-0 top-0 z-40 bg-[#131313] border-r border-white/5 py-6">
      <div className="px-6 mb-10">
        <div className="flex flex-col gap-1 items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 kinetic-gradient rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-black" style={{ fontVariationSettings: "'FILL' 1" }}>sports_soccer</span>
            </div>
            <div>
              <h2 className="text-2xl font-black text-emerald-400 italic font-headline leading-tight">FC ELITE</h2>
              <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-headline font-semibold">Kinetic Arena</p>
            </div>
          </div>
        </div>
      </div>
      <nav className="flex-1 space-y-2 px-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/20 to-transparent text-emerald-400 border-l-4 border-emerald-500'
                  : 'text-neutral-500 hover:text-emerald-400 hover:bg-neutral-800/50'
              }`}
            >
              <span className="material-symbols-outlined">{link.icon}</span>
              <span className="font-headline font-semibold uppercase tracking-widest text-[10px]">{link.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="px-4 mt-auto space-y-4">
        <button className="w-full py-4 kinetic-gradient text-neutral-950 font-headline font-extrabold uppercase tracking-tighter rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2">
          <span className="material-symbols-outlined">sports_soccer</span>
          MATCH DAY
        </button>
        <div className="pt-6 border-t border-outline-variant/10">
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-neutral-500 hover:text-emerald-400 hover:bg-neutral-800 transition-all rounded-lg">
            <span className="material-symbols-outlined text-sm">help</span>
            <span className="font-headline font-semibold uppercase tracking-widest text-[10px]">Support</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-error hover:bg-error/10 hover:text-error transition-all rounded-lg">
            <span className="material-symbols-outlined text-sm">logout</span>
            <span className="font-headline font-semibold uppercase tracking-widest text-[10px]">Logout</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
