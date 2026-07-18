
import {
  Battery,
  Zap,
  Gauge,
  AlertTriangle,
  Wrench,
  HeartPulse,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { chartActions } from '../store/slices/chartSlice';
import { alertActions } from '../store/slices/alertSlice';
import { MetricCard } from '../components/ui/MetricCard';
import { Card, CardHeader } from '../components/ui/Card';
import { VehicleInfoCard } from '../components/dashboard/VehicleInfoCard';
import { TelemetryChart } from '../components/dashboard/TelemetryChart';
import { AlertsPanel } from '../components/dashboard/AlertsPanel';
import { RpmGauge } from '../components/dashboard/RpmGauge';
import { MaintenanceList, PredictionsPanel } from '../components/dashboard/MaintenanceCard';
import { maintenanceActions } from '../store/slices/maintenanceSlice';
import { useAlertSound } from '../hooks/useAlertSound';
import type { ChartMetric } from '../types';
import { THRESHOLDS } from '../utils/mockData';
import { useTelemetrySocket } from '../hooks/useTelemetrySocket';
import React from 'react';

function metricStatus(
  value: number,
  warningMax?: number,
  criticalMax?: number,
  warningMin?: number,
  criticalMin?: number
): 'normal' | 'warning' | 'critical' {
  if (criticalMax !== undefined && value >= criticalMax) return 'critical';
  if (criticalMin !== undefined && value <= criticalMin) return 'critical';
  if (warningMax !== undefined && value >= warningMax) return 'warning';
  if (warningMin !== undefined && value <= warningMin) return 'warning';
  return 'normal';
}

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { currentVehicle, health } = useAppSelector((s) => s.vehicle);
  const { live } = useAppSelector((s) => s.telemetry);
  const { voltage, current, temperature, expandedChart, status: chartStatus } = useAppSelector(
    (s) => s.chart
  );
  const { alerts } = useAppSelector((s) => s.alert);
  const { tasks, predictions } = useAppSelector((s) => s.maintenance);
  const { soundEnabled, volume, setVolume, toggleSound } = useAlertSound();

  // 🎙️ STEP 1: INTEGRATED SCI-FI VOICE NARRATOR ENGINE LOOP
  React.useEffect(() => {
    if ('speechSynthesis' in window) {
      // Clear out running audio cues to block stack delays
      window.speechSynthesis.cancel();

      const targetVehicleId = currentVehicle?.id || 'EV-001';
      const welcomePhrase = `Welcome to dashboard page. System online. Diagnostics streaming for vehicle ${targetVehicleId}.`;
      
      const utterance = new SpeechSynthesisUtterance(welcomePhrase);
      utterance.rate = 1.05; // Fast, snappy, advanced computer AI pace
      utterance.pitch = 1.0;  // Balanced system pitch

      // Optional voice selector hookup
      const voices = window.speechSynthesis.getVoices();
      const systemVoice = voices.find(v => v.lang.includes('en')) || voices[0];
      if (systemVoice) utterance.voice = systemVoice;

      window.speechSynthesis.speak(utterance);
    }
  }, [currentVehicle?.id]);

  // Alert Fetch Hook
  React.useEffect(() => {
    const targetVehicleId = currentVehicle?.id || 'EV-001';
    dispatch(alertActions.fetchAlertsRequest(targetVehicleId));
  }, [dispatch, currentVehicle?.id]);

  const onExpand = (metric: ChartMetric | null) => {
    dispatch(chartActions.setExpandedChart(metric));
  };

  // Start WebSocket connection for live telemetry
  useTelemetrySocket(currentVehicle?.id ?? 'EV-001');

  const onResolveAllAlerts = () => {
    dispatch(alertActions.resolveAllAlertsRequest());
  };

  // 🛠️ STEP 2: PARSE THE DECIMAL METRIC VALUES CLEANLY 
  const displayHealth = currentVehicle?.health 
    ? Number(currentVehicle.health).toFixed(1) 
    : '—';

  return (
    <div className="space-y-5">
      {/* Integrated diagnostic key metrics (Single Vehicle focused) */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-6">
        <MetricCard
          title="Vehicle Health"
          value={displayHealth} // Cleaned up: displays as "8.1" instead of "8.090000000"
          unit="%"
          icon={HeartPulse}
          status={(currentVehicle?.health ?? 0) < 70 ? 'warning' : 'normal'}
        />
        <MetricCard
          title="Battery Charge"
          value={currentVehicle?.battery ?? '—'}
          unit="%"
          icon={Battery}
          status={(currentVehicle?.battery ?? 0) < 20 ? 'critical' : 'normal'}
        />
        <MetricCard
          title="Active Alerts"
          value={alerts.filter((a) => a.status === 'active').length}
          icon={AlertTriangle}
          status={
            alerts.some((a) => a.severity === 'critical' && a.status === 'active')
              ? 'critical'
              : 'normal'
          }
        />
        <MetricCard
          title="Predictive RUL"
          value="18"
          unit="days"
          icon={Wrench}
          status="warning"
          subtitle="Cooling Pump Service"
        />
        <MetricCard
          title="Voltage State"
          value={live ? live.voltage.toFixed(1) : '—'}
          unit="V"
          icon={Zap}
          status={
            live
              ? metricStatus(
                  live.voltage,
                  THRESHOLDS.voltage.warningMax,
                  THRESHOLDS.voltage.criticalMax,
                  THRESHOLDS.voltage.warningMin,
                  THRESHOLDS.voltage.criticalMin
                )
              : 'normal'
          }
        />
        <MetricCard
          title="Odometer"
          value={(currentVehicle?.mileage ?? 0).toLocaleString()}
          unit="km"
          icon={Gauge}
        />
      </div>

      {/* Vehicle Render + Diagnosis details */}
      <VehicleInfoCard vehicle={currentVehicle} health={health} />

      {/* Charts + Alerts */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          {(!expandedChart || expandedChart === 'voltage') && (
            <TelemetryChart
              series={voltage}
              loading={chartStatus === 'loading' && !voltage}
              warningThreshold={THRESHOLDS.voltage.warningMin}
              criticalThreshold={THRESHOLDS.voltage.criticalMin}
              expanded={expandedChart === 'voltage'}
              onExpand={onExpand}
            />
          )}
          {(!expandedChart || expandedChart === 'temperature') && (
            <TelemetryChart
              series={temperature}
              loading={chartStatus === 'loading' && !temperature}
              warningThreshold={THRESHOLDS.temperature.warningMax}
              criticalThreshold={THRESHOLDS.temperature.criticalMax}
              expanded={expandedChart === 'temperature'}
              onExpand={onExpand}
            />
          )}
          {(!expandedChart || expandedChart === 'current') && (
            <TelemetryChart
              series={current}
              loading={chartStatus === 'loading' && !current}
              warningThreshold={THRESHOLDS.current.warningMax}
              criticalThreshold={THRESHOLDS.current.criticalMax}
              expanded={expandedChart === 'current'}
              onExpand={onExpand}
            />
          )}
        </div>

        <div className="space-y-4">
          <RpmGauge
            rpm={live?.rpm ?? 0}
            odometer={currentVehicle?.mileage ?? 0}
          />
          <AlertsPanel
            alerts={alerts.filter((a) => a.status === 'active')}
            soundEnabled={soundEnabled}
            volume={volume}
            onSetVolume={setVolume}
            onToggleSound={toggleSound}
            onAcknowledge={(id) => dispatch(alertActions.acknowledgeAlertRequest(id))}
            onResolve={(id) => dispatch(alertActions.resolveAlertRequest(id))}
            onResolveAll={onResolveAllAlerts}
            compact
          />
        </div>
      </div>

      {/* Maintenance section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-4 sm:p-5">
          <CardHeader
            title="Maintenance Queue"
            subtitle="Predictive + preventive + corrective tasks"
          />
          <MaintenanceList
            tasks={tasks}
            compact
            onUpdateStatus={(taskId, status) =>
              dispatch(maintenanceActions.updateTaskStatusRequest({ taskId, status }))
            }
          />
        </Card>
        <PredictionsPanel predictions={predictions} />
      </div>
    </div>
  );
}