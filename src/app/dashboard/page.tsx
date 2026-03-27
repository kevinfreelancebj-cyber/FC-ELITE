'use client';

import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import type { Match, Team, Alert } from '@/lib/supabase/types';
import Link from 'next/link';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

type MatchWithTeams = Match & { home_team?: Team; away_team?: Team };
type MembershipInfo = { team_id: string; role: string; teams: Team };

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, isLoading: authLoading } = useAuth();
  const [nextMatch, setNextMatch] = useState<MatchWithTeams | null>(null);
  const [membership, setMembership] = useState<MembershipInfo | null>(null);
  const [notifications, setNotifications] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) { router.push('/login'); return; }
    if (!authLoading && user) {
      (async () => {
        // 1. Fetch membership
        const { data: memberData } = await supabase
          .from('team_members')
          .select('team_id, role, teams(*)')
          .eq('profile_id', user.id)
          .eq('is_active', true)
          .single();
        if (memberData) setMembership(memberData as unknown as MembershipInfo);

        // 2. Fetch next match for user's team
        if (memberData) {
          const teamId = (memberData as unknown as MembershipInfo).team_id;
          const { data: matchData } = await supabase
            .from('matches')
            .select('*')
            .eq('status', 'scheduled')
            .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
            .order('scheduled_at', { ascending: true })
            .limit(1)
            .single();

          if (matchData) {
            const md = matchData as unknown as Match;
            const { data: homeTeam } = await supabase.from('teams').select('*').eq('id', md.home_team_id).single();
            const { data: awayTeam } = await supabase.from('teams').select('*').eq('id', md.away_team_id).single();
            setNextMatch({ ...md, home_team: homeTeam as unknown as Team, away_team: awayTeam as unknown as Team });
          }
        }

        // 3. Fetch notifications / alerts for this user
        const { data: alertData } = await supabase
          .from('alerts')
          .select('*')
          .eq('target_user_id', user.id)
          .eq('is_dismissed', false)
          .order('created_at', { ascending: false })
          .limit(10);
        if (alertData) setNotifications(alertData as Alert[]);

        setLoading(false);
      })();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user]);

  if (authLoading || loading) return <PageSkeleton />;
  if (!profile) return null;

  const userName = profile.full_name?.split(' ')[0] || profile.username || 'Joueur';

  const handleDismissAlert = async (id: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('alerts') as any).update({ is_dismissed: true }).eq('id', id);
    setNotifications(prev => prev.filter(a => a.id !== id));
  };

  const handleAcceptOffer = async (alert: Alert) => {
    if (!alert.related_team_id) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('team_members') as any).insert({
      team_id: alert.related_team_id,
      profile_id: user!.id,
      role: 'player',
      is_active: true,
      joined_at: new Date().toISOString(),
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('alerts') as any).update({ is_dismissed: true, is_read: true }).eq('id', alert.id);
    setNotifications(prev => prev.filter(a => a.id !== alert.id));
    router.refresh();
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      {/* Hero Welcome */}
      <motion.header variants={fadeUp} className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-primary font-label font-semibold uppercase tracking-[0.2em] text-[10px] mb-2 block">Mon Espace</span>
          <h1 className="text-5xl md:text-6xl font-headline font-black tracking-tighter mb-2">Bienvenue, <span className="text-primary italic">{userName}.</span></h1>
          <p className="text-on-surface-variant max-w-lg">
            {membership
              ? `Vous faites partie de ${membership.teams.name}. ${membership.role === 'captain' ? 'En tant que Capitaine, gérez votre effectif et déclarez vos résultats.' : 'Consultez votre calendrier et vos notifications.'}`
              : 'Vous êtes actuellement Agent Libre. Rendez-vous sur le Mercato pour trouver un club !'
            }
          </p>
        </div>
        {/* Status Card */}
        <div className="w-full md:w-72 p-5 bg-surface-container-high rounded-xl border-l-4 border-primary">
          <span className="block text-[10px] uppercase font-headline font-bold text-neutral-500 tracking-widest">Statut</span>
          <span className="text-xl font-headline font-black text-primary italic uppercase">
            {membership ? membership.teams.short_name : 'Agent Libre'}
          </span>
          <div className="mt-2 text-xs font-label text-on-surface-variant">
            {membership ? (membership.role === 'captain' ? '⭐ Capitaine' : 'Joueur') : 'Aucun club'}
          </div>
        </div>
      </motion.header>

      <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* NEXT MATCH */}
        <motion.section variants={fadeUp} className="md:col-span-8 group relative overflow-hidden rounded-xl bg-surface-container-low min-h-[300px] border border-white/5">
          {nextMatch ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-tertiary/5" />
              <div className="relative h-full p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 bg-error-container text-on-error-container text-[10px] font-headline font-black uppercase tracking-widest rounded">Prochain Match</span>
                  <span className="text-tertiary font-headline font-bold text-sm">
                    {new Date(nextMatch.scheduled_at).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-8 md:gap-16 my-8">
                  <div className="text-center">
                    <div className="w-20 h-20 mb-3 mx-auto p-3 bg-surface-container-highest rounded-full border-2 border-primary/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-primary">shield</span>
                    </div>
                    <span className="font-headline font-black text-lg italic uppercase">
                      {nextMatch.home_team?.short_name || 'DOM'}
                    </span>
                  </div>
                  <span className="text-3xl font-headline font-black text-neutral-700 italic">VS</span>
                  <div className="text-center">
                    <div className="w-20 h-20 mb-3 mx-auto p-3 bg-surface-container-highest rounded-full border-2 border-error/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-error">shield</span>
                    </div>
                    <span className="font-headline font-black text-lg italic uppercase">
                      {nextMatch.away_team?.short_name || 'EXT'}
                    </span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Link href="/fixtures" className="px-6 py-3 primary-gradient text-on-primary-container font-headline font-black uppercase tracking-widest text-xs rounded-xl hover:scale-105 active:scale-95 transition-all">
                    Voir le Calendrier
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <span className="material-symbols-outlined text-5xl text-neutral-600 mb-4">event_busy</span>
              <h3 className="font-headline font-bold text-xl uppercase tracking-tighter mb-2">Aucun match programmé</h3>
              <p className="text-on-surface-variant text-sm max-w-sm">
                {membership ? 'Votre prochain match sera affiché ici dès qu\'il sera planifié par l\'admin.' : 'Rejoignez un club pour voir vos matchs à venir.'}
              </p>
            </div>
          )}
        </motion.section>

        {/* QUICK LINKS */}
        <motion.section variants={fadeUp} className="md:col-span-4 space-y-4">
          <Link href="/profile" className="block bg-surface-container-low rounded-xl p-5 border border-white/5 hover:border-primary/30 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">person</span>
              </div>
              <div>
                <h4 className="font-headline font-bold text-sm uppercase">Mon Profil</h4>
                <p className="text-xs text-neutral-500">Voir mes infos Virtual Pro</p>
              </div>
            </div>
          </Link>
          <Link href="/my-club" className="block bg-surface-container-low rounded-xl p-5 border border-white/5 hover:border-tertiary/30 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">shield</span>
              </div>
              <div>
                <h4 className="font-headline font-bold text-sm uppercase">Mon Club</h4>
                <p className="text-xs text-neutral-500">{membership ? membership.teams.name : 'Agent Libre'}</p>
              </div>
            </div>
          </Link>
          <Link href="/mercato" className="block bg-surface-container-low rounded-xl p-5 border border-white/5 hover:border-secondary/30 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">handshake</span>
              </div>
              <div>
                <h4 className="font-headline font-bold text-sm uppercase">Mercato</h4>
                <p className="text-xs text-neutral-500">Marché des transferts</p>
              </div>
            </div>
          </Link>
          <Link href="/standings" className="block bg-surface-container-low rounded-xl p-5 border border-white/5 hover:border-white/20 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined">leaderboard</span>
              </div>
              <div>
                <h4 className="font-headline font-bold text-sm uppercase">Classement</h4>
                <p className="text-xs text-neutral-500">Tableau de la ligue</p>
              </div>
            </div>
          </Link>
        </motion.section>

        {/* NOTIFICATIONS */}
        <motion.section variants={fadeUp} className="md:col-span-12 mt-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-headline font-black text-2xl uppercase italic tracking-tighter">
              Notifications <span className="text-primary font-normal not-italic tracking-normal">| {notifications.length}</span>
            </h3>
          </div>

          {notifications.length === 0 ? (
            <div className="bg-surface-container-low rounded-xl p-8 text-center border border-white/5">
              <span className="material-symbols-outlined text-4xl text-neutral-600 mb-3 block">notifications_none</span>
              <p className="text-on-surface-variant text-sm">Aucune notification pour le moment.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-5 bg-surface-container-low rounded-xl border-l-4 ${
                    alert.category === 'transfer' ? 'border-primary' : 'border-white/20'
                  } flex flex-col md:flex-row md:items-center justify-between gap-4`}
                >
                  <div>
                    <span className={`text-[10px] font-label font-bold uppercase tracking-widest block mb-1 ${
                      alert.category === 'transfer' ? 'text-primary' : 'text-neutral-400'
                    }`}>
                      {alert.category === 'transfer' ? '🤝 Offre de Recrutement' : alert.title}
                    </span>
                    <p className="text-sm text-neutral-300">{alert.message}</p>
                    <span className="text-[10px] text-neutral-600 mt-1 block">
                      {new Date(alert.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {alert.category === 'transfer' && alert.related_team_id && !membership && (
                      <button
                        onClick={() => handleAcceptOffer(alert)}
                        className="px-4 py-2 primary-gradient text-background rounded-lg text-[10px] font-headline font-black uppercase tracking-widest hover:scale-105 transition-transform"
                      >
                        Accepter
                      </button>
                    )}
                    <button
                      onClick={() => handleDismissAlert(alert.id)}
                      className="px-4 py-2 bg-surface-container-highest border border-white/10 rounded-lg text-[10px] font-headline font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
                    >
                      {alert.category === 'transfer' ? 'Refuser' : 'OK'}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </motion.div>
    </motion.div>
  );
}
