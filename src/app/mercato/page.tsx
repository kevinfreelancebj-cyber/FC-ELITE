import Link from 'next/link';

export default function Mercato() {
  const transferList = [
    {
      id: "1",
      name: "Marcus Rashford",
      position: "LW",
      ovr: 88,
      value: "€65.5M",
      wage: "€250k/w",
      bids: 3,
      image: "https://images.unsplash.com/photo-1544168190-79c154273140?w=400&h=400&fit=crop",
      tag: "Hot Prospect",
      tagColor: "error"
    },
    {
      id: "2",
      name: "Jude Bellingham",
      position: "CM",
      ovr: 91,
      value: "€120M",
      wage: "€320k/w",
      bids: 5,
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
      tag: "Galactico",
      tagColor: "tertiary"
    },
    {
      id: "3",
      name: "Alphonso Davies",
      position: "LB",
      ovr: 86,
      value: "€58.2M",
      wage: "€180k/w",
      bids: 1,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      tag: "Listed",
      tagColor: "primary"
    },
    {
      id: "4",
      name: "Julian Velasquez",
      position: "ST",
      ovr: 84,
      value: "€42.0M",
      wage: "€110k/w",
      bids: 0,
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
      tag: "Release Clause",
      tagColor: "secondary-container"
    }
  ];

  return (
    <>
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-tertiary font-label font-semibold uppercase tracking-[0.2em] text-[10px] mb-2 block animate-pulse">Live Transfer Window</span>
          <h1 className="text-5xl md:text-6xl font-headline font-black tracking-tighter mb-2">The <span className="text-white italic">Mercato.</span></h1>
          <p className="text-on-surface-variant max-w-lg">Scout, negotiate, and sign the next generation of Elite talent. The window closes in 4 days.</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <span className="block text-[10px] uppercase font-headline font-bold text-neutral-500 tracking-widest">Transfer Budget</span>
            <span className="text-2xl font-headline font-black text-white">€145.5<span className="text-primary text-lg">M</span></span>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-primary/30 flex items-center justify-center bg-surface-container-high relative">
            <span className="material-symbols-outlined text-primary">gavel</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-error text-white text-[8px] font-bold flex items-center justify-center">2</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
        <section className="lg:col-span-8 bg-surface-container-low rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-primary/10 transition-colors duration-700"></div>
          
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <h3 className="font-headline font-black text-2xl uppercase italic tracking-tighter">Active Negotiations</h3>
              <p className="text-xs font-label text-on-surface-variant mt-1">Updates on your outgoing bids and incoming offers.</p>
            </div>
            <button className="text-primary text-xs font-headline font-bold uppercase tracking-widest hover:underline flex items-center gap-1">
              View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          <div className="space-y-4 relative z-10">
            <div className="bg-surface-container-highest/50 p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row items-center gap-4 hover:border-primary/30 transition-colors">
              <div className="flex -space-x-2 shrink-0">
                <img alt="Player" className="w-12 h-12 rounded-full border-2 border-surface-container-low object-cover" src="https://images.unsplash.com/photo-1544168190-79c154273140?w=150&h=150&fit=crop" />
                <div className="w-12 h-12 rounded-full border-2 border-surface-container-low bg-surface-container-highest flex items-center justify-center">
                  <span className="material-symbols-outlined text-neutral-500 text-sm">handshake</span>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-surface-container-low bg-white flex items-center justify-center p-2">
                  <img alt="Club" className="w-full h-full object-contain opacity-50 grayscale" src="https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png" />
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h4 className="font-headline font-bold text-sm">Federico Valverde</h4>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                  <span className="text-[10px] font-label text-error bg-error/10 px-2 py-0.5 rounded uppercase font-bold tracking-wider">Bid Rejected</span>
                  <span className="text-[10px] text-on-surface-variant font-label">Counter: €85.0M</span>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <button className="flex-1 sm:flex-none px-4 py-2 border border-white/10 text-white rounded text-xs font-headline font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">Withdraw</button>
                <button className="flex-1 sm:flex-none px-4 py-2 bg-white text-surface-container-lowest rounded text-xs font-headline font-black uppercase tracking-widest hover:bg-neutral-200 transition-colors">Revise Bid</button>
              </div>
            </div>
          </div>
        </section>

        <section className="lg:col-span-4 bg-surface-container-low rounded-2xl p-6 border border-white/5 flex flex-col">
          <h3 className="font-headline font-black text-xl uppercase tracking-tighter mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary">monitoring</span> Market Trends
          </h3>
          <div className="flex-1 flex flex-col justify-center gap-6">
            <div>
              <div className="flex justify-between text-xs font-label text-on-surface-variant mb-2">
                <span>Avg. Transfer Fee</span>
                <span className="text-secondary font-bold">+12.4%</span>
              </div>
              <div className="text-2xl font-headline font-black">€24.5M</div>
            </div>
            <div className="h-px w-full bg-white/5"></div>
            <div>
              <div className="flex justify-between text-xs font-label text-on-surface-variant mb-2">
                <span>Most Wanted Position</span>
              </div>
              <div className="text-2xl font-headline font-black text-primary italic">CDM / CM</div>
            </div>
          </div>
        </section>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="font-headline font-black text-3xl uppercase italic tracking-tighter">The Transfer List</h2>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-lg bg-surface-container-low border border-white/5 flex items-center justify-center hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-sm">tune</span>
          </button>
          <div className="bg-surface-container-low border border-white/5 rounded-lg p-1 flex">
            <button className="px-4 py-1.5 bg-surface-container-highest text-white rounded text-xs font-headline font-bold tracking-widest uppercase">All</button>
            <button className="px-4 py-1.5 text-neutral-500 hover:text-white transition-colors rounded text-xs font-headline font-bold tracking-widest uppercase">Listed</button>
            <button className="px-4 py-1.5 text-neutral-500 hover:text-white transition-colors rounded text-xs font-headline font-bold tracking-widest uppercase">Scouted</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {transferList.map((player) => (
          <Link href={`/profile`} key={player.id}>
            <div className="group bg-surface-container-low rounded-2xl border border-white/5 overflow-hidden hover:-translate-y-1 transition-transform duration-300 relative cursor-pointer">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative h-48 bg-surface-container-lowest">
                <img alt={player.name} className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" src={player.image} />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent"></div>
                
                <div className="absolute top-3 left-3 bg-surface-container-highest/80 backdrop-blur-md px-2 py-1 rounded border border-white/10 flex flex-col items-center">
                  <span className="font-headline font-black text-xl leading-none text-white">{player.ovr}</span>
                  <span className="text-[8px] font-label font-bold uppercase tracking-wider text-primary">{player.position}</span>
                </div>
                
                <div className={`absolute top-3 right-3 text-[9px] font-headline font-black uppercase tracking-widest px-2 py-1 rounded 
                  ${player.tagColor === 'error' ? 'bg-error/20 text-error' : 
                    player.tagColor === 'tertiary' ? 'bg-tertiary/20 text-tertiary' : 
                    player.tagColor === 'primary' ? 'bg-primary/20 text-primary' : 
                    'bg-white/10 text-white'}`}>
                  {player.tag}
                </div>
              </div>

              <div className="p-5">
                <h4 className="font-headline font-black text-lg truncate mb-1">{player.name}</h4>
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
                  <span className="text-xs font-label text-on-surface-variant">24 y/o • ENG</span>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px] text-tertiary">star</span>
                    <span className="material-symbols-outlined text-[12px] text-tertiary">star</span>
                    <span className="material-symbols-outlined text-[12px] text-tertiary">star</span>
                    <span className="material-symbols-outlined text-[12px] text-tertiary">star</span>
                    <span className="material-symbols-outlined text-[12px] text-neutral-600">star</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div>
                    <span className="block text-[9px] font-label text-neutral-500 uppercase font-bold tracking-widest">Est. Value</span>
                    <span className="font-headline font-bold text-sm text-white">{player.value}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-label text-neutral-500 uppercase font-bold tracking-widest">Wage</span>
                    <span className="font-headline font-bold text-sm text-white">{player.wage}</span>
                  </div>
                </div>

                <button className="w-full py-2.5 bg-surface-container-highest hover:bg-white/10 text-emerald-400 border border-primary/20 rounded font-headline font-bold uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                  Make Offer
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
