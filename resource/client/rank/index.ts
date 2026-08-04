import { addKeybind } from "@overextended/ox_lib/client";
import type { playerStatuses } from "common/config";
import { ResourceName } from "common/resource";
import { emitEvent } from "lenix/client";
import type { Rank } from 'types/index'

addKeybind({
	name: `${ResourceName}:rank:open`,
	description: 'Open Rank',
	defaultKey: 'G',
	onPressed: () => emitEvent<Rank.Events['open']>('rank:open')
})

const avatar = 'https://lenix.dev/favicon-light.svg'

	const leaderboard = entries(common.users)
		.map(([userId, { name, avatar, stats }]) => ({
			userId,
			name,
			avatar,
			score: calculatePlayerScore(stats),
		}))
		.sort((a, b) => b.score - a.score)
		.map((player, index) => ({
			...player,
			place: index + 1,
		}));


		
		const leaderboard = entries(common.users)
			.map(([userId, player]) => {
				const score = calculatePlayerScore(player.stats)
				const rank = getRankTier(score)
	
				return {
					userId,
					...player,
					score,
					rank,
					matches: player.stats.wins + player.stats.losses,
					winRate: getWinRate(player.stats),
					kdRatio: getKdRatio(player.stats),
				}
			})
			.sort((firstPlayer, secondPlayer) => secondPlayer.score - firstPlayer.score)
			.map((player, index) => ({
				...player,
				place: index + 1,
			}))
export const common: {
	users: Record<string, Rank.Player>;
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
			]
		}
	}
}

export const session: {
	users: {
		[key: string]: {
			isReady: boolean;
		};
	};
	notifications: UserNotification[];
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
	},
	notifications: [
		{
			id: 'notification-001',
			type: 'party_invite',
			title: 'Party Invite',
			description: 'nour invited you to join their party.',
			createdAt: 'Just now',
			invite: {
				fromUserId: 'nour',
				toUserId: 'lenix',
			},
		},
		{
			id: 'notification-002',
			type: 'party_invite',
			title: 'Party Invite',
			description: '7MOOD invited you to join their party.',
			createdAt: '2m ago',
			invite: {
				fromUserId: '7MOOD',
				toUserId: 'lenix',
			},
		},
		{
			id: 'notification-003',
			type: 'party_invite',
			title: 'Party Invite',
			description: 'M_D7M invited you to join their party.',
			createdAt: '8m ago',
			invite: {
				fromUserId: 'M_D7M',
				toUserId: 'lenix',
			},
		},
	]
}

export const user = {
	id: 'lenix',
	friendsIds: ['7MOOD', 'nour', 'M_D7M', 'iSnipe', 'abood']
}
