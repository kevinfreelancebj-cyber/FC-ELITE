'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white relative overflow-hidden font-sans">
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 blur-[150px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay" />
      </div>

      {/* MINI NAVBAR */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 kinetic-gradient rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-black font-black" style={{ fontVariationSettings: "'FILL' 1" }}>sports_soccer</span>
          </div>
          <h2 className="text-2xl font-black text-white italic font-headline tracking-tighter">FC ELITE</h2>
        </div>
        
        <div className="flex gap-4 items-center">
          {user ? (
            <Link href="/dashboard" className="px-6 py-2 rounded-full border border-white/20 font-headline font-bold text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-all">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden md:block font-headline font-semibold text-sm text-neutral-400 hover:text-white transition-colors uppercase tracking-widest">
                Connexion
              </Link>
              <Link href="/signup" className="px-6 py-2 rounded-full kinetic-gradient font-headline font-black text-sm text-black uppercase tracking-widest shadow-[0_0_20px_rgba(92,253,128,0.3)] hover:scale-105 transition-transform">
                S&apos;inscrire
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] px-4 text-center pb-20">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="max-w-4xl"
        >
          <motion.div variants={fadeUp} className="mb-6 inline-flex border border-primary/30 bg-primary/10 px-4 py-1.5 rounded-full text-primary font-headline font-bold uppercase tracking-widest text-[10px]">
            Saison 2025 Ouverte • Rejoignez le Championnat
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="text-6xl md:text-8xl font-black font-headline tracking-tighter leading-[0.9] text-white mb-8">
            FORGEZ VOTRE <br/> <span className="kinetic-gradient text-transparent bg-clip-text italic">LÉGENDE.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg md:text-xl text-neutral-400 font-medium mb-12 max-w-2xl mx-auto">
            La première plateforme e-sport 11v11 immersive. Créez votre Virtual Pro, signez dans un club, disputez des matchs officiels et hissez-vous au sommet du classement.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user ? (
              <Link href="/dashboard" className="px-10 py-5 rounded-2xl kinetic-gradient text-black font-headline font-black uppercase tracking-widest shadow-[0_0_30px_rgba(92,253,128,0.4)] hover:scale-105 transition-all text-lg flex items-center gap-2">
                Poursuivre ma carrière
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            ) : (
              <>
                <Link href="/signup" className="w-full sm:w-auto px-10 py-5 rounded-2xl kinetic-gradient text-black font-headline font-black uppercase tracking-widest shadow-[0_0_30px_rgba(92,253,128,0.4)] hover:scale-105 transition-all text-lg flex justify-center items-center gap-2">
                  Entrer dans l&apos;Arène
                  <span className="material-symbols-outlined">sports_score</span>
                </Link>
                <Link href="/login" className="w-full sm:w-auto px-10 py-5 rounded-2xl border border-white/10 bg-surface-container-low hover:bg-white/5 text-white font-headline font-bold uppercase tracking-widest transition-all text-sm flex justify-center items-center">
                  J&apos;ai déjà un compte
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>
      </main>

      {/* FEATURES SHOWCASE */}
      <section className="relative z-10 bg-surface-container py-24 pb-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface-container-low p-8 rounded-3xl border border-white/5 hover:border-primary/50 transition-colors group">
              <div className="w-16 h-16 rounded-2xl bg-surface-container-high border border-white/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">badge</span>
              </div>
              <h3 className="text-2xl font-black font-headline uppercase tracking-tighter mb-4">Éditeur de Pro</h3>
              <p className="text-sm text-neutral-400">Définissez votre profil, votre style de jeu, et impressionnez les recruteurs du monde entier.</p>
            </div>

            <div className="bg-surface-container-low p-8 rounded-3xl border border-white/5 hover:border-tertiary/50 transition-colors group">
              <div className="w-16 h-16 rounded-2xl bg-surface-container-high border border-white/10 flex items-center justify-center mb-6 text-tertiary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">handshake</span>
              </div>
              <h3 className="text-2xl font-black font-headline uppercase tracking-tighter mb-4">Le Mercato</h3>
              <p className="text-sm text-neutral-400">Postulez comme agent libre ou utilisez votre pouvoir de Capitaine pour dénicher les pépites de demain.</p>
            </div>

            <div className="bg-surface-container-low p-8 rounded-3xl border border-white/5 hover:border-secondary/50 transition-colors group">
              <div className="w-16 h-16 rounded-2xl bg-surface-container-high border border-white/10 flex items-center justify-center mb-6 text-secondary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">stadium</span>
              </div>
              <h3 className="text-2xl font-black font-headline uppercase tracking-tighter mb-4">Jour de Match</h3>
              <p className="text-sm text-neutral-400">Affrontez d&apos;autres clubs, déclarez vos scores, et surveillez l&apos;évolution de votre équipe au classement officiel.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
