'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import type { Team } from '@/lib/supabase/types';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

type MembershipInfo = {
  team_id: string;
  role: string;
  jersey_number: number | null;
  teams: Team;
};

export default function PlayerProfile() {
  const router = useRouter();
  const { user, profile, isLoading } = useAuth();
  const [membership, setMembership] = useState<MembershipInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) { router.push('/login'); return; }
    if (!isLoading && user) {
      (async () => {
        const { data } = await supabase
          .from('team_members')
          .select('team_id, role, jersey_number, teams(*)')
          .eq('profile_id', user.id)
          .eq('is_active', true)
          .single();
        if (data) setMembership(data as unknown as MembershipInfo);
        setLoading(false);
      })();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, user]);

  if (isLoading || loading) return <PageSkeleton />;
  if (!profile) return null;

  const positionLabels: Record<string, string> = {
    GB: 'Gardien de But', DC: 'Défenseur Central', DD: 'Arrière Droit', DG: 'Arrière Gauche',
    MDC: 'Milieu Défensif', MC: 'Milieu Central', MOC: 'Milieu Offensif',
    AD: 'Ailier Droit', AG: 'Ailier Gauche', BU: 'Buteur',
  };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
      {/* HERO HEADER */}
      <motion.header variants={fadeUp} className="mb-10 rounded-2xl overflow-hidden relative min-h-[350px] bg-surface-container-low border border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-tertiary/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-surface-container-low/60 to-transparent" />

        <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-end">
          <div className="flex flex-col md:flex-row gap-8 items-end justify-between">
            <div className="flex items-end gap-6 w-full">
              {/* Avatar */}
              <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 relative">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                <div className="w-full h-full rounded-2xl border-2 border-primary/50 relative z-10 bg-surface-container-highest flex items-center justify-center overflow-hidden">
                  {profile.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-6xl text-primary">person</span>
                  )}
                </div>
                <div className="absolute -bottom-3 -right-3 px-3 py-1.5 rounded-xl bg-surface-container-highest border border-white/10 flex flex-col items-center justify-center shadow-xl z-20">
                  <span className="text-[8px] font-label text-primary uppercase font-bold tracking-widest">Poste</span>
                  <span className="font-headline font-black text-lg text-white leading-none">{profile.position || '?'}</span>
                </div>
              </div>

              <div className="flex-1 pb-2">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  {profile.height && (
                    <span className="px-3 py-1 bg-surface-container-highest border border-white/10 rounded text-[10px] font-headline font-bold uppercase tracking-widest text-neutral-400">{profile.height} cm</span>
                  )}
                  {profile.weight && (
                    <span className="px-3 py-1 bg-surface-container-highest border border-white/10 rounded text-[10px] font-headline font-bold uppercase tracking-widest text-neutral-400">{profile.weight} kg</span>
                  )}
                  {profile.strong_foot && (
                    <span className="px-3 py-1 bg-tertiary/10 border border-tertiary/20 rounded text-[10px] font-headline font-bold uppercase tracking-widest text-tertiary">Pied {profile.strong_foot}</span>
                  )}
                </div>
                <h1 className="text-4xl md:text-6xl font-headline font-black tracking-tighter uppercase leading-none mb-1">
                  {profile.full_name || profile.username}
                </h1>
                <p className="text-primary font-headline font-bold text-sm uppercase tracking-widest mt-2">
                  @{profile.username}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
        {/* INFO CARDS */}
        <motion.section variants={fadeUp} className="lg:col-span-8 space-y-6">
          {/* Identité Virtual Pro */}
          <div className="bg-surface-container-low rounded-2xl p-6 border border-white/5">
            <h3 className="font-headline font-black text-xl uppercase tracking-tighter mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">badge</span> Identité Virtual Pro
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-surface-container-highest rounded-xl p-4">
                <span className="block text-[10px] uppercase font-label text-neutral-500 tracking-widest mb-1">Position</span>
                <span className="text-lg font-headline font-black text-white">{positionLabels[profile.position || ''] || profile.position || 'Non défini'}</span>
              </div>
              <div className="bg-surface-container-highest rounded-xl p-4">
                <span className="block text-[10px] uppercase font-label text-neutral-500 tracking-widest mb-1">Taille</span>
                <span className="text-lg font-headline font-black text-white">{profile.height ? `${profile.height} cm` : '-'}</span>
              </div>
              <div className="bg-surface-container-highest rounded-xl p-4">
                <span className="block text-[10px] uppercase font-label text-neutral-500 tracking-widest mb-1">Poids</span>
                <span className="text-lg font-headline font-black text-white">{profile.weight ? `${profile.weight} kg` : '-'}</span>
              </div>
              <div className="bg-surface-container-highest rounded-xl p-4">
                <span className="block text-[10px] uppercase font-label text-neutral-500 tracking-widest mb-1">Pied Fort</span>
                <span className="text-lg font-headline font-black text-white">{profile.strong_foot || '-'}</span>
              </div>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <div className="bg-surface-container-low rounded-2xl p-6 border border-white/5">
              <h3 className="font-headline font-black text-xl uppercase tracking-tighter mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary">description</span> Bio / Style de Jeu
              </h3>
              <p className="text-on-surface-variant font-body leading-relaxed">{profile.bio}</p>
            </div>
          )}

          {/* Statut Club */}
          <div className="bg-surface-container-low rounded-2xl p-6 border border-white/5">
            <h3 className="font-headline font-black text-xl uppercase tracking-tighter mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">shield</span> Club Actuel
            </h3>
            {membership ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center border border-white/10" style={{ backgroundColor: membership.teams.primary_color + '20' }}>
                    <span className="material-symbols-outlined text-3xl" style={{ color: membership.teams.primary_color }}>shield</span>
                  </div>
                  <div>
                    <p className="font-headline font-black text-xl uppercase">{membership.teams.name}</p>
                    <p className="text-xs font-label text-neutral-500 uppercase tracking-widest">
                      {membership.role === 'captain' ? '⭐ Capitaine' : 'Joueur'} {membership.jersey_number ? `• N°${membership.jersey_number}` : ''}
                    </p>
                  </div>
                </div>
                <button onClick={() => router.push('/my-club')} className="px-4 py-2 bg-surface-container-highest border border-white/10 rounded-xl text-xs font-headline font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">
                  Voir le Club
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-surface-container-highest flex items-center justify-center border border-white/10">
                    <span className="material-symbols-outlined text-3xl text-neutral-500">work_history</span>
                  </div>
                  <div>
                    <p className="font-headline font-bold text-lg text-neutral-400">Agent Libre</p>
                    <p className="text-xs font-label text-neutral-600">Aucun club pour le moment</p>
                  </div>
                </div>
                <button onClick={() => router.push('/mercato')} className="px-4 py-2 primary-gradient rounded-xl text-xs font-headline font-black uppercase tracking-widest text-background hover:scale-105 transition-transform">
                  Aller au Mercato
                </button>
              </div>
            )}
          </div>
        </motion.section>

        {/* SIDEBAR */}
        <motion.section variants={fadeUp} className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-low rounded-2xl p-6 border border-white/5">
            <h3 className="font-headline font-black text-lg uppercase tracking-tighter mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">info</span> Infos Compte
            </h3>
            <div className="space-y-4">
              <div className="bg-surface-container-highest/50 rounded-xl p-4">
                <span className="block text-[10px] uppercase font-label font-bold text-neutral-500 tracking-widest mb-1">Rôle</span>
                <span className="text-lg font-headline font-black text-white capitalize">{profile.role}</span>
              </div>
              <div className="bg-surface-container-highest/50 rounded-xl p-4">
                <span className="block text-[10px] uppercase font-label font-bold text-neutral-500 tracking-widest mb-1">Membre depuis</span>
                <span className="text-sm font-headline font-bold text-white">
                  {new Date(profile.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
              <div className="bg-surface-container-highest/50 rounded-xl p-4">
                <span className="block text-[10px] uppercase font-label font-bold text-neutral-500 tracking-widest mb-1">Onboarding</span>
                <span className={`text-sm font-headline font-bold ${profile.onboarding_completed ? 'text-primary' : 'text-error'}`}>
                  {profile.onboarding_completed ? '✓ Complété' : '✗ Incomplet'}
                </span>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
