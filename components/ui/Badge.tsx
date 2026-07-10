import { cn } from '../../utils/cn';
import { getStatusColor } from '../../utils/format';

interface BadgeProps {
  children: React.ReactNode;
  status?: string;
  className?: string;
  pulse?: boolean;
}

export function Badge({ children, status, className, pulse }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize transition-all duration-300',
        status ? getStatusColor(status) : 'border-slate-600 bg-slate-800 text-slate-300',
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}
