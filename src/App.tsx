import { RouterProvider } from 'react-router-dom';
import router from './Router';
import { AuthProvider } from './context/AuthProvider';
import ConfigMissing from './routes/ConfigMissing';
import { isSupabaseConfigured } from './lib/supabaseClient';

export default function App() {
  if (!isSupabaseConfigured) return <ConfigMissing />;
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
