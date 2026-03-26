'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Connexion réussie !');
      router.push('/');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4">
      {/* Background effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-tertiary/5 rounded-full blur-[100px] -ml-32 -mb-32" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 kinetic-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-3xl text-black" style={{ fontVariationSettings: "'FILL' 1" }}>sports_soccer</span>
          </div>
          <h1 className="text-4xl font-headline font-black tracking-tighter uppercase">
            FC <span className="text-primary italic">Elite</span>
          </h1>
          <p className="text-on-surface-variant text-sm mt-2">Connectez-vous à votre espace</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-surface-container-low border border-white/5 rounded-2xl p-8 space-y-6 shadow-2xl">
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
              placeholder="••••••••"
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
                <span className="material-symbols-outlined">login</span>
                Se Connecter
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <p className="text-sm text-on-surface-variant">
              Pas encore de compte ?{' '}
              <Link href="/signup" className="text-primary font-bold hover:underline">
                Créer un compte
              </Link>
            </p>
          </div>
        </form>

        <p className="text-center text-[10px] text-neutral-600 mt-8 uppercase tracking-widest font-label">
          Kinetic Arena &bull; Saison 2024-25
        </p>
      </motion.div>
    </div>
  );
}
