import { createCn, validators } from 'cn/config'

export const cn = createCn({
	extend: {
		classGroups: {
			'font-size': [
				{ 'text-v': [validators.isNumber] },
				{ 'text-w': [validators.isNumber] },
				{ 'text-h': [validators.isNumber] },
			],
		},
	},
})
