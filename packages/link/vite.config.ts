import { defineConfig } from 'vite'

// O workflow do embark faz `bun run --cwd packages/link build` e publica
// `packages/link/dist`, que é o padrão do Vite. Nada a configurar além disso.
export default defineConfig({
  build: {
    outDir: 'dist',
  },
})
