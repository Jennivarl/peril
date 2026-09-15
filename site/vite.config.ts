import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Served from https://jennivarl.github.io/peril/, so assets need the repo name
// as their base. Routing is hash-based for the same reason: GitHub Pages has no
// server to rewrite unknown paths back to index.html, so a history-API route
// would 404 on refresh and on any shared link.
export default defineConfig({
  base: "/peril/",
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist",
    assetsInlineLimit: 0,
  },
});
