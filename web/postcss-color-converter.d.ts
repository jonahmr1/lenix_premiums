declare module 'postcss-color-converter' {
	import type { Plugin } from 'postcss'

	interface Options {
		outputColorFormat: 'hex' | 'rgb' | 'hsl' | 'oklab' | 'oklch' | 'keyword'
		alwaysAlpha?: boolean
		ignore?: Array<'hex' | 'rgb' | 'hsl' | 'oklab' | 'oklch' | 'keyword'>
	}

	function colorConverter(options: Options): Plugin

	export default colorConverter
}
