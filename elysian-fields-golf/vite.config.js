import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  // IMPORTANTE: Adiciona a base do repositório para o deploy no GitHub Pages
  base: '/jogo-golfe-interativo/', 
  
  root: 'src', 
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
      },
    },
  },
  server: {
    port: 3000,
  },
});
