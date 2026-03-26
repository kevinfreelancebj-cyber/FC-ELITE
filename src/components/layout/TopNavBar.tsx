import Link from 'next/link';

export default function TopNavBar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#0e0e0e]/70 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.8)] border-none flex justify-between items-center px-6 h-16 max-w-none">
      <div className="flex items-center gap-8 lg:ml-64">
        <span className="text-xl font-black text-emerald-400 italic tracking-tighter font-headline lg:hidden">FC ELITE</span>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-emerald-400 font-bold font-headline text-sm tracking-tight transition-colors">Home</Link>
          <Link href="/standings" className="text-neutral-400 font-headline text-sm tracking-tight hover:text-white transition-colors">Standings</Link>
          <Link href="/mercato" className="text-neutral-400 font-headline text-sm tracking-tight hover:text-white transition-colors">Mercato</Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="bg-surface-container-highest px-4 py-1.5 rounded-full hidden sm:flex items-center gap-2 border border-white/5">
          <span className="material-symbols-outlined text-primary text-sm">search</span>
          <input className="bg-transparent border-none focus:ring-0 text-sm w-32 outline-none lg:w-48 placeholder:text-white/30 text-white" placeholder="Search..." type="text" />
        </div>
        <button className="text-emerald-400 hover:bg-white/5 transition-all duration-300 p-2 rounded-full active:scale-95">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/20 shrink-0">
          <img alt="Manager Profile" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop" />
        </div>
      </div>
    </header>
  );
}
