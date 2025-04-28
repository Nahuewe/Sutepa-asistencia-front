import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import rollupReplace from '@rollup/plugin-replace'

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, './src')
      }
    ]
  },

  plugins: [
    rollupReplace({
      preventAssignment: true,
      values: {
        __DEV__: JSON.stringify(true),
        'process.env.NODE_ENV': JSON.stringify('development')
      }
    }),
    react()
  ],

  build: {
    rollupOptions: {
      output: {
        // Esto genera nombres de archivo con hashes para los archivos JS, CSS y otros assets
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  }
})
