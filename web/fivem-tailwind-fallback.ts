import type { Plugin } from 'vite'

const COLOR_MIX_SUPPORT_BLOCK =
	/@supports\s*\(color:color-mix\(in lab,\s*red,\s*red\)\)\s*{\s*([^{}]+?)\s*{\s*([\w-]+|--[\w-]+)\s*:\s*color-mix\(in oklab,\s*var\((--[\w-]+)\)\s*([\d.]+)%\s*,\s*transparent\)\s*;?\s*}\s*}/g

const CUSTOM_PROPERTY_DECLARATION = /(\s*)(--[\w-]+)\s*:\s*([^;{}]+);/g

export function fivemTailwindFallback(): Plugin {
	return {
		name: 'fivem-tailwind-fallback',
		apply: 'build',
		enforce: 'post',
		generateBundle(_options, bundle) {
			for (const asset of Object.values(bundle)) {
				if (asset.type !== 'asset' || !asset.fileName.endsWith('.css')) {
					continue
				}

				const source = asset.source.toString()
				asset.source = addColorMixFallbacks(addRgbVariables(source))
			}
		},
	}
}

function addRgbVariables(css: string) {
	return css.replace(CUSTOM_PROPERTY_DECLARATION, (match, indent, name, value) => {
		if (name.endsWith('-rgb')) {
			return match
		}

		const rgb = toRgb(value.trim())

		if (!rgb) {
			return match
		}

		return `${match}${indent}${name}-rgb: ${rgb};`
	})
}

function addColorMixFallbacks(css: string) {
	return css.replace(COLOR_MIX_SUPPORT_BLOCK, (match, selector, property, variable, percent) => {
		const alpha = formatAlpha(Number(percent) / 100)
		const fallback = `${selector.trim()} {\n\t${property}: rgba(var(${variable}-rgb), ${alpha})\n}\n\n`

		return `${fallback}${match}`
	})
}

function toRgb(value: string) {
	return parseHex(value) ?? parseRgb(value) ?? parseOklch(value)
}

function parseHex(value: string) {
	const hex = value.match(/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i)?.[1]

	if (!hex) {
		return null
	}

	const normalized =
		hex.length === 3 || hex.length === 4
			? hex
					.split('')
					.map(character => `${character}${character}`)
					.join('')
			: hex

	return [
		Number.parseInt(normalized.slice(0, 2), 16),
		Number.parseInt(normalized.slice(2, 4), 16),
		Number.parseInt(normalized.slice(4, 6), 16),
	].join(', ')
}

function parseRgb(value: string) {
	const rgb = value.match(/^rgba?\(([^)]+)\)$/i)?.[1]

	if (!rgb) {
		return null
	}

	const channels = rgb
		.split(/[,\s/]+/)
		.filter(Boolean)
		.slice(0, 3)
		.map(channel => Number(channel.replace('%', '')))

	if (channels.length !== 3 || channels.some(channel => Number.isNaN(channel))) {
		return null
	}

	return channels.map(channel => Math.round(clamp(channel, 0, 255))).join(', ')
}

function parseOklch(value: string) {
	const match = value.match(/^oklch\(\s*([\d.]+)(%)?\s+([\d.]+)\s+(-?[\d.]+)(?:deg)?(?:\s*\/\s*[\d.]+%?)?\s*\)$/i)

	if (!match) {
		return null
	}

	const lightness = Number(match[1]) / (match[2] ? 100 : 1)
	const chroma = Number(match[3])
	const hue = (Number(match[4]) * Math.PI) / 180

	if ([lightness, chroma, hue].some(channel => Number.isNaN(channel))) {
		return null
	}

	const a = chroma * Math.cos(hue)
	const b = chroma * Math.sin(hue)

	const lPrime = lightness + 0.3963377774 * a + 0.2158037573 * b
	const mPrime = lightness - 0.1055613458 * a - 0.0638541728 * b
	const sPrime = lightness - 0.0894841775 * a - 1.291485548 * b

	const l = lPrime ** 3
	const m = mPrime ** 3
	const s = sPrime ** 3

	return [
		4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
		-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
		-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
	]
		.map(linearSrgbToRgb)
		.join(', ')
}

function linearSrgbToRgb(value: number) {
	const encoded = value <= 0.0031308 ? 12.92 * value : 1.055 * value ** (1 / 2.4) - 0.055

	return Math.round(clamp(encoded, 0, 1) * 255)
}

function formatAlpha(value: number) {
	return Number(value.toFixed(4)).toString()
}

function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max)
}
