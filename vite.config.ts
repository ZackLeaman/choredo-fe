import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
  base: "",
});
