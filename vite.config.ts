import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: true,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.png", "icon.svg", "robots.txt"],
      manifest: {
        name: "Ponto do Cordeiro",
        short_name: "Ponto Cordeiro",
        description: "Decisão rápida de venda de cordeiros para produtores rurais",
        theme_color: "#059669",
        background_color: "#1C2416",
        display: "standalone",
        start_url: "/dashboard",
        icons: [
          { src: "/icon.png", sizes: "192x192", type: "image/png" },
          { src: "/icon.png", sizes: "512x512", type: "image/png" },
          { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // JS e HTML sempre buscam do servidor (network-first)
        // Garante que updates chegam imediatamente no PWA instalado
        navigateFallback: "index.html",
        navigateFallbackDenylist: [/^\/api/],
        runtimeCaching: [
          {
            // Imagens e fontes: cache-first (não mudam)
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico|woff2?)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "static-assets",
              expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
          {
            // Supabase API: network-first (dados sempre frescos)
            urlPattern: /supabase\.co/,
            handler: "NetworkFirst",
            options: {
              cacheName: "supabase-api",
              networkTimeoutSeconds: 10,
              expiration: { maxEntries: 50, maxAgeSeconds: 5 * 60 },
            },
          },
        ],
        // NÃO cacheia JS/CSS agressivamente — deixa o browser gerenciar
        globPatterns: ["**/*.{html,ico,png,svg,jpg,jpeg,webp}"],
        skipWaiting: true,
        clientsClaim: true,
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
