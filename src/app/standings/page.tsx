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
  const [standings, setStandings] = useState<StandingWithTeam[]>([]);
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
        </div>
        <div className="flex bg-surface-container-high p-1 rounded-lg border border-white/5">
          <button className="px-6 py-2 bg-surface-container-lowest text-emerald-400 rounded shadow-sm text-xs font-headline font-bold uppercase tracking-widest">Mondial</button>
          <button className="px-6 py-2 text-neutral-500 hover:text-white transition-colors text-xs font-headline font-bold uppercase tracking-widest rounded">Équipe</button>
          <button className="px-6 py-2 text-neutral-500 hover:text-white transition-colors text-xs font-headline font-bold uppercase tracking-widest rounded">Joueur</button>
        </div>
      </motion.header>

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
    </motion.div>
  );
}
