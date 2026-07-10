import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { Download, Maximize2, Minimize2 } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import type { ChartSeries, ChartMetric } from '../../types';
import { downloadChartAsPng } from '../../utils/format';
import { cn } from '../../utils/cn';

interface TelemetryChartProps {
  series: ChartSeries | null;
  loading?: boolean;
  warningThreshold?: number;
  criticalThreshold?: number;
  expanded?: boolean;
  onExpand?: (metric: ChartMetric | null) => void;
  height?: number;
  className?: string;
}

function CustomTooltip({
  active,
  payload,
  unit,
}: {
  active?: boolean;
  payload?: Array<{ value: number; payload: { timestamp: string } }>;
  unit: string;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0];
  return (
    <div className="rounded-xl border border-slate-600/80 bg-slate-900/95 px-3 py-2 shadow-xl backdrop-blur">
      <p className="text-[10px] text-slate-400">
        {format(parseISO(point.payload.timestamp), 'MMM d, HH:mm')}
      </p>
      <p className="text-sm font-semibold text-white">
        {point.value.toFixed(2)} <span className="text-xs font-normal text-slate-400">{unit}</span>
      </p>
    </div>
  );
}

export function TelemetryChart({
  series,
  loading,
  warningThreshold,
  criticalThreshold,
  expanded,
  onExpand,
  height = 135,
  className,
}: TelemetryChartProps) {
  const chartId = `chart-${series?.metric || 'empty'}`;

  const data = useMemo(() => {
    if (!series?.data) return [];
    return series.data.map((d) => ({
      ...d,
      time: format(parseISO(d.timestamp), 'HH:mm'),
    }));
  }, [series]);

  const gradientId = `grad-${series?.metric || 'default'}`;

  return (
    <Card className={cn('p-4 sm:p-5', expanded && 'col-span-full', className)}>
      <CardHeader
        title={series?.name || 'Loading...'}
        subtitle={
          series
            ? `Avg ${series.avg?.toFixed(1)}${series.unit} · Min ${series.min?.toFixed(1)} · Max ${series.max?.toFixed(1)}`
            : 'Fetching telemetry...'
        }
        action={
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => series && downloadChartAsPng(chartId, series.metric)}
              title="Download chart"
            >
              <Download className="h-4 w-4" />
            </Button>
            {onExpand && series && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onExpand(expanded ? null : series.metric)}
                title={expanded ? 'Collapse' : 'Expand'}
              >
                {expanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            )}
          </div>
        }
      />

      <div id={chartId} style={{ height: expanded ? 400 : height }}>
        {loading || !series ? (
          <div className="flex h-full items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-cyan-400" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={series.color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={series.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fill: '#64748b', fontSize: 10 }}
                axisLine={{ stroke: '#1e293b' }}
                tickLine={false}
                interval="preserveStartEnd"
                minTickGap={40}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={45}
                domain={['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip unit={series.unit} />} />
              {warningThreshold !== undefined && (
                <ReferenceLine
                  y={warningThreshold}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  strokeWidth={1}
                />
              )}
              {criticalThreshold !== undefined && (
                <ReferenceLine
                  y={criticalThreshold}
                  stroke="#f43f5e"
                  strokeDasharray="4 4"
                  strokeWidth={1}
                />
              )}
              <Area
                type="monotone"
                dataKey="value"
                stroke={series.color}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                animationDuration={800}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
