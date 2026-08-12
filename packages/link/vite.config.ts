import { defineConfig } from 'vite'

// O workflow do embark faz `bun run --cwd packages/link build` e publica
// `packages/link/dist`, que é o padrão do Vite. Nada a configurar além disso.
export default defineConfig({
  // Deixa o dev server aceitar qualquer Host, para dar para abrir de outro
  // aparelho na rede e conferir o site num celular de verdade.
  server: {
    allowedHosts: true,
  },
  preview: {
    allowedHosts: true,
  },
  build: {
    outDir: 'dist',
  },
})
