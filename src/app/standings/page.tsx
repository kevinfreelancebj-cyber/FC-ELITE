export default function LeagueStandings() {
  const teams = [
    { rank: 1, name: 'FC ELITE', played: 12, w: 10, d: 2, l: 0, gf: 28, ga: 5, gd: '+23', pts: 32, form: ['W', 'W', 'D', 'W', 'W'] },
    { rank: 2, name: 'RED WOLVES', played: 12, w: 9, d: 1, l: 2, gf: 22, ga: 9, gd: '+13', pts: 28, form: ['W', 'L', 'W', 'W', 'D'] },
    { rank: 3, name: 'NEON KINGS', played: 12, w: 8, d: 2, l: 2, gf: 19, ga: 11, gd: '+8', pts: 26, form: ['D', 'W', 'W', 'L', 'W'] },
    { rank: 4, name: 'STEEL CITY', played: 12, w: 6, d: 4, l: 2, gf: 15, ga: 10, gd: '+5', pts: 22, form: ['D', 'D', 'W', 'W', 'L'] },
    { rank: 5, name: 'AZURE DRAGONS', played: 12, w: 5, d: 3, l: 4, gf: 14, ga: 15, gd: '-1', pts: 18, form: ['L', 'W', 'D', 'L', 'W'] },
  ];

  return (
    <>
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-primary font-label font-semibold uppercase tracking-[0.2em] text-[10px] mb-2 block">Global Division 1</span>
          <h1 className="text-5xl md:text-6xl font-headline font-black tracking-tighter mb-2">League <span className="text-white italic">Standings.</span></h1>
          <p className="text-on-surface-variant max-w-lg">Live updates and extensive team statistics for the current season.</p>
        </div>
        <div className="flex bg-surface-container-high p-1 rounded-lg border border-white/5">
          <button className="px-6 py-2 bg-surface-container-lowest text-emerald-400 rounded shadow-sm text-xs font-headline font-bold uppercase tracking-widest">Global</button>
          <button className="px-6 py-2 text-neutral-500 hover:text-white transition-colors text-xs font-headline font-bold uppercase tracking-widest rounded">Team</button>
          <button className="px-6 py-2 text-neutral-500 hover:text-white transition-colors text-xs font-headline font-bold uppercase tracking-widest rounded">Player</button>
        </div>
      </header>

      <div className="bg-surface-container-low border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-container-highest/50 border-b border-white/10 text-[10px] uppercase font-label tracking-widest text-on-surface-variant">
                <th className="p-4 font-bold w-16 text-center">Pos</th>
                <th className="p-4 font-bold">Club</th>
                <th className="p-4 font-bold text-center">MP</th>
                <th className="p-4 font-bold text-center">W</th>
                <th className="p-4 font-bold text-center">D</th>
                <th className="p-4 font-bold text-center">L</th>
                <th className="p-4 font-bold text-center hidden md:table-cell">GF</th>
                <th className="p-4 font-bold text-center hidden md:table-cell">GA</th>
                <th className="p-4 font-bold text-center">GD</th>
                <th className="p-4 font-bold text-center text-primary">Pts</th>
                <th className="p-4 font-bold">Form</th>
              </tr>
            </thead>
            <tbody className="font-headline text-sm font-semibold divide-y divide-white/5">
              {teams.map((team, index) => (
                <tr key={team.name} className={`hover:bg-surface-container-high/50 transition-colors ${index === 0 ? 'bg-primary/5' : ''}`}>
                  <td className={`p-4 text-center ${index === 0 ? 'text-primary font-black' : 'text-neutral-500'}`}>{team.rank}</td>
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-white/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-sm">{index === 0 ? 'shield' : 'sports_soccer'}</span>
                    </div>
                    <span className={`uppercase tracking-wider ${index === 0 ? 'text-white italic font-black' : 'text-neutral-300'}`}>{team.name}</span>
                  </td>
                  <td className="p-4 text-center text-on-surface-variant">{team.played}</td>
                  <td className="p-4 text-center text-neutral-300">{team.w}</td>
                  <td className="p-4 text-center text-neutral-500">{team.d}</td>
                  <td className="p-4 text-center text-error/80">{team.l}</td>
                  <td className="p-4 text-center text-neutral-400 hidden md:table-cell">{team.gf}</td>
                  <td className="p-4 text-center text-neutral-400 hidden md:table-cell">{team.ga}</td>
                  <td className={`p-4 text-center font-bold ${Number(team.gd) > 0 || team.gd.startsWith('+') ? 'text-primary' : 'text-error'}`}>{team.gd}</td>
                  <td className="p-4 text-center text-lg font-black text-emerald-400">{team.pts}</td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      {team.form.map((f, i) => (
                        <span key={i} className={`w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold ${
                          f === 'W' ? 'bg-primary/20 text-primary' : 
                          f === 'D' ? 'bg-neutral-600/50 text-neutral-400' : 
                          'bg-error/20 text-error'
                        }`}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
