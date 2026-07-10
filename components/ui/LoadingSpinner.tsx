import { cn } from '../../utils/cn';

export function LoadingSpinner({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-slate-600 border-t-cyan-400',
          sizes[size]
        )}
      />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <LoadingSpinner size="lg" />
      <p className="animate-pulse text-sm text-slate-400">Loading dashboard data...</p>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded-xl bg-slate-800/80', className)} />
  );
}
