export default function PlayerHome() {
  return (
    <>
      {/* Hero Welcome */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-tertiary font-label font-semibold uppercase tracking-[0.2em] text-[10px] mb-2 block">Player Performance Hub</span>
          <h1 className="text-5xl md:text-6xl font-headline font-black tracking-tighter mb-2">Welcome back, <span className="text-primary italic">Marcus.</span></h1>
          <p className="text-on-surface-variant max-w-lg">Your training session starts in 4 hours. The medical team has cleared you for full intensity.</p>
        </div>
        {/* XP & Level Card */}
        <div className="w-full md:w-80 p-5 bg-surface-container-high rounded-xl border-l-4 border-primary">
          <div className="flex justify-between items-end mb-3">
            <div>
              <span className="block text-[10px] uppercase font-headline font-bold text-neutral-500 tracking-widest">Current Rank</span>
              <span className="text-xl font-headline font-black text-primary italic uppercase">Elite Bronze</span>
            </div>
            <span className="text-xs font-label text-on-surface-variant">Level 14</span>
          </div>
          {/* XP Progress Bar */}
          <div className="relative h-2 w-full bg-surface-container-highest rounded-full overflow-hidden mb-2">
            <div className="absolute top-0 left-0 h-full primary-gradient shadow-[0_0_8px_rgba(92,253,128,0.4)]" style={{ width: '65%' }}></div>
          </div>
          <div className="flex justify-between text-[10px] font-label text-neutral-500 uppercase tracking-tighter">
            <span>1,250 XP</span>
            <span>Next: Silver (2,000 XP)</span>
          </div>
        </div>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Next Match Card (Spans 8) */}
        <section className="md:col-span-8 group relative overflow-hidden rounded-xl bg-surface-container-low h-[400px]">
          <img alt="Stadium background" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700" src="https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=2664&auto=format&fit=crop" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent"></div>
          
          <div className="relative h-full p-8 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="px-3 py-1 bg-error-container text-on-error-container text-[10px] font-headline font-black uppercase tracking-widest rounded">Match Day: LIVE</span>
              <div className="text-right">
                <span className="block text-tertiary font-headline font-bold text-sm">Derby della Capitale</span>
                <span className="text-on-surface-variant text-xs font-label">Stadio Olimpico, 20:45</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-8 md:gap-16">
              <div className="text-center">
                <div className="w-24 h-24 mb-4 mx-auto p-4 bg-surface-container-highest rounded-full border-2 border-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-primary">shield</span>
                </div>
                <span className="font-headline font-black text-xl italic uppercase">FC ELITE</span>
              </div>
              <div className="text-center flex flex-col items-center">
                <span className="text-3xl font-headline font-black text-neutral-700 italic">VS</span>
                <div className="mt-2 px-4 py-1 bg-surface-container-highest/80 rounded-full border border-outline-variant/20 text-[10px] font-label uppercase text-on-surface-variant">24.10.23</div>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 mb-4 mx-auto p-4 bg-surface-container-highest rounded-full border-2 border-error/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-error">poker_chip</span>
                </div>
                <span className="font-headline font-black text-xl italic uppercase">RED WOLVES</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 items-center justify-between border-t border-outline-variant/10 pt-6">
              <div className="flex -space-x-3">
                <img alt="Teammate 1" className="w-8 h-8 rounded-full border-2 border-surface-container-lowest object-cover" src="https://images.unsplash.com/photo-1544168190-79c154273140?w=150&h=150&fit=crop" />
                <img alt="Teammate 2" className="w-8 h-8 rounded-full border-2 border-surface-container-lowest object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop" />
                <img alt="Teammate 3" className="w-8 h-8 rounded-full border-2 border-surface-container-lowest object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" />
                <div className="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-surface-container-highest flex items-center justify-center text-[10px] font-bold text-primary">+18</div>
              </div>
              <button className="px-8 py-3 primary-gradient text-on-primary-container font-headline font-black uppercase tracking-widest text-xs rounded-xl hover:scale-105 active:scale-95 transition-all">
                View Tactics
              </button>
            </div>
          </div>
        </section>

        {/* My Stats (Spans 4) */}
        <section className="md:col-span-4 bg-surface-container-low rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline font-bold text-xl uppercase tracking-tighter">My Stats</h3>
              <span className="material-symbols-outlined text-primary">analytics</span>
            </div>
            
            {/* Radar Chart Placeholder */}
            <div className="relative w-full aspect-square mb-8 flex items-center justify-center">
              <div className="absolute inset-0 radar-grid bg-surface-container-highest/50 border border-outline-variant/30 scale-100"></div>
              <div className="absolute inset-0 radar-grid bg-surface-container-highest scale-75 border border-outline-variant/20"></div>
              <div className="absolute inset-0 radar-grid bg-surface-container-highest scale-50 border border-outline-variant/10"></div>
              
              <div className="absolute inset-0 radar-grid primary-gradient opacity-30" style={{ clipPath: 'polygon(50% 10%, 90% 40%, 75% 85%, 25% 90%, 15% 35%)' }}></div>
              
              <span className="absolute top-0 text-[10px] font-headline font-black text-on-surface-variant uppercase">Pace</span>
              <span className="absolute top-[35%] right-0 text-[10px] font-headline font-black text-on-surface-variant uppercase">Sho</span>
              <span className="absolute bottom-0 right-[15%] text-[10px] font-headline font-black text-on-surface-variant uppercase">Pas</span>
              <span className="absolute bottom-0 left-[15%] text-[10px] font-headline font-black text-on-surface-variant uppercase">Dri</span>
              <span className="absolute top-[35%] left-0 text-[10px] font-headline font-black text-on-surface-variant uppercase">Def</span>
              
              <div className="text-3xl font-headline font-black italic text-primary">88</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-surface-container-lowest p-3 rounded-lg text-center border-b-2 border-primary">
              <span className="block text-2xl font-headline font-black">12</span>
              <span className="text-[9px] uppercase font-label text-neutral-500 font-bold">Goals</span>
            </div>
            <div className="bg-surface-container-lowest p-3 rounded-lg text-center border-b-2 border-primary-container">
              <span className="block text-2xl font-headline font-black">08</span>
              <span className="text-[9px] uppercase font-label text-neutral-500 font-bold">Assists</span>
            </div>
            <div className="bg-surface-container-lowest p-3 rounded-lg text-center border-b-2 border-tertiary">
              <span className="block text-2xl font-headline font-black">04</span>
              <span className="text-[9px] uppercase font-label text-neutral-500 font-bold">MVPs</span>
            </div>
          </div>
        </section>

        {/* News Feed (Spans 12) */}
        <section className="md:col-span-12 mt-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-headline font-black text-2xl uppercase italic tracking-tighter">System Intelligence <span className="text-primary font-normal not-italic tracking-normal">| Insights</span></h3>
            <button className="text-primary text-xs font-headline font-bold uppercase tracking-widest hover:underline">Full Report</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group bg-surface-container-low rounded-xl overflow-hidden hover:bg-surface-container-high transition-colors">
              <div className="relative h-48">
                <img alt="Football pitch" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1518605368461-1eb5a7da769c?q=80&w=2670&auto=format&fit=crop" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent"></div>
                <span className="absolute top-4 left-4 px-2 py-1 bg-primary text-on-primary-container text-[8px] font-black uppercase rounded">New Report</span>
              </div>
              <div className="p-5">
                <span className="text-[10px] text-primary font-label font-bold uppercase tracking-widest mb-2 block">Match Analysis</span>
                <h4 className="font-headline font-bold text-lg leading-tight mb-3 group-hover:text-primary transition-colors">Match Report: Elite FC wins the derby!</h4>
                <p className="text-on-surface-variant text-sm line-clamp-2 font-body mb-4">A tactical masterclass from the midfield duo secured a 3-1 victory under the lights.</p>
              </div>
            </div>

            <div className="group bg-surface-container-low rounded-xl overflow-hidden hover:bg-surface-container-high transition-colors">
              <div className="relative h-48">
                <img alt="Training" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2670&auto=format&fit=crop" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent"></div>
                <span className="absolute top-4 left-4 px-2 py-1 bg-tertiary text-on-tertiary-container text-[8px] font-black uppercase rounded">Mercato</span>
              </div>
              <div className="p-5">
                <span className="text-[10px] text-tertiary font-label font-bold uppercase tracking-widest mb-2 block">Transfer Rumors</span>
                <h4 className="font-headline font-bold text-lg leading-tight mb-3 group-hover:text-tertiary transition-colors">Scouting Insight: The next rising star?</h4>
                <p className="text-on-surface-variant text-sm line-clamp-2 font-body mb-4">Analysis of the youth league's top scorer reveals potential fit for Elite's front line.</p>
              </div>
            </div>

            <div className="group bg-surface-container-low rounded-xl overflow-hidden hover:bg-surface-container-high transition-colors">
              <div className="relative h-48">
                <img alt="Training" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1510067341398-32aae55dcebd?q=80&w=2670&auto=format&fit=crop" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent"></div>
              </div>
              <div className="p-5">
                <span className="text-[10px] text-primary-dim font-label font-bold uppercase tracking-widest mb-2 block">Performance Hub</span>
                <h4 className="font-headline font-bold text-lg leading-tight mb-3 group-hover:text-primary-dim transition-colors">Optimal Recovery: New protocols</h4>
                <p className="text-on-surface-variant text-sm line-clamp-2 font-body mb-4">The medical AI suggests a 15% increase in rest periods based on recent load data.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
