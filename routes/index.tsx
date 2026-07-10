import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import Dashboard from '../pages/Dashboard';
import Analytics from '../pages/Analytics';
import Maintenance from '../pages/Maintenance';
import Reports from '../pages/Reports';
import Calibration from '../pages/Calibration';
import CameraScan from '../pages/CameraScan';
import PredictiveInsightsPage from "../pages/PredictiveInsights";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> }, // ✅ Dashboard is landing page
      { path: 'predictive-insights', element: <PredictiveInsightsPage /> }, // ✅ separate route
      { path: 'analytics', element: <Analytics /> },
      { path: 'maintenance', element: <Maintenance /> },
      { path: 'reports', element: <Reports /> },
      { path: 'calibration', element: <Calibration /> },
      { path: 'camera', element: <CameraScan /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

export default router;
