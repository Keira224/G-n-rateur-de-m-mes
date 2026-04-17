import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // GitHub Pages sert ce projet sous /<repo>/, pas à la racine du domaine.
  base: '/G-n-rateur-de-m-mes/',
  plugins: [react()],
});
