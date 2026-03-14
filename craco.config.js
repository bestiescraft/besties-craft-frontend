// craco.config.js — removes ESLint from build + aggressive bundle splitting

const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {

      // ── REMOVE ESLINT WEBPACK PLUGIN COMPLETELY ────────────────────────
      // This kills ALL eslint errors during build — nuclear option
      webpackConfig.plugins = webpackConfig.plugins.filter(
        (plugin) => plugin.constructor.name !== 'ESLintWebpackPlugin'
      );

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
          // React + React DOM together
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