import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fivemTailwindFallback } from './plugins/fivem-tailwind-fallback.ts'

// https://vite.dev/config/
export default defineConfig({
	base: './',
	plugins: [react(), tailwindcss(), fivemTailwindFallback()],
	resolve: {
		dedupe: ['react', 'react-dom'],
		alias: {
			'@': path.resolve(__dirname, './src'),
			config: path.resolve(__dirname, '../../../public/config.competitive.json'),
		},
	},
	build: {
		minify: false
	}
})
