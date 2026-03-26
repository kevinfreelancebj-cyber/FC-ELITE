'use client';

import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import type { Match, Team, PlayerStats } from '@/lib/supabase/types';
import Link from 'next/link';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function PlayerHome() {
  const { profile, isLoading: authLoading } = useAuth();
  const [nextMatch, setNextMatch] = useState<(Match & { home_team?: Team; away_team?: Team }) | null>(null);
  const [stats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Fetch next scheduled match
      const { data: matchData } = await supabase
        .from('matches')
        .select('*')
        .eq('status', 'scheduled')
        .order('scheduled_at', { ascending: true })
        .limit(1)
        .single();
      
      if (matchData) {
        const md = matchData as unknown as Match;
        const { data: homeTeam } = await supabase.from('teams').select('*').eq('id', md.home_team_id).single();
        const { data: awayTeam } = await supabase.from('teams').select('*').eq('id', md.away_team_id).single();
        setNextMatch({ ...md, home_team: homeTeam as unknown as Team, away_team: awayTeam as unknown as Team });
      }

      setLoading(false);
    }
    fetchData();
  }, []);

  if (authLoading || loading) return <PageSkeleton />;

  const userName = profile?.full_name?.split(' ')[0] || profile?.username || 'Manager';

  return (
    <motion.div variants={stagger} initial="hidden" animate="show">
      {/* Hero Welcome */}
      <motion.header variants={fadeUp} className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-tertiary font-label font-semibold uppercase tracking-[0.2em] text-[10px] mb-2 block">Centre de Performance</span>
          <h1 className="text-5xl md:text-6xl font-headline font-black tracking-tighter mb-2">Bienvenue, <span className="text-primary italic">{userName}.</span></h1>
          <p className="text-on-surface-variant max-w-lg">Votre prochaine séance d&apos;entraînement commence bientôt. L&apos;équipe médicale vous a autorisé à jouer à pleine intensité.</p>
        </div>
        {/* XP & Level Card */}
        <div className="w-full md:w-80 p-5 bg-surface-container-high rounded-xl border-l-4 border-primary">
          <div className="flex justify-between items-end mb-3">
            <div>
              <span className="block text-[10px] uppercase font-headline font-bold text-neutral-500 tracking-widest">Rang Actuel</span>
              <span className="text-xl font-headline font-black text-primary italic uppercase">{profile?.rank_title || 'Recrue'}</span>
            </div>
            <span className="text-xs font-label text-on-surface-variant">Niveau {profile?.level || 1}</span>
          </div>
          <div className="relative h-2 w-full bg-surface-container-highest rounded-full overflow-hidden mb-2">
            <motion.div
              className="absolute top-0 left-0 h-full primary-gradient shadow-[0_0_8px_rgba(92,253,128,0.4)]"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(((profile?.xp || 0) / 2000) * 100, 100)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-label text-neutral-500 uppercase tracking-tighter">
            <span>{(profile?.xp || 0).toLocaleString('fr-FR')} XP</span>
            <span>Suivant : Silver (2 000 XP)</span>
          </div>
        </div>
      </motion.header>

      {/* Bento Grid Layout */}
      <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Next Match Card */}
        <motion.section variants={fadeUp} className="md:col-span-8 group relative overflow-hidden rounded-xl bg-surface-container-low h-[400px]">
          <img alt="Stade" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-700" src="https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=2664&auto=format&fit=crop" />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent" />
          
          <div className="relative h-full p-8 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="px-3 py-1 bg-error-container text-on-error-container text-[10px] font-headline font-black uppercase tracking-widest rounded">Jour de Match</span>
              <div className="text-right">
                <span className="block text-tertiary font-headline font-bold text-sm">
                  {nextMatch ? new Date(nextMatch.scheduled_at).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Prochain match'}
                </span>
                <span className="text-on-surface-variant text-xs font-label">{nextMatch?.venue || 'Stade à confirmer'}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-8 md:gap-16">
              <div className="text-center">
                <div className="w-24 h-24 mb-4 mx-auto p-4 bg-surface-container-highest rounded-full border-2 border-primary/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-primary">shield</span>
                </div>
                <span className="font-headline font-black text-xl italic uppercase">
                  {nextMatch?.home_team?.short_name || 'FC ELITE'}
                </span>
              </div>
              <div className="text-center flex flex-col items-center">
                <span className="text-3xl font-headline font-black text-neutral-700 italic">VS</span>
                <div className="mt-2 px-4 py-1 bg-surface-container-highest/80 rounded-full border border-outline-variant/20 text-[10px] font-label uppercase text-on-surface-variant">
                  {nextMatch ? new Date(nextMatch.scheduled_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) : '--/--'}
                </div>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 mb-4 mx-auto p-4 bg-surface-container-highest rounded-full border-2 border-error/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-error">poker_chip</span>
                </div>
                <span className="font-headline font-black text-xl italic uppercase">
                  {nextMatch?.away_team?.short_name || 'ADVERSAIRE'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 items-center justify-between border-t border-outline-variant/10 pt-6">
              <div className="flex -space-x-3">
                <div className="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">+11</div>
              </div>
              <Link href="/tactics" className="px-8 py-3 primary-gradient text-on-primary-container font-headline font-black uppercase tracking-widest text-xs rounded-xl hover:scale-105 active:scale-95 transition-all">
                Voir les Tactiques
              </Link>
            </div>
          </div>
        </motion.section>

        {/* My Stats */}
        <motion.section variants={fadeUp} className="md:col-span-4 bg-surface-container-low rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline font-bold text-xl uppercase tracking-tighter">Mes Stats</h3>
              <span className="material-symbols-outlined text-primary">analytics</span>
            </div>
            
            <div className="relative w-full aspect-square mb-8 flex items-center justify-center">
              <div className="absolute inset-0 radar-grid bg-surface-container-highest/50 border border-outline-variant/30 scale-100" />
              <div className="absolute inset-0 radar-grid bg-surface-container-highest scale-75 border border-outline-variant/20" />
              <div className="absolute inset-0 radar-grid bg-surface-container-highest scale-50 border border-outline-variant/10" />
              <div className="absolute inset-0 radar-grid primary-gradient opacity-30" style={{ clipPath: 'polygon(50% 10%, 90% 40%, 75% 85%, 25% 90%, 15% 35%)' }} />
              <span className="absolute top-0 text-[10px] font-headline font-black text-on-surface-variant uppercase">Vit</span>
              <span className="absolute top-[35%] right-0 text-[10px] font-headline font-black text-on-surface-variant uppercase">Tir</span>
              <span className="absolute bottom-0 right-[15%] text-[10px] font-headline font-black text-on-surface-variant uppercase">Pas</span>
              <span className="absolute bottom-0 left-[15%] text-[10px] font-headline font-black text-on-surface-variant uppercase">Dri</span>
              <span className="absolute top-[35%] left-0 text-[10px] font-headline font-black text-on-surface-variant uppercase">Déf</span>
              <div className="text-3xl font-headline font-black italic text-primary">
                <AnimatedCounter target={88} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-surface-container-lowest p-3 rounded-lg text-center border-b-2 border-primary">
              <span className="block text-2xl font-headline font-black"><AnimatedCounter target={stats?.goals || 12} /></span>
              <span className="text-[9px] uppercase font-label text-neutral-500 font-bold">Buts</span>
            </div>
            <div className="bg-surface-container-lowest p-3 rounded-lg text-center border-b-2 border-primary-container">
              <span className="block text-2xl font-headline font-black"><AnimatedCounter target={stats?.assists || 8} /></span>
              <span className="text-[9px] uppercase font-label text-neutral-500 font-bold">Passes D.</span>
            </div>
            <div className="bg-surface-container-lowest p-3 rounded-lg text-center border-b-2 border-tertiary">
              <span className="block text-2xl font-headline font-black"><AnimatedCounter target={stats?.mvp_awards || 4} /></span>
              <span className="text-[9px] uppercase font-label text-neutral-500 font-bold">MVP</span>
            </div>
          </div>
        </motion.section>

        {/* News Feed */}
        <motion.section variants={fadeUp} className="md:col-span-12 mt-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-headline font-black text-2xl uppercase italic tracking-tighter">Intelligence Système <span className="text-primary font-normal not-italic tracking-normal">| Actualités</span></h3>
            <button className="text-primary text-xs font-headline font-bold uppercase tracking-widest hover:underline">Rapport Complet</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={fadeUp} className="group bg-surface-container-low rounded-xl overflow-hidden hover:bg-surface-container-high transition-colors">
              <div className="relative h-48">
                <img alt="Terrain de football" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1518605368461-1eb5a7da769c?q=80&w=2670&auto=format&fit=crop" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent" />
                <span className="absolute top-4 left-4 px-2 py-1 bg-primary text-on-primary-container text-[8px] font-black uppercase rounded">Nouveau</span>
              </div>
              <div className="p-5">
                <span className="text-[10px] text-primary font-label font-bold uppercase tracking-widest mb-2 block">Analyse de Match</span>
                <h4 className="font-headline font-bold text-lg leading-tight mb-3 group-hover:text-primary transition-colors">Rapport : l&apos;Élite remporte le derby !</h4>
                <p className="text-on-surface-variant text-sm line-clamp-2 font-body mb-4">Un chef-d&apos;œuvre tactique du duo au milieu de terrain a assuré une victoire 3-1 sous les projecteurs.</p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="group bg-surface-container-low rounded-xl overflow-hidden hover:bg-surface-container-high transition-colors">
              <div className="relative h-48">
                <img alt="Entraînement" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2670&auto=format&fit=crop" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent" />
                <span className="absolute top-4 left-4 px-2 py-1 bg-tertiary text-on-tertiary-container text-[8px] font-black uppercase rounded">Mercato</span>
              </div>
              <div className="p-5">
                <span className="text-[10px] text-tertiary font-label font-bold uppercase tracking-widest mb-2 block">Rumeurs Transferts</span>
                <h4 className="font-headline font-bold text-lg leading-tight mb-3 group-hover:text-tertiary transition-colors">Repérage : la prochaine pépite ?</h4>
                <p className="text-on-surface-variant text-sm line-clamp-2 font-body mb-4">L&apos;analyse du meilleur buteur des jeunes révèle un profil idéal pour la ligne d&apos;attaque de l&apos;Élite.</p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="group bg-surface-container-low rounded-xl overflow-hidden hover:bg-surface-container-high transition-colors">
              <div className="relative h-48">
                <img alt="Récupération" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1510067341398-32aae55dcebd?q=80&w=2670&auto=format&fit=crop" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent" />
              </div>
              <div className="p-5">
                <span className="text-[10px] text-primary-dim font-label font-bold uppercase tracking-widest mb-2 block">Performance</span>
                <h4 className="font-headline font-bold text-lg leading-tight mb-3 group-hover:text-primary-dim transition-colors">Récupération optimisée : nouveaux protocoles</h4>
                <p className="text-on-surface-variant text-sm line-clamp-2 font-body mb-4">L&apos;IA médicale suggère une augmentation de 15% des temps de repos basée sur les dernières données de charge.</p>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </motion.div>
    </motion.div>
  );
}
