'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import Modal from '@/components/ui/Modal';
import { PlayerCardSkeleton } from '@/components/ui/LoadingSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import type { Player, TransferListing } from '@/lib/supabase/types';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

type ListingWithPlayer = TransferListing & { players: Player };

// Demo data (used when DB is empty)
const demoPlayers = [
  { id: '1', name: 'Marcus Rashford', position: 'AG', overall_rating: 88, market_value: 65500000, wage: 250000, star_rating: 4, age: 24, nationality: 'ANG', image_url: 'https://images.unsplash.com/photo-1544168190-79c154273140?w=400&h=400&fit=crop', tag: 'Pépite', tagColor: 'error', bids: 3 },
  { id: '2', name: 'Jude Bellingham', position: 'MC', overall_rating: 91, market_value: 120000000, wage: 320000, star_rating: 5, age: 21, nationality: 'ANG', image_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop', tag: 'Galactique', tagColor: 'tertiary', bids: 5 },
  { id: '3', name: 'Alphonso Davies', position: 'AG', overall_rating: 86, market_value: 58200000, wage: 180000, star_rating: 4, age: 23, nationality: 'CAN', image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', tag: 'En Vente', tagColor: 'primary', bids: 1 },
  { id: '4', name: 'Julian Velasquez', position: 'BU', overall_rating: 84, market_value: 42000000, wage: 110000, star_rating: 3, age: 22, nationality: 'ARG', image_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop', tag: 'Clause Libératoire', tagColor: 'secondary-container', bids: 0 },
];

function formatCurrency(value: number) {
  if (value >= 1000000) return `€${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `€${(value / 1000).toFixed(0)}k`;
  return `€${value}`;
}

export default function Mercato() {
  const { profile } = useAuth();
  const [listings, setListings] = useState<ListingWithPlayer[]>([]);
  const [players, setPlayers] = useState(demoPlayers);
  const [loading, setLoading] = useState(true);
  const [bidModal, setBidModal] = useState<{ open: boolean; player: typeof demoPlayers[0] | null }>({ open: false, player: null });
  const [bidAmount, setBidAmount] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    async function fetchListings() {
      const { data } = await supabase
        .from('transfer_listings')
        .select('*, players(*)')
        .eq('status', 'active')
        .order('listed_at', { ascending: false });
      
      if (data && data.length > 0) {
        setListings(data as unknown as ListingWithPlayer[]);
      }
      setLoading(false);
    }
    fetchListings();
  }, []);

  const handleBid = async () => {
    if (!bidAmount || !bidModal.player) return;
    toast.success(`Offre de €${parseFloat(bidAmount).toLocaleString('fr-FR')}M soumise pour ${bidModal.player.name} !`);
    setBidModal({ open: false, player: null });
    setBidAmount('');
  };

  const filteredPlayers = activeFilter === 'all' ? players : players.filter(p => {
    if (activeFilter === 'listed') return p.tagColor === 'primary';
    if (activeFilter === 'scouted') return p.tagColor === 'tertiary' || p.tagColor === 'error';
    return true;
  });

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
      <motion.header variants={fadeUp} className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-tertiary font-label font-semibold uppercase tracking-[0.2em] text-[10px] mb-2 block animate-pulse">Fenêtre de Transfert Active</span>
          <h1 className="text-5xl md:text-6xl font-headline font-black tracking-tighter mb-2">Le <span className="text-white italic">Mercato.</span></h1>
          <p className="text-on-surface-variant max-w-lg">Repérez, négociez et signez la prochaine génération de talents d&apos;Élite. La fenêtre ferme dans 4 jours.</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <span className="block text-[10px] uppercase font-headline font-bold text-neutral-500 tracking-widest">Budget Transferts</span>
            <span className="text-2xl font-headline font-black text-white">€145,5<span className="text-primary text-lg">M</span></span>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-primary/30 flex items-center justify-center bg-surface-container-high relative">
            <span className="material-symbols-outlined text-primary">gavel</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-error text-white text-[8px] font-bold flex items-center justify-center">2</span>
          </div>
        </div>
      </motion.header>

      {/* Negotiations + Market Trends */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
        <section className="lg:col-span-8 bg-surface-container-low rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-primary/10 transition-colors duration-700" />
          
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <h3 className="font-headline font-black text-2xl uppercase italic tracking-tighter">Négociations en Cours</h3>
              <p className="text-xs font-label text-on-surface-variant mt-1">Suivi de vos offres sortantes et entrantes.</p>
            </div>
            <button className="text-primary text-xs font-headline font-bold uppercase tracking-widest hover:underline flex items-center gap-1">
              Tout Voir <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          <div className="space-y-4 relative z-10">
            <div className="bg-surface-container-highest/50 p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row items-center gap-4 hover:border-primary/30 transition-colors">
              <div className="flex -space-x-2 shrink-0">
                <img alt="Joueur" className="w-12 h-12 rounded-full border-2 border-surface-container-low object-cover" src="https://images.unsplash.com/photo-1544168190-79c154273140?w=150&h=150&fit=crop" />
                <div className="w-12 h-12 rounded-full border-2 border-surface-container-low bg-surface-container-highest flex items-center justify-center">
                  <span className="material-symbols-outlined text-neutral-500 text-sm">handshake</span>
                </div>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h4 className="font-headline font-bold text-sm">Federico Valverde</h4>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                  <span className="text-[10px] font-label text-error bg-error/10 px-2 py-0.5 rounded uppercase font-bold tracking-wider">Offre Refusée</span>
                  <span className="text-[10px] text-on-surface-variant font-label">Contre : €85,0M</span>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <button className="flex-1 sm:flex-none px-4 py-2 border border-white/10 text-white rounded text-xs font-headline font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">Retirer</button>
                <button className="flex-1 sm:flex-none px-4 py-2 bg-white text-surface-container-lowest rounded text-xs font-headline font-black uppercase tracking-widest hover:bg-neutral-200 transition-colors">Réviser</button>
              </div>
            </div>
          </div>
        </section>

        <section className="lg:col-span-4 bg-surface-container-low rounded-2xl p-6 border border-white/5 flex flex-col">
          <h3 className="font-headline font-black text-xl uppercase tracking-tighter mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary">monitoring</span> Tendances du Marché
          </h3>
          <div className="flex-1 flex flex-col justify-center gap-6">
            <div>
              <div className="flex justify-between text-xs font-label text-on-surface-variant mb-2">
                <span>Indemnité Moy.</span>
                <span className="text-secondary font-bold">+12,4%</span>
              </div>
              <div className="text-2xl font-headline font-black">€24,5M</div>
            </div>
            <div className="h-px w-full bg-white/5" />
            <div>
              <div className="flex justify-between text-xs font-label text-on-surface-variant mb-2">
                <span>Poste le Plus Demandé</span>
              </div>
              <div className="text-2xl font-headline font-black text-primary italic">MDC / MC</div>
            </div>
          </div>
        </section>
      </motion.div>

      {/* Filter tabs */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="font-headline font-black text-3xl uppercase italic tracking-tighter">Liste des Transferts</h2>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-lg bg-surface-container-low border border-white/5 flex items-center justify-center hover:bg-white/5 transition-colors">
            <span className="material-symbols-outlined text-sm">tune</span>
          </button>
          <div className="bg-surface-container-low border border-white/5 rounded-lg p-1 flex">
            {[
              { key: 'all', label: 'Tous' },
              { key: 'listed', label: 'En Vente' },
              { key: 'scouted', label: 'Repérés' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`px-4 py-1.5 rounded text-xs font-headline font-bold tracking-widest uppercase transition-colors ${
                  activeFilter === tab.key ? 'bg-surface-container-highest text-white' : 'text-neutral-500 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Player Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <PlayerCardSkeleton key={i} />)
        ) : filteredPlayers.length === 0 ? (
          <div className="col-span-full"><EmptyState icon="storefront" title="Aucun joueur" description="Aucun joueur ne correspond à ce filtre." /></div>
        ) : (
          filteredPlayers.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-surface-container-low rounded-2xl border border-white/5 overflow-hidden hover:-translate-y-1 transition-transform duration-300 relative"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <Link href="/profile">
                <div className="relative h-48 bg-surface-container-lowest">
                  <img alt={player.name} className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700" src={player.image_url} />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 bg-surface-container-highest/80 backdrop-blur-md px-2 py-1 rounded border border-white/10 flex flex-col items-center">
                    <span className="font-headline font-black text-xl leading-none text-white">{player.overall_rating}</span>
                    <span className="text-[8px] font-label font-bold uppercase tracking-wider text-primary">{player.position}</span>
                  </div>
                  <div className={`absolute top-3 right-3 text-[9px] font-headline font-black uppercase tracking-widest px-2 py-1 rounded ${
                    player.tagColor === 'error' ? 'bg-error/20 text-error' :
                    player.tagColor === 'tertiary' ? 'bg-tertiary/20 text-tertiary' :
                    player.tagColor === 'primary' ? 'bg-primary/20 text-primary' :
                    'bg-white/10 text-white'
                  }`}>
                    {player.tag}
                  </div>
                </div>
              </Link>

              <div className="p-5">
                <h4 className="font-headline font-black text-lg truncate mb-1">{player.name}</h4>
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
                  <span className="text-xs font-label text-on-surface-variant">{player.age} ans • {player.nationality}</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className={`material-symbols-outlined text-[12px] ${i < player.star_rating ? 'text-tertiary' : 'text-neutral-600'}`}>star</span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div>
                    <span className="block text-[9px] font-label text-neutral-500 uppercase font-bold tracking-widest">Valeur Est.</span>
                    <span className="font-headline font-bold text-sm text-white">{formatCurrency(player.market_value)}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-label text-neutral-500 uppercase font-bold tracking-widest">Salaire</span>
                    <span className="font-headline font-bold text-sm text-white">{formatCurrency(player.wage)}/sem</span>
                  </div>
                </div>

                <button
                  onClick={() => setBidModal({ open: true, player })}
                  className="w-full py-2.5 bg-surface-container-highest hover:bg-white/10 text-emerald-400 border border-primary/20 rounded font-headline font-bold uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                  Faire une Offre
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Bid Modal */}
      <Modal isOpen={bidModal.open} onClose={() => setBidModal({ open: false, player: null })} title="Soumettre une Offre">
        {bidModal.player && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <img alt={bidModal.player.name} className="w-16 h-16 rounded-xl object-cover" src={bidModal.player.image_url} />
              <div>
                <h4 className="font-headline font-black text-lg">{bidModal.player.name}</h4>
                <p className="text-xs text-on-surface-variant">{bidModal.player.position} • {bidModal.player.overall_rating} OVR</p>
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-label font-bold tracking-widest text-neutral-400 mb-2">
                Montant de l&apos;offre (en millions €)
              </label>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="w-full bg-surface-container-highest border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-neutral-600"
                placeholder={`Valeur : ${formatCurrency(bidModal.player.market_value)}`}
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setBidModal({ open: false, player: null })} className="flex-1 py-3 border border-white/10 rounded-xl text-xs font-headline font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">
                Annuler
              </button>
              <button onClick={handleBid} className="flex-1 py-3 primary-gradient text-on-primary-container rounded-xl text-xs font-headline font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
                Confirmer l&apos;Offre
              </button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
