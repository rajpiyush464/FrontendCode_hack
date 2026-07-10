import { useState } from 'react';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Info,
  XCircle,
  Volume2,
  VolumeX,
  Volume1,
  Download,
  CheckCheck,
  Eye,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, Button, Badge, Modal } from '../ui';
import type { Alert } from '../../types';
import { formatRelative, formatDateTime } from '../../utils/format';
import { cn } from '../../utils/cn';

interface AlertsPanelProps {
  alerts: Alert[];
  soundEnabled: boolean;
  volume: number;
  onSetVolume: (v: number) => void;
  onToggleSound: () => void;
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
  onResolveAll: () => void;
  compact?: boolean;
  className?: string;
}

const severityIcon = {
  critical: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const severityBorder = {
  critical: 'border-l-rose-500',
  warning: 'border-l-amber-500',
  info: 'border-l-sky-500',
};

function exportToExcel(alerts: Alert[]) {
  const headers = [
    'ID',
    'Vehicle',
    'Title',
    'Severity',
    'Status',
    'Category',
    'Metric',
    'Value',
    'Threshold',
    'Unit',
    'Timestamp',
    'Message',
  ];
  const escape = (val: string | number | undefined) => {
    const s = String(val ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = alerts.map((a) =>
    [
      a.id,
      a.vehicleName || a.vehicleId,
      a.title,
      a.severity,
      a.status,
      a.category,
      a.metric || '',
      a.value ?? '',
      a.threshold ?? '',
      a.unit || '',
      a.timestamp,
      a.message,
    ]
      .map(escape)
      .join(',')
  );
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fleetguard-alerts-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function AlertsPanel({
  alerts,
  soundEnabled,
  volume,
  onSetVolume,
  onToggleSound,
  onAcknowledge,
  onResolve,
  onResolveAll,
  compact,
  className,
}: AlertsPanelProps) {
  const [viewTarget, setViewTarget] = useState<Alert | null>(null);

  const active = alerts.filter((a) => a.status === 'active');
  const display = compact ? active.slice(0, 5) : alerts;
  const criticalActive = alerts.filter(
    (a) => a.severity === 'critical' && a.status === 'active'
  ).length;

  const VolumeIcon = !soundEnabled || volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;

  return (
    <Card className={cn('flex h-full flex-col p-4 sm:p-5', className)}>
      <CardHeader
        title="Live Alerts"
        subtitle={`${active.length} active · ${criticalActive} critical`}
        action={
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Volume control switch + slider */}
            <div className="relative flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleSound}
                title={soundEnabled ? 'Mute beep alerts' : 'Enable beep alerts'}
              >
                <VolumeIcon
                  className={cn('h-4 w-4', soundEnabled && volume > 0 ? 'text-cyan-400' : 'text-slate-500')}
                />
              </Button>
              <AnimatePresence>
                {soundEnabled && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 104 }}
                    exit={{ opacity: 0, width: 0 }}
                    className="flex items-center gap-2 overflow-hidden"
                  >
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={volume}
                      onChange={(e) => onSetVolume(Number(e.target.value))}
                      className="h-1 w-16 cursor-pointer appearance-none rounded-full bg-slate-700 accent-cyan-400"
                      title={`Beep volume ${volume}%`}
                    />
                    <span className="w-8 text-[10px] tabular-nums text-slate-400">{volume}%</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Export to Excel/CSV */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => exportToExcel(alerts)}
              title="Export alerts to Excel (CSV)"
            >
              <Download className="h-4 w-4" />
            </Button>

            {/* Resolve all */}
            <Button
              variant="success"
              size="sm"
              onClick={onResolveAll}
              disabled={active.length === 0}
              title="Resolve all active alerts"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Resolve All</span>
            </Button>
          </div>
        }
      />

      <div className={cn('flex-1 space-y-2 overflow-y-auto pr-1', compact ? 'max-h-[340px]' : 'max-h-[600px]')}>
        <AnimatePresence mode="popLayout">
          {display.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-10 text-slate-500"
            >
              <Bell className="mb-2 h-8 w-8 opacity-40" />
              <p className="text-sm">No alerts</p>
            </motion.div>
          ) : (
            display.map((alert) => {
              const Icon = severityIcon[alert.severity];
              return (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={cn(
                    'rounded-xl border border-slate-700/50 border-l-4 bg-slate-800/50 p-3 transition-colors hover:bg-slate-800/80',
                    severityBorder[alert.severity],
                    alert.status !== 'active' && 'opacity-60'
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <Icon
                      className={cn(
                        'mt-0.5 h-4 w-4 shrink-0',
                        alert.severity === 'critical' && 'text-rose-400',
                        alert.severity === 'warning' && 'text-amber-400',
                        alert.severity === 'info' && 'text-sky-400'
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-slate-100">{alert.title}</p>
                        <Badge status={alert.severity}>{alert.severity}</Badge>
                        {alert.status !== 'active' && (
                          <Badge status={alert.status}>{alert.status}</Badge>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{alert.message}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
                        <span>{alert.vehicleName || alert.vehicleId}</span>
                        <span>·</span>
                        <span>{formatRelative(alert.timestamp)}</span>
                        {alert.value !== undefined && (
                          <>
                            <span>·</span>
                            <span className="font-mono text-slate-400">
                              {alert.value}
                              {alert.unit}
                              {alert.threshold !== undefined && ` / ${alert.threshold}${alert.unit}`}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setViewTarget(alert)}
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                        {alert.status === 'active' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onAcknowledge(alert.id)}
                            >
                              Acknowledge
                            </Button>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => onResolve(alert.id)}
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              Resolve
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Glassmorphism View Modal */}
      <Modal open={!!viewTarget} onClose={() => setViewTarget(null)} title="Alert Details" size="md">
        {viewTarget && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-2xl',
                  viewTarget.severity === 'critical' && 'bg-rose-500/20 text-rose-400',
                  viewTarget.severity === 'warning' && 'bg-amber-500/20 text-amber-400',
                  viewTarget.severity === 'info' && 'bg-sky-500/20 text-sky-400'
                )}
              >
                {(() => {
                  const I = severityIcon[viewTarget.severity];
                  return <I className="h-6 w-6" />;
                })()}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-lg font-semibold text-white">{viewTarget.title}</h4>
                  <Badge status={viewTarget.severity}>{viewTarget.severity}</Badge>
                  <Badge status={viewTarget.status}>{viewTarget.status}</Badge>
                </div>
                <p className="text-xs text-slate-400">{viewTarget.vehicleName || viewTarget.vehicleId}</p>
              </div>
            </div>

            <p className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm leading-relaxed text-slate-200">
              {viewTarget.message}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <DetailField label="Category" value={viewTarget.category} />
              <DetailField label="Detected" value={formatRelative(viewTarget.timestamp)} />
              <DetailField
                label="Metric Reading"
                value={
                  viewTarget.metric
                    ? `${viewTarget.value ?? '—'} ${viewTarget.unit || ''}`
                    : '—'
                }
              />
              <DetailField
                label="Threshold"
                value={
                  viewTarget.threshold !== undefined
                    ? `${viewTarget.threshold} ${viewTarget.unit || ''}`
                    : '—'
                }
              />
              <DetailField label="Timestamp (UTC)" value={formatDateTime(viewTarget.timestamp)} span />
            </div>

            {viewTarget.status === 'active' && (
              <div className="flex flex-wrap gap-2 pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onAcknowledge(viewTarget.id);
                    setViewTarget(null);
                  }}
                >
                  Acknowledge
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => {
                    onResolve(viewTarget.id);
                    setViewTarget(null);
                  }}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Resolve Alert
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </Card>
  );
}

function DetailField({ label, value, span }: { label: string; value: string; span?: boolean }) {
  return (
    <div className={cn('rounded-xl border border-white/10 bg-white/5 p-3', span && 'col-span-2')}>
      <p className="text-[10px] uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-slate-100">{value}</p>
    </div>
  );
}
