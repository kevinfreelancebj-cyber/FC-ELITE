'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import type { Team } from '@/lib/supabase/types';

// Types custom pour la jointure
type MatchWithTeams = {
  id: string;
  week: number;
  home_team_id: string;
  away_team_id: string;
  home_score: number | null;
  away_score: number | null;
  status: 'scheduled' | 'completed' | 'cancelled' | 'live';
  scheduled_at: string;
  home_team: Team;
  away_team: Team;
};

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function FixturesPage() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<MatchWithTeams[]>([]);
  
  // Roster logic to check if user can submit scores
  const [myTeamId, setMyTeamId] = useState<string | null>(null);
  const [isCaptain, setIsCaptain] = useState(false);

  // Modal logic
  const [submittingMatch, setSubmittingMatch] = useState<MatchWithTeams | null>(null);
  const [homeScore, setHomeScore] = useState<number>(0);
  const [awayScore, setAwayScore] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, profile]);

  const fetchData = async () => {
    try {
      // 1. Déterminer si l'utilisateur peut déclarer un résultat
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: membership } = await (supabase.from('team_members') as any)
          .select('team_id, role')
          .eq('profile_id', user.id)
          .eq('is_active', true)
          .single();

        if (membership) {
          setMyTeamId(membership.team_id);
          if (membership.role === 'captain' || profile?.role === 'admin' || profile?.role === 'captain') {
            setIsCaptain(true);
          }
        }
      }

      // 2. Fetch matches joined with teams
      const { data: matchesData, error } = await supabase
        .from('matches')
        .select(`
          *,
          home_team:teams!home_team_id(*),
          away_team:teams!away_team_id(*)
        `)
        .order('week', { ascending: false })
        .order('scheduled_at', { ascending: false });

      if (error) throw error;
      
      if (matchesData) {
        setMatches(matchesData as MatchWithTeams[]);
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Erreur lors du chargement des matchs.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingMatch) return;
    setIsSubmitting(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from('matches') as any)
        .update({
          home_score: homeScore,
          away_score: awayScore,
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', submittingMatch.id);

      if (error) throw error;

      toast.success('Résultat du match déclaré avec succès !');
      setSubmittingMatch(null);
      fetchData(); // Refresh UI
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Erreur lors de la déclaration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openSubmitModal = (match: MatchWithTeams) => {
    setSubmittingMatch(match);
    setHomeScore(0);
    setAwayScore(0);
  };

  if (loading) return <PageSkeleton />;

  // Grouper les matchs par semaine (journée)
  const matchesByWeek = matches.reduce((acc, match) => {
    if (!acc[match.week]) acc[match.week] = [];
    acc[match.week].push(match);
    return acc;
  }, {} as Record<number, MatchWithTeams[]>);

  const sortedWeeks = Object.keys(matchesByWeek).map(Number).sort((a, b) => b - a);

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="pb-24 lg:pb-8 max-w-5xl mx-auto">
      
      {/* HEADER */}
      <motion.header variants={fadeUp} className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-secondary font-label font-semibold uppercase tracking-[0.2em] text-[10px] mb-2 block animate-pulse">Saison 2024-25</span>
          <h1 className="text-5xl md:text-6xl font-headline font-black tracking-tighter mb-2">Centre de <span className="text-white italic">Matchs.</span></h1>
          <p className="text-on-surface-variant max-w-lg">Suivez les résultats officiels et, en tant que capitaine, déclarez les scores de vos rencontres.</p>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="text-right">
            <span className="block text-[10px] uppercase font-headline font-bold text-neutral-500 tracking-widest">Matchs Joués</span>
            <span className="text-2xl font-headline font-black text-white">
              {matches.filter(m => m.status === 'completed').length} <span className="text-secondary text-lg">/ {matches.length}</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-secondary/30 flex items-center justify-center bg-surface-container-high relative shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <span className="material-symbols-outlined text-secondary">sports_score</span>
          </div>
        </div>
      </motion.header>

      {/* FIXTURES LIST */}
      <motion.div variants={fadeUp} className="space-y-12">
        {sortedWeeks.length === 0 ? (
          <EmptyState 
            icon="calendar_off" 
            title="Aucun match programmé" 
            description="Le calendrier de la saison n'a pas encore été généré par les administrateurs." 
          />
        ) : (
          sortedWeeks.map(week => (
            <div key={week} className="space-y-4">
              <h2 className="font-headline font-black text-2xl uppercase tracking-tighter flex items-center gap-3 border-b border-white/5 pb-2">
                Journée {week}
                {week === sortedWeeks[0] && <span className="text-[10px] font-label px-2 py-1 bg-surface-container-highest rounded text-neutral-400">Actuelle</span>}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matchesByWeek[week].map(match => {
                  const isMyMatch = isCaptain && (myTeamId === match.home_team_id || myTeamId === match.away_team_id);
                  const canSubmitScore = isMyMatch && match.status === 'scheduled';
                  
                  return (
                    <div key={match.id} className="bg-surface-container-low border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-white/10 transition-colors">
                      {/* Ligne Status / Date */}
                      <div className="flex justify-between items-center mb-6 text-xs font-label uppercase tracking-widest font-bold">
                        <span className="text-neutral-500">
                          {new Date(match.scheduled_at).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </span>
                        {match.status === 'completed' ? (
                          <span className="text-primary bg-primary/10 px-2 py-1 rounded">Terminé</span>
                        ) : (
                          <span className="text-tertiary bg-tertiary/10 px-2 py-1 rounded">À venir</span>
                        )}
                      </div>

                      {/* Les équipes et le score */}
                      <div className="flex justify-between items-center">
                        {/* DOMICILE */}
                        <div className="flex flex-col items-center gap-2 flex-1">
                          <div className="w-16 h-16 rounded-xl flex items-center justify-center border-2 border-surface-container" style={{ backgroundColor: match.home_team.primary_color + '20', borderColor: match.home_team.primary_color + '50' }}>
                            <span className="material-symbols-outlined text-3xl" style={{ color: match.home_team.primary_color }}>shield</span>
                          </div>
                          <span className="font-headline font-bold text-sm text-center truncate w-full">{match.home_team.short_name}</span>
                        </div>

                        {/* SCORE / VS */}
                        <div className="flex-1 flex flex-col items-center justify-center px-4">
                          {match.status === 'completed' ? (
                            <div className="flex items-center gap-3">
                              <span className="text-4xl font-headline font-black text-white">{match.home_score}</span>
                              <span className="text-neutral-600">-</span>
                              <span className="text-4xl font-headline font-black text-white">{match.away_score}</span>
                            </div>
                          ) : (
                            <span className="text-2xl font-headline font-black text-neutral-600">VS</span>
                          )}
                        </div>

                        {/* EXTERIEUR */}
                        <div className="flex flex-col items-center gap-2 flex-1">
                          <div className="w-16 h-16 rounded-xl flex items-center justify-center border-2 border-surface-container" style={{ backgroundColor: match.away_team.primary_color + '20', borderColor: match.away_team.primary_color + '50' }}>
                            <span className="material-symbols-outlined text-3xl" style={{ color: match.away_team.primary_color }}>shield</span>
                          </div>
                          <span className="font-headline font-bold text-sm text-center truncate w-full">{match.away_team.short_name}</span>
                        </div>
                      </div>

                      {/* Action logic */}
                      {canSubmitScore && (
                        <div className="mt-6 pt-4 border-t border-white/5 flex justify-center">
                          <button 
                            onClick={() => openSubmitModal(match)}
                            className="bg-white text-black font-headline font-bold uppercase tracking-widest text-[10px] px-6 py-2 rounded-lg hover:bg-neutral-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)] flex items-center gap-2"
                          >
                            <span className="material-symbols-outlined text-[14px]">edit_document</span>
                            Déclarer le Score
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </motion.div>

      {/* MATCH SUBMISSION MODAL */}
      <AnimatePresence>
        {submittingMatch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-surface-container rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative"
            >
              <div className="p-8">
                <h2 className="text-2xl font-headline font-black text-center mb-2 uppercase tracking-tighter">Terminer le match</h2>
                <p className="text-center text-sm text-neutral-400 mb-8">
                  Soumettez le score final de cette rencontre. Toute fausse déclaration entraînera des sanctions de l&apos;administration.
                </p>

                <form onSubmit={handleSubmitScore}>
                  {/* Score inputs */}
                  <div className="flex items-center justify-center gap-8 mb-10">
                    <div className="flex flex-col items-center gap-4 flex-1">
                      <span className="font-headline font-bold uppercase text-xs" style={{ color: submittingMatch.home_team.primary_color }}>{submittingMatch.home_team.short_name}</span>
                      <input 
                        type="number" min="0" max="99" required
                        value={homeScore} onChange={e => setHomeScore(parseInt(e.target.value) || 0)}
                        className="w-24 h-24 bg-surface-container-highest border-2 border-white/10 rounded-2xl text-center text-5xl font-headline font-black text-white focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    
                    <span className="text-2xl font-black text-neutral-600">-</span>
                    
                    <div className="flex flex-col items-center gap-4 flex-1">
                      <span className="font-headline font-bold uppercase text-xs" style={{ color: submittingMatch.away_team.primary_color }}>{submittingMatch.away_team.short_name}</span>
                      <input 
                        type="number" min="0" max="99" required
                        value={awayScore} onChange={e => setAwayScore(parseInt(e.target.value) || 0)}
                        className="w-24 h-24 bg-surface-container-highest border-2 border-white/10 rounded-2xl text-center text-5xl font-headline font-black text-white focus:outline-none focus:border-tertiary transition-colors"
                      />
                    </div>
                  </div>

                  {/* VPG Screenshot Proof (Mock) */}
                  <div className="mb-8 p-4 border-2 border-dashed border-white/10 rounded-xl text-center hover:bg-white/5 transition-colors cursor-pointer group">
                    <span className="material-symbols-outlined text-3xl text-neutral-500 mb-2 group-hover:text-white transition-colors">add_photo_alternate</span>
                    <p className="font-headline font-bold text-sm text-white">Preuve Capture d&apos;écran</p>
                    <p className="text-xs text-neutral-500">Obligatoire pour validation</p>
                  </div>

                  <div className="flex gap-4">
                    <button type="button" onClick={() => setSubmittingMatch(null)} className="flex-1 py-4 bg-surface-container-highest hover:bg-white/10 text-white rounded-xl font-headline font-bold uppercase tracking-widest text-xs transition-colors">
                      Annuler
                    </button>
                    <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-white text-black hover:bg-neutral-200 rounded-xl font-headline font-black uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-transform flex items-center justify-center gap-2">
                      {isSubmitting ? 'Envoi...' : 'Valider Résultat'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
