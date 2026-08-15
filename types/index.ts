import type { Event, Request } from 'lenix'

export namespace Competitive {
	export interface Events {
		open: Event<'competitive:open', []>
		playerInvited: Event<'competitive:playerInvited', [Player['Profile']]>
		updateParty: Event<'competitive:updateParty', [Player['Party']]>
	}

	export interface Requests {
		getProfile: Request<Player['Profile'], 'competitive:getProfile'>
		getLeaderboard: Request<Leaderboard, 'competitive:getLeaderboard'>
		party: {
			get: Request<Player['Party'], 'competitive:party:get'>
			setSize: Request<null, 'competitive:party:setSize', { size: number }>
			getStats: Request<Record<string, Player['Stats']>, 'competitive:party:getStats', { profiles: string[] }>
		}
		getMatches: Request<Player['Match'][], 'competitive:getMatches'>
		getStats: Request<Player['Stats'], 'competitive:getStats'>
		getFriends: Request<Player['OfflineProfile'][], 'competitive:getFriends'>
		setStatus: Request<true, 'competitive:setStatus', { status: Player['Profile']['status'] }>
		getProfiles: Request<Player['OfflineProfile'][], 'competitive:getProfiles'>
		invitePlayer: Request<null | string, 'competitive:invitePlayer', { invited: number }>
		acceptInvite: Request<null, 'competitive:acceptInvite', { inviter: number }>
		ignoreInvites: Request<null, 'competitive:ignoreInvites', { inviter: number }>
		updateReadiness: Request<null, 'competitive:updateReadiness', { status: boolean }>
		leaveParty: Request<null, 'competitive:leaveParty'>
		kickProfile: Request<null, 'competitive:kickProfile', { profile: number }>
		updateGameSearch: Request<null, 'competitive:updateGameSearch', { status: boolean }>
	}

	export interface APIs {
		getStats: (Pick<Competitive.Player['Stats'], 'kills' | 'assists' | 'deaths'> & { result: 'win' | 'loss' })[]
		getProfilesStats: Record<string, APIs['getStats'][number]>
	}

	export interface Player {
		Profile: {
			profile_id: string
			name: string
			avatar: string | null
			status: 'online' | 'offline' | 'dnd'
			ready: boolean
			sessionId: number
		}
		OfflineProfile: Pick<Player['Profile'], 'avatar' | 'name' | 'profile_id' | 'status'>
		Friend: Player['Profile']['profile_id']
		Stats: {
			kills: number
			deaths: number
			assists: number
			wins: number
			losses: number
			winRate: number
			killsDeathsRatio: number
			matches: number
		}
		Match: {
			match_id: number
			map: string
			played_at: number
			result: Player['Performance']['result']
			delta: number
			stats: {
				kills: Player['Stats']['kills']
				deaths: Player['Stats']['deaths']
				assits: Player['Stats']['assists']
			}
		},
		Notification: {
			id: string
			type: 'party_invite'
			title: string
			description: string
			createdAt: number
			author: {
				avatar: Player['Profile']['avatar']
			}
		}
		Performance: {
			match_id: number
			profile_id: string
			result: 'win' | 'loss'
			kills: number
			deaths: number
			assists: number
		}
		Party: {
			profiles: Competitive.Player['Profile'][]
			roomAvailable: number
			leader: Competitive.Player['Profile']['sessionId']
			searching: boolean
		}
	}

	export type Leaderboard = {
		place: number
		score: number
		profile_id: Player['Profile']['profile_id']
		name: Player['Profile']['name']
		avatar: Player['Profile']['avatar']
	}[]
}
