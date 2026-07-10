import { useState, useRef } from 'react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import {
  Camera,
  Upload,
  Scan,
  CheckCircle2,
  AlertTriangle,
  Image as ImageIcon,
  Sparkles,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { useAppSelector } from '../hooks/redux';

interface ScanResult {
  id: string;
  area: string;
  severity: 'none' | 'minor' | 'moderate' | 'severe';
  confidence: number;
  description: string;
}

const mockResults: ScanResult[] = [
  {
    id: '1',
    area: 'Front Bumper',
    severity: 'minor',
    confidence: 92,
    description: 'Minor scuff marks detected on lower left bumper edge',
  },
  {
    id: '2',
    area: 'Driver Door',
    severity: 'none',
    confidence: 97,
    description: 'No damage detected — panel integrity normal',
  },
  {
    id: '3',
    area: 'Rear Quarter Panel',
    severity: 'moderate',
    confidence: 88,
    description: 'Dent approximately 4cm diameter with paint crack',
  },
  {
    id: '4',
    area: 'Windshield',
    severity: 'minor',
    confidence: 85,
    description: 'Hairline chip detected near passenger-side wiper arc',
  },
  {
    id: '5',
    area: 'Hood',
    severity: 'none',
    confidence: 99,
    description: 'Surface clear — no anomalies found',
  },
];

export default function CameraScan() {
  const { currentVehicle } = useAppSelector((s) => s.vehicle);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<ScanResult[] | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const startScan = () => {
    setScanning(true);
    setResults(null);
    setProgress(0);

    let p = 0;
    const interval = setInterval(() => {
      p += 5 + Math.random() * 10;
      if (p >= 100) {
        clearInterval(interval);
        setProgress(100);
        setScanning(false);
        setResults(mockResults);
      } else {
        setProgress(Math.min(99, p));
      }
    }, 200);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setResults(null);
  };

  const clearPreview = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setResults(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const severityColor = {
    none: 'completed',
    minor: 'warning',
    moderate: 'high',
    severe: 'critical',
  } as const;

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-600/20">
              <Camera className="h-6 w-6 text-violet-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">AI Visual Inspection</h2>
              <p className="text-sm text-slate-400">
                Damage detection for {currentVehicle?.name || 'selected vehicle'}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => fileRef.current?.click()}>
              <Upload className="h-4 w-4" />
              Upload Image
            </Button>
            <Button onClick={startScan} loading={scanning} disabled={scanning}>
              <Scan className="h-4 w-4" />
              {scanning ? 'Scanning...' : 'Start AI Scan'}
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="overflow-hidden p-0">
          <div className="relative flex min-h-[320px] items-center justify-center bg-slate-900/80">
            {preview ? (
              <>
                <img src={preview} alt="Scan preview" className="max-h-[400px] w-full object-contain" />
                <button
                  onClick={clearPreview}
                  className="absolute right-3 top-3 rounded-full bg-slate-900/80 p-1.5 text-slate-300 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 p-8 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-dashed border-slate-600 bg-slate-800/50">
                  <ImageIcon className="h-8 w-8 text-slate-600" />
                </div>
                <p className="text-sm text-slate-400">
                  Upload a vehicle photo or run scan with camera feed simulation
                </p>
                <p className="text-xs text-slate-600">Supports JPG, PNG · Max 10MB</p>
              </div>
            )}

            {scanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-sm">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                  className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-violet-500/30 border-t-violet-400"
                >
                  <Sparkles className="h-6 w-6 text-violet-400" />
                </motion.div>
                <p className="text-sm font-medium text-violet-300">AI analyzing vehicle surfaces...</p>
                <div className="mt-3 w-48">
                  <ProgressBar value={progress} size="sm" color="bg-violet-500" />
                </div>
              </div>
            )}

            {/* Scan line animation overlay when scanning */}
            {scanning && (
              <motion.div
                className="pointer-events-none absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-violet-400 to-transparent"
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
              />
            )}
          </div>
        </Card>

        <Card className="p-4 sm:p-5">
          <CardHeader
            title="Scan Results"
            subtitle={results ? `${results.length} areas analyzed` : 'Run a scan to detect damage'}
          />
          <AnimatePresence mode="wait">
            {!results ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 text-slate-500"
              >
                <Scan className="mb-3 h-10 w-10 opacity-30" />
                <p className="text-sm">No scan results yet</p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2.5"
              >
                {results.map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={cn(
                      'rounded-xl border border-slate-700/50 bg-slate-800/40 p-3.5',
                      r.severity === 'severe' && 'border-rose-500/30',
                      r.severity === 'moderate' && 'border-orange-500/30'
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {r.severity === 'none' ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <AlertTriangle
                            className={cn(
                              'h-4 w-4',
                              r.severity === 'minor' && 'text-amber-400',
                              r.severity === 'moderate' && 'text-orange-400',
                              r.severity === 'severe' && 'text-rose-400'
                            )}
                          />
                        )}
                        <p className="text-sm font-medium text-slate-100">{r.area}</p>
                      </div>
                      <Badge status={severityColor[r.severity]}>{r.severity}</Badge>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-400">{r.description}</p>
                    <div className="mt-2">
                      <ProgressBar
                        value={r.confidence}
                        label="AI confidence"
                        size="sm"
                        color="bg-violet-500"
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Clean Areas', value: results?.filter((r) => r.severity === 'none').length ?? '—', color: 'text-emerald-400' },
          { label: 'Minor Issues', value: results?.filter((r) => r.severity === 'minor').length ?? '—', color: 'text-amber-400' },
          { label: 'Needs Repair', value: results?.filter((r) => r.severity === 'moderate' || r.severity === 'severe').length ?? '—', color: 'text-rose-400' },
        ].map((stat) => (
          <Card key={stat.label} className="p-4 text-center">
            <p className={cn('text-3xl font-bold', stat.color)}>{stat.value}</p>
            <p className="mt-1 text-xs text-slate-400">{stat.label}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
