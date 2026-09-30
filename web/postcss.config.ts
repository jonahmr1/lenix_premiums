// export default {
// 	plugins: {
// 		'postcss-color-converter': {
// 			outputColorFormat: 'rgb',
// 			// ignore: ['oklch']
// 		},
// 	},
// }


import colorConverter from 'postcss-color-converter'

const normalizeOklchHue = {
	postcssPlugin: 'normalize-oklch-hue',
	Declaration(declaration: { value: string }) {
		declaration.value = declaration.value.replace(
			/oklch\(([^)]*?)\s+none(\s*\/\s*[^)]*)?\)/gi,
			(_color, channels, alpha = '') => `oklch(${channels} 0${alpha})`,
		)
	},
}

export default {
	plugins: [normalizeOklchHue, colorConverter({ outputColorFormat: 'rgb' })],
}
