import { useState } from 'react';
import { useAppSelector } from '../hooks/redux';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  FileText,
  Download,
  Calendar,
  BarChart3,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Printer,
} from 'lucide-react';
import { formatDate, formatCurrency, formatDateTime } from '../utils/format';

const reportTypes = [
  {
    id: 'health',
    title: 'Vehicle Health Report',
    description: 'Comprehensive health scores, component status, and trends',
    icon: BarChart3,
    color: 'text-cyan-400 bg-cyan-500/15',
  },
  {
    id: 'maintenance',
    title: 'Maintenance Summary',
    description: 'All predictive, preventive, and corrective work orders',
    icon: Wrench,
    color: 'text-violet-400 bg-violet-500/15',
  },
  {
    id: 'alerts',
    title: 'Alerts & Incidents',
    description: 'Active and historical alerts with severity breakdown',
    icon: AlertTriangle,
    color: 'text-amber-400 bg-amber-500/15',
  },
  {
    id: 'cost',
    title: 'Cost Analysis Report',
    description: 'Maintenance spend by type, vehicle, and period',
    icon: FileText,
    color: 'text-emerald-400 bg-emerald-500/15',
  },
];

export default function Reports() {
  const { currentVehicle, stats } = useAppSelector((s) => s.vehicle);
  const { alerts } = useAppSelector((s) => s.alert);
  const { tasks, summary } = useAppSelector((s) => s.maintenance);
  const { analytics } = useAppSelector((s) => s.chart);
  const [generating, setGenerating] = useState<string | null>(null);
  const [generated, setGenerated] = useState<string[]>([]);
  const [period, setPeriod] = useState('30d');

  const handleGenerate = (id: string) => {
    setGenerating(id);
    setTimeout(() => {
      setGenerating(null);
      setGenerated((g) => (g.includes(id) ? g : [...g, id]));
      downloadReport(id);
    }, 1200);
  };

  const downloadReport = (id: string) => {
    const report = reportTypes.find((r) => r.id === id);
    const lines = [
      `FleetGuard AI — ${report?.title || 'Report'}`,
      `Generated: ${new Date().toISOString()}`,
      `Period: ${period}`,
      `Vehicle: ${currentVehicle?.name || 'Fleet-wide'} (${currentVehicle?.id || 'ALL'})`,
      '',
      '=== SUMMARY ===',
      `Total Vehicles: ${stats?.totalVehicles ?? 'N/A'}`,
      `Avg Health: ${stats?.avgHealth?.toFixed(1) ?? 'N/A'}%`,
      `Critical Alerts: ${alerts.filter((a) => a.severity === 'critical').length}`,
      `Active Alerts: ${alerts.filter((a) => a.status === 'active').length}`,
      `Maintenance Tasks: ${tasks.length}`,
      `Predictive: ${tasks.filter((t) => t.type === 'predictive').length}`,
      `Preventive: ${tasks.filter((t) => t.type === 'preventive').length}`,
      `Corrective: ${tasks.filter((t) => t.type === 'corrective').length}`,
      `Est. Monthly Cost: ${formatCurrency(summary?.estimatedMonthlyCost ?? 0)}`,
      '',
      '=== ALERTS ===',
      ...alerts.map(
        (a) =>
          `[${a.severity.toUpperCase()}] ${a.title} | ${a.vehicleName} | ${a.status} | ${a.timestamp}`
      ),
      '',
      '=== MAINTENANCE ===',
      ...tasks.map(
        (t) =>
          `[${t.type}] ${t.title} | ${t.priority} | ${t.status} | ${formatCurrency(t.estimatedCost)} | ${t.scheduledDate}`
      ),
      '',
      analytics
        ? `=== ANALYTICS ===\nEfficiency: ${analytics.efficiencyScore}\nDowntime: ${analytics.downtimeHours}h\nMTBF: ${analytics.mtbf}h\nMTTR: ${analytics.mttr}h`
        : '',
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fleetguard-${id}-report-${period}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Report Generator</h2>
            <p className="text-sm text-slate-400">
              Export fleet data for {currentVehicle?.name || 'selected vehicle'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-500" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500/50"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          const isDone = generated.includes(report.id);
          return (
            <Card key={report.id} className="p-5" hover>
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${report.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">{report.title}</h3>
                    {isDone && (
                      <Badge status="completed">
                        <CheckCircle2 className="mr-0.5 h-3 w-3" />
                        Generated
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-400">{report.description}</p>
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      loading={generating === report.id}
                      onClick={() => handleGenerate(report.id)}
                    >
                      <Download className="h-3.5 w-3.5" />
                      Generate & Download
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => window.print()}>
                      <Printer className="h-3.5 w-3.5" />
                      Print
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-5">
        <CardHeader title="Quick Preview" subtitle={`As of ${formatDateTime(new Date().toISOString())}`} />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-xs uppercase tracking-wider text-slate-500">
                <th className="pb-3 pr-4 font-medium">Metric</th>
                <th className="pb-3 pr-4 font-medium">Value</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr>
                <td className="py-3 pr-4 text-slate-300">Vehicle</td>
                <td className="py-3 pr-4 text-white">{currentVehicle?.name || '—'}</td>
                <td className="py-3">
                  <Badge status={currentVehicle?.status || 'idle'}>
                    {currentVehicle?.status || '—'}
                  </Badge>
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-slate-300">Health Score</td>
                <td className="py-3 pr-4 text-white">{currentVehicle?.health ?? '—'}%</td>
                <td className="py-3">
                  <Badge status={(currentVehicle?.health ?? 0) >= 80 ? 'active' : 'warning'}>
                    {(currentVehicle?.health ?? 0) >= 80 ? 'Good' : 'Needs Attention'}
                  </Badge>
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-slate-300">Active Alerts</td>
                <td className="py-3 pr-4 text-white">
                  {alerts.filter((a) => a.status === 'active').length}
                </td>
                <td className="py-3">
                  <Badge
                    status={
                      alerts.some((a) => a.severity === 'critical' && a.status === 'active')
                        ? 'critical'
                        : 'info'
                    }
                  >
                    {alerts.some((a) => a.severity === 'critical' && a.status === 'active')
                      ? 'Critical Present'
                      : 'Managed'}
                  </Badge>
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-slate-300">Open Work Orders</td>
                <td className="py-3 pr-4 text-white">
                  {tasks.filter((t) => t.status !== 'completed' && t.status !== 'cancelled').length}
                </td>
                <td className="py-3">
                  <Badge status="scheduled">In Queue</Badge>
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-slate-300">Next Service</td>
                <td className="py-3 pr-4 text-white">
                  {currentVehicle ? formatDate(currentVehicle.nextService) : '—'}
                </td>
                <td className="py-3">
                  <Badge status="preventive">Scheduled</Badge>
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-slate-300">Est. Monthly Cost</td>
                <td className="py-3 pr-4 text-white">
                  {formatCurrency(summary?.estimatedMonthlyCost ?? 0)}
                </td>
                <td className="py-3">
                  <Badge status="info">Projected</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
