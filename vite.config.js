import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  root: path.resolve(__dirname, "client"),
  plugins: [react()],
  define: {
    'process.env': process.env // Enables Vite to access env vars (VITE_ only)
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"), // From src/
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets")
    }
  },
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: path.resolve(__dirname, "dist", "public"), // Vercel expects /dist or /build
    emptyOutDir: true
  }
});