export default function PlayerProfile() {
  return (
    <>
      <header className="mb-8 rounded-2xl overflow-hidden relative min-h-[450px]">
        <img alt="Julian Velasquez action shot" className="absolute inset-0 w-full h-full object-cover object-top opacity-40 mix-blend-luminosity" src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=2000" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent"></div>
        
        <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-end">
          <div className="flex flex-col md:flex-row gap-8 items-end justify-between">
            <div className="flex items-end gap-6 w-full">
              <div className="w-32 h-32 md:w-48 md:h-48 shrink-0 relative">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
                <img alt="Julian Velasquez portrait" className="w-full h-full object-cover rounded-2xl border-2 border-primary/50 relative z-10" src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600" />
                <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-xl bg-surface-container-highest border border-white/10 flex flex-col items-center justify-center shadow-xl z-20">
                  <span className="font-headline font-black text-2xl text-white leading-none">84</span>
                  <span className="text-[8px] font-label text-primary uppercase font-bold tracking-widest">OVR</span>
                </div>
              </div>
              
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-surface-container-highest border border-white/10 rounded text-[10px] font-headline font-bold uppercase tracking-widest text-neutral-400">22 y/o</span>
                  <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded text-[10px] font-headline font-bold uppercase tracking-widest text-primary">Striker (ST)</span>
                  <div className="flex gap-1 ml-2">
                    <span className="material-symbols-outlined text-sm text-tertiary">star</span>
                    <span className="material-symbols-outlined text-sm text-tertiary">star</span>
                    <span className="material-symbols-outlined text-sm text-tertiary">star</span>
                    <span className="material-symbols-outlined text-sm text-neutral-600">star</span>
                    <span className="material-symbols-outlined text-sm text-neutral-600">star</span>
                  </div>
                </div>
                <h1 className="text-5xl md:text-7xl font-headline font-black tracking-tighter uppercase leading-none mb-1 shadow-black drop-shadow-lg">
                  Julian <br className="hidden md:block" />
                  <span className="text-white italic">Velasquez</span>
                </h1>
                <div className="flex items-center gap-2 mt-4">
                  <span className="material-symbols-outlined text-neutral-500">location_on</span>
                  <span className="text-sm font-label text-neutral-400">Buenos Aires, ARG</span>
                  <span className="mx-2 text-neutral-600">|</span>
                  <div className="flex -space-x-2">
                    <img className="w-6 h-6 rounded-full border border-background object-contain bg-white opacity-80" src="https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png" />
                    <img className="w-6 h-6 rounded-full border border-background object-cover grayscale" src="https://upload.wikimedia.org/wikipedia/commons/1/1a/Flag_of_Argentina.svg" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="shrink-0 w-full md:w-auto flex flex-row md:flex-col gap-4">
              <button className="flex-1 md:w-48 py-4 primary-gradient text-on-primary-container font-headline font-black uppercase tracking-widest rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(92,253,128,0.3)]">
                Negotiate
              </button>
              <button className="flex-1 md:w-48 py-4 bg-surface-container-high border border-white/10 text-white font-headline font-bold uppercase tracking-widest rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-sm">bookmark_add</span> Shortlist
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
        <section className="lg:col-span-8 space-y-6">
          <div className="bg-surface-container-low rounded-2xl p-6 border border-white/5">
            <h3 className="font-headline font-black text-xl uppercase tracking-tighter mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary">show_chart</span> Market Value Evolution
            </h3>
            <div className="h-64 relative flex items-end">
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 opacity-10">
                {[...Array(24)].map((_, i) => (
                  <div key={i} className="border-t border-l border-white"></div>
                ))}
              </div>
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="valueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#5cfd80" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#5cfd80" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 80 Q 20 75, 40 60 T 70 40 T 100 20 L 100 100 L 0 100 Z" fill="url(#valueGradient)" />
                <path d="M0 80 Q 20 75, 40 60 T 70 40 T 100 20" fill="none" stroke="#5cfd80" strokeWidth="2" />
                
                <circle cx="0" cy="80" r="1.5" fill="#0e0e0e" stroke="#5cfd80" strokeWidth="1" />
                <circle cx="40" cy="60" r="1.5" fill="#0e0e0e" stroke="#5cfd80" strokeWidth="1" />
                <circle cx="70" cy="40" r="1.5" fill="#0e0e0e" stroke="#5cfd80" strokeWidth="1" />
                <circle cx="100" cy="20" r="2.5" fill="#02c953" stroke="#fff" strokeWidth="1" className="animate-pulse" />
              </svg>
              <div className="absolute top-[10%] right-[2%] bg-surface-container-highest px-3 py-1.5 rounded border border-primary/20 shadow-lg">
                <span className="block text-[8px] font-label text-neutral-400 uppercase tracking-widest mb-0.5">Current Value</span>
                <span className="font-headline font-black text-primary text-sm">€42.0M</span>
              </div>
              <div className="absolute bottom-[-1.5rem] w-full flex justify-between text-[10px] font-label text-neutral-500">
                <span>2021</span>
                <span>2022</span>
                <span>2023</span>
                <span>2024</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-2xl p-6 border border-white/5">
            <h3 className="font-headline font-black text-xl uppercase tracking-tighter mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">analytics</span> Key Metrics
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-surface-container-highest rounded-xl p-4">
                <span className="block text-[10px] uppercase font-label text-neutral-500 tracking-widest mb-1">Goals (Season)</span>
                <span className="text-3xl font-headline font-black text-white">18</span>
                <div className="w-full bg-surface-container-lowest h-1 mt-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[85%]"></div>
                </div>
              </div>
              <div className="bg-surface-container-highest rounded-xl p-4">
                <span className="block text-[10px] uppercase font-label text-neutral-500 tracking-widest mb-1">Assists</span>
                <span className="text-3xl font-headline font-black text-white">07</span>
                <div className="w-full bg-surface-container-lowest h-1 mt-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[60%]"></div>
                </div>
              </div>
              <div className="bg-surface-container-highest rounded-xl p-4">
                <span className="block text-[10px] uppercase font-label text-neutral-500 tracking-widest mb-1">Shot Conv.</span>
                <span className="text-3xl font-headline font-black text-tertiary">24%</span>
                <div className="w-full bg-surface-container-lowest h-1 mt-2 rounded-full overflow-hidden">
                  <div className="bg-tertiary h-full w-[70%]"></div>
                </div>
              </div>
              <div className="bg-surface-container-highest rounded-xl p-4">
                <span className="block text-[10px] uppercase font-label text-neutral-500 tracking-widest mb-1">Top Speed</span>
                <span className="text-3xl font-headline font-black text-white">34.2</span>
                <span className="text-[10px] text-neutral-500 ml-1">km/h</span>
                <div className="w-full bg-surface-container-lowest h-1 mt-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[92%]"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="lg:col-span-4 bg-surface-container-low rounded-2xl p-6 border border-white/5">
          <h3 className="font-headline font-black text-xl uppercase tracking-tighter mb-8 flex items-center gap-2">
            <span className="material-symbols-outlined text-neutral-400">route</span> Career Journey
          </h3>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-white/10 before:to-transparent">
            
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface-container-low bg-primary text-on-primary-container shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_15px_rgba(92,253,128,0.4)] relative z-10">
                <span className="material-symbols-outlined text-[16px]">sports_soccer</span>
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-surface-container-highest p-4 rounded-xl border border-primary/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-headline font-bold text-sm text-white">Real Madrid</span>
                  <span className="text-[10px] font-label text-primary font-bold">2024 - Present</span>
                </div>
                <span className="text-xs font-label text-on-surface-variant">42 Apps • 26 Goals</span>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:even:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface-container-low bg-surface-container-highest shrink-0 md:order-1 md:group-even:translate-x-1/2 relative z-10">
                <span className="w-2 h-2 rounded-full bg-neutral-500"></span>
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl hover:bg-surface-container-highest transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-headline font-bold text-sm text-neutral-300">FC Porto</span>
                  <span className="text-[10px] font-label text-neutral-500">2021 - 2024</span>
                </div>
                <span className="text-xs font-label text-neutral-500">88 Apps • 45 Goals</span>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
               <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface-container-low bg-surface-container-highest shrink-0 md:order-1 md:group-odd:-translate-x-1/2 relative z-10">
                <span className="w-2 h-2 rounded-full bg-neutral-600"></span>
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl hover:bg-surface-container-highest transition-colors opacity-70">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-headline font-bold text-sm text-neutral-400">Boca Juniors (Academy)</span>
                  <span className="text-[10px] font-label text-neutral-600">2016 - 2021</span>
                </div>
                <span className="text-xs font-label text-neutral-600">Youth System</span>
              </div>
            </div>

          </div>
        </section>
      </div>
    </>
  );
}
