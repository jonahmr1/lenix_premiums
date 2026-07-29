import type { userStatuses } from '@/constants';
import avatar from '../assets/user.png'

export type UserStatus = keyof typeof userStatuses

export const common: {
	users: {
		[key: string]: {
			name: string;
			avatar: string;
			stats: {
				kills: number;
				deaths: number;
				assits: number;
				wins: number;
				losses: number;
			};
		};
	};
} = {
	users: {
		lenix: {
			name: 'Lenix',
			avatar,
			stats: {
				kills: 19247,
				deaths: 8354,
				assits: 17898,
				wins: 5469,
				losses: 8498,
			},
		},
		'7MOOD': {
			name: '7MOOD',
			avatar,
			stats: {
				kills: 28410,
				deaths: 9120,
				assits: 11450,
				wins: 6320,
				losses: 2190,
			},
		},
		nour: {
			name: 'nour',
			avatar,
			stats: {
				kills: 24120,
				deaths: 10340,
				assits: 12880,
				wins: 5870,
				losses: 2450,
			},
		},
		M_D7M: {
			name: 'M_D7M',
			avatar,
			stats: {
				kills: 22980,
				deaths: 11020,
				assits: 13110,
				wins: 5630,
				losses: 2680,
			},
		},
		iSnipe: {
			name: 'iSnipe',
			avatar,
			stats: {
				kills: 20330,
				deaths: 9860,
				assits: 10240,
				wins: 5120,
				losses: 3010,
			},
		},
		abood: {
			name: 'abood',
			avatar,
			stats: {
				kills: 19870,
				deaths: 10540,
				assits: 9540,
				wins: 4980,
				losses: 3220,
			},
		},
	},
}

export const session: {
	users: {
		[key: string]: {
			isReady: boolean;
			status: UserStatus;
		};
	};
} = {
	users: {
		lenix: {
			isReady: false,
			status: 'online'
		}
	}
}

export const user = {
	id: 'lenix',
	friendsIds: ['7MOOD', 'nour', 'M_D7M', 'iSnipe', 'abood']
}
