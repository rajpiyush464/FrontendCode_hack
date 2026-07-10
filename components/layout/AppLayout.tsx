import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { vehicleActions } from '../../store/slices/vehicleSlice';
import { telemetryActions } from '../../store/slices/telemetrySlice';
import { chartActions } from '../../store/slices/chartSlice';
import { alertActions } from '../../store/slices/alertSlice';
import { maintenanceActions } from '../../store/slices/maintenanceSlice';
import { useAlertSound } from '../../hooks/useAlertSound';
import { motion, AnimatePresence } from 'framer-motion';

const pageMeta: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Vehicle Dashboard', subtitle: 'Real-time predictive vehicle health monitoring' },
  '/analytics': { title: 'Data Analytics', subtitle: 'Fleet performance insights and trends' },
  '/maintenance': { title: 'Maintenance Hub', subtitle: 'Predictive + preventive maintenance management' },
  '/reports': { title: 'Reports', subtitle: 'Generate and export fleet reports' },
  '/calibration': { title: 'Sensor Calibration', subtitle: 'Calibrate and validate vehicle sensors' },
  '/camera': { title: 'Camera Scan', subtitle: 'Visual inspection and damage detection' },
};

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const selectedVehicleId = useAppSelector((s) => s.vehicle.selectedVehicleId);
  const activeAlerts = useAppSelector(
    (s) => s.alert.alerts.filter((a) => a.status === 'active').length
  );
  useAlertSound();

  useEffect(() => {
    dispatch(vehicleActions.fetchVehiclesRequest());
    dispatch(vehicleActions.fetchStatsRequest());
    dispatch(alertActions.fetchAlertsRequest(undefined));
    dispatch(maintenanceActions.fetchSummaryRequest());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedVehicleId) return;

    dispatch(vehicleActions.fetchVehicleRequest(selectedVehicleId));
    dispatch(vehicleActions.fetchHealthRequest(selectedVehicleId));
    dispatch(telemetryActions.fetchTelemetryRequest(selectedVehicleId));
    dispatch(telemetryActions.startPolling(selectedVehicleId));
    dispatch(chartActions.fetchAllChartsRequest({ vehicleId: selectedVehicleId }));
    dispatch(alertActions.fetchAlertsRequest(selectedVehicleId));
    dispatch(maintenanceActions.fetchMaintenanceRequest(selectedVehicleId));
    dispatch(maintenanceActions.fetchPredictionsRequest(selectedVehicleId));
    dispatch(chartActions.fetchAnalyticsRequest({ vehicleId: selectedVehicleId }));

    return () => {
      dispatch(telemetryActions.stopPolling());
    };
  }, [dispatch, selectedVehicleId]);

  const handleRefresh = () => {
    if (!selectedVehicleId) return;
    dispatch(vehicleActions.fetchVehicleRequest(selectedVehicleId));
    dispatch(vehicleActions.fetchHealthRequest(selectedVehicleId));
    dispatch(telemetryActions.fetchTelemetryRequest(selectedVehicleId));
    dispatch(chartActions.fetchAllChartsRequest({ vehicleId: selectedVehicleId }));
    dispatch(alertActions.fetchAlertsRequest(undefined));
    dispatch(maintenanceActions.fetchMaintenanceRequest(selectedVehicleId));
    dispatch(maintenanceActions.fetchPredictionsRequest(selectedVehicleId));
    dispatch(chartActions.fetchAnalyticsRequest({ vehicleId: selectedVehicleId }));
    dispatch(vehicleActions.fetchStatsRequest());
  };

  const meta = pageMeta[location.pathname] || pageMeta['/'];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/5 via-slate-50 to-slate-100 dark:from-cyan-900/10 dark:via-slate-950 dark:to-slate-950" />
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      />

      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
        alertCount={activeAlerts}
      />

      <div
        className="relative transition-all duration-250"
        style={{ marginLeft: collapsed ? 72 : 260 }}
      >
        <Header title={meta.title} subtitle={meta.subtitle} onRefresh={handleRefresh} />
        <main className="p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
