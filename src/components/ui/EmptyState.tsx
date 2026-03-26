'use client';

import { motion } from 'framer-motion';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon = 'inbox', title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-16 px-8"
    >
      <div className="w-20 h-20 rounded-full bg-surface-container-highest flex items-center justify-center mb-6">
        <span className="material-symbols-outlined text-4xl text-neutral-500">{icon}</span>
      </div>
      <h3 className="font-headline font-black text-xl uppercase tracking-tighter mb-2">{title}</h3>
      <p className="text-on-surface-variant text-sm max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 primary-gradient text-on-primary-container font-headline font-bold uppercase tracking-widest text-xs rounded-xl hover:scale-105 active:scale-95 transition-all"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
