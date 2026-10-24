import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { defineConfig } from 'vite'
import { fivemTailwindFallback } from './fivem-tailwind-fallback.ts'

// https://vite.dev/config/
export default defineConfig({
	base: './',
	plugins: [
		tanstackRouter({
			target: 'react',
		}),
		react(),
		tailwindcss(),
		fivemTailwindFallback(),
	],
	resolve: {
		dedupe: ['react', 'react-dom'],
		alias: [
			{
				find: /^cn$/,
				replacement: path.resolve(import.meta.dirname, 'src/lib/cn.ts'),
			},
			{
				find: '@',
				replacement: path.resolve(import.meta.dirname, 'src'),
			},
			{
				find: /^common\//,
				replacement: path.resolve(import.meta.dirname, '../resource/common') + '/',
			},
		],
	},
	build: {
		rolldownOptions: {
			input: {
				main: path.resolve(import.meta.dirname, 'index.html'),
				loading: path.resolve(import.meta.dirname, 'loading.html'),
			},
		},
	},
})
