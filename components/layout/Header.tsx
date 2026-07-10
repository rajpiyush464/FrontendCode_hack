import { Bell, Search, RefreshCw, Sun, Moon, X, Check, ShieldAlert, Sparkles } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { formatRelative } from '../../utils/format';
import { useTheme } from '../../hooks/useTheme';
import { alertActions } from '../../store/slices/alertSlice';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
}

export function Header({ title, subtitle, onRefresh }: HeaderProps) {
  const dispatch = useAppDispatch();
  const { currentVehicle } = useAppSelector((s) => s.vehicle);
  const { alerts } = useAppSelector((s) => s.alert);
  const { tasks } = useAppSelector((s) => s.maintenance);
  const { theme, toggleTheme } = useTheme();

  const activeAlerts = alerts.filter((a) => a.status === 'active');
  const [now, setNow] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  // States for search and notification center
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Close search / notification dropdown on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setRefreshing(true);
    onRefresh();
    setTimeout(() => setRefreshing(false), 800);
  };

  // Perform multi-metric live fuzzy search across active alerts and maintenance tasks
  const matchedAlerts = searchQuery
    ? alerts.filter(
        (a) =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (a.category && a.category.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  const matchedTasks = searchQuery
    ? tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.component.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const totalResults = matchedAlerts.length + matchedTasks.length;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-950/80">
      <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-800 dark:text-white sm:text-xl">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Active vehicle preview */}
          {currentVehicle && (
            <div className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              <span className="font-semibold">{currentVehicle.name}</span>
            </div>
          )}

          {/* Interactive Search Bar */}
          <div ref={searchRef} className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search alerts, tasks..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="w-48 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-8 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 lg:w-60"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-3 w-3" />
              </button>
            )}

            {/* Floating Glassmorphic Search Results Panel */}
            <AnimatePresence>
              {showSearchResults && searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.08] dark:bg-slate-900/95 backdrop-blur-2xl shadow-2xl"
                >
                  <div className="p-3 border-b border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      Search Results ({totalResults})
                    </span>
                    <button onClick={() => setShowSearchResults(false)} className="text-slate-400 hover:text-white">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto p-2 space-y-1.5">
                    {matchedAlerts.length > 0 && (
                      <div>
                        <p className="px-2 py-1 text-[9px] font-semibold text-rose-400 uppercase">Alerts</p>
                        {matchedAlerts.map((a) => (
                          <div
                            key={a.id}
                            className="p-2 rounded-lg hover:bg-white/10 dark:hover:bg-slate-800/80 transition-colors cursor-pointer text-left"
                            onClick={() => {
                              setSearchQuery('');
                              setShowSearchResults(false);
                            }}
                          >
                            <p className="text-xs font-semibold text-slate-100">{a.title}</p>
                            <p className="text-[10px] text-slate-400 truncate">{a.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {matchedTasks.length > 0 && (
                      <div>
                        <p className="px-2 py-1 text-[9px] font-semibold text-violet-400 uppercase">Maintenance</p>
                        {matchedTasks.map((t) => (
                          <div
                            key={t.id}
                            className="p-2 rounded-lg hover:bg-white/10 dark:hover:bg-slate-800/80 transition-colors cursor-pointer text-left"
                            onClick={() => {
                              setSearchQuery('');
                              setShowSearchResults(false);
                            }}
                          >
                            <p className="text-xs font-semibold text-slate-100">{t.title}</p>
                            <p className="text-[10px] text-slate-400 truncate">{t.component} · {t.type}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {totalResults === 0 && (
                      <p className="py-4 text-center text-xs text-slate-400">No matches found for "{searchQuery}"</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme switcher toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            )}
          </Button>

          {/* Interactive Bell Icon & Notification center dropdown panel */}
          <div ref={notificationsRef} className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
              title="Notification center"
            >
              <Bell className="h-4 w-4 text-slate-600 dark:text-slate-100" />
              {activeAlerts.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
                  {activeAlerts.length}
                </span>
              )}
            </Button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.08] dark:bg-slate-900/95 backdrop-blur-2xl shadow-2xl"
                >
                  <div className="p-3 border-b border-white/10 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-white">Active Notifications</span>
                    <Badge status="critical">{activeAlerts.length} Active</Badge>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-white/5 p-1">
                    {activeAlerts.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400">
                        <Sparkles className="mx-auto mb-2 h-5 w-5 text-emerald-400" />
                        All systems operational. No active alerts.
                      </div>
                    ) : (
                      activeAlerts.map((alert) => (
                        <div key={alert.id} className="p-2.5 hover:bg-white/5 transition-colors text-left">
                          <div className="flex items-start justify-between gap-2">
                            <span className="flex items-center gap-1.5 text-xs font-bold text-slate-100">
                              <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
                              {alert.title}
                            </span>
                            <span className="text-[9px] text-slate-400">{formatRelative(alert.timestamp)}</span>
                          </div>
                          <p className="mt-1 text-[10px] text-slate-300 leading-normal">{alert.message}</p>
                          <div className="mt-2 flex gap-1.5">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                dispatch(alertActions.acknowledgeAlertRequest(alert.id));
                              }}
                              className="h-6 px-2 text-[9px]"
                            >
                              Ack
                            </Button>
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => {
                                dispatch(alertActions.resolveAlertRequest(alert.id));
                              }}
                              className="h-6 px-2 text-[9px]"
                            >
                              <Check className="h-2.5 w-2.5" />
                              Resolve
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {onRefresh && (
            <Button variant="secondary" size="sm" onClick={handleRefresh} loading={refreshing}>
              <RefreshCw className="h-3.5 w-3.5 text-slate-600 dark:text-slate-100" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          )}

          <span className="hidden text-[11px] tabular-nums text-slate-500 lg:inline">
            {now.toLocaleTimeString()}
          </span>
        </div>
      </div>
    </header>
  );
}
export default Header;
