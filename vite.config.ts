import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "public/choredo-fe/*", // Source path (images in public/choredo-fe)
          dest: "", // Destination path in build output (directly inside dist)
        },
      ],
    }),
  ],
  build: {
    outDir: "dist", // Set the main output directory
    rollupOptions: {
      output: {
        // Place all JS files inside the 'assets' folder
        assetFileNames: "[name].[ext]", // Static assets (CSS, images, etc.)
        chunkFileNames: "[name].[js]", // JavaScript chunks
        entryFileNames: "[name].js", // Main entry JS file
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  base: "/choredo-fe/",
});
