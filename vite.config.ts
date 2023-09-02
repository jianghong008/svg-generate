import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import * as path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve:{
    alias:{
      "@": path.resolve(__dirname, "./src"),
    }
  },
  base:'svg-generate',
  server:{
    port:5180,
    host:'0.0.0.0'
  }
})
