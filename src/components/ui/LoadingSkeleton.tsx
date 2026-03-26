'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-surface-container-highest rounded-lg ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-surface-container-low rounded-2xl border border-white/5 p-6 space-y-4"
    >
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </motion.div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-surface-container-low border border-white/5 rounded-2xl p-6 space-y-3">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-10 w-20" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-white/5">
      <td className="p-4"><Skeleton className="h-4 w-8 mx-auto" /></td>
      <td className="p-4"><div className="flex items-center gap-3"><Skeleton className="w-8 h-8 rounded-full" /><Skeleton className="h-4 w-28" /></div></td>
      <td className="p-4"><Skeleton className="h-4 w-6 mx-auto" /></td>
      <td className="p-4"><Skeleton className="h-4 w-6 mx-auto" /></td>
      <td className="p-4"><Skeleton className="h-4 w-6 mx-auto" /></td>
      <td className="p-4"><Skeleton className="h-4 w-6 mx-auto" /></td>
      <td className="p-4"><Skeleton className="h-4 w-8 mx-auto" /></td>
      <td className="p-4"><Skeleton className="h-4 w-16" /></td>
    </tr>
  );
}

export function PlayerCardSkeleton() {
  return (
    <div className="bg-surface-container-low rounded-2xl border border-white/5 overflow-hidden">
      <Skeleton className="h-48 rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-1"><Skeleton className="h-3 w-16" /><Skeleton className="h-4 w-20" /></div>
          <div className="space-y-1"><Skeleton className="h-3 w-16" /><Skeleton className="h-4 w-20" /></div>
        </div>
        <Skeleton className="h-10 w-full mt-4" />
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-12 w-80" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
      <CardSkeleton />
    </div>
  );
}
