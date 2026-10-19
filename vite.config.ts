import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Resolve three.js to its ES module sources instead of the single pre-bundled
    // file, so the bundler can tree-shake per module and split the shader library
    // into its own chunk (see codeSplitting below).
    alias: [{ find: /^three$/, replacement: 'three/src/Three.js' }],
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'react-vendor', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            { name: 'motion', test: /node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/ },
            { name: 'three-shaders', test: /node_modules[\\/]three[\\/]src[\\/]renderers[\\/]shaders[\\/]/ },
            { name: 'three', test: /node_modules[\\/]three[\\/]/ },
          ],
        },
      },
    },
  },
})
