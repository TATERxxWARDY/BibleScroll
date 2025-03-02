import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      '$lib': path.resolve('./src/lib'),
      '$components': path.resolve('./src/components'),
      '$styles': path.resolve('./src/styles')
    }
  },
  // Configure output for .NET integration
  build: {
    // Output to a specific directory that the .NET app can reference
    outDir: 'dist',
    // Generate sourcemaps for easier debugging
    sourcemap: true,
    // Customize asset file names to avoid caching issues
    rollupOptions: {
      output: {
        // Use a consistent naming pattern
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  },
  // Optional base path, useful if you're not serving from the root
  // Set to empty string if serving from the root of the domain
  base: '/'
}); 