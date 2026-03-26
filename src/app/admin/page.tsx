'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import Modal from '@/components/ui/Modal';
import { PageSkeleton } from '@/components/ui/LoadingSkeleton';
import type { Alert } from '@/lib/supabase/types';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function AdminDashboard() {
  useAuth(); // verify auth context is available
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [banModal, setBanModal] = useState(false);
  const [stats, setStats] = useState({ managers: 0, matches: 0, transfers: 0, violations: 0 });
  const [mountTime] = useState(() => Date.now());

  useEffect(() => {
    async function fetchData() {
      // Fetch alerts
      const { data: alertData } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      if (alertData) setAlerts(alertData as Alert[]);

      // Fetch aggregate stats
      const { count: managerCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: matchCount } = await supabase.from('matches').select('*', { count: 'exact', head: true }).eq('status', 'live');
      const { count: transferCount } = await supabase.from('transfer_listings').select('*', { count: 'exact', head: true }).eq('status', 'active');
      const { count: violationCount } = await supabase.from('alerts').select('*', { count: 'exact', head: true }).eq('category', 'financial_foul').eq('is_read', false);

      setStats({
        managers: managerCount || 0,
        matches: matchCount || 0,
        transfers: transferCount || 0,
        violations: violationCount || 0,
      });

      setLoading(false);
    }
    fetchData();

    // Realtime alerts
    const channel = supabase.channel('admin-alerts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'alerts' }, (payload) => {
        setAlerts(prev => [payload.new as Alert, ...prev]);
        toast.info('Nouvelle alerte reçue !');
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleAdvanceWeek = async () => {
    toast.success('Semaine avancée ! Les matchs de la journée 13 sont programmés.');
  };

  const handleDismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    toast.success('Alerte supprimée');
  };

  if (loading) return <PageSkeleton />;

  // Demo alerts if DB is empty — use mountTime (captured once) instead of Date.now()
  const displayAlerts = alerts.length > 0 ? alerts : [
    { id: '1', category: 'financial_foul' as const, severity: 'error' as const, title: 'Infraction Financière', message: "Le manager 'PepG' (ID: 8821) a tenté un transfert dépassant le plafond salarial de 45%. Transaction bloquée automatiquement.", created_at: new Date(mountTime - 120000).toISOString(), is_read: false, is_dismissed: false },
    { id: '2', category: 'match_result' as const, severity: 'info' as const, title: 'Résultat de Match', message: 'Division Mondiale 1 : FC Elite (3) - (1) Red Wolves. Classement mis à jour avec succès.', created_at: new Date(mountTime - 840000).toISOString(), is_read: false, is_dismissed: false },
    { id: '3', category: 'server' as const, severity: 'warning' as const, title: 'Charge Serveur Élevée', message: "Pool de connexions à la base de données à 85% de capacité. Auto-scaling initié.", created_at: new Date(mountTime - 2520000).toISOString(), is_read: false, is_dismissed: false },
    { id: '4', category: 'user_report' as const, severity: 'info' as const, title: 'Signalement Joueur', message: 'Toxicité détectée dans le Match ID: LM-992. Avertissement automatique envoyé.', created_at: new Date(mountTime - 3600000).toISOString(), is_read: true, is_dismissed: false },
  ] as Alert[];

  const timeAgo = (date: string) => {
    const diff = mountTime - new Date(date).getTime();
    if (diff < 60000) return 'À l\'instant';
    if (diff < 3600000) return `Il y a ${Math.floor(diff / 60000)} min`;
    if (diff < 86400000) return `Il y a ${Math.floor(diff / 3600000)} h`;
    return `Il y a ${Math.floor(diff / 86400000)} j`;

  };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
      <motion.header variants={fadeUp} className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-error font-label font-semibold uppercase tracking-[0.2em] text-[10px] mb-2 block animate-pulse">Maître du Système</span>
          <h1 className="text-5xl md:text-6xl font-headline font-black tracking-tighter mb-2">Centre de <span className="text-white italic">Contrôle.</span></h1>
          <p className="text-on-surface-variant max-w-lg">Gérez les paramètres de la ligue, résolvez les litiges et surveillez l&apos;intégrité du système.</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <span className="block text-[10px] uppercase font-headline font-bold text-neutral-500 tracking-widest">État Serveur</span>
            <span className="text-2xl font-headline font-black text-primary">EN LIGNE</span>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-error/30 flex items-center justify-center bg-surface-container-high relative">
            <span className="material-symbols-outlined text-error">warning</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-error text-white text-[8px] font-bold flex items-center justify-center">{stats.violations || 3}</span>
          </div>
        </div>
      </motion.header>

      {/* Stats */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface-container-low border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-[100px] text-primary">groups</span></div>
          <span className="block text-[10px] font-label font-bold text-neutral-500 uppercase tracking-widest mb-2">Managers Actifs</span>
          <div className="flex items-end gap-3">
            <AnimatedCounter target={stats.managers || 4281} className="text-4xl font-headline font-black text-white" />
            <span className="text-xs font-bold text-primary mb-1">+12%</span>
          </div>
        </div>

        <div className="bg-surface-container-low border border-primary/20 rounded-2xl p-6 relative overflow-hidden group shadow-[0_0_15px_rgba(92,253,128,0.05)]">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-[100px] text-primary">sports_soccer</span></div>
          <span className="block text-[10px] font-label font-bold text-primary uppercase tracking-widest mb-2">Matchs en Cours</span>
          <div className="flex items-end gap-3">
            <AnimatedCounter target={stats.matches || 142} className="text-4xl font-headline font-black text-primary" />
            <span className="text-xs font-bold text-neutral-500 mb-1">En direct</span>
          </div>
        </div>

        <div className="bg-surface-container-low border border-tertiary/20 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-[100px] text-tertiary">swap_horiz</span></div>
          <span className="block text-[10px] font-label font-bold text-tertiary uppercase tracking-widest mb-2">Transferts Ouverts</span>
          <div className="flex items-end gap-3">
            <AnimatedCounter target={stats.transfers || 8930} className="text-4xl font-headline font-black text-white" />
            <span className="text-xs font-bold text-neutral-500 mb-1">Offres</span>
          </div>
        </div>

        <div className="bg-surface-container-low border border-error/20 rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-[100px] text-error">report</span></div>
          <span className="block text-[10px] font-label font-bold text-error uppercase tracking-widest mb-2">Infractions</span>
          <div className="flex items-end gap-3">
            <AnimatedCounter target={stats.violations || 12} className="text-4xl font-headline font-black text-white" />
            <span className="text-xs font-bold text-error mb-1">En attente</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <motion.section variants={fadeUp} className="xl:col-span-2 space-y-8">
          {/* Activity Chart */}
          <div className="bg-surface-container-low border border-white/5 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline font-black text-xl uppercase tracking-tighter flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">monitoring</span> Activité du Système
              </h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-surface-container-highest text-[10px] font-bold uppercase rounded text-white">1H</button>
                <button className="px-3 py-1 text-[10px] font-bold uppercase rounded text-neutral-500 hover:text-white">24H</button>
                <button className="px-3 py-1 text-[10px] font-bold uppercase rounded text-neutral-500 hover:text-white">7J</button>
              </div>
            </div>
            <div className="h-64 relative border-b border-l border-white/10 pt-4 pr-4">
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-10 pt-4 pr-4">
                {[...Array(16)].map((_, i) => (<div key={i} className="border-t border-r border-white" />))}
              </div>
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#5cfd80" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#5cfd80" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 80 Q 15 60, 30 70 T 60 40 T 80 50 T 100 20 L 100 100 L 0 100 Z" fill="url(#chartGradient)" />
                <path d="M0 80 Q 15 60, 30 70 T 60 40 T 80 50 T 100 20" fill="none" stroke="#5cfd80" strokeWidth="2" />
                <circle cx="100" cy="20" r="3" fill="#02c953" className="animate-pulse" />
              </svg>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="bg-surface-container-low border border-white/5 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline font-black text-xl uppercase tracking-tighter flex items-center gap-2">
                <span className="material-symbols-outlined text-error">gavel</span> Actions Administratives
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <button onClick={handleAdvanceWeek} className="p-4 bg-surface-container-highest hover:bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors group">
                <span className="material-symbols-outlined text-white group-hover:text-primary transition-colors">calendar_month</span>
                <span className="text-[10px] font-bold uppercase tracking-widest font-label">Avancer Semaine</span>
              </button>
              <button className="p-4 bg-surface-container-highest hover:bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors group">
                <span className="material-symbols-outlined text-white group-hover:text-tertiary transition-colors">settings_applications</span>
                <span className="text-[10px] font-bold uppercase tracking-widest font-label">Modifier Règles</span>
              </button>
              <button onClick={() => setBanModal(true)} className="p-4 bg-surface-container-highest hover:bg-error/10 border border-white/10 hover:border-error/30 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors group">
                <span className="material-symbols-outlined text-white group-hover:text-error transition-colors">block</span>
                <span className="text-[10px] font-bold uppercase tracking-widest font-label">Bannir Manager</span>
              </button>
              <button className="p-4 bg-surface-container-highest hover:bg-white/5 border border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 transition-colors group">
                <span className="material-symbols-outlined text-white transition-colors">manage_accounts</span>
                <span className="text-[10px] font-bold uppercase tracking-widest font-label">Forcer Transfert</span>
              </button>
            </div>
          </div>
        </motion.section>

        {/* Live Alerts */}
        <motion.section variants={fadeUp} className="bg-surface-container-low border border-white/5 rounded-2xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline font-black text-xl uppercase tracking-tighter flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">feed</span> Alertes en Direct
            </h2>
            <span className="px-2 py-0.5 bg-error/20 text-error text-[8px] uppercase font-bold rounded">Live</span>
          </div>

          <div className="flex-1 space-y-4 overflow-hidden relative">
            {displayAlerts.map((alert, index) => {
              const borderColor = alert.severity === 'error' || alert.severity === 'critical' ? 'border-error' :
                alert.category === 'match_result' ? 'border-primary' :
                alert.category === 'server' ? 'border-tertiary' : 'border-white/20';
              const labelColor = alert.severity === 'error' || alert.severity === 'critical' ? 'text-error' :
                alert.category === 'match_result' ? 'text-primary' :
                alert.category === 'server' ? 'text-tertiary' : 'text-neutral-400';
              const categoryLabels: Record<string, string> = {
                financial_foul: 'Infraction Financière',
                match_result: 'Résultat de Match',
                server: 'Charge Serveur',
                user_report: 'Signalement',
                transfer: 'Transfert',
                system: 'Système',
              };

              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 bg-surface-container-highest/50 border-l-2 ${borderColor} rounded-r-lg ${alert.is_read ? 'opacity-60' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-[10px] font-label font-bold uppercase tracking-widest ${labelColor}`}>
                      {categoryLabels[alert.category] || alert.category}
                    </span>
                    <span className="text-[9px] text-neutral-500">{timeAgo(alert.created_at)}</span>
                  </div>
                  <p className="text-xs font-body text-neutral-300">{alert.message}</p>
                  {(alert.severity === 'error' || alert.severity === 'critical') && !alert.is_read && (
                    <div className="mt-3 flex gap-2">
                      <button className="text-[9px] font-bold uppercase tracking-widest text-white bg-error hover:bg-error/80 px-3 py-1 rounded transition-colors">Examiner</button>
                      <button onClick={() => handleDismissAlert(alert.id)} className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 hover:text-white px-3 py-1 transition-colors">Ignorer</button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      </div>

      {/* Ban Modal */}
      <Modal isOpen={banModal} onClose={() => setBanModal(false)} title="Bannir un Manager">
        <div className="space-y-4">
          <p className="text-sm text-on-surface-variant">Entrez l&apos;identifiant ou le nom d&apos;utilisateur du manager à bannir.</p>
          <input
            type="text"
            className="w-full bg-surface-container-highest border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-error/50 focus:ring-1 focus:ring-error/30 transition-all placeholder:text-neutral-600"
            placeholder="Nom d'utilisateur ou ID..."
          />
          <div className="flex gap-3">
            <button onClick={() => setBanModal(false)} className="flex-1 py-3 border border-white/10 rounded-xl text-xs font-headline font-bold uppercase tracking-widest hover:bg-white/5">Annuler</button>
            <button onClick={() => { setBanModal(false); toast.error('Manager banni avec succès'); }} className="flex-1 py-3 bg-error text-white rounded-xl text-xs font-headline font-black uppercase tracking-widest hover:bg-error/80">Confirmer le Ban</button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
