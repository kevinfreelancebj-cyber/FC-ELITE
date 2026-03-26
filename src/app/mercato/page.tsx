'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import type { Profile, Team } from '@/lib/supabase/types';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

type FreeAgent = Profile;

export default function MercatoPage() {
  const { user, profile, isLoading } = useAuth();
  const [agents, setAgents] = useState<FreeAgent[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  
  const [activeFilter, setActiveFilter] = useState('ALL'); // ALL, ATT, MIL, DEF, GB
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isCaptain, setIsCaptain] = useState(false);
  const [myTeam, setMyTeam] = useState<Team | null>(null);

  const [recruitingAgent, setRecruitingAgent] = useState<FreeAgent | null>(null);
  const [sendingOffer, setSendingOffer] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      fetchMarketData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const fetchMarketData = async () => {
    try {
      // 1. Déterminer si l'utilisateur est capitaine
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: membership } = await (supabase.from('team_members') as any)
          .select('team_id, role, teams(*)')
          .eq('profile_id', user.id)
          .eq('is_active', true)
          .single();

        if (membership && (membership.role === 'captain' || profile?.role === 'admin' || profile?.role === 'captain')) {
          setIsCaptain(true);
          setMyTeam(membership.teams as Team);
        }
      }

      // 2. Récupérer TOUS les profils qui ont fini l'onboarding
      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('*')
        .eq('onboarding_completed', true)
        .order('created_at', { ascending: false });

      // 3. Récupérer TOUS les membres actifs des équipes pour les filtrer
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: activeMembers } = await (supabase.from('team_members') as any)
        .select('profile_id')
        .eq('is_active', true);

      const activeProfileIds = new Set(activeMembers?.map((m: { profile_id: string }) => m.profile_id) || []);

      // 4. Filtrer les Agents Libres (profiles NON PRÉSENTS dans activeMembers)
      const freeAgents = ((allProfiles as Profile[]) || []).filter(p => !activeProfileIds.has(p.id));

      setAgents(freeAgents as FreeAgent[]);
      setLoadingInitial(false);
    } catch (error) {
      console.error(error);
      setLoadingInitial(false);
      toast.error('Erreur lors du chargement du marché.');
    }
  };

  const handleSendOffer = async () => {
    if (!recruitingAgent || !myTeam) return;
    setSendingOffer(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from('alerts') as any).insert({
        category: 'transfer',
        severity: 'info',
        title: 'Nouvelle Offre de Recrutement !',
        message: `Le capitaine de l'équipe ${myTeam.name} souhaite vous recruter dans son effectif. Contactez-le !`,
        target_user_id: recruitingAgent.id,
        related_team_id: myTeam.id,
      });

      if (error) throw error;

      toast.success(`Offre envoyée à ${recruitingAgent.username} avec succès !`);
      setRecruitingAgent(null);
    } catch (err: unknown) {
      toast.error((err as Error).message || "Erreur lors de l'envoi de l'offre.");
    } finally {
      setSendingOffer(false);
    }
  };

  const filteredAgents = agents.filter(agent => {
    const sMatch = agent.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
                   (agent.bio || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'ALL') return sMatch;
    
    const pos = agent.position || '';
    if (activeFilter === 'ATT') return ['BU', 'AG', 'AD'].includes(pos) && sMatch;
    if (activeFilter === 'MIL') return ['MOC', 'MC', 'MDC', 'MG', 'MD'].includes(pos) && sMatch;
    if (activeFilter === 'DEF') return ['DC', 'DG', 'DD', 'DLD', 'DLG'].includes(pos) && sMatch;
    if (activeFilter === 'GB') return pos === 'GB' && sMatch;
    
    return sMatch;
  });

  if (isLoading || loadingInitial) return <PageSkeleton />;

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="pb-24 lg:pb-8">
      
      {/* HEADER */}
      <motion.header variants={fadeUp} className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-primary font-label font-semibold uppercase tracking-[0.2em] text-[10px] mb-2 block animate-pulse">Pôle Emploi FC Elite</span>
          <h1 className="text-5xl md:text-6xl font-headline font-black tracking-tighter mb-2">Le <span className="text-white italic">Mercato.</span></h1>
          <p className="text-on-surface-variant max-w-lg">Le Hub officiel pour recruter les talents de demain. Les agents libres publient leur profil, les capitaines font leurs offres.</p>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="text-right">
            <span className="block text-[10px] uppercase font-headline font-bold text-neutral-500 tracking-widest">Agents Libres Dipo.</span>
            <span className="text-2xl font-headline font-black text-white">{agents.length} <span className="text-primary text-lg">Joueurs</span></span>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-primary/30 flex items-center justify-center bg-surface-container-high relative">
            <span className="material-symbols-outlined text-primary">person_search</span>
          </div>
        </div>
      </motion.header>

      {/* FILTERS & SEARCH */}
      <motion.div variants={fadeUp} className="flex flex-col md:flex-row gap-4 mb-8 justify-between">
        <div className="flex bg-surface-container-low p-1 rounded-xl border border-white/5 overflow-x-auto text-sm shrink-0 no-scrollbar">
          {['ALL', 'ATT', 'MIL', 'DEF', 'GB'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-lg font-headline font-bold uppercase tracking-widest transition-all ${
                activeFilter === filter 
                  ? 'bg-white text-black shadow-md' 
                  : 'text-neutral-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {filter === 'ALL' ? 'Tous' : filter}
            </button>
          ))}
        </div>
        
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">search</span>
          <input 
            type="text" 
            placeholder="Rechercher par pseudo ou style de jeu..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-container-low border border-white/5 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-neutral-600 font-headline font-semibold"
          />
        </div>
      </motion.div>

      {/* GRID AGENCE */}
      <motion.div variants={fadeUp}>
        {filteredAgents.length === 0 ? (
          <EmptyState 
            icon="search_off" 
            title="Aucun talent trouvé" 
            description="Aucun agent libre ne correspond à vos critères de recherche actuels. Essayez de modifier vos filtres." 
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredAgents.map((agent) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={agent.id} 
                  className="bg-surface-container-low border border-white/5 rounded-2xl overflow-hidden group hover:border-primary/30 transition-all duration-300 relative flex flex-col"
                >
                  {/* Position Badge */}
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center border border-white/10 z-10 shadow-lg">
                    <span className="font-headline font-black text-sm text-white uppercase">{agent.position || 'NC'}</span>
                  </div>

                  {/* Top Half: Gradient Identity */}
                  <div className="h-24 bg-gradient-to-br from-surface-container-highest to-surface-container-lowest relative">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
                    <div className="absolute -bottom-8 left-6 w-16 h-16 rounded-xl bg-surface-container-high border-2 border-surface-container flex items-center justify-center shadow-xl">
                      <span className="font-headline font-black text-2xl text-primary">{agent.username.charAt(0).toUpperCase()}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 pt-12 flex-1 flex flex-col">
                    <h3 className="font-headline font-black text-xl text-white mb-1 truncate">{agent.username}</h3>
                    <div className="flex gap-2 mb-4">
                      {agent.height && (
                        <span className="text-[10px] font-label uppercase tracking-widest text-neutral-400 bg-white/5 px-2 py-1 rounded">
                          {agent.height} cm
                        </span>
                      )}
                      {agent.weight && (
                        <span className="text-[10px] font-label uppercase tracking-widest text-neutral-400 bg-white/5 px-2 py-1 rounded">
                          {agent.weight} kg
                        </span>
                      )}
                      {agent.strong_foot && (
                        <span className="text-[10px] font-label uppercase tracking-widest text-neutral-400 bg-white/5 px-2 py-1 rounded">
                          {agent.strong_foot}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-xs text-on-surface-variant font-medium line-clamp-3 italic mb-6 flex-1">
                      &quot;{agent.bio || 'Aucune description fournie. Recrutez-moi pour en savoir plus sur mon style de jeu.'}&quot;
                    </p>

                    {/* Action Button */}
                    <button 
                      className="w-full py-3 bg-surface-container-highest hover:bg-white text-white hover:text-black rounded-xl font-headline font-bold uppercase tracking-widest text-[10px] transition-all flex justify-center items-center gap-2 group-hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => isCaptain ? setRecruitingAgent(agent) : toast.info("Seuls les capitaines d'équipe peuvent recruter des joueurs.")}
                    >
                      <span className="material-symbols-outlined text-[16px]">file_copy</span>
                      Proposer un Contrat
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* RECRUITMENT MODAL */}
      {recruitingAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-surface-container rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative"
          >
            <div className="h-32 bg-primary/20 relative flex items-center justify-center overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-t from-surface-container to-transparent z-10" />
               <span className="material-symbols-outlined text-6xl text-primary/50 relative z-0 scale-150">handshake</span>
            </div>
            
            <div className="p-8 relative z-20 -mt-10">
              <div className="w-16 h-16 rounded-2xl bg-surface-container-high border-2 border-surface flex items-center justify-center mb-6 shadow-xl mx-auto">
                <span className="font-headline font-black text-2xl text-white">{recruitingAgent?.username?.charAt(0).toUpperCase()}</span>
              </div>
              
              <h2 className="text-2xl font-headline font-black text-center mb-2">Recruter {recruitingAgent?.username}</h2>
              <p className="text-center text-sm text-neutral-400 mb-8">
                Vous êtes sur le point d&apos;envoyer une offre officielle au nom de votre équipe <strong className="text-white">{myTeam?.name}</strong>. Une notification lui sera envoyée.
              </p>

              <div className="flex gap-4">
                <button 
                  onClick={() => setRecruitingAgent(null)}
                  className="flex-1 py-4 bg-surface-container-highest hover:bg-white/10 text-white rounded-xl font-headline font-bold uppercase tracking-widest text-xs transition-colors"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleSendOffer}
                  disabled={sendingOffer}
                  className="flex-1 py-4 primary-gradient text-background rounded-xl font-headline font-black uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(92,253,128,0.2)] hover:scale-105 transition-transform flex items-center justify-center gap-2"
                >
                  {sendingOffer ? 'Envoi...' : 'Envoyer Offre'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

    </motion.div>
  );
}
