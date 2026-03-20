import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync } from "node:fs";

function jsoncPlugin(): Plugin {
  return {
    name: "vite-plugin-jsonc",
    load(id) {
      if (id.endsWith(".jsonc")) {
        const raw = readFileSync(id, "utf-8");
        const stripped = raw.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
        const parsed = JSON.parse(stripped);
        return `export default ${JSON.stringify(parsed)}`;
      }
    },
  };
}

export default defineConfig({
  plugins: [jsoncPlugin(), react(), tailwindcss()],
  build: { outDir: "dist" },
  server: { port: 8080 },
});
