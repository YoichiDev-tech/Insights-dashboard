import { RouterProvider } from 'react-router-dom';
import router from './Router';
import { AuthProvider } from './context/AuthProvider';
import ConfigMissing from './routes/ConfigMissing';
import PalettePreview from './routes/PalettePreview';
import { isSupabaseConfigured } from './lib/supabaseClient';
import { ThemeProvider } from './context/ThemeProvider';

export default function App() {
  if (import.meta.env.DEV && window.location.pathname === '/palette-preview') {
    return (
      <ThemeProvider>
        <PalettePreview />
      </ThemeProvider>
    );
  }
  if (!isSupabaseConfigured) return <ConfigMissing />;
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
