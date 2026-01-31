
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carga las variables de entorno basándose en el modo (development/production)
  // El tercer argumento '' carga todas las variables, independientemente del prefijo, aunque Vercel/Vite usan VITE_ por defecto.
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true
    },
    define: {
      // Polyfill para process.env.API_KEY requerido por las guías de @google/genai
      // Esto inyecta el valor de la variable VITE_GEMINI_API_KEY en el código compilado
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY)
    }
  };
});
