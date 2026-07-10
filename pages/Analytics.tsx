import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { useAppSelector } from '../hooks/redux';
import { Card, CardHeader } from '../components/ui/Card';
import { MetricCard } from '../components/ui/MetricCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import {
  TrendingUp,
  Clock,
  DollarSign,
  Fuel,
  Activity,
  Timer,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { formatCurrency } from '../utils/format';

const PIE_COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#f43f5e', '#3b82f6'];
const TYPE_COLORS = { Predictive: '#8b5cf6', Preventive: '#06b6d4', Corrective: '#f59e0b' };

export default function Analytics() {
  const { analytics, analyticsStatus } = useAppSelector((s) => s.chart);

  if (analyticsStatus === 'loading' && !analytics) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="py-20 text-center text-slate-500">No analytics data available</div>
    );
  }

  const healthTrend = analytics.healthTrend.map((d) => ({
    ...d,
    date: format(parseISO(d.timestamp), 'MMM d'),
  }));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        <MetricCard
          title="Efficiency Score"
          value={analytics.efficiencyScore.toFixed(1)}
          unit="/100"
          icon={TrendingUp}
          trend="up"
          trendValue="+2.1"
        />
        <MetricCard
          title="Downtime"
          value={analytics.downtimeHours.toFixed(1)}
          unit="hrs"
          icon={Clock}
          status={analytics.downtimeHours > 20 ? 'warning' : 'normal'}
        />
        <MetricCard
          title="Maint. Cost"
          value={formatCurrency(analytics.maintenanceCost)}
          icon={DollarSign}
        />
        <MetricCard
          title="Energy Eff."
          value={analytics.fuelEfficiency.toFixed(1)}
          unit="km/kWh"
          icon={Fuel}
        />
        <MetricCard
          title="Utilization"
          value={analytics.utilizationRate.toFixed(1)}
          unit="%"
          icon={Activity}
        />
        <MetricCard
          title="MTBF / MTTR"
          value={`${analytics.mtbf}h`}
          subtitle={`MTTR ${analytics.mttr}h`}
          icon={Timer}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-4 sm:p-5">
          <CardHeader title="Health Trend" subtitle="30-day overall vehicle health" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[70, 100]} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  name="Health %"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  dot={false}
                  animationDuration={800}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 sm:p-5">
          <CardHeader title="Monthly Maintenance Costs" subtitle="By maintenance type" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.monthlyCosts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="predictive" name="Predictive" stackId="a" fill="#8b5cf6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="preventive" name="Preventive" stackId="a" fill="#06b6d4" />
                <Bar dataKey="corrective" name="Corrective" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 sm:p-5">
          <CardHeader title="Alerts by Category" subtitle="Distribution of alert types" />
          <div className="flex h-64 items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.alertsByCategory}
                  dataKey="count"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  animationDuration={800}
                >
                  {analytics.alertsByCategory.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 sm:p-5">
          <CardHeader title="Component Health Radar" subtitle="Multi-system health scores" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={analytics.componentHealth}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="component" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 9 }} />
                <Radar
                  name="Health"
                  dataKey="health"
                  stroke="#22d3ee"
                  fill="#22d3ee"
                  fillOpacity={0.25}
                  animationDuration={800}
                />
                <Tooltip
                  contentStyle={{
                    background: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-4 sm:p-5">
        <CardHeader title="Maintenance Type Breakdown" subtitle="Work order distribution" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {analytics.maintenanceByType.map((item) => (
            <div
              key={item.type}
              className="rounded-xl border border-slate-700/50 bg-slate-800/40 p-4 text-center"
            >
              <div
                className="mx-auto mb-2 h-3 w-3 rounded-full"
                style={{ background: TYPE_COLORS[item.type as keyof typeof TYPE_COLORS] || '#64748b' }}
              />
              <p className="text-2xl font-bold text-white">{item.count}</p>
              <p className="text-xs text-slate-400">{item.type}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
