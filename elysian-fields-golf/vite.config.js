import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src', // A raiz do nosso desenvolvimento é a pasta 'src'
  build: {
    outDir: '../dist', // Onde os arquivos de produção serão gerados
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
      },
    },
  },
  server: {
    port: 3000, // Define a porta para o servidor de desenvolvimento
  },
});
