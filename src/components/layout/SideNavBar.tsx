'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function SideNavBar() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();

  const links = [
    { href: '/', icon: 'home', label: 'Accueil' },
    { href: '/standings', icon: 'leaderboard', label: 'Classement' },
    { href: '/mercato', icon: 'payments', label: 'Mercato' },
    { href: '/tactics', icon: 'strategy', label: 'Tactiques' },
    { href: '/profile', icon: 'person', label: 'Profil' },
    ...(profile?.role === 'admin' ? [{ href: '/admin', icon: 'dashboard', label: 'Admin' }] : []),
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

      {/* User info */}
      {profile && (
        <div className="px-4 mb-6">
          <div className="bg-surface-container-highest/50 rounded-xl p-3 flex items-center gap-3 border border-white/5">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <span className="text-primary font-headline font-bold text-sm">{profile.username?.charAt(0).toUpperCase()}</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-headline font-bold truncate">{profile.username}</p>
              <p className="text-[10px] text-primary uppercase font-label font-bold tracking-widest">{profile.rank_title}</p>
            </div>
          </div>
        </div>
      )}

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
          JOUR DE MATCH
        </button>
        <div className="pt-6 border-t border-outline-variant/10">
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-neutral-500 hover:text-emerald-400 hover:bg-neutral-800 transition-all rounded-lg">
            <span className="material-symbols-outlined text-sm">help</span>
            <span className="font-headline font-semibold uppercase tracking-widest text-[10px]">Aide</span>
          </Link>
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-4 py-3 text-error hover:bg-error/10 hover:text-error transition-all rounded-lg"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span className="font-headline font-semibold uppercase tracking-widest text-[10px]">Déconnexion</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
