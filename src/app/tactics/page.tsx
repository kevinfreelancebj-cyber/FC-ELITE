'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function Tactics() {
  const [formation, setFormation] = useState('4-3-3');
  const [mentality, setMentality] = useState(4);
  const [pressing, setPressing] = useState(85);
  const [buildupStyle, setBuildupStyle] = useState('possession');

  const players = [
    { pos: 'GB', top: '85%', left: '50%', num: '1', name: 'Courtois' },
    { pos: 'DC', top: '70%', left: '35%', num: '4', name: 'Alaba' },
    { pos: 'DC', top: '70%', left: '65%', num: '3', name: 'Militão' },
    { pos: 'AG', top: '65%', left: '15%', num: '23', name: 'Mendy' },
    { pos: 'AD', top: '65%', left: '85%', num: '2', name: 'Carvajal' },
    { pos: 'MDC', top: '50%', left: '50%', num: '14', name: 'Casemiro' },
    { pos: 'MC', top: '40%', left: '30%', num: '8', name: 'Kroos' },
    { pos: 'MC', top: '40%', left: '70%', num: '10', name: 'Modrić' },
    { pos: 'AG', top: '25%', left: '20%', num: '20', name: 'Vini Jr' },
    { pos: 'AD', top: '25%', left: '80%', num: '11', name: 'Rodrygo' },
    { pos: 'BU', top: '15%', left: '50%', num: '9', name: 'Benzema' },
  ];

  const mentalities = ['Défensif', 'Prudent', 'Équilibré', 'Offensif', 'Ultra-Off.'];

  const handleSave = () => {
    toast.success('Tactique sauvegardée avec succès !');
  };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
      <motion.header variants={fadeUp} className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-secondary font-label font-semibold uppercase tracking-[0.2em] text-[10px] mb-2 block">Intelligence Système</span>
          <h1 className="text-5xl md:text-6xl font-headline font-black tracking-tighter mb-2">Tableau <span className="text-white italic">Tactique.</span></h1>
          <p className="text-on-surface-variant max-w-lg">Configurez les formations, définissez les rôles et ajustez la mentalité de l&apos;équipe en temps réel.</p>
        </div>
        <div className="flex bg-surface-container-high border border-white/5 rounded-xl p-2 items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-label text-neutral-500 font-bold tracking-widest px-2">Formation Active</span>
            <select
              value={formation}
              onChange={(e) => setFormation(e.target.value)}
              className="bg-transparent text-white font-headline font-bold text-xl uppercase italic border-none focus:ring-0 cursor-pointer outline-none"
            >
              <option value="4-3-3">4-3-3 Attaque</option>
              <option value="4-2-3-1">4-2-3-1 Large</option>
              <option value="3-5-2">3-5-2 Ailiers</option>
              <option value="4-4-2">4-4-2 Plat</option>
            </select>
          </div>
          <button
            onClick={handleSave}
            className="h-12 w-12 rounded-lg primary-gradient flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-transform shrink-0"
          >
            <span className="material-symbols-outlined text-background">upload_2</span>
          </button>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 relative">
        {/* Pitch */}
        <motion.section variants={fadeUp} className="lg:col-span-8 bg-surface-container-low rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center relative overflow-hidden min-h-[600px]">
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/5 to-transparent" />
          
          <div className="relative w-full max-w-[400px] aspect-[1/1.4] mx-auto border-2 border-white/20 rounded-md bg-emerald-950/20 shadow-[0_0_50px_rgba(92,253,128,0.05)]">
            <div className="absolute inset-0 grid grid-cols-5 grid-rows-7 opacity-10">
              {[...Array(35)].map((_, i) => (<div key={i} className="border-t border-l border-white" />))}
            </div>
            
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 aspect-[2/1] border-2 border-t-0 border-white/20 rounded-b-sm" />
            <div className="absolute top-0 left-[42%] w-[16%] aspect-[2/1] border-2 border-t-0 border-white/20 rounded-b-sm" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 aspect-[2/1] border-2 border-b-0 border-white/20 rounded-t-sm" />
            <div className="absolute bottom-0 left-[42%] w-[16%] aspect-[2/1] border-2 border-b-0 border-white/20 rounded-t-sm" />
            <div className="absolute top-1/2 left-0 w-full border-t-2 border-white/20 -translate-y-[1px]" />
            <div className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full border-2 border-white/20 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-white/40 -translate-x-1/2 -translate-y-1/2" />
            
            {players.map((p, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 group cursor-grab active:cursor-grabbing hover:z-20 transition-all duration-300"
                style={{ top: p.top, left: p.left }}
              >
                <div className="relative">
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-headline font-black shadow-lg transition-transform group-hover:scale-110
                    ${p.pos.includes('BU') || p.pos === 'AG' || p.pos === 'AD' ? 'bg-primary text-background border border-primary/50 shadow-primary/20' :
                      p.pos.includes('M') ? 'bg-tertiary text-background border border-tertiary/50 shadow-tertiary/20' :
                      p.pos === 'GB' ? 'bg-error text-white border border-error/50 shadow-error/20' :
                      'bg-surface-container-highest text-white border border-white/20'}`}>
                    {p.num}
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-background rounded-full border border-white/20 flex items-center justify-center">
                    <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${i % 3 === 0 ? 'bg-error' : i % 2 === 0 ? 'bg-primary' : 'bg-tertiary'}`} />
                  </div>
                </div>
                <div className="mt-1 bg-background/80 backdrop-blur px-2 py-0.5 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  <span className="text-[10px] font-label font-bold text-white tracking-widest uppercase">{p.name} <span className="text-neutral-500 ml-1">{p.pos}</span></span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="w-full flex justify-between items-center mt-8 border-t border-white/5 pt-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary border-none" /><span className="text-[10px] uppercase font-label text-neutral-400">Attaque</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-tertiary border-none" /><span className="text-[10px] uppercase font-label text-neutral-400">Milieu</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-surface-container-highest border border-white/20" /><span className="text-[10px] uppercase font-label text-neutral-400">Défense</span></div>
            </div>
            <button className="text-primary text-[10px] font-headline font-bold uppercase tracking-widest hover:underline">Réinitialiser</button>
          </div>
        </motion.section>

        {/* Instructions */}
        <motion.section variants={fadeUp} className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-low rounded-2xl p-6 border border-white/5">
            <h3 className="font-headline font-black text-xl uppercase tracking-tighter mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">tune</span> Consignes d&apos;Équipe
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs uppercase font-label font-bold tracking-widest text-neutral-400">Mentalité</span>
                  <span className="text-sm font-headline font-bold text-primary italic uppercase">{mentalities[mentality - 1]}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={mentality}
                  onChange={(e) => setMentality(Number(e.target.value))}
                  className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between mt-1 text-[8px] uppercase tracking-widest text-neutral-600 font-label">
                  <span>Défensif</span><span>Équilibré</span><span>Ultra-Off.</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs uppercase font-label font-bold tracking-widest text-neutral-400">Intensité du Pressing</span>
                  <span className="text-sm font-headline font-bold text-tertiary italic uppercase">{pressing}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={pressing}
                  onChange={(e) => setPressing(Number(e.target.value))}
                  className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-tertiary"
                />
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs uppercase font-label font-bold tracking-widest text-neutral-400">Relance</span>
                  <span className="text-sm font-headline font-bold text-secondary italic uppercase">
                    {buildupStyle === 'possession' ? 'Possession' : buildupStyle === 'direct' ? 'Direct' : buildupStyle === 'counter' ? 'Contre' : 'Jeu Long'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    { key: 'possession', label: 'Possession' },
                    { key: 'direct', label: 'Direct' },
                    { key: 'counter', label: 'Contre' },
                    { key: 'long_ball', label: 'Jeu Long' },
                  ].map((style) => (
                    <button
                      key={style.key}
                      onClick={() => setBuildupStyle(style.key)}
                      className={`py-2 rounded text-[10px] uppercase font-bold tracking-widest transition-colors ${
                        buildupStyle === style.key
                          ? 'border border-primary bg-primary/10 text-primary'
                          : 'border border-white/10 bg-surface-container-highest hover:bg-white/5 text-neutral-400'
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sub Bench */}
          <div className="bg-surface-container-low rounded-2xl p-6 border border-white/5">
            <h3 className="font-headline font-black text-xl uppercase tracking-tighter mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">groups</span> Banc de Touche
            </h3>
            <div className="space-y-3">
              {[
                { num: 12, name: 'Lunin', pos: 'GB' },
                { num: 6, name: 'Nacho', pos: 'DC' },
                { num: 15, name: 'Valverde', pos: 'MC' },
                { num: 21, name: 'Brahim', pos: 'AD' },
              ].map((sub, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className="flex justify-between items-center p-3 rounded-lg border border-white/5 bg-surface-container-highest/50 hover:border-white/20 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-headline font-black text-neutral-500 w-4">{sub.num}</span>
                    <span className="text-sm font-headline font-bold">{sub.name}</span>
                  </div>
                  <span className="text-[10px] font-label font-bold tracking-widest text-neutral-500 uppercase">{sub.pos}</span>
                </motion.div>
              ))}
            </div>
            <button className="w-full mt-4 py-3 bg-surface-container-highest hover:bg-white/5 border border-white/10 rounded-lg text-xs font-headline font-bold uppercase tracking-widest transition-colors flex justify-center items-center gap-2">
              <span className="material-symbols-outlined text-sm">swap_vert</span> Remplacement Auto
            </button>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
