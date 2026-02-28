import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
  registerType: "autoUpdate",
  includeAssets: ["pwa-192.png", "pwa-512.png"],

  workbox: {
    navigateFallback: "/index.html",
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "firestore-cache",
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24,
          },
        },
      },
    ],
  },

  manifest: {
    name: "Leave Tracker",
    short_name: "LeaveApp",
    description: "Smart leave management system",
    theme_color: "#0f172a",
    background_color: "#0f172a",
    display: "standalone",
    start_url: "/",
    icons: [
      {
        src: "pwa-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "pwa-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
    }),
  ],
});