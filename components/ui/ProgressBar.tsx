import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';
import { getHealthBg } from '../../utils/format';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
  animated?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  size = 'md',
  color,
  className,
  animated = true,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3.5' };

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between text-xs">
          {label && <span className="font-medium text-slate-300">{label}</span>}
          {showValue && (
            <span className="tabular-nums text-slate-400">{Math.round(pct)}%</span>
          )}
        </div>
      )}
      <div className={cn('overflow-hidden rounded-full bg-slate-800', heights[size])}>
        <motion.div
          className={cn('h-full rounded-full', color || getHealthBg(pct))}
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export function CircularProgress({
  value,
  size = 80,
  strokeWidth = 6,
  label,
  color,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  color?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const strokeColor =
    color ||
    (value >= 85 ? '#34d399' : value >= 70 ? '#22d3ee' : value >= 50 ? '#fbbf24' : '#fb7185');

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgb(30 41 59)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold tabular-nums text-white">{Math.round(value)}</span>
        {label && <span className="text-[10px] text-slate-400">{label}</span>}
      </div>
    </div>
  );
}
