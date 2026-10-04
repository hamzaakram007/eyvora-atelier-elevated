import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

/**
 * Independent EYVORA storefront build.
 * Hosting target: Vercel (Nitro preset).
 * Commerce source of truth: Shopify.
 */
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    cssCodeSplit: true,
    sourcemap: false,
    target: "es2022",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("@tanstack")) return "tanstack";
          if (id.includes("lucide-react")) return "icons";
          if (id.includes("zustand")) return "state";
          // Keep Radix dialog/sheet out of the critical product path until opened.
          if (id.includes("@radix-ui/react-dialog") || id.includes("@radix-ui/react-portal")) {
            return "radix-dialog";
          }
          if (id.includes("@radix-ui")) return "radix";
        },
      },
    },
  },
  plugins: [
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    tanstackStart(),
    nitro({
      preset: "vercel",
    }),
    viteReact(),
  ],
});
