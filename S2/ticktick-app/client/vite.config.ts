import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import viteCompression from 'vite-plugin-compression';

import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
   server: {
    proxy: {
      '/api': {
        target: 'http://server:3000',
        changeOrigin: true,
      }
    }
  },
  plugins: [
    react(),
    viteCompression(),
    tailwindcss(),
    visualizer({
      open: false, 
      gzipSize: true,
      brotliSize: true,
      filename: "bundle-analysis.html",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          state: ["@tanstack/react-query", "react-hook-form", "zod"],
          ui: [
            "@radix-ui/react-avatar",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-collapsible",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-label",
            "@radix-ui/react-popover",
            "@radix-ui/react-select",
            "@radix-ui/react-separator",
            "@radix-ui/react-slot",
            "@radix-ui/react-tooltip",
            "lucide-react",
            "sonner",
            "tailwind-merge",
            "clsx",
          ],
          animation: ["framer-motion"],
          date: ["date-fns"],
          dnd: ["@dnd-kit/core", "@dnd-kit/sortable"],
          misc: ["crypto-js", "js-cookie", "jwt-decode"],
        },
      },
    },
    minify: "terser",
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@tanstack/react-query",
      "react-hook-form",
      "zod",
    ],
  },
});
