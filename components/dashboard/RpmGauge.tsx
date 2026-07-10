import { motion } from 'framer-motion';
import { Card, CardHeader } from '../ui/Card';
import { Gauge } from 'lucide-react';
import { cn } from '../../utils/cn';

interface RpmGaugeProps {
  rpm: number; // 0 to 8000 (or higher)
  odometer: number; // cumulative distance
  className?: string;
}

export function RpmGauge({ rpm, odometer, className }: RpmGaugeProps) {
  const maxRpm = 6000;
  const percentage = Math.min(100, Math.max(0, (rpm / maxRpm) * 100));

  // Gauge arcs: -90 degrees to +90 degrees = 180 degrees total range.
  // We'll map percentage to a rotation angle from -90 to +90 degrees.
  const needleRotation = -90 + (percentage / 100) * 180;

  // Format odometer as a fixed-width string, e.g. "028450"
  const odoString = String(Math.round(odometer)).padStart(6, '0');

  // Generate tick marks
  const ticks = Array.from({ length: 7 }, (_, i) => {
    const val = i * 1000;
    const angle = -90 + (i / 6) * 180;
    return { val, angle };
  });

  return (
    <Card className={cn('p-4 sm:p-5', className)}>
      <CardHeader
        title="RPM & Mileage Analysis"
        subtitle="Live motor rotational speed and cumulative odometer"
        action={
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
            <Gauge className="h-4 w-4" />
          </div>
        }
      />

      <div className="flex flex-col items-center justify-center pt-2">
        {/* Semi-circular Speedometer/RPM Gauge */}
        <div className="relative flex h-36 w-64 items-end justify-center overflow-hidden">
          {/* Main gauge track */}
          <svg className="absolute bottom-0 h-32 w-64 overflow-visible" viewBox="0 0 200 100">
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="60%" stopColor="#3b82f6" />
                <stop offset="85%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
            </defs>

            {/* Arc Track */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="rgba(148, 163, 184, 0.1)"
              strokeWidth="10"
              strokeLinecap="round"
            />

            {/* Glowing Active Fill */}
            <motion.path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="251.2"
              initial={{ strokeDashoffset: 251.2 }}
              animate={{ strokeDashoffset: 251.2 - (percentage / 100) * 251.2 }}
              transition={{ type: 'spring', stiffness: 80, damping: 25 }}
            />
          </svg>

          {/* Ticks and Labels */}
          <div className="absolute inset-0 pointer-events-none">
            {ticks.map((tick) => (
              <div
                key={tick.val}
                className="absolute bottom-0 left-1/2 flex flex-col items-center origin-bottom"
                style={{
                  transform: `translateX(-50%) rotate(${tick.angle}deg)`,
                  height: '110px',
                }}
              >
                <span
                  className={cn(
                    'text-[9px] font-bold tracking-tight',
                    tick.val >= 5000 ? 'text-rose-400' : 'text-slate-400'
                  )}
                  style={{ transform: `rotate(${-tick.angle}deg)` }}
                >
                  {tick.val / 1000}
                </span>
                <div
                  className={cn(
                    'mt-1 h-2 w-0.5',
                    tick.val >= 5000 ? 'bg-rose-500/60' : 'bg-slate-600/50'
                  )}
                />
              </div>
            ))}
          </div>

          {/* Core Hub and Rotating Needle */}
          <div className="absolute bottom-0 left-1/2 z-10 flex h-4 w-4 -translate-x-1/2 translate-y-1/2 items-center justify-center">
            <div className="h-4 w-4 rounded-full border border-slate-700 bg-slate-900 shadow-lg shadow-black/50" />

            {/* Needle */}
            <motion.div
              className="absolute bottom-0 left-1/2 h-24 w-1 origin-bottom rounded-full"
              style={{
                transform: `translateX(-50%) rotate(${needleRotation}deg)`,
                background: 'linear-gradient(to top, #ef4444 30%, #f43f5e 100%)',
                boxShadow: '0 0 8px rgba(239, 68, 68, 0.4)',
              }}
              animate={{ transform: `translateX(-50%) rotate(${needleRotation}deg)` }}
              transition={{ type: 'spring', stiffness: 90, damping: 15 }}
            />
          </div>

          {/* Digital RPM reading in the center of the gauge */}
          <div className="absolute bottom-2 flex flex-col items-center justify-center">
            <span className="text-xl font-extrabold tabular-nums tracking-tight text-white">
              {Math.round(rpm).toLocaleString()}
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
              Motor RPM x1000
            </span>
          </div>
        </div>

        {/* Digital Odometer Block */}
        <div className="mt-5 w-full max-w-xs rounded-xl border border-slate-700/50 bg-slate-950/60 p-3">
          <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Odometer (km)
          </p>
          <div className="mt-1.5 flex items-center justify-center gap-1">
            {odoString.split('').map((char, index) => (
              <div
                key={index}
                className="flex h-8 w-6 items-center justify-center rounded bg-slate-900 border border-slate-800 font-mono text-base font-bold tabular-nums text-cyan-400 shadow-inner"
              >
                {char}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
