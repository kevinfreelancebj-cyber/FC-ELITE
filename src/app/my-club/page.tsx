'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import type { Team } from '@/lib/supabase/types';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

type MemberRow = {
  id: string;
  role: string;
  jersey_number: number | null;
  profiles: {
    username: string;
    position: string;
    avatar_url: string | null;
  };
};

export default function MyClubPage() {
  const router = useRouter();
  const { user, profile, isLoading } = useAuth();
  const [loadingInitial, setLoadingInitial] = useState(true);
  
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [isCaptain, setIsCaptain] = useState(false);

  const fetchMyClub = async () => {
    // 1. Chercher si l'utilisateur est dans une équipe active
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: membership } = await (supabase.from('team_members') as any)
      .select('team_id, role')
      .eq('profile_id', user!.id)
      .eq('is_active', true)
      .single();

    if (!membership) {
      setLoadingInitial(false);
      return;
    }

    if (membership.role === 'captain' || profile?.role === 'admin' || profile?.role === 'captain') {
      setIsCaptain(true);
    }

    // 2. Fetch de l'équipe
    const { data: teamData } = await supabase
      .from('teams')
      .select('*')
      .eq('id', membership.team_id)
      .single();

    if (teamData) setTeam(teamData as Team);

    // 3. Fetch des membres de l'équipe (les vrais profils)
    const { data: membersData } = await supabase
      .from('team_members')
      .select(`
        id,
        role,
        jersey_number,
        profiles (
          username,
          position,
          avatar_url
        )
      `)
      .eq('team_id', membership.team_id)
      .eq('is_active', true);

    if (membersData) {
      setMembers(membersData as MemberRow[]);
    }

    setLoadingInitial(false);
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
      return;
    }

    if (!isLoading && user) {
      fetchMyClub();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, user, router]);

  if (isLoading || loadingInitial) return <PageSkeleton />;

  // CAS 1 : Agent Libre (Pas de club)
  if (!team) {
    return (
      <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
         <motion.header variants={fadeUp} className="mb-10">
          <span className="text-secondary font-label font-semibold uppercase tracking-[0.2em] text-[10px] mb-2 block">Statut Actuel</span>
          <h1 className="text-5xl md:text-6xl font-headline font-black tracking-tighter mb-2">Agent <span className="text-white italic">Libre.</span></h1>
          <p className="text-on-surface-variant max-w-lg">Vous n&apos;êtes actuellement affilié à aucun club. Rejoignez le marché des transferts pour trouver une équipe.</p>
        </motion.header>

        <motion.div variants={fadeUp} className="mt-12">
          <EmptyState 
            icon="work_history" 
            title="Aucun club trouvé" 
            description="Prêt à fouler la pelouse ? Allez sur le Mercato pour postuler aux offres des capitaines ou créer votre propre club."
            actionLabel="Aller au Mercato"
            onAction={() => router.push('/mercato')}
          />
        </motion.div>
      </motion.div>
    );
  }

  // CAS 2 : Membre d'un Club
  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
      <motion.header variants={fadeUp} className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 relative">
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10 pointer-events-none blur-3xl rounded-full" style={{ backgroundColor: team.primary_color }} />
        
        <div className="relative z-10">
          <span className="font-label font-semibold uppercase tracking-[0.2em] text-[10px] mb-2 block" style={{ color: team.primary_color }}>
            QG du Club
          </span>
          <div className="flex items-center gap-4 mb-2">
            {team.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={team.logo_url} alt="Logo" className="w-16 h-16 rounded-lg object-contain bg-white/5 p-2" />
            ) : (
              <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg border border-white/10" style={{ backgroundColor: team.primary_color + '20' }}>
                <span className="material-symbols-outlined text-4xl" style={{ color: team.primary_color }}>shield</span>
              </div>
            )}
            <h1 className="text-5xl md:text-6xl font-headline font-black tracking-tighter uppercase">{team.name}</h1>
          </div>
          <p className="text-on-surface-variant max-w-lg mt-2">Bienvenue dans le vestiaire. Voici la liste de vos coéquipiers officiels pour cette saison.</p>
        </div>

        {isCaptain && (
          <div className="flex gap-3 relative z-10 shrink-0">
            <button className="px-4 py-3 bg-surface-container-high hover:bg-white/5 border border-white/10 rounded-xl text-xs font-headline font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">settings</span> Paramètres
            </button>
            <button onClick={() => router.push('/mercato')} className="px-4 py-3 primary-gradient text-background rounded-xl text-xs font-headline font-black uppercase tracking-widest transition-transform hover:scale-105 shadow-[0_0_20px_rgba(92,253,128,0.3)] flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">add</span> Recruter
            </button>
          </div>
        )}
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        <motion.section variants={fadeUp} className="lg:col-span-8 space-y-6">
          <div className="bg-surface-container-low border border-white/5 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-surface-container-highest/30">
              <h2 className="font-headline font-black text-xl uppercase tracking-tighter flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary">groups</span> Effectif ({members.length})
              </h2>
            </div>
            
            <div className="divide-y divide-white/5">
              {members.map((member) => (
                <div key={member.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-surface-container-highest shrink-0 relative" style={{ backgroundColor: team.primary_color + '30' }}>
                      <span className="font-headline font-black text-white text-sm">{member.jersey_number || '-'}</span>
                      {member.role === 'captain' && <div className="absolute -bottom-2 -right-2 w-5 h-5 rounded-full bg-primary text-background flex items-center justify-center text-[10px] shadow-lg"><span className="material-symbols-outlined text-[12px] font-bold">star</span></div>}
                    </div>
                    <div>
                      <p className="font-headline font-bold text-base text-white group-hover:text-primary transition-colors cursor-pointer">
                        {member.profiles.username}
                      </p>
                      <p className="text-[10px] font-label uppercase tracking-widest text-neutral-500 font-bold">
                        {member.profiles.position || 'NC'}
                      </p>
                    </div>
                  </div>
                  
                  {isCaptain && member.role !== 'captain' && (
                    <button className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-neutral-500 hover:text-error hover:bg-error/10 transition-colors opacity-0 group-hover:opacity-100">
                      <span className="material-symbols-outlined text-[16px]">person_remove</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section variants={fadeUp} className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-low border border-white/5 rounded-2xl p-6">
            <h3 className="font-headline font-black text-lg uppercase tracking-tighter mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">cases</span> Infos Club
            </h3>
            
            <div className="space-y-4">
              <div className="bg-surface-container-highest/50 rounded-xl p-4">
                <span className="block text-[10px] uppercase font-label font-bold text-neutral-500 tracking-widest mb-1">Budget Transferts</span>
                <span className="text-2xl font-headline font-black text-white">
                  €{(team.budget / 1000000).toFixed(1)}M
                </span>
              </div>
              <div className="bg-surface-container-highest/50 rounded-xl p-4">
                <span className="block text-[10px] uppercase font-label font-bold text-neutral-500 tracking-widest mb-1">Masse Salariale / Semaine</span>
                <span className="text-2xl font-headline font-black text-white">
                  €{(team.wage_cap / 1000).toFixed(0)}K
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-surface-container-low border border-white/5 rounded-2xl p-6">
            <h3 className="font-headline font-black text-lg uppercase tracking-tighter mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">forum</span> Chat d&apos;équipe
            </h3>
            <div className="h-48 flex items-center justify-center border-2 border-dashed border-white/5 rounded-xl">
              <span className="text-xs font-label uppercase tracking-widest text-neutral-600">Bientôt disponible</span>
            </div>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
