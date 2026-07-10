import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  Wrench,
  FileText,
  Crosshair,
  Camera,
  ChevronLeft,
  ChevronRight,
  Activity,
  Zap,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';
const navItems = [
  { to: '/predictive-insights', label: 'Predictive Insights', icon: Activity }, // ✅ new item
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/maintenance', label: 'Maintenance', icon: Wrench },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/calibration', label: 'Calibration', icon: Crosshair },
  { to: '/camera', label: 'Camera Scan', icon: Camera },
];


interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  alertCount?: number;
}

export function Sidebar({ collapsed, onToggle, alertCount = 0 }: SidebarProps) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-slate-200 bg-white shadow-lg shadow-slate-200/20 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/95 dark:shadow-none"
    >
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-4 dark:border-slate-800/80">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/30">
          <Zap className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-w-0"
          >
            <p className="truncate text-sm font-bold tracking-tight text-slate-800 dark:text-white">
              DriveCare AI
            </p>
            <p className="truncate text-[10px] text-slate-500">
              Predictive Maintenance
            </p>
          </motion.div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/10 text-cyan-700 shadow-inner dark:text-cyan-300'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-200'
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-cyan-400"
                  />
                )}
                <item.icon className={cn('h-5 w-5 shrink-0', isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400')} />
                {!collapsed && <span className="truncate">{item.label}</span>}
                {item.to === '/' && alertCount > 0 && (
                  <span
                    className={cn(
                      'flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white',
                      collapsed ? 'absolute -right-1 -top-1' : 'ml-auto'
                    )}
                  >
                    {alertCount > 9 ? '9+' : alertCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-3 dark:border-slate-800/80">
        {!collapsed && (
          <div className="mb-3 rounded-xl border border-emerald-500/10 bg-emerald-50 p-3 dark:border-emerald-500/20 dark:bg-emerald-500/5">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                System Online
              </span>
            </div>
            <p className="mt-1 text-[10px] text-slate-500">
              All sensors connected · API healthy
            </p>
          </div>
        )}
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:border-slate-700/60 dark:bg-slate-800/40 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              Collapse
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
export default Sidebar;
