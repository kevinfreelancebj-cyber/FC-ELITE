'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 rounded-full bg-error/10 flex items-center justify-center mb-8">
        <span className="material-symbols-outlined text-5xl text-error">error</span>
      </div>
      <h2 className="text-3xl font-headline font-black tracking-tighter mb-2">Une erreur est survenue</h2>
      <p className="text-sm text-neutral-500 mb-8 max-w-md">
        {error.message || 'Quelque chose s\'est mal passé. Veuillez réessayer.'}
      </p>
      <button
        onClick={reset}
        className="px-8 py-4 primary-gradient text-on-primary-container font-headline font-black uppercase tracking-widest text-xs rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
      >
        Réessayer
      </button>
    </div>
  );
}
