'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';

const POSITIONS = ['GB', 'DC', 'DD', 'DG', 'MDC', 'MC', 'MOC', 'AD', 'AG', 'BU'];
const FEET = ['Droit', 'Gauche', 'Ambidextre'];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, profile, refreshProfile, isLoading } = useAuth();
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [position, setPosition] = useState<string>('');
  const [height, setHeight] = useState<number>(180);
  const [weight, setWeight] = useState<number>(75);
  const [strongFoot, setStrongFoot] = useState<string>('Droit');
  const [bio, setBio] = useState<string>('');

  useEffect(() => {
    // Si pas connecté, rediriger d'abord vers le login
    if (!isLoading && !user) router.push('/login');
    // Si déjà onboarding completed, rediriger vers l'accueil
    if (!isLoading && profile?.onboarding_completed) router.push('/dashboard');
  }, [user, profile, isLoading, router]);

  if (isLoading || !user) return <PageSkeleton />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!position) {
      toast.error('Veuillez sélectionner un poste de prédilection.');
      return;
    }

    setSaving(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from('profiles') as any)
        .update({
          position,
          height,
          weight,
          strong_foot: strongFoot,
          bio,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();
      toast.success('Profil Virtual Pro créé avec succès !');
      router.push('/dashboard');
    } catch (err: unknown) {
      const e = err as Error;
      toast.error(e.message || 'Une erreur est survenue lors de la création de votre profil.');
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
         <div className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-primary/20 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />
         <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-tertiary/20 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/3" />
      </div>

      {/* Left side: Context */}
      <div className="flex-1 p-8 md:p-16 flex flex-col justify-center relative z-10 border-b md:border-b-0 md:border-r border-white/5 bg-surface-container-lowest/50 backdrop-blur-md">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <div className="w-16 h-16 rounded-2xl bg-surface-container-high border border-white/10 flex items-center justify-center mb-8 shadow-xl shadow-black/50">
            <span className="material-symbols-outlined text-3xl text-primary">person_add</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-black tracking-tighter uppercase leading-none mb-6">
            Créez votre <br/><span className="text-transparent bg-clip-text primary-gradient">Virtual Pro.</span>
          </h1>
          <p className="text-on-surface-variant text-lg max-w-md leading-relaxed">
            Pour rejoindre une équipe et participer au Mercato, vous devez définir les caractéristiques physiques et athlétiques de votre joueur.
          </p>
          
          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-4 text-sm font-label text-neutral-400">
              <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/30">1</span>
              Définir votre profil physique
            </div>
            <div className="flex items-center gap-4 text-sm font-label text-neutral-600">
              <span className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center">2</span>
              Intégrer le marché des transferts
            </div>
            <div className="flex items-center gap-4 text-sm font-label text-neutral-600">
              <span className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center">3</span>
              Recevoir des offres de contrats
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right side: Form */}
      <div className="flex-[1.5] p-8 md:p-16 overflow-y-auto relative z-10 flex items-center">
        <motion.form 
          initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="w-full max-w-2xl mx-auto space-y-8"
        >
          {/* Position */}
          <div className="bg-surface-container-low rounded-2xl p-6 border border-white/5">
            <label className="block text-xs uppercase font-headline font-bold text-neutral-400 tracking-widest mb-4">Poste de Prédilection</label>
            <div className="flex flex-wrap gap-3">
              {POSITIONS.map(pos => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => setPosition(pos)}
                  className={`w-14 h-14 rounded-xl font-headline font-black text-lg transition-all ${
                    position === pos 
                      ? 'primary-gradient text-background shadow-[0_0_15px_rgba(92,253,128,0.4)] scale-110' 
                      : 'bg-surface-container-highest text-white/70 hover:bg-white/10 hover:text-white border border-white/5'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Height & Weight */}
            <div className="bg-surface-container-low rounded-2xl p-6 border border-white/5 space-y-6">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="text-xs uppercase font-headline font-bold text-neutral-400 tracking-widest">Taille</label>
                  <span className="text-lg font-headline font-black text-white">{height} cm</span>
                </div>
                <input 
                  type="range" min="150" max="220" value={height} onChange={(e) => setHeight(Number(e.target.value))}
                  title="Taille en cm"
                  className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary" 
                />
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="text-xs uppercase font-headline font-bold text-neutral-400 tracking-widest">Poids</label>
                  <span className="text-lg font-headline font-black text-white">{weight} kg</span>
                </div>
                <input 
                  type="range" min="50" max="120" value={weight} onChange={(e) => setWeight(Number(e.target.value))}
                  title="Poids en kg"
                  className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-tertiary" 
                />
              </div>
            </div>

            {/* Strong Foot & Bio */}
            <div className="bg-surface-container-low rounded-2xl p-6 border border-white/5 space-y-6">
              <div>
                <label className="block text-xs uppercase font-headline font-bold text-neutral-400 tracking-widest mb-3">Pied Fort</label>
                <div className="flex gap-2 bg-surface-container-highest p-1 rounded-lg">
                  {FEET.map(foot => (
                    <button
                      key={foot} type="button" onClick={() => setStrongFoot(foot)}
                      className={`flex-1 py-2 rounded text-xs font-bold uppercase tracking-widest transition-colors ${
                        strongFoot === foot ? 'bg-white/10 text-white shadow' : 'text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      {foot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-headline font-bold text-neutral-400 tracking-widest mb-3">Bio / Style de Jeu</label>
                <textarea 
                  value={bio} onChange={(e) => setBio(e.target.value)}
                  placeholder="Décrivez votre style (ex: Buteur rapide, sentinelle agressive...)"
                  className="w-full bg-surface-container-highest border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors resize-none h-24 placeholder:text-neutral-600"
                />
              </div>
            </div>
          </div>

          <button
            type="submit" disabled={saving || !position}
            className="w-full py-5 primary-gradient rounded-2xl font-headline font-black uppercase tracking-widest text-background shadow-[0_0_30px_rgba(92,253,128,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex justify-center items-center gap-3"
          >
            {saving ? (
              <span className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className="material-symbols-outlined">how_to_reg</span>
            )}
            {saving ? 'Création en cours...' : 'Finaliser le Pro'}
          </button>
        </motion.form>
      </div>
    </div>
  );
}
