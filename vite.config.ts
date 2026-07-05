import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "es2019",
    lib: {
      entry: "src/dynamic-map-card.ts",
      formats: ["es"],
      fileName: () => "dynamic-map-card.js",
    },
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: "dynamic-map-card.js",
      },
    },
  },
});
