// ✅ FIX 8: craco.config.js — aggressive bundle splitting
// This splits framer-motion, firebase, radix-ui into separate chunks
// so they don't bloat the initial bundle loaded on first visit.

const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // ── Split chunks aggressively ──────────────────────────────────────
      webpackConfig.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
        cacheGroups: {
          // Firebase in its own chunk — large library, rarely changes
          firebase: {
            test: /[\\/]node_modules[\\/](firebase|@firebase)[\\/]/,
            name: 'vendor-firebase',
            chunks: 'all',
            priority: 30,
          },
          // Framer Motion in its own chunk — ~150KB, only needed after render
          framerMotion: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'vendor-framer-motion',
            chunks: 'all',
            priority: 25,
          },
          // All Radix UI components together
          radix: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: 'vendor-radix',
            chunks: 'all',
            priority: 20,
          },
          // React + React DOM together (they're tiny but keep them stable)
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom|react-router)[\\/]/,
            name: 'vendor-react',
            chunks: 'all',
            priority: 15,
          },
          // All other node_modules
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor-misc',
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      };

      // ── Path alias for @ imports ───────────────────────────────────────
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        '@': path.resolve(__dirname, 'src'),
      };

      return webpackConfig;
    },
  },
};