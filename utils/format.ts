import { format, formatDistanceToNow, parseISO } from 'date-fns';

// Safe date formatting
export function formatDate(date: string | Date | null | undefined, pattern = 'MMM d, yyyy'): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (isNaN(d.getTime())) return '—';
  return format(d, pattern);
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (isNaN(d.getTime())) return '—';
  return format(d, 'MMM d, yyyy HH:mm');
}

export function formatRelative(date: string | Date | null | undefined): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (isNaN(d.getTime())) return '—';
  return formatDistanceToNow(d, { addSuffix: true });
}

// Safe number formatting
export function formatNumber(value: number | string | null | undefined, decimals = 1): string {
  if (value === null || value === undefined || isNaN(Number(value))) return '—';
  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatCurrency(value: number | string | null | undefined): string {
  if (value === null || value === undefined || isNaN(Number(value))) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export function formatPercent(value: number | string | null | undefined, decimals = 0): string {
  if (value === null || value === undefined || isNaN(Number(value))) return '—';
  return `${Number(value).toFixed(decimals)}%`;
}

// Health color helpers
export function getHealthColor(health: number | null | undefined): string {
  const h = health ?? 0;
  if (h >= 85) return 'text-emerald-400';
  if (h >= 70) return 'text-cyan-400';
  if (h >= 50) return 'text-amber-400';
  return 'text-rose-400';
}

export function getHealthBg(health: number | null | undefined): string {
  const h = health ?? 0;
  if (h >= 85) return 'bg-emerald-500';
  if (h >= 70) return 'bg-cyan-500';
  if (h >= 50) return 'bg-amber-500';
  return 'bg-rose-500';
}

// Status color mapping
export function getStatusColor(status: string | null | undefined): string {
  const map: Record<string, string> = {
    active: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
    idle: 'text-slate-300 bg-slate-500/15 border-slate-500/30',
    maintenance: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
    critical: 'text-rose-400 bg-rose-500/15 border-rose-500/30',
    scheduled: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30',
    in_progress: 'text-violet-400 bg-violet-500/15 border-violet-500/30',
    completed: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
    overdue: 'text-rose-400 bg-rose-500/15 border-rose-500/30',
    cancelled: 'text-slate-400 bg-slate-500/15 border-slate-500/30',
    warning: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
    info: 'text-sky-400 bg-sky-500/15 border-sky-500/30',
    acknowledged: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
    resolved: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
    predictive: 'text-violet-400 bg-violet-500/15 border-violet-500/30',
    preventive: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30',
    corrective: 'text-orange-400 bg-orange-500/15 border-orange-500/30',
    high: 'text-orange-400 bg-orange-500/15 border-orange-500/30',
    medium: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
    low: 'text-slate-300 bg-slate-500/15 border-slate-500/30',
  };
  return map[status || ''] || 'text-slate-300 bg-slate-500/15 border-slate-500/30';
}

// Chart download helper
export function downloadChartAsPng(elementId: string, filename: string) {
  const svg = document.querySelector(`#${elementId} svg`);
  if (!svg) return;

  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svg);
  const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width * 2 || 800;
    canvas.height = img.height * 2 || 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const a = document.createElement('a');
    a.download = `${filename}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
    URL.revokeObjectURL(url);
  };
  img.src = url;
}
