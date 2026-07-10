// import { MapPin, Gauge, Calendar, User, Battery, ShieldCheck } from 'lucide-react';
// import { Card } from '../ui/Card';
// import { Badge } from '../ui/Badge';
// import { ProgressBar, CircularProgress } from '../ui/ProgressBar';
// import type { Vehicle, VehicleHealth } from '../../types';
// import { formatDate, formatNumber } from '../../utils/format';

// interface VehicleInfoCardProps {
//   vehicle: Vehicle | null;
//   health: VehicleHealth | null;
// }

// export function VehicleInfoCard({ vehicle, health }: VehicleInfoCardProps) {
//   if (!vehicle) {
//     return (
//       <Card className="p-5">
//         <div className="animate-pulse space-y-4">
//           <div className="h-6 w-40 rounded bg-slate-800" />
//           <div className="h-24 rounded bg-slate-800" />
//         </div>
//       </Card>
//     );
//   }

//   const healthItems = health
//     ? [
//         { label: 'Battery Unit', value: health.battery },
//         { label: 'Electric Motor', value: health.engine },
//         { label: 'Hydraulic Brakes', value: health.brakes },
//         { label: 'Tire Pressure', value: health.tires },
//         { label: 'Cooling Loop', value: health.cooling },
//         { label: 'Electrical Wiring', value: health.electrical },
//       ]
//     : [];

//   return (
//     <Card className="p-5" glow>
//       <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
//         {/* Real Vehicle Visual Render with custom glass border */}
//         {vehicle.imageUrl && (
//           <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-2xl border border-white/10 shadow-lg lg:w-72">
//             <img
//               src={vehicle.imageUrl}
//               alt={vehicle.name}
//               className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
//             />
//             {/* High-tech HUD layer on image */}
//             <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
//             <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
//               <span className="flex items-center gap-1 text-[10px] font-bold tracking-widest text-cyan-400 uppercase">
//                 <ShieldCheck className="h-3.5 w-3.5" />
//                 HUD ACTIVE
//               </span>
//               <span className="font-mono text-[9px] text-slate-300 bg-black/40 px-2 py-0.5 rounded backdrop-blur">
//                 EV-PROTO-1
//               </span>
//             </div>
//           </div>
//         )}

//         {/* Text and stats side */}
//         <div className="flex-1 space-y-4">
//           <div className="flex flex-col gap-4 sm:flex-row sm:items-start justify-between">
//             <div className="space-y-1">
//               <div className="flex flex-wrap items-center gap-2">
//                 <h2 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-white">
//                   {vehicle.name}
//                 </h2>
//                 <Badge status={vehicle.status} pulse={vehicle.status === 'active'}>
//                   {vehicle.status}
//                 </Badge>
//               </div>
//               <p className="text-sm text-slate-500 dark:text-slate-400">
//                 {vehicle.year} {vehicle.make} {vehicle.model}
//               </p>
//               <p className="font-mono text-xs text-slate-400 dark:text-slate-500">VIN: {vehicle.vin}</p>
//             </div>

//             {/* Quick circular status metrics */}
//             <div className="flex items-center gap-5">
//               <CircularProgress value={vehicle.health} label="Health" size={80} strokeWidth={6} />
//               <CircularProgress
//                 value={vehicle.battery}
//                 label="Charge"
//                 size={80}
//                 strokeWidth={6}
//                 color="#06b6d4"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
//             <InfoItem icon={MapPin} label="Location" value={vehicle.location} />
//             <InfoItem icon={Gauge} label="Mileage" value={`${formatNumber(vehicle.mileage, 0)} km`} />
//             <InfoItem icon={Battery} label="Power Type" value={vehicle.fuelType} />
//             <InfoItem icon={User} label="Driver" value={vehicle.driver || '—'} />
//             <InfoItem icon={Calendar} label="Last Service" value={formatDate(vehicle.lastService)} />
//             <InfoItem icon={Calendar} label="Next Service" value={formatDate(vehicle.nextService)} />
//           </div>
//         </div>
//       </div>

//       {healthItems.length > 0 && (
//         <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 border-t border-slate-200 pt-4 dark:border-slate-800">
//           {healthItems.map((item) => (
//             <ProgressBar key={item.label} label={item.label} value={item.value} size="sm" />
//           ))}
//         </div>
//       )}
//     </Card>
//   );
// }

// function InfoItem({
//   icon: Icon,
//   label,
//   value,
// }: {
//   icon: React.ComponentType<{ className?: string }>;
//   label: string;
//   value: string;
// }) {
//   return (
//     <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700/50 dark:bg-slate-800/40">
//       <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
//         <Icon className="h-3 w-3" />
//         <span className="text-[10px] uppercase tracking-wider">{label}</span>
//       </div>
//       <p className="mt-1 truncate text-xs font-semibold capitalize text-slate-800 dark:text-slate-200">
//         {value}
//       </p>
//     </div>
//   );
// }
import { MapPin, Gauge, Calendar, User, Battery, ShieldCheck } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar, CircularProgress } from '../ui/ProgressBar';
import type { Vehicle, VehicleHealth } from '../../types';
import { formatDate, formatNumber } from '../../utils/format';

interface VehicleInfoCardProps {
  vehicle: Vehicle | null;
  health: VehicleHealth | null;
}

export function VehicleInfoCard({ vehicle, health }: VehicleInfoCardProps) {
  if (!vehicle) {
    return (
      <Card className="p-5">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-40 rounded bg-slate-800" />
          <div className="h-24 rounded bg-slate-800" />
        </div>
      </Card>
    );
  }

  const healthItems = health
    ? [
        { label: 'Battery Unit', value: health.battery },
        { label: 'Electric Motor', value: health.engine },
        { label: 'Hydraulic Brakes', value: health.brakes },
        { label: 'Tire Pressure', value: health.tires },
        { label: 'Cooling Loop', value: health.cooling },
        { label: 'Electrical Wiring', value: health.electrical },
      ]
    : [];

  return (
    <Card className="p-5" glow>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        {/* Vehicle image */}
        {vehicle.imageUrl && (
          <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-2xl border border-white/10 shadow-lg lg:w-72">
            <img
              src={vehicle.imageUrl}
              alt={vehicle.name}
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="flex items-center gap-1 text-[10px] font-bold tracking-widest text-cyan-400 uppercase">
                <ShieldCheck className="h-3.5 w-3.5" />
                HUD ACTIVE
              </span>
              <span className="font-mono text-[9px] text-slate-300 bg-black/40 px-2 py-0.5 rounded backdrop-blur">
                EV-PROTO-1
              </span>
            </div>
          </div>
        )}

        {/* Text and stats */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start justify-between">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-white">
                  {vehicle.name}
                </h2>
                <Badge status={vehicle.status} pulse={vehicle.status === 'active'}>
                  {vehicle.status}
                </Badge>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </p>
              <p className="font-mono text-xs text-slate-400 dark:text-slate-500">VIN: {vehicle.vin}</p>
            </div>

            {/* Circular metrics */}
            <div className="flex items-center gap-5">
              <CircularProgress value={vehicle.health} label="Health" size={80} strokeWidth={6} />
              <CircularProgress
                value={vehicle.battery}
                label="Charge"
                size={80}
                strokeWidth={6}
                color="#06b6d4"
              />
              <CircularProgress
                value={vehicle.batteryHealth}
                label="Battery Health"
                size={80}
                strokeWidth={6}
                color="#f59e0b"
              />
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
            <InfoItem icon={MapPin} label="Location" value={vehicle.location} />
            <InfoItem icon={Gauge} label="Mileage" value={`${formatNumber(vehicle.mileage, 0)} km`} />
            <InfoItem icon={Battery} label="Power Type" value={vehicle.fuelType} />
            <InfoItem icon={User} label="Driver" value={vehicle.driver || '—'} />
            <InfoItem icon={Calendar} label="Last Service" value={formatDate(vehicle.lastService)} />
            <InfoItem icon={Calendar} label="Next Service" value={formatDate(vehicle.nextService)} />
          </div>
        </div>
      </div>

      {/* Component health breakdown */}
      {healthItems.length > 0 && (
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 border-t border-slate-200 pt-4 dark:border-slate-800">
          {healthItems.map((item) => (
            <ProgressBar key={item.label} label={item.label} value={item.value} size="sm" />
          ))}
        </div>
      )}
    </Card>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700/50 dark:bg-slate-800/40">
      <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
        <Icon className="h-3 w-3" />
        <span className="text-[10px] uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-1 truncate text-xs font-semibold capitalize text-slate-800 dark:text-slate-200">
        {value}
      </p>
    </div>
  );
}
