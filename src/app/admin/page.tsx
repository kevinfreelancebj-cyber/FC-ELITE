'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import type { Team } from '@/lib/supabase/types';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

type MemberWithProfile = {
  id: string;
  team_id: string;
  role: string;
  profile_id: string;
  profiles: { username: string; full_name: string | null; position: string | null };
  teams: { name: string; short_name: string };
};

export default function AdminDashboard() {
  const router = useRouter();
  const { user, profile, isLoading } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [members, setMembers] = useState<MemberWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ players: 0, teams: 0, matches: 0 });

  // Calendar generation state
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) { router.push('/login'); return; }
    if (!isLoading && profile && profile.role !== 'admin') {
      toast.error('Accès réservé aux administrateurs.');
      router.push('/dashboard');
      return;
    }
    if (!isLoading && user && profile?.role === 'admin') {
      fetchData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, user, profile]);

  async function fetchData() {
    // Teams
    const { data: teamsData } = await supabase.from('teams').select('*').order('name');
    if (teamsData) setTeams(teamsData as Team[]);

    // All members with profiles and teams
    const { data: membersData } = await supabase.from('team_members').select('id, team_id, role, profile_id, profiles(username, full_name, position), teams(name, short_name)').eq('is_active', true);
    if (membersData) setMembers(membersData as unknown as MemberWithProfile[]);

    // All players for stats count
    const { count: playerCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

    // Stats
    const { count: teamCount } = await supabase.from('teams').select('*', { count: 'exact', head: true });
    const { count: matchCount } = await supabase.from('matches').select('*', { count: 'exact', head: true });

    setStats({
      players: playerCount || 0,
      teams: teamCount || 0,
      matches: matchCount || 0,
    });

    setLoading(false);
  }

  // PROMOTE TO CAPTAIN
  const handlePromoteCaptain = async (memberId: string, profileUsername: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('team_members') as any)
      .update({ role: 'captain' })
      .eq('id', memberId);
    if (error) { toast.error('Erreur : ' + error.message); return; }
    toast.success(`${profileUsername} est maintenant Capitaine !`);
    fetchData();
  };

  // DEMOTE FROM CAPTAIN
  const handleDemoteCaptain = async (memberId: string, profileUsername: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('team_members') as any)
      .update({ role: 'player' })
      .eq('id', memberId);
    if (error) { toast.error('Erreur : ' + error.message); return; }
    toast.success(`${profileUsername} n&apos;est plus Capitaine.`);
    fetchData();
  };

  // GENERATE ROUND-ROBIN CALENDAR
  const handleGenerateCalendar = async () => {
    if (teams.length < 2) { toast.error('Il faut au moins 2 équipes pour générer un calendrier.'); return; }
    setGenerating(true);

    // Get or create active season
    let seasonId: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existingSeason } = await (supabase.from('seasons') as any).select('id').eq('is_active', true).single();
    if (existingSeason) {
      seasonId = existingSeason.id;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: newSeason, error: sErr } = await (supabase.from('seasons') as any).insert({
        league_id: (await (supabase.from('leagues') as any).select('id').limit(1).single()).data?.id,
        name: 'Saison 2025-26',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 180 * 86400000).toISOString(),
        is_active: true,
        current_week: 1,
      }).select('id').single();
      if (sErr || !newSeason) { toast.error('Erreur création saison'); setGenerating(false); return; }
      seasonId = (newSeason as { id: string }).id;
    }

    // Delete existing scheduled matches for this season
    await supabase.from('matches').delete().eq('season_id', seasonId).eq('status', 'scheduled');

    // Round-robin algorithm
    const teamIds = teams.map(t => t.id);
    const n = teamIds.length;
    const rounds: { home: string; away: string; week: number }[] = [];
    const list = [...teamIds];
    if (n % 2 !== 0) list.push('BYE');
    const total = list.length;
    const half = total / 2;

    for (let round = 0; round < total - 1; round++) {
      for (let i = 0; i < half; i++) {
        const home = list[i];
        const away = list[total - 1 - i];
        if (home !== 'BYE' && away !== 'BYE') {
          rounds.push({ home, away, week: round + 1 });
        }
      }
      // Rotate (keep first element fixed)
      const last = list.pop()!;
      list.splice(1, 0, last);
    }

    // Insert matches
    const baseDate = new Date();
    const matchInserts = rounds.map(r => ({
      season_id: seasonId,
      week: r.week,
      home_team_id: r.home,
      away_team_id: r.away,
      status: 'scheduled',
      scheduled_at: new Date(baseDate.getTime() + (r.week - 1) * 7 * 86400000).toISOString(),
    }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertErr } = await (supabase.from('matches') as any).insert(matchInserts);
    if (insertErr) { toast.error('Erreur : ' + insertErr.message); }
    else { toast.success(`${matchInserts.length} matchs générés avec succès !`); }

    // Create or reset standings for each team
    for (const t of teams) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: existing } = await (supabase.from('standings') as any).select('id').eq('season_id', seasonId).eq('team_id', t.id).single();
      if (!existing) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('standings') as any).insert({
          season_id: seasonId,
          team_id: t.id,
          played: 0, wins: 0, draws: 0, losses: 0,
          goals_for: 0, goals_against: 0, goal_difference: 0,
          points: 0, form: [], rank: null,
        });
      }
    }

    setGenerating(false);
    fetchData();
  };

  if (isLoading || loading) return <PageSkeleton />;
  if (!profile || profile.role !== 'admin') return null;

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
      <motion.header variants={fadeUp} className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-error font-label font-semibold uppercase tracking-[0.2em] text-[10px] mb-2 block animate-pulse">Administration</span>
          <h1 className="text-5xl md:text-6xl font-headline font-black tracking-tighter mb-2">Centre de <span className="text-white italic">Contrôle.</span></h1>
          <p className="text-on-surface-variant max-w-lg">Gérez les équipes, nommez les capitaines et générez le calendrier de la saison.</p>
        </div>
      </motion.header>

      {/* Stats */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-surface-container-low border border-white/5 rounded-2xl p-6">
          <span className="block text-[10px] font-label font-bold text-neutral-500 uppercase tracking-widest mb-2">Joueurs Inscrits</span>
          <span className="text-4xl font-headline font-black text-white">{stats.players}</span>
        </div>
        <div className="bg-surface-container-low border border-primary/20 rounded-2xl p-6">
          <span className="block text-[10px] font-label font-bold text-primary uppercase tracking-widest mb-2">Équipes</span>
          <span className="text-4xl font-headline font-black text-primary">{stats.teams}</span>
        </div>
        <div className="bg-surface-container-low border border-tertiary/20 rounded-2xl p-6">
          <span className="block text-[10px] font-label font-bold text-tertiary uppercase tracking-widest mb-2">Matchs Programmés</span>
          <span className="text-4xl font-headline font-black text-tertiary">{stats.matches}</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* GESTION DES CAPITAINES */}
        <motion.section variants={fadeUp} className="bg-surface-container-low border border-white/5 rounded-2xl p-6">
          <h2 className="font-headline font-black text-xl uppercase tracking-tighter mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">star</span> Gestion des Capitaines
          </h2>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {members.length === 0 ? (
              <p className="text-neutral-500 text-sm text-center py-8">Aucun membre dans les équipes.</p>
            ) : (
              members.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-4 bg-surface-container-highest/50 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center border border-white/10">
                      <span className="material-symbols-outlined text-sm">{m.role === 'captain' ? 'star' : 'person'}</span>
                    </div>
                    <div>
                      <p className="font-headline font-bold text-sm">{m.profiles.username}</p>
                      <p className="text-[10px] font-label text-neutral-500 uppercase tracking-widest">
                        {m.teams.short_name} • {m.profiles.position || 'NC'} • <span className={m.role === 'captain' ? 'text-primary' : ''}>{m.role === 'captain' ? 'Capitaine' : 'Joueur'}</span>
                      </p>
                    </div>
                  </div>
                  <div>
                    {m.role === 'captain' ? (
                      <button onClick={() => handleDemoteCaptain(m.id, m.profiles.username)} className="px-3 py-1.5 bg-error/10 text-error border border-error/20 rounded-lg text-[10px] font-headline font-bold uppercase tracking-widest hover:bg-error/20 transition-colors">
                        Retirer C
                      </button>
                    ) : (
                      <button onClick={() => handlePromoteCaptain(m.id, m.profiles.username)} className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[10px] font-headline font-bold uppercase tracking-widest hover:bg-primary/20 transition-colors">
                        Nommer C
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.section>

        {/* GÉNÉRATION CALENDRIER */}
        <motion.section variants={fadeUp} className="bg-surface-container-low border border-white/5 rounded-2xl p-6">
          <h2 className="font-headline font-black text-xl uppercase tracking-tighter mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary">calendar_month</span> Génération du Calendrier
          </h2>

          <div className="bg-surface-container-highest/50 rounded-xl p-6 mb-6 border border-white/5">
            <p className="text-on-surface-variant text-sm mb-4">
              Génère automatiquement un calendrier aller simple (Round-Robin) pour toutes les équipes enregistrées.
              Chaque équipe joue exactement une fois contre toutes les autres.
            </p>
            <div className="flex items-center gap-4 mb-4">
              <div className="px-3 py-1.5 bg-surface-container-highest rounded-lg text-xs font-headline font-bold">
                {teams.length} équipe{teams.length > 1 ? 's' : ''}
              </div>
              <div className="px-3 py-1.5 bg-surface-container-highest rounded-lg text-xs font-headline font-bold">
                {teams.length > 1 ? (teams.length * (teams.length - 1)) / 2 : 0} matchs prévus
              </div>
            </div>
            <button
              onClick={handleGenerateCalendar}
              disabled={generating || teams.length < 2}
              className="w-full py-4 primary-gradient text-background rounded-xl font-headline font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(92,253,128,0.3)] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {generating ? (
                <span className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="material-symbols-outlined">auto_fix_high</span>
              )}
              {generating ? 'Génération...' : 'Générer le Calendrier'}
            </button>
          </div>

          {/* Teams list */}
          <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-neutral-400 mb-4">Équipes enregistrées</h3>
          <div className="space-y-2">
            {teams.map(team => (
              <div key={team.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-highest/30 border border-white/5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/10" style={{ backgroundColor: team.primary_color + '20' }}>
                  <span className="material-symbols-outlined text-sm" style={{ color: team.primary_color }}>shield</span>
                </div>
                <div>
                  <span className="font-headline font-bold text-sm">{team.name}</span>
                  <span className="text-[10px] text-neutral-500 ml-2">{team.short_name}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
