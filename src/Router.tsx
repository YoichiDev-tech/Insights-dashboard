import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import DashboardLayout from './routes/DashboardLayout';
import OverviewPage from './routes/OverviewPage';
import TrafficPage from './routes/TrafficPage';
import EngagementPage from './routes/EngagementPage';
import SourcesPage from './routes/SourcesPage';
import SystemHealthPage from './routes/SystemHealthPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { path: '/', element: <OverviewPage /> },
      { path: '/traffic', element: <TrafficPage /> },
      { path: '/engagement', element: <EngagementPage /> },
      { path: '/sources', element: <SourcesPage /> },
      { path: '/system', element: <SystemHealthPage /> }
    ]
  }
]);

export default router;
