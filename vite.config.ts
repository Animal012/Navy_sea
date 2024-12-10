import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { 
            host: true,
            port: 3000,
            // proxy: {
            //   "/api": {
            //     target: "http://192.168.109.51:8000",
            //     changeOrigin: true,
            //     rewrite: (path) => path.replace(/^\/api/, "/"),
            //   }
            // }
   },
  //plugins: [react()],
})
