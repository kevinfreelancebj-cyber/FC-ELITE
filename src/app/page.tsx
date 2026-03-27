'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useRef, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function LandingPage() {
  const { user } = useAuth();
  const heroRef = useRef(null);
  const [stats, setStats] = useState({ clubs: 0, joueurs: 0 });
  
  useEffect(() => {
    (async () => {
      const { count: teamCount } = await supabase.from('teams').select('*', { count: 'exact', head: true });
      const { count: playerCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      setStats({ clubs: teamCount || 0, joueurs: playerCount || 0 });
    })();
  }, []);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans selection:bg-primary selection:text-black overflow-x-hidden">
      
      {/* NAVBAR TRÈS CRISTALLINE */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto backdrop-blur-md bg-black/20 border-b border-white/5 mt-4 rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 kinetic-gradient rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(92,253,128,0.5)]">
            <span className="material-symbols-outlined text-black font-black" style={{ fontVariationSettings: "'FILL' 1" }}>sports_soccer</span>
          </div>
          <h2 className="text-2xl font-black text-white italic font-headline tracking-tighter">FC ELITE</h2>
        </div>
        
        <div className="flex gap-4 items-center">
          {user ? (
            <Link href="/dashboard" className="px-6 py-2.5 rounded-full bg-white text-black font-headline font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">
              Mon Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden md:block font-headline font-bold text-xs text-neutral-300 hover:text-white transition-colors uppercase tracking-widest">
                Connexion
              </Link>
              <Link href="/signup" className="px-6 py-2.5 rounded-full kinetic-gradient font-headline font-black text-xs text-black uppercase tracking-widest shadow-[0_0_20px_rgba(92,253,128,0.4)] hover:scale-105 transition-transform flex items-center gap-2">
                Rejoindre <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO SECTION - IMMERSION TOTALE */}
      <section ref={heroRef} className="relative min-h-[100svh] flex items-center justify-center pt-20 overflow-hidden">
        {/* PARALLAX BACKGROUND */}
        <motion.div 
          style={{ y: backgroundY, opacity }}
          className="absolute inset-0 z-0"
        >
          {/* Main Background Image - Dark Stadium */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518605368461-1ee068dc4d07?q=80&w=2675&auto=format&fit=crop')] bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity" />
          
          {/* Overlay Gradients pour le style "Foot App" */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay" />
          
          {/* Lueur E-sport Émeraude */}
          <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="relative z-10 w-full max-w-7xl mx-auto px-4 text-center flex flex-col items-center"
        >
          {/* Badge E-sport */}
          <motion.div variants={fadeUp} className="mb-8 inline-flex items-center gap-2 border border-primary/40 bg-primary/10 backdrop-blur-md px-5 py-2 rounded-full text-primary font-headline font-bold uppercase tracking-widest text-[10px] shadow-[0_0_20px_rgba(92,253,128,0.2)]">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Ligue Officielle 11v11 - Inscriptions Ouvertes
          </motion.div>
          
          {/* Titre Ultra Stylisé avec clip-text et italics */}
          <motion.h1 variants={fadeUp} className="text-7xl md:text-9xl font-black font-headline tracking-tighter leading-[0.85] text-white mb-6 uppercase">
            Votre <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-600">Carrière</span><br/>
            <span className="kinetic-gradient text-transparent bg-clip-text italic drop-shadow-[0_0_30px_rgba(92,253,128,0.5)]">Commence Ici.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-xl md:text-2xl text-neutral-300 font-medium mb-12 max-w-3xl mx-auto leading-relaxed">
            Créez votre Virtual Pro, signez dans un club mythique et dominez le championnat. La plateforme ultime de recrutement et de gestion de ligue.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full max-w-md mx-auto sm:max-w-none">
            {user ? (
              <Link href="/dashboard" className="w-full sm:w-auto px-12 py-5 rounded-2xl kinetic-gradient text-black font-headline font-black uppercase tracking-widest text-sm shadow-[0_0_40px_rgba(92,253,128,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group">
                Aller au Vestiaire
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
            ) : (
              <>
                <Link href="/signup" className="w-full sm:w-auto px-12 py-5 rounded-2xl kinetic-gradient text-black font-headline font-black uppercase tracking-widest text-sm shadow-[0_0_40px_rgba(92,253,128,0.5)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group">
                  Créer mon Joueur
                  <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">sports_soccer</span>
                </Link>
                <Link href="/login" className="w-full sm:w-auto px-12 py-5 rounded-2xl border-2 border-white/20 bg-black/50 backdrop-blur-md hover:bg-white hover:text-black text-white font-headline font-bold uppercase tracking-widest text-sm transition-all flex items-center justify-center">
                  Se Connecter
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>

        {/* Diagonal Cut Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] to-transparent z-10" />
      </section>

      {/* STATS BANNER */}
      <section className="relative z-20 -mt-10 border-y border-white/5 bg-surface-container/50 backdrop-blur-xl py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5">
          <div className="text-center">
            <div className="text-4xl font-headline font-black text-white mb-1 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{stats.clubs}</div>
            <div className="text-[10px] font-headline font-bold uppercase tracking-widest text-primary">Clubs Pro</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-headline font-black text-white mb-1 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{stats.joueurs}</div>
            <div className="text-[10px] font-headline font-bold uppercase tracking-widest text-primary">Joueurs Inscrits</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-headline font-black text-white mb-1 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">100%</div>
            <div className="text-[10px] font-headline font-bold uppercase tracking-widest text-primary">Compétitif</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-headline font-black text-white mb-1 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">24/7</div>
            <div className="text-[10px] font-headline font-bold uppercase tracking-widest text-primary">Marché Ouvert</div>
          </div>
        </div>
      </section>

      {/* THREE PILLARS (FEATURES POSTER STYLE) */}
      <section className="relative z-10 py-32 bg-[#050505] overflow-hidden">
        {/* Lueur d'arrière plan */}
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-secondary/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-tertiary/10 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-headline font-black uppercase tracking-tighter mb-4">L&apos;Avantage <span className="text-primary italic">FC Elite</span></h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">Vivez votre passion du football virtuel dans un écosystème conçu pour les compétiteurs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* CARTE 1 */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="group relative h-[450px] rounded-[2rem] overflow-hidden border border-white/10 bg-surface-container"
            >
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-40 mix-blend-luminosity" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white mb-6">
                  <span className="material-symbols-outlined text-3xl">badge</span>
                </div>
                <h3 className="text-3xl font-black font-headline uppercase tracking-tighter mb-3 text-white">L&apos;Éditeur Pro</h3>
                <p className="text-sm text-neutral-300 font-medium">Façonnez votre identité. Spécifiez votre pied fort, votre taille et votre style de jeu pour séduire les meilleurs clubs.</p>
              </div>
            </motion.div>

            {/* CARTE 2 */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="group relative h-[450px] rounded-[2rem] overflow-hidden border border-primary/30 bg-surface-container shadow-[0_0_30px_rgba(92,253,128,0.1)]"
            >
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544168190-79c154273140?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-50 mix-blend-luminosity" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 backdrop-blur-md border border-primary/50 flex items-center justify-center text-primary mb-6 shadow-[0_0_15px_rgba(92,253,128,0.5)]">
                  <span className="material-symbols-outlined text-3xl">handshake</span>
                </div>
                <h3 className="text-3xl font-black font-headline uppercase tracking-tighter mb-3 text-white">Le Pôle Mercato</h3>
                <p className="text-sm text-neutral-300 font-medium">Une bourse aux joueurs dynamique. En tant qu&apos;Agent Libre, exposez votre profil. En tant que Capitaine, proposez de vrais contrats.</p>
              </div>
            </motion.div>

            {/* CARTE 3 */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="group relative h-[450px] rounded-[2rem] overflow-hidden border border-white/10 bg-surface-container"
            >
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-40 mix-blend-luminosity" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white mb-6">
                  <span className="material-symbols-outlined text-3xl">emoji_events</span>
                </div>
                <h3 className="text-3xl font-black font-headline uppercase tracking-tighter mb-3 text-white">Centre de Matchs</h3>
                <p className="text-sm text-neutral-300 font-medium">Retrouvez le calendrier complet et déclarez officiellement vos scores avec preuves à l&apos;appui pour grimper au classement.</p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* MEGA CALL TO ACTION */}
      <section className="relative z-10 py-32 overflow-hidden bg-surface-container-low border-t border-white/5">
        <div className="absolute inset-0">
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[300px] bg-primary/30 blur-[200px] rounded-full pointer-events-none" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-7xl font-black font-headline uppercase tracking-tighter mb-6">
            Le Tableau Final <br/><span className="text-primary italic">Vous Attend.</span>
          </h2>
          <p className="text-xl text-neutral-400 font-medium mb-12">
            Rejoignez la communauté FC Elite et prouvez que vous êtes le meilleur sur le terrain virtuel.
          </p>
          
          <Link href="/signup" className="inline-flex items-center justify-center gap-3 px-12 py-6 rounded-2xl kinetic-gradient text-black font-headline font-black uppercase tracking-widest text-lg shadow-[0_0_50px_rgba(92,253,128,0.5)] hover:scale-105 active:scale-95 transition-all">
            Créer un Compte Gratuitement
            <span className="material-symbols-outlined text-2xl">rocket_launch</span>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-20 py-8 border-t border-white/10 bg-black text-center text-xs text-neutral-500 font-headline uppercase tracking-widest">
        <p>© 2026 FC Elite. La plateforme e-sport de référence.</p>
      </footer>
    </div>
  );
}
