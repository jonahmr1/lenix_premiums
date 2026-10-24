import { createCn, validators } from 'cn/config'

export const cn = createCn({
	extend: {
		classGroups: {
			'game-blur': [{ blurred: [validators.isNumber] }],
			'font-size': [
				{ 'text-v': [validators.isNumber] },
				{ 'text-w': [validators.isNumber] },
				{ 'text-h': [validators.isNumber] },
			],
		},
	},
})
