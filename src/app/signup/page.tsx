'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, username, fullName);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Compte créé avec succès ! Vérifiez votre e-mail.');
      router.push('/login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-tertiary/5 rounded-full blur-[120px] -ml-64 -mt-64" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -mr-32 -mb-32" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 kinetic-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-3xl text-black" style={{ fontVariationSettings: "'FILL' 1" }}>sports_soccer</span>
          </div>
          <h1 className="text-4xl font-headline font-black tracking-tighter uppercase">
            Rejoindre <span className="text-primary italic">l&apos;Élite</span>
          </h1>
          <p className="text-on-surface-variant text-sm mt-2">Créez votre profil de joueur</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-container-low border border-white/5 rounded-2xl p-8 space-y-5 shadow-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-label font-bold tracking-widest text-neutral-400 mb-2">
                Nom d&apos;utilisateur
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-surface-container-highest border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-neutral-600"
                placeholder="PepG"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-label font-bold tracking-widest text-neutral-400 mb-2">
                Nom complet
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-surface-container-highest border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-neutral-600"
                placeholder="Kevin Martin"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-label font-bold tracking-widest text-neutral-400 mb-2">
              Adresse e-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container-highest border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-neutral-600"
              placeholder="votre@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-label font-bold tracking-widest text-neutral-400 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-highest border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-neutral-600"
              placeholder="Minimum 6 caractères"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 primary-gradient text-on-primary-container font-headline font-black uppercase tracking-widest rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
            ) : (
              <>
                <span className="material-symbols-outlined">person_add</span>
                Créer mon Compte
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <p className="text-sm text-on-surface-variant">
              Déjà un compte ?{' '}
              <Link href="/login" className="text-primary font-bold hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </form>

        <p className="text-center text-[10px] text-neutral-600 mt-8 uppercase tracking-widest font-label">
          Kinetic Arena &bull; Saison 2025-26
        </p>
      </motion.div>
    </div>
  );
}
