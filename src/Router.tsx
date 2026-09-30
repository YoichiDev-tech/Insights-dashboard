import { createBrowserRouter, Navigate } from 'react-router-dom';
import DashboardLayout from './routes/DashboardLayout';
import LoginPage from './routes/LoginPage';
import OverviewPage from './routes/OverviewPage';
import TrafficPage from './routes/TrafficPage';
import EngagementPage from './routes/EngagementPage';
import SourcesPage from './routes/SourcesPage';
import PagesPage from './routes/PagesPage';
import InteractionsPage from './routes/InteractionsPage';
import FunnelsPage from './routes/FunnelsPage';
import LeadsPage from './routes/LeadsPage';
import ReportsPage from './routes/ReportsPage';
import LiveFeedPage from './routes/LiveFeedPage';
import SystemHealthPage from './routes/SystemHealthPage';

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Navigate to="/overview" replace /> },
      { path: 'overview', element: <OverviewPage /> },
      { path: 'traffic', element: <TrafficPage /> },
      { path: 'engagement', element: <EngagementPage /> },
      { path: 'sources', element: <SourcesPage /> },
      { path: 'pages', element: <PagesPage /> },
      { path: 'interactions', element: <InteractionsPage /> },
      { path: 'clicks', element: <Navigate to="/interactions" replace /> },
      { path: 'funnels', element: <FunnelsPage /> },
      { path: 'leads', element: <LeadsPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'live-feed', element: <LiveFeedPage /> },
      { path: 'system-health', element: <SystemHealthPage /> },
      { path: '*', element: <Navigate to="/overview" replace /> },
    ],
  },
]);

export default router;
