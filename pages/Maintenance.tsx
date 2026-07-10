import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { maintenanceActions } from '../store/slices/maintenanceSlice';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { MetricCard } from '../components/ui/MetricCard';
import { MaintenanceList, PredictionsPanel } from '../components/dashboard/MaintenanceCard';
import { Brain, Shield, AlertOctagon, CalendarClock, DollarSign, ListTodo } from 'lucide-react';
import { formatCurrency } from '../utils/format';
import { cn } from '../utils/cn';

const filters = [
  { key: 'all' as const, label: 'All Tasks', icon: ListTodo },
  { key: 'predictive' as const, label: 'Predictive', icon: Brain },
  { key: 'preventive' as const, label: 'Preventive', icon: Shield },
  { key: 'corrective' as const, label: 'Corrective', icon: AlertOctagon },
];

export default function Maintenance() {
  const dispatch = useAppDispatch();
  const { tasks, predictions, summary, filter, status } = useAppSelector((s) => s.maintenance);

  const filtered =
    filter === 'all' ? tasks : tasks.filter((t) => t.type === filter);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        <MetricCard title="Total Tasks" value={summary?.total ?? tasks.length} icon={ListTodo} />
        <MetricCard
          title="Predictive"
          value={summary?.predictive ?? tasks.filter((t) => t.type === 'predictive').length}
          icon={Brain}
          iconColor="bg-violet-500/15 text-violet-400"
        />
        <MetricCard
          title="Preventive"
          value={summary?.preventive ?? tasks.filter((t) => t.type === 'preventive').length}
          icon={Shield}
          iconColor="bg-cyan-500/15 text-cyan-400"
        />
        <MetricCard
          title="Scheduled"
          value={summary?.scheduled ?? tasks.filter((t) => t.status === 'scheduled').length}
          icon={CalendarClock}
        />
        <MetricCard
          title="Overdue"
          value={summary?.overdue ?? tasks.filter((t) => t.status === 'overdue').length}
          icon={AlertOctagon}
          status={(summary?.overdue ?? 0) > 0 ? 'critical' : 'normal'}
        />
        <MetricCard
          title="Est. Monthly"
          value={formatCurrency(summary?.estimatedMonthlyCost ?? 0)}
          icon={DollarSign}
        />
      </div>

      {/* Feature highlight cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-transparent p-5" hover>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20">
              <Brain className="h-6 w-6 text-violet-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Predictive Maintenance</h3>
              <p className="text-xs text-slate-400">ML-powered failure prediction</p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            AI models analyze telemetry patterns to predict component failures before they occur,
            reducing unplanned downtime by up to 45%.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 border-violet-500/40 text-violet-300 hover:bg-violet-500/20"
            onClick={() => dispatch(maintenanceActions.setFilter('predictive'))}
          >
            View Predictive Tasks
          </Button>
        </Card>

        <Card className="border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-transparent p-5" hover>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20">
              <Shield className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Preventive Maintenance</h3>
              <p className="text-xs text-slate-400">Scheduled service intervals</p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Time and mileage-based service schedules keep your fleet operating at peak efficiency
            with standardized inspection checklists.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => dispatch(maintenanceActions.setFilter('preventive'))}
          >
            View Preventive Tasks
          </Button>
        </Card>

        <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-5" hover>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20">
              <AlertOctagon className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Data Analytics</h3>
              <p className="text-xs text-slate-400">Insights-driven decisions</p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            Comprehensive analytics across health trends, cost breakdowns, and component RUL
            estimates empower smarter fleet decisions.
          </p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-4"
            onClick={() => dispatch(maintenanceActions.setFilter('all'))}
          >
            View All Analytics Tasks
          </Button>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Card className="p-4 sm:p-5">
            <CardHeader
              title="Work Orders"
              subtitle={`${filtered.length} tasks · filter: ${filter}`}
              action={
                <div className="flex flex-wrap gap-1.5">
                  {filters.map((f) => (
                    <button
                      key={f.key}
                      onClick={() => dispatch(maintenanceActions.setFilter(f.key))}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all',
                        filter === f.key
                          ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/40'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      )}
                    >
                      <f.icon className="h-3.5 w-3.5" />
                      {f.label}
                    </button>
                  ))}
                </div>
              }
            />
            {status === 'loading' && tasks.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-500">Loading tasks...</div>
            ) : (
              <MaintenanceList
                tasks={filtered}
                onUpdateStatus={(taskId, s) =>
                  dispatch(maintenanceActions.updateTaskStatusRequest({ taskId, status: s }))
                }
              />
            )}
          </Card>
        </div>
        <PredictionsPanel predictions={predictions} />
      </div>
    </div>
  );
}
