import { defineConfig } from 'vite'

// O workflow do embark faz `bun run --cwd packages/me build` e publica
// `packages/me/dist`, que é o padrão do Vite. Nada a configurar além disso.
export default defineConfig({
  build: {
    outDir: 'dist',
  },
})
