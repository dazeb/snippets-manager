import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    tailwindcss(),
    react(),
    // The code below enables dev tools like taking screenshots of your site
    // while it is being developed on chef.convex.dev.
    // Feel free to remove this code if you're no longer developing your app with Chef.
    mode === "development"
      ? {
          name: "inject-chef-dev",
          transform(code: string, id: string) {
            if (id.includes("main.tsx")) {
              return {
                code: `${code}

/* Added by Vite plugin inject-chef-dev */
window.addEventListener('message', async (message) => {
  if (message.source !== window.parent) return;
  if (message.data.type !== 'chefPreviewRequest') return;

  const worker = await import('https://chef.convex.dev/scripts/worker.bundled.mjs');
  await worker.respondToMessage(message);
});
            `,
                map: null,
              };
            }
            return null;
          },
        }
      : null,
    // End of code for taking screenshots on chef.convex.dev.
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      // Prevent circular dependency issues
      external: (id) => {
        // Don't externalize these, but handle them carefully
        return false;
      },
      output: {
        // Ensure proper chunk loading order and module format
        inlineDynamicImports: false,
        format: 'es',
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: (id) => {
          // React core - keep small and essential
          if (id.includes('node_modules/react/') && !id.includes('react-dom')) {
            return 'react-core';
          }

          // React DOM - separate chunk
          if (id.includes('node_modules/react-dom')) {
            return 'react-dom';
          }

          // Convex vendor chunk
          if (id.includes('node_modules/convex') || id.includes('node_modules/@convex-dev')) {
            return 'convex-vendor';
          }

          // Syntax highlighting chunk (largest dependency) - more specific splitting
          if (id.includes('node_modules/react-syntax-highlighter')) {
            // Split core highlighter from languages
            if (id.includes('/languages/') || id.includes('/styles/')) {
              return 'syntax-highlighting-assets';
            }
            return 'syntax-highlighting-core';
          }

          // Prism and other syntax libraries
          if (id.includes('node_modules/prismjs') ||
              id.includes('node_modules/highlight.js') ||
              id.includes('node_modules/refractor')) {
            return 'syntax-highlighting-libs';
          }

          // Radix UI components - separate chunk as they're large
          if (id.includes('node_modules/@radix-ui')) {
            return 'radix-ui';
          }

          // Tailwind and styling utilities
          if (id.includes('node_modules/class-variance-authority') ||
              id.includes('node_modules/clsx') ||
              id.includes('node_modules/tailwind-merge') ||
              id.includes('node_modules/tailwindcss')) {
            return 'styling-utils';
          }

          // Icons and visual components
          if (id.includes('node_modules/@heroicons') ||
              id.includes('node_modules/react-icons')) {
            return 'icons';
          }

          // Notification and UI feedback
          if (id.includes('node_modules/sonner') ||
              id.includes('node_modules/react-hot-toast')) {
            return 'notifications';
          }

          // Fonts and typography
          if (id.includes('node_modules/@next/font')) {
            return 'fonts';
          }

          // Date and time utilities
          if (id.includes('node_modules/date-fns') ||
              id.includes('node_modules/moment') ||
              id.includes('node_modules/dayjs')) {
            return 'date-utils';
          }

          // Form and validation libraries
          if (id.includes('node_modules/react-hook-form') ||
              id.includes('node_modules/zod') ||
              id.includes('node_modules/yup')) {
            return 'forms';
          }

          // Animation libraries
          if (id.includes('node_modules/framer-motion') ||
              id.includes('node_modules/react-spring') ||
              id.includes('node_modules/@react-spring')) {
            return 'animations';
          }

          // Default vendor chunk for remaining node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }

          // App components chunking
          if (id.includes('/src/components/')) {
            // Large components get their own chunks
            if (id.includes('ContentManager') ||
                id.includes('SpaceSelector') ||
                id.includes('SnippetForm') ||
                id.includes('PromptForm')) {
              return 'large-components';
            }
            // UI components
            if (id.includes('/ui/')) {
              return 'ui-components';
            }
            // Regular components
            return 'components';
          }
        }
      }
    },
    // Increase chunk size warning limit to 1.5MB
    chunkSizeWarningLimit: 1500,
    // Enable source maps for better debugging
    sourcemap: false,
    // Minification options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
}));
