import { Wrench, Brain, Shield, AlertOctagon, Clock, DollarSign } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import type { MaintenanceTask, MaintenancePrediction } from '../../types';
import { formatDate, formatCurrency } from '../../utils/format';
import { cn } from '../../utils/cn';

const typeIcon = {
  predictive: Brain,
  preventive: Shield,
  corrective: AlertOctagon,
};

interface MaintenanceListProps {
  tasks: MaintenanceTask[];
  filter?: string;
  onUpdateStatus?: (id: string, status: MaintenanceTask['status']) => void;
  compact?: boolean;
}

export function MaintenanceList({ tasks, onUpdateStatus, compact }: MaintenanceListProps) {
  const display = compact ? tasks.slice(0, 4) : tasks;

  return (
    <div className="space-y-3">
      {display.map((task) => {
        const Icon = typeIcon[task.type];
        return (
          <div
            key={task.id}
            className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-3.5 transition-all duration-300 hover:border-slate-600 hover:bg-slate-800/70"
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                  task.type === 'predictive' && 'bg-violet-500/15 text-violet-400',
                  task.type === 'preventive' && 'bg-cyan-500/15 text-cyan-400',
                  task.type === 'corrective' && 'bg-orange-500/15 text-orange-400'
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-slate-100">{task.title}</p>
                  <Badge status={task.type}>{task.type}</Badge>
                  <Badge status={task.priority}>{task.priority}</Badge>
                  <Badge status={task.status}>{task.status.replace('_', ' ')}</Badge>
                </div>
                {!compact && (
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{task.description}</p>
                )}
                <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Wrench className="h-3 w-3" />
                    {task.component}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(task.scheduledDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {formatCurrency(task.estimatedCost)}
                  </span>
                  {task.confidence !== undefined && (
                    <span className="text-violet-400">ML confidence {task.confidence}%</span>
                  )}
                </div>
                {task.type === 'predictive' && task.confidence !== undefined && !compact && (
                  <div className="mt-2">
                    <ProgressBar
                      value={task.confidence}
                      label="Prediction confidence"
                      size="sm"
                      color="bg-violet-500"
                    />
                  </div>
                )}
                {onUpdateStatus && task.status !== 'completed' && task.status !== 'cancelled' && (
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {task.status === 'scheduled' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUpdateStatus(task.id, 'in_progress')}
                      >
                        Start
                      </Button>
                    )}
                    {task.status === 'in_progress' && (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => onUpdateStatus(task.id, 'completed')}
                      >
                        Complete
                      </Button>
                    )}
                    {task.status === 'overdue' && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => onUpdateStatus(task.id, 'in_progress')}
                      >
                        Start Now
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      {display.length === 0 && (
        <p className="py-8 text-center text-sm text-slate-500">No maintenance tasks found</p>
      )}
    </div>
  );
}

export function PredictionsPanel({ predictions }: { predictions: MaintenancePrediction[] }) {
  return (
    <Card className="p-4 sm:p-5">
      <CardHeader
        title="Predictive Insights"
        subtitle="ML-based component remaining useful life"
      />
      <div className="space-y-3">
        {predictions.map((p, i) => (
          <div
            key={`${p.component}-${i}`}
            className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-3.5"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium text-slate-100">{p.component}</p>
              <Badge status={p.urgency}>{p.urgency}</Badge>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold tabular-nums text-white">{p.remainingLife}</span>
              <span className="text-xs text-slate-400">{p.remainingLifeUnit} remaining</span>
            </div>
            <ProgressBar
              value={(1 - p.failureProbability) * 100}
              label={`Failure probability ${(p.failureProbability * 100).toFixed(0)}%`}
              size="sm"
              className="mt-2"
              color={
                p.failureProbability > 0.7
                  ? 'bg-rose-500'
                  : p.failureProbability > 0.4
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
              }
            />
            <p className="mt-2 text-xs text-slate-400">{p.recommendedAction}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
