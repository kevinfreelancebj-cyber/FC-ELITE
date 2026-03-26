import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 rounded-full bg-surface-container-highest flex items-center justify-center mb-8">
        <span className="material-symbols-outlined text-5xl text-error">sports_soccer</span>
      </div>
      <h1 className="text-6xl font-headline font-black tracking-tighter mb-2">4<span className="text-primary">0</span>4</h1>
      <p className="text-xl font-headline font-bold text-on-surface-variant mb-2">Page introuvable</p>
      <p className="text-sm text-neutral-500 mb-8 max-w-md">
        Le ballon est sorti du terrain ! La page que vous cherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link href="/" className="px-8 py-4 primary-gradient text-on-primary-container font-headline font-black uppercase tracking-widest text-xs rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
        Retour à l&apos;Accueil
      </Link>
    </div>
  );
}
