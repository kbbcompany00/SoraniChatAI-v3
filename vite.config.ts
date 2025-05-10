import { defineConfig, PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(async () => {
  const plugins: PluginOption[] = [react()];

  const isReplit = typeof process.env.REPL_ID !== "undefined";
  const isDev = process.env.NODE_ENV !== "production";

  if (isReplit && isDev) {
    try {
      const runtimeErrorOverlay = await import("@replit/vite-plugin-runtime-error-modal").then(m => m.default);
      const cartographer = await import("@replit/vite-plugin-cartographer").then(m => m.cartographer);

      plugins.push(runtimeErrorOverlay() as PluginOption);
      plugins.push(cartographer() as PluginOption);
    } catch (err: unknown) {
      const error = err as Error;
      console.warn("Skipping Replit plugins (not installed in prod):", error.message);
    }
  }

  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@shared": path.resolve(import.meta.dirname, "shared"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets")
      }
    },
    root: path.resolve(import.meta.dirname, "client"),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist/public"),
      emptyOutDir: true
    }
  };
});
