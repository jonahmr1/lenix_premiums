import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { defineConfig } from "vite"
import { fivemTailwindFallback } from './fivem-tailwind-fallback.ts'

// https://vite.dev/config/
export default defineConfig({
	base: './',
  plugins: [
		tanstackRouter({
			target: 'react',
		}),
		react(), tailwindcss(), fivemTailwindFallback()],
  resolve: {
		dedupe: ['react', 'react-dom'],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
	build: {
		rolldownOptions: {
			input: {
				main: path.resolve(__dirname, 'index.html'),
				loading: path.resolve(__dirname, 'loading.html'),
			},
		},
	}
})
