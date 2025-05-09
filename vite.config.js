import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import rollupReplace from '@rollup/plugin-replace'

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, './src'),
        '@mui/styled-engine': '@mui/styled-engine-sc'
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
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  }
})
