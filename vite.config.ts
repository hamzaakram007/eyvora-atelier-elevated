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
