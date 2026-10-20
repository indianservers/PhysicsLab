import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: "generateSW",
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: ["assets/**/*", "!assets/scale-universe/**", "index.html"],
      manifest: {
        name: "PhysicsLab 100",
        short_name: "PhysicsLab",
        theme_color: "#1e1b4b",
        background_color: "#0f0e17",
        display: "standalone",
        icons: [
          { src: "/assets/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/assets/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
      },
      workbox: {
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        globIgnores: ["**/assets/scale-universe/**"],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2,ttf}"],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/assets/scale-universe/"),
            handler: "CacheFirst",
            options: { cacheName: "physicslab-scale-assets-v2", expiration: { maxEntries: 48, maxAgeSeconds: 30 * 24 * 60 * 60 } },
          },
          {
            urlPattern: ({ request }) => request.destination === "font",
            handler: "CacheFirst",
            options: { cacheName: "physicslab-fonts" },
          },
          {
            urlPattern: ({ request }) => request.destination === "script" || request.destination === "style",
            handler: "StaleWhileRevalidate",
            options: { cacheName: "physicslab-assets" },
          },
        ],
      },
    }),
  ],
});
