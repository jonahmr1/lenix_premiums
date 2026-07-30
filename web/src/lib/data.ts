import type { userStatuses } from '@/constants';
import type { PlayerStats } from '@/types';

const avatar = 'https://lenix.dev/favicon-light.svg'

interface MatchHistoryItem {
	id: string;
	mode: string;
	map: string;
	playedAt: string;
	result: 'win' | 'loss';
	duration: string;
	scoreChange: number;
	stats: Pick<PlayerStats, 'kills' | 'deaths' | 'assits'>;
}

export type UserStatus = keyof typeof userStatuses

export const common: {
	users: {
		[key: string]: {
			name: string;
			avatar: string;
			stats: PlayerStats;
			history: MatchHistoryItem[]
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
			history: [
				{
					id: 'match-001',
					mode: '2v2',
					map: 'Downtown',
					playedAt: 'Today 21:18',
					result: 'win',
					duration: '14m 32s',
					scoreChange: 34,
					stats: {
						kills: 24,
						deaths: 9,
						assits: 17,
					},
				},
				{
					id: 'match-002',
					mode: '1v1',
					map: 'Vinewood',
					playedAt: 'Today 20:44',
					result: 'loss',
					duration: '11m 08s',
					scoreChange: -18,
					stats: {
						kills: 13,
						deaths: 16,
						assits: 4,
					},
				},
				{
					id: 'match-003',
					mode: '3v3',
					map: 'Sandy Shores',
					playedAt: 'Yesterday 23:12',
					result: 'win',
					duration: '18m 40s',
					scoreChange: 42,
					stats: {
						kills: 31,
						deaths: 12,
						assits: 21,
					},
				},
				{
					id: 'match-004',
					mode: '2v2',
					map: 'Docks',
					playedAt: 'Yesterday 22:30',
					result: 'win',
					duration: '15m 05s',
					scoreChange: 29,
					stats: {
						kills: 20,
						deaths: 8,
						assits: 13,
					},
				},
				{
					id: 'match-005',
					mode: '4v4',
					map: 'Paleto Bay',
					playedAt: 'Jul 28 19:56',
					result: 'loss',
					duration: '20m 14s',
					scoreChange: -21,
					stats: {
						kills: 18,
						deaths: 22,
						assits: 15,
					},
				},
				{
					id: 'match-006',
					mode: '1v1',
					map: 'Airport',
					playedAt: 'Jul 28 18:37',
					result: 'win',
					duration: '9m 48s',
					scoreChange: 25,
					stats: {
						kills: 15,
						deaths: 6,
						assits: 2,
					},
				},
			],
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
			history: [
				{
					id: 'match-001',
					mode: '2v2',
					map: 'Downtown',
					playedAt: 'Today 21:18',
					result: 'win',
					duration: '14m 32s',
					scoreChange: 34,
					stats: {
						kills: 24,
						deaths: 9,
						assits: 17,
					},
				},
				{
					id: 'match-002',
					mode: '1v1',
					map: 'Vinewood',
					playedAt: 'Today 20:44',
					result: 'loss',
					duration: '11m 08s',
					scoreChange: -18,
					stats: {
						kills: 13,
						deaths: 16,
						assits: 4,
					},
				},
				{
					id: 'match-003',
					mode: '3v3',
					map: 'Sandy Shores',
					playedAt: 'Yesterday 23:12',
					result: 'win',
					duration: '18m 40s',
					scoreChange: 42,
					stats: {
						kills: 31,
						deaths: 12,
						assits: 21,
					},
				},
				{
					id: 'match-004',
					mode: '2v2',
					map: 'Docks',
					playedAt: 'Yesterday 22:30',
					result: 'win',
					duration: '15m 05s',
					scoreChange: 29,
					stats: {
						kills: 20,
						deaths: 8,
						assits: 13,
					},
				},
				{
					id: 'match-005',
					mode: '4v4',
					map: 'Paleto Bay',
					playedAt: 'Jul 28 19:56',
					result: 'loss',
					duration: '20m 14s',
					scoreChange: -21,
					stats: {
						kills: 18,
						deaths: 22,
						assits: 15,
					},
				},
				{
					id: 'match-006',
					mode: '1v1',
					map: 'Airport',
					playedAt: 'Jul 28 18:37',
					result: 'win',
					duration: '9m 48s',
					scoreChange: 25,
					stats: {
						kills: 15,
						deaths: 6,
						assits: 2,
					},
				},
			],
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
			history: [
				{
					id: 'match-001',
					mode: '2v2',
					map: 'Downtown',
					playedAt: 'Today 21:18',
					result: 'win',
					duration: '14m 32s',
					scoreChange: 34,
					stats: {
						kills: 24,
						deaths: 9,
						assits: 17,
					},
				},
				{
					id: 'match-002',
					mode: '1v1',
					map: 'Vinewood',
					playedAt: 'Today 20:44',
					result: 'loss',
					duration: '11m 08s',
					scoreChange: -18,
					stats: {
						kills: 13,
						deaths: 16,
						assits: 4,
					},
				},
				{
					id: 'match-003',
					mode: '3v3',
					map: 'Sandy Shores',
					playedAt: 'Yesterday 23:12',
					result: 'win',
					duration: '18m 40s',
					scoreChange: 42,
					stats: {
						kills: 31,
						deaths: 12,
						assits: 21,
					},
				},
				{
					id: 'match-004',
					mode: '2v2',
					map: 'Docks',
					playedAt: 'Yesterday 22:30',
					result: 'win',
					duration: '15m 05s',
					scoreChange: 29,
					stats: {
						kills: 20,
						deaths: 8,
						assits: 13,
					},
				},
				{
					id: 'match-005',
					mode: '4v4',
					map: 'Paleto Bay',
					playedAt: 'Jul 28 19:56',
					result: 'loss',
					duration: '20m 14s',
					scoreChange: -21,
					stats: {
						kills: 18,
						deaths: 22,
						assits: 15,
					},
				},
				{
					id: 'match-006',
					mode: '1v1',
					map: 'Airport',
					playedAt: 'Jul 28 18:37',
					result: 'win',
					duration: '9m 48s',
					scoreChange: 25,
					stats: {
						kills: 15,
						deaths: 6,
						assits: 2,
					},
				},
			],
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
			history: [
				{
					id: 'match-001',
					mode: '2v2',
					map: 'Downtown',
					playedAt: 'Today 21:18',
					result: 'win',
					duration: '14m 32s',
					scoreChange: 34,
					stats: {
						kills: 24,
						deaths: 9,
						assits: 17,
					},
				},
				{
					id: 'match-002',
					mode: '1v1',
					map: 'Vinewood',
					playedAt: 'Today 20:44',
					result: 'loss',
					duration: '11m 08s',
					scoreChange: -18,
					stats: {
						kills: 13,
						deaths: 16,
						assits: 4,
					},
				},
				{
					id: 'match-003',
					mode: '3v3',
					map: 'Sandy Shores',
					playedAt: 'Yesterday 23:12',
					result: 'win',
					duration: '18m 40s',
					scoreChange: 42,
					stats: {
						kills: 31,
						deaths: 12,
						assits: 21,
					},
				},
				{
					id: 'match-004',
					mode: '2v2',
					map: 'Docks',
					playedAt: 'Yesterday 22:30',
					result: 'win',
					duration: '15m 05s',
					scoreChange: 29,
					stats: {
						kills: 20,
						deaths: 8,
						assits: 13,
					},
				},
				{
					id: 'match-005',
					mode: '4v4',
					map: 'Paleto Bay',
					playedAt: 'Jul 28 19:56',
					result: 'loss',
					duration: '20m 14s',
					scoreChange: -21,
					stats: {
						kills: 18,
						deaths: 22,
						assits: 15,
					},
				},
				{
					id: 'match-006',
					mode: '1v1',
					map: 'Airport',
					playedAt: 'Jul 28 18:37',
					result: 'win',
					duration: '9m 48s',
					scoreChange: 25,
					stats: {
						kills: 15,
						deaths: 6,
						assits: 2,
					},
				},
			],
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
			history: [
				{
					id: 'match-001',
					mode: '2v2',
					map: 'Downtown',
					playedAt: 'Today 21:18',
					result: 'win',
					duration: '14m 32s',
					scoreChange: 34,
					stats: {
						kills: 24,
						deaths: 9,
						assits: 17,
					},
				},
				{
					id: 'match-002',
					mode: '1v1',
					map: 'Vinewood',
					playedAt: 'Today 20:44',
					result: 'loss',
					duration: '11m 08s',
					scoreChange: -18,
					stats: {
						kills: 13,
						deaths: 16,
						assits: 4,
					},
				},
				{
					id: 'match-003',
					mode: '3v3',
					map: 'Sandy Shores',
					playedAt: 'Yesterday 23:12',
					result: 'win',
					duration: '18m 40s',
					scoreChange: 42,
					stats: {
						kills: 31,
						deaths: 12,
						assits: 21,
					},
				},
				{
					id: 'match-004',
					mode: '2v2',
					map: 'Docks',
					playedAt: 'Yesterday 22:30',
					result: 'win',
					duration: '15m 05s',
					scoreChange: 29,
					stats: {
						kills: 20,
						deaths: 8,
						assits: 13,
					},
				},
				{
					id: 'match-005',
					mode: '4v4',
					map: 'Paleto Bay',
					playedAt: 'Jul 28 19:56',
					result: 'loss',
					duration: '20m 14s',
					scoreChange: -21,
					stats: {
						kills: 18,
						deaths: 22,
						assits: 15,
					},
				},
				{
					id: 'match-006',
					mode: '1v1',
					map: 'Airport',
					playedAt: 'Jul 28 18:37',
					result: 'win',
					duration: '9m 48s',
					scoreChange: 25,
					stats: {
						kills: 15,
						deaths: 6,
						assits: 2,
					},
				},
			],
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
			history: [
				{
					id: 'match-001',
					mode: '2v2',
					map: 'Downtown',
					playedAt: 'Today 21:18',
					result: 'win',
					duration: '14m 32s',
					scoreChange: 34,
					stats: {
						kills: 24,
						deaths: 9,
						assits: 17,
					},
				},
				{
					id: 'match-002',
					mode: '1v1',
					map: 'Vinewood',
					playedAt: 'Today 20:44',
					result: 'loss',
					duration: '11m 08s',
					scoreChange: -18,
					stats: {
						kills: 13,
						deaths: 16,
						assits: 4,
					},
				},
				{
					id: 'match-003',
					mode: '3v3',
					map: 'Sandy Shores',
					playedAt: 'Yesterday 23:12',
					result: 'win',
					duration: '18m 40s',
					scoreChange: 42,
					stats: {
						kills: 31,
						deaths: 12,
						assits: 21,
					},
				},
				{
					id: 'match-004',
					mode: '2v2',
					map: 'Docks',
					playedAt: 'Yesterday 22:30',
					result: 'win',
					duration: '15m 05s',
					scoreChange: 29,
					stats: {
						kills: 20,
						deaths: 8,
						assits: 13,
					},
				},
				{
					id: 'match-005',
					mode: '4v4',
					map: 'Paleto Bay',
					playedAt: 'Jul 28 19:56',
					result: 'loss',
					duration: '20m 14s',
					scoreChange: -21,
					stats: {
						kills: 18,
						deaths: 22,
						assits: 15,
					},
				},
				{
					id: 'match-006',
					mode: '1v1',
					map: 'Airport',
					playedAt: 'Jul 28 18:37',
					result: 'win',
					duration: '9m 48s',
					scoreChange: 25,
					stats: {
						kills: 15,
						deaths: 6,
						assits: 2,
					},
				},
			],
		},
		StarDev: {
			name: 'StarDev',
			avatar,
			stats: {
				kills: 18750,
				deaths: 9840,
				assits: 11230,
				wins: 4620,
				losses: 2890,
			},
			history: [
				{
					id: 'match-001',
					mode: '2v2',
					map: 'Downtown',
					playedAt: 'Today 21:18',
					result: 'win',
					duration: '14m 32s',
					scoreChange: 34,
					stats: {
						kills: 24,
						deaths: 9,
						assits: 17,
					},
				},
				{
					id: 'match-002',
					mode: '1v1',
					map: 'Vinewood',
					playedAt: 'Today 20:44',
					result: 'loss',
					duration: '11m 08s',
					scoreChange: -18,
					stats: {
						kills: 13,
						deaths: 16,
						assits: 4,
					},
				},
				{
					id: 'match-003',
					mode: '3v3',
					map: 'Sandy Shores',
					playedAt: 'Yesterday 23:12',
					result: 'win',
					duration: '18m 40s',
					scoreChange: 42,
					stats: {
						kills: 31,
						deaths: 12,
						assits: 21,
					},
				},
				{
					id: 'match-004',
					mode: '2v2',
					map: 'Docks',
					playedAt: 'Yesterday 22:30',
					result: 'win',
					duration: '15m 05s',
					scoreChange: 29,
					stats: {
						kills: 20,
						deaths: 8,
						assits: 13,
					},
				},
				{
					id: 'match-005',
					mode: '4v4',
					map: 'Paleto Bay',
					playedAt: 'Jul 28 19:56',
					result: 'loss',
					duration: '20m 14s',
					scoreChange: -21,
					stats: {
						kills: 18,
						deaths: 22,
						assits: 15,
					},
				},
				{
					id: 'match-006',
					mode: '1v1',
					map: 'Airport',
					playedAt: 'Jul 28 18:37',
					result: 'win',
					duration: '9m 48s',
					scoreChange: 25,
					stats: {
						kills: 15,
						deaths: 6,
						assits: 2,
					},
				},
			],
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
		},
		nour: {
			isReady: false,
			status: 'online'
		},
	}
}

export const user = {
	id: 'lenix',
	friendsIds: ['7MOOD', 'nour', 'M_D7M', 'iSnipe', 'abood']
}