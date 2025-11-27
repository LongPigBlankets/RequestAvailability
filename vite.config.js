import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const sanitizeTarget = (target) => target?.replace(/\/$/, "");

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiBase = sanitizeTarget(env.VITE_API_BASE_URL) || "http://localhost:8000";

  const proxyConfig = {
    target: apiBase,
    changeOrigin: true,
  };

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": { ...proxyConfig },
      },
    },
    preview: {
      proxy: {
        "/api": { ...proxyConfig },
      },
    },
  };
});
