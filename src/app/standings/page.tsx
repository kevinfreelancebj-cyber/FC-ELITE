'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import type { Standing, Team } from '@/lib/supabase/types';
import { TableRowSkeleton } from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

type StandingWithTeam = Standing & { teams: Team };

export default function LeagueStandings() {
  const [activeTab, setActiveTab] = useState<'Team'|'Player'>('Team');
  const [standings, setStandings] = useState<StandingWithTeam[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [playerStats, setPlayerStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStandings() {
      const { data } = await supabase
        .from('standings')
        .select('*, teams(*)')
        .order('points', { ascending: false });

      if (data && data.length > 0) {
        setStandings(data as unknown as StandingWithTeam[]);
      }

      // Fetch player stats
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: perfs } = await (supabase.from('match_performances') as any).select('goals, assists, is_mvp, profile_id, profiles(username, position), teams(short_name, primary_color)');
      
      if (perfs) {
        // Aggregate
        const statsMap = new Map();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        perfs.forEach((p: any) => {
          if (!statsMap.has(p.profile_id)) {
            statsMap.set(p.profile_id, {
              profile_id: p.profile_id,
              username: p.profiles?.username || 'Inconnu',
              position: p.profiles?.position || 'NC',
              team_short: p.teams?.short_name || 'AGENT',
              team_color: p.teams?.primary_color || '#10B981',
              goals: 0,
              assists: 0,
              mvps: 0,
              played: 0
            });
          }
          const s = statsMap.get(p.profile_id);
          s.goals += p.goals || 0;
          s.assists += p.assists || 0;
          s.mvps += p.is_mvp ? 1 : 0;
          s.played += 1;
        });
        setPlayerStats(Array.from(statsMap.values()));
      }

      setLoading(false);
    }
    fetchStandings();
  }, []);

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
      <motion.header variants={fadeUp} className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-primary font-label font-semibold uppercase tracking-[0.2em] text-[10px] mb-2 block">Division Mondiale 1</span>
          <h1 className="text-5xl md:text-6xl font-headline font-black tracking-tighter mb-2">Le <span className="text-white italic">Classement.</span></h1>
          <p className="text-on-surface-variant max-w-lg">Mises à jour en direct et statistiques détaillées des équipes pour la saison en cours.</p>
          <button onClick={() => setActiveTab('Team')} className={`px-6 py-2 rounded shadow-sm text-xs font-headline font-bold uppercase tracking-widest transition-colors ${activeTab === 'Team' ? 'bg-surface-container-lowest text-emerald-400' : 'text-neutral-500 hover:text-white'}`}>Class. Équipes</button>
          <button onClick={() => setActiveTab('Player')} className={`px-6 py-2 rounded shadow-sm text-xs font-headline font-bold uppercase tracking-widest transition-colors ${activeTab === 'Player' ? 'bg-surface-container-lowest text-emerald-400' : 'text-neutral-500 hover:text-white'}`}>Class. Joueurs</button>
        </div>
      </motion.header>

      {/* TEAM STANDINGS */}
      {!loading && activeTab === 'Team' && (
      <motion.div variants={fadeUp} className="bg-surface-container-low border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-surface-container-highest/50 border-b border-white/10 text-[10px] uppercase font-label tracking-widest text-on-surface-variant">
                <th className="p-4 font-bold w-16 text-center">Pos</th>
                <th className="p-4 font-bold">Club</th>
                <th className="p-4 font-bold text-center">MJ</th>
                <th className="p-4 font-bold text-center">V</th>
                <th className="p-4 font-bold text-center">N</th>
                <th className="p-4 font-bold text-center">D</th>
                <th className="p-4 font-bold text-center hidden md:table-cell">BP</th>
                <th className="p-4 font-bold text-center hidden md:table-cell">BC</th>
                <th className="p-4 font-bold text-center">DB</th>
                <th className="p-4 font-bold text-center text-primary">Pts</th>
                <th className="p-4 font-bold">Forme</th>
              </tr>
            </thead>
            <tbody className="font-headline text-sm font-semibold divide-y divide-white/5">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} />)
              ) : standings.length === 0 ? (
                <tr><td colSpan={11}><EmptyState icon="leaderboard" title="Aucun classement" description="Le classement sera disponible une fois la saison commencée." /></td></tr>
              ) : (
                standings.map((team, index) => (
                  <motion.tr
                    key={team.teams?.name || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`hover:bg-surface-container-high/50 transition-colors ${index === 0 ? 'bg-primary/5' : ''}`}
                  >
                    <td className={`p-4 text-center ${index === 0 ? 'text-primary font-black' : 'text-neutral-500'}`}>{team.rank || index + 1}</td>
                    <td className="p-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-white/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-sm">{index === 0 ? 'shield' : 'sports_soccer'}</span>
                      </div>
                      <span className={`uppercase tracking-wider ${index === 0 ? 'text-white italic font-black' : 'text-neutral-300'}`}>{team.teams?.name}</span>
                    </td>
                    <td className="p-4 text-center text-on-surface-variant">{team.played}</td>
                    <td className="p-4 text-center text-neutral-300">{team.wins}</td>
                    <td className="p-4 text-center text-neutral-500">{team.draws}</td>
                    <td className="p-4 text-center text-error/80">{team.losses}</td>
                    <td className="p-4 text-center text-neutral-400 hidden md:table-cell">{team.goals_for}</td>
                    <td className="p-4 text-center text-neutral-400 hidden md:table-cell">{team.goals_against}</td>
                    <td className={`p-4 text-center font-bold ${team.goal_difference > 0 ? 'text-primary' : team.goal_difference < 0 ? 'text-error' : 'text-neutral-400'}`}>
                      {team.goal_difference > 0 ? '+' : ''}{team.goal_difference}
                    </td>
                    <td className="p-4 text-center text-lg font-black text-emerald-400">{team.points}</td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        {(team.form || []).slice(-5).map((f: string, i: number) => (
                          <span key={i} className={`w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold ${
                            f === 'V' || f === 'W' ? 'bg-primary/20 text-primary' :
                            f === 'N' || f === 'D' ? 'bg-neutral-600/50 text-neutral-400' :
                            'bg-error/20 text-error'
                          }`}>
                            {f === 'W' ? 'V' : f === 'L' ? 'D' : f}
                          </span>
                        ))}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
      )}

      {/* TABS PLAYER LEADERBOARDS */}
      {!loading && activeTab === 'Player' && (
        <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* TOP SCORERS */}
          <div className="bg-surface-container-low border border-white/5 rounded-2xl p-6">
            <h2 className="font-headline font-black text-xl mb-4 flex items-center gap-2 uppercase tracking-tighter text-white">
              <span className="material-symbols-outlined text-primary">sports_soccer</span> Soulier d&apos;Or
            </h2>
            <div className="space-y-2">
              {[...playerStats].sort((a,b) => b.goals - a.goals || a.played - b.played).slice(0,10).map((p, i) => (
                <div key={p.profile_id} className="flex justify-between items-center p-3 rounded-lg bg-surface-container-highest/30 border border-white/5">
                  <div className="flex gap-3 items-center">
                    <span className="text-sm font-black w-4 text-neutral-500">{i+1}</span>
                    <div>
                      <span className="font-headline font-bold text-sm block">{p.username}</span>
                      <span className="text-[10px] text-neutral-500" style={{ color: p.team_color }}>{p.team_short} • {p.position}</span>
                    </div>
                  </div>
                  <span className="font-headline font-black text-lg text-white">{p.goals}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TOP ASSISTS */}
          <div className="bg-surface-container-low border border-white/5 rounded-2xl p-6">
            <h2 className="font-headline font-black text-xl mb-4 flex items-center gap-2 uppercase tracking-tighter text-white">
              <span className="material-symbols-outlined text-tertiary">moving</span> Meilleurs Passeurs
            </h2>
            <div className="space-y-2">
              {[...playerStats].sort((a,b) => b.assists - a.assists || a.played - b.played).slice(0,10).map((p, i) => (
                <div key={p.profile_id} className="flex justify-between items-center p-3 rounded-lg bg-surface-container-highest/30 border border-white/5">
                  <div className="flex gap-3 items-center">
                    <span className="text-sm font-black w-4 text-neutral-500">{i+1}</span>
                    <div>
                      <span className="font-headline font-bold text-sm block">{p.username}</span>
                      <span className="text-[10px] text-neutral-500" style={{ color: p.team_color }}>{p.team_short} • {p.position}</span>
                    </div>
                  </div>
                  <span className="font-headline font-black text-lg text-white">{p.assists}</span>
                </div>
              ))}
            </div>
          </div>

          {/* MVP / BALLON D'OR */}
          <div className="bg-surface-container-low border border-warning/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(234,179,8,0.05)]">
            <h2 className="font-headline font-black text-xl mb-4 flex items-center gap-2 uppercase tracking-tighter text-warning">
              <span className="material-symbols-outlined text-warning">social_leaderboard</span> Ballon d&apos;Or
            </h2>
            <div className="space-y-2">
              {[...playerStats].sort((a,b) => b.mvps - a.mvps || b.goals - a.goals).slice(0,10).map((p, i) => (
                <div key={p.profile_id} className="flex justify-between items-center p-3 rounded-lg bg-warning/5 border border-warning/10">
                  <div className="flex gap-3 items-center">
                    <span className="text-sm font-black w-4 text-warning/50">{i+1}</span>
                    <div>
                      <span className="font-headline font-bold text-sm block text-warning">{p.username}</span>
                      <span className="text-[10px] text-neutral-500" style={{ color: p.team_color }}>{p.team_short} • {p.position}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-headline font-black text-lg text-warning block leading-none">{p.mvps} <span className="text-[10px] font-label font-normal text-warning/50">MVP</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

    </motion.div>
  );
}
