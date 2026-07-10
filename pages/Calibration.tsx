import { useState } from 'react';
import { useAppSelector } from '../hooks/redux';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import {
  Crosshair,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Play,
  Thermometer,
  Zap,
  Gauge,
  Battery,
  Wind,
} from 'lucide-react';
import { cn } from '../utils/cn';
import { motion } from 'framer-motion';

interface Sensor {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'calibrated' | 'needs_calibration' | 'calibrating' | 'error';
  lastCalibrated: string;
  deviation: number;
  target: string;
  current: string;
  progress: number;
}

const initialSensors: Sensor[] = [
  {
    id: 'volt',
    name: 'Voltage Sensor',
    icon: Zap,
    status: 'calibrated',
    lastCalibrated: '2026-06-28',
    deviation: 0.2,
    target: '400.0 V',
    current: '400.8 V',
    progress: 100,
  },
  {
    id: 'temp',
    name: 'Temperature Sensor',
    icon: Thermometer,
    status: 'needs_calibration',
    lastCalibrated: '2026-05-15',
    deviation: 2.8,
    target: '25.0 °C',
    current: '27.8 °C',
    progress: 0,
  },
  {
    id: 'current',
    name: 'Current Sensor',
    icon: Gauge,
    status: 'calibrated',
    lastCalibrated: '2026-06-20',
    deviation: 0.5,
    target: '0.0 A',
    current: '0.5 A',
    progress: 100,
  },
  {
    id: 'soc',
    name: 'Battery SOC Sensor',
    icon: Battery,
    status: 'needs_calibration',
    lastCalibrated: '2026-04-10',
    deviation: 3.1,
    target: '100%',
    current: '96.9%',
    progress: 0,
  },
  {
    id: 'tire',
    name: 'Tire Pressure Sensors',
    icon: Wind,
    status: 'calibrated',
    lastCalibrated: '2026-07-01',
    deviation: 0.3,
    target: '34.0 PSI',
    current: '33.7 PSI',
    progress: 100,
  },
  {
    id: 'coolant',
    name: 'Coolant Temp Sensor',
    icon: Thermometer,
    status: 'error',
    lastCalibrated: '2026-03-22',
    deviation: 5.4,
    target: '40.0 °C',
    current: '45.4 °C',
    progress: 0,
  },
];

export default function Calibration() {
  const { currentVehicle } = useAppSelector((s) => s.vehicle);
  const [sensors, setSensors] = useState(initialSensors);
  const [selected, setSelected] = useState<string | null>(null);

  const calibrate = (id: string) => {
    setSensors((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'calibrating' as const, progress: 0 } : s))
    );
    setSelected(id);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 8 + Math.random() * 12;
      if (progress >= 100) {
        clearInterval(interval);
        setSensors((prev) =>
          prev.map((s) =>
            s.id === id
              ? {
                  ...s,
                  status: 'calibrated' as const,
                  progress: 100,
                  deviation: Number((Math.random() * 0.4).toFixed(2)),
                  lastCalibrated: new Date().toISOString().slice(0, 10),
                  current: s.target,
                }
              : s
          )
        );
        setSelected(null);
      } else {
        setSensors((prev) =>
          prev.map((s) => (s.id === id ? { ...s, progress: Math.min(99, progress) } : s))
        );
      }
    }, 280);
  };

  const calibrateAll = () => {
    sensors
      .filter((s) => s.status !== 'calibrated' && s.status !== 'calibrating')
      .forEach((s, i) => {
        setTimeout(() => calibrate(s.id), i * 400);
      });
  };

  const needsCount = sensors.filter(
    (s) => s.status === 'needs_calibration' || s.status === 'error'
  ).length;

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20">
              <Crosshair className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Sensor Calibration</h2>
              <p className="text-sm text-slate-400">
                {currentVehicle?.name || 'Vehicle'} · {needsCount} sensor
                {needsCount !== 1 ? 's' : ''} need attention
              </p>
            </div>
          </div>
          <Button onClick={calibrateAll} disabled={needsCount === 0}>
            <Play className="h-4 w-4" />
            Calibrate All Pending
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sensors.map((sensor) => {
          const Icon = sensor.icon;
          return (
            <motion.div key={sensor.id} layout>
              <Card
                className={cn(
                  'p-5 transition-all',
                  sensor.status === 'calibrating' && 'ring-1 ring-cyan-500/40',
                  sensor.status === 'error' && 'ring-1 ring-rose-500/30'
                )}
                hover
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-xl',
                        sensor.status === 'calibrated' && 'bg-emerald-500/15 text-emerald-400',
                        sensor.status === 'needs_calibration' && 'bg-amber-500/15 text-amber-400',
                        sensor.status === 'calibrating' && 'bg-cyan-500/15 text-cyan-400',
                        sensor.status === 'error' && 'bg-rose-500/15 text-rose-400'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{sensor.name}</p>
                      <p className="text-xs text-slate-500">Last: {sensor.lastCalibrated}</p>
                    </div>
                  </div>
                  <Badge
                    status={
                      sensor.status === 'calibrated'
                        ? 'completed'
                        : sensor.status === 'error'
                          ? 'critical'
                          : sensor.status === 'calibrating'
                            ? 'in_progress'
                            : 'warning'
                    }
                    pulse={sensor.status === 'calibrating'}
                  >
                    {sensor.status.replace('_', ' ')}
                  </Badge>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-slate-800/50 p-2">
                    <p className="text-slate-500">Target</p>
                    <p className="font-mono text-slate-200">{sensor.target}</p>
                  </div>
                  <div className="rounded-lg bg-slate-800/50 p-2">
                    <p className="text-slate-500">Current</p>
                    <p className="font-mono text-slate-200">{sensor.current}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-slate-400">Deviation</span>
                    <span
                      className={cn(
                        'font-mono',
                        sensor.deviation > 2 ? 'text-amber-400' : 'text-emerald-400'
                      )}
                    >
                      ±{sensor.deviation}
                    </span>
                  </div>
                  {(sensor.status === 'calibrating' || sensor.progress > 0) && (
                    <ProgressBar
                      value={sensor.progress}
                      size="sm"
                      showValue={sensor.status === 'calibrating'}
                      color={sensor.status === 'calibrated' ? 'bg-emerald-500' : 'bg-cyan-500'}
                    />
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  {sensor.status !== 'calibrated' && sensor.status !== 'calibrating' && (
                    <Button size="sm" onClick={() => calibrate(sensor.id)} loading={selected === sensor.id}>
                      <Crosshair className="h-3.5 w-3.5" />
                      Calibrate
                    </Button>
                  )}
                  {sensor.status === 'calibrated' && (
                    <Button size="sm" variant="secondary" onClick={() => calibrate(sensor.id)}>
                      <RotateCcw className="h-3.5 w-3.5" />
                      Recalibrate
                    </Button>
                  )}
                  {sensor.status === 'calibrated' && (
                    <span className="ml-auto flex items-center gap-1 text-xs text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      OK
                    </span>
                  )}
                  {sensor.status === 'error' && (
                    <span className="ml-auto flex items-center gap-1 text-xs text-rose-400">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Fault
                    </span>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="p-5">
        <CardHeader
          title="Calibration Guidelines"
          subtitle="Best practices for accurate sensor readings"
        />
        <ul className="space-y-2 text-sm text-slate-400">
          <li className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
            Ensure the vehicle is stationary and powered on during calibration.
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
            Temperature sensors should be calibrated at ambient room temperature (20–25°C).
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
            Voltage/current sensors require a known reference load for zero-point calibration.
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
            Recalibrate after any battery pack service or major electrical work.
          </li>
        </ul>
      </Card>
    </div>
  );
}
