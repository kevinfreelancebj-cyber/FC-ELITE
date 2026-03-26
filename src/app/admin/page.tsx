export default function AdminDashboard() {
  return (
    <>
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-error font-label font-semibold uppercase tracking-[0.2em] text-[10px] mb-2 block animate-pulse">System Overlord</span>
          <h1 className="text-5xl md:text-6xl font-headline font-black tracking-tighter mb-2">Control <span className="text-white italic">Center.</span></h1>
          <p className="text-on-surface-variant max-w-lg">Manage league parameters, resolve disputes, and monitor system integrity across all active instances.</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <span className="block text-[10px] uppercase font-headline font-bold text-neutral-500 tracking-widest">Server Status</span>
            <span className="text-2xl font-headline font-black text-primary">ONLINE</span>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-error/30 flex items-center justify-center bg-surface-container-high relative">
            <span className="material-symbols-outlined text-error">warning</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-error text-white text-[8px] font-bold flex items-center justify-center">3</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface-container-low border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[100px] text-primary">groups</span>
          </div>
          <span className="block text-[10px] font-label font-bold text-neutral-500 uppercase tracking-widest mb-2">Active Managers</span>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-headline font-black text-white">4,281</span>
            <span className="text-xs font-bold text-primary mb-1">+12%</span>
          </div>
        </div>

        <div className="bg-surface-container-low border border-primary/20 rounded-2xl p-6 relative overflow-hidden group shadow-[0_0_15px_rgba(92,253,128,0.05)]">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[100px] text-primary">sports_soccer</span>
          </div>
          <span className="block text-[10px] font-label font-bold text-primary uppercase tracking-widest mb-2">Ongoing Matches</span>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-headline font-black text-primary">142</span>
            <span className="text-xs font-bold text-neutral-500 mb-1">Live</span>
          </div>
        </div>

        <div className="bg-surface-container-low border border-tertiary/20 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[100px] text-tertiary">swap_horiz</span>
          </div>
          <span className="block text-[10px] font-label font-bold text-tertiary uppercase tracking-widest mb-2">Open Transfers</span>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-headline font-black text-white">8,930</span>
            <span className="text-xs font-bold text-neutral-500 mb-1">Bids</span>
          </div>
        </div>

        <div className="bg-surface-container-low border border-error/20 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[100px] text-error">report</span>
          </div>
          <span className="block text-[10px] font-label font-bold text-error uppercase tracking-widest mb-2">Rule Violations</span>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-headline font-black text-white">12</span>
            <span className="text-xs font-bold text-error mb-1">Pending</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <section className="xl:col-span-2 space-y-8">
          <div className="bg-surface-container-low border border-white/5 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline font-black text-xl uppercase tracking-tighter flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">monitoring</span> System Activity
              </h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-surface-container-highest text-[10px] font-bold uppercase rounded text-white">1H</button>
                <button className="px-3 py-1 text-[10px] font-bold uppercase rounded text-neutral-500 hover:text-white">24H</button>
                <button className="px-3 py-1 text-[10px] font-bold uppercase rounded text-neutral-500 hover:text-white">7D</button>
              </div>
            </div>
            
            <div className="h-64 relative border-b border-l border-white/10 pt-4 pr-4">
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-10 pt-4 pr-4">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className="border-t border-r border-white"></div>
                ))}
              </div>
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#5cfd80" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#5cfd80" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 80 Q 15 60, 30 70 T 60 40 T 80 50 T 100 20 L 100 100 L 0 100 Z" fill="url(#chartGradient)" />
                <path d="M0 80 Q 15 60, 30 70 T 60 40 T 80 50 T 100 20" fill="none" stroke="#5cfd80" strokeWidth="2" />
                <circle cx="100" cy="20" r="3" fill="#02c953" className="animate-pulse" />
              </svg>
            </div>
          </div>

          <div className="bg-surface-container-low border border-white/5 rounded-2xl p-6">
             <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline font-black text-xl uppercase tracking-tighter flex items-center gap-2">
                <span className="material-symbols-outlined text-error">gavel</span> Administrative Actions
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="p-4 bg-surface-container-highest hover:bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors group">
                <span className="material-symbols-outlined text-white group-hover:text-primary transition-colors">calendar_month</span>
                <span className="text-[10px] font-bold uppercase tracking-widest font-label">Advance Week</span>
              </button>
              <button className="p-4 bg-surface-container-highest hover:bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors group">
                <span className="material-symbols-outlined text-white group-hover:text-tertiary transition-colors">settings_applications</span>
                <span className="text-[10px] font-bold uppercase tracking-widest font-label">Edit Rules</span>
              </button>
              <button className="p-4 bg-surface-container-highest hover:bg-error/10 border border-white/10 hover:border-error/30 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors group">
                <span className="material-symbols-outlined text-white group-hover:text-error transition-colors">block</span>
                <span className="text-[10px] font-bold uppercase tracking-widest font-label">Ban Manager</span>
              </button>
              <button className="p-4 bg-surface-container-highest hover:bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors group">
                <span className="material-symbols-outlined text-white transition-colors">manage_accounts</span>
                <span className="text-[10px] font-bold uppercase tracking-widest font-label">Force Transfer</span>
              </button>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low border border-white/5 rounded-2xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline font-black text-xl uppercase tracking-tighter flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">feed</span> Live Alerts
            </h2>
            <span className="px-2 py-0.5 bg-error/20 text-error text-[8px] uppercase font-bold rounded">Live</span>
          </div>

          <div className="flex-1 space-y-4 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1 h-full bg-surface-container-highest rounded-full">
               <div className="w-full bg-primary rounded-full h-1/3"></div>
            </div>

            <div className="p-4 bg-surface-container-highest/50 border-l-2 border-error rounded-r-lg">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-label font-bold text-error uppercase tracking-widest">Financial Foul</span>
                <span className="text-[9px] text-neutral-500">2 min ago</span>
              </div>
              <p className="text-xs font-body text-neutral-300">Manager 'PepG' (ID: 8821) attempted transfer exceeding wage cap by 45%. Transaction blocked automatically.</p>
              <div className="mt-3 flex gap-2">
                <button className="text-[9px] font-bold uppercase tracking-widest text-white bg-error hover:bg-error/80 px-3 py-1 rounded transition-colors">Review</button>
                <button className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 hover:text-white px-3 py-1 transition-colors">Dismiss</button>
              </div>
            </div>

            <div className="p-4 bg-surface-container-highest/50 border-l-2 border-primary rounded-r-lg">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-label font-bold text-primary uppercase tracking-widest">Match Result</span>
                <span className="text-[9px] text-neutral-500">14 min ago</span>
              </div>
              <p className="text-xs font-body text-neutral-300">Global Div 1: FC Elite (3) - (1) Red Wolves. Standings updated successfully.</p>
            </div>

            <div className="p-4 bg-surface-container-highest/50 border-l-2 border-tertiary rounded-r-lg">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-label font-bold text-tertiary uppercase tracking-widest">Server Load Warning</span>
                <span className="text-[9px] text-neutral-500">42 min ago</span>
              </div>
              <p className="text-xs font-body text-neutral-300">Database connection pool reaching 85% capacity. Auto-scaling initiated.</p>
            </div>
             
            <div className="p-4 bg-surface-container-highest/50 border-l-2 border-white/20 rounded-r-lg opacity-60">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-label font-bold text-neutral-400 uppercase tracking-widest">User Report</span>
                <span className="text-[9px] text-neutral-500">1 hr ago</span>
              </div>
              <p className="text-xs font-body text-neutral-300">Toxicity flagged in Match ID: LM-992. Automated warning sent.</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
