import { Card } from './Card';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  status?: 'normal' | 'warning' | 'critical';
  subtitle?: string;
  className?: string;
  iconColor?: string;
}

const statusStyles = {
  normal: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/20',
  warning: 'from-amber-500/20 to-orange-500/10 border-amber-500/30',
  critical: 'from-rose-500/20 to-red-500/10 border-rose-500/40 animate-pulse-subtle',
};

const iconBg = {
  normal: 'bg-cyan-500/15 text-cyan-400',
  warning: 'bg-amber-500/15 text-amber-400',
  critical: 'bg-rose-500/15 text-rose-400',
};

export function MetricCard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  trendValue,
  status = 'normal',
  subtitle,
  className,
  iconColor,
}: MetricCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <Card
      hover
      className={cn(
        'bg-gradient-to-br p-4 sm:p-5',
        statusStyles[status],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-xl',
            iconColor || iconBg[status]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs',
              trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-rose-400' : 'text-slate-400'
            )}
          >
            <TrendIcon className="h-3.5 w-3.5" />
            {trendValue}
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{title}</p>
        <div className="mt-1 flex items-baseline gap-1">
          <motion.span
            key={String(value)}
            initial={{ opacity: 0.5, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold tabular-nums tracking-tight text-white sm:text-3xl"
          >
            {value}
          </motion.span>
          {unit && <span className="text-sm text-slate-400">{unit}</span>}
        </div>
        {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
      </div>
    </Card>
  );
}
