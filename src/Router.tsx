import { createBrowserRouter } from 'react-router-dom';

import DashboardLayout from './routes/DashboardLayout';
import OverviewPage from './routes/OverviewPage';
import TrafficPage from './routes/TrafficPage';
import EngagementPage from './routes/EngagementPage';
import SourcesPage from './routes/SourcesPage';
import SystemHealthPage from './routes/SystemHealthPage';
import PagesPage from './routes/PagesPage';
import InteractionsPage from './routes/InteractionsPage';
import ReportsPage from './routes/ReportsPage';
import LiveFeedPage from './routes/LiveFeedPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <OverviewPage /> },
      { path: 'overview', element: <OverviewPage /> },
      { path: 'traffic', element: <TrafficPage /> },
      { path: 'engagement', element: <EngagementPage /> },
      { path: 'sources', element: <SourcesPage /> },
      { path: 'pages', element: <PagesPage /> },
      { path: 'interactions', element: <InteractionsPage /> },
      { path: 'clicks', element: <InteractionsPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'live-feed', element: <LiveFeedPage /> },
      { path: 'system-health', element: <SystemHealthPage /> }
    ]
  }
]);

export default router;
