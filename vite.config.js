import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  base: '/اسم-الريبو/',   // مهم عشان GitHub Pages
  plugins: [tailwindcss()],
})
