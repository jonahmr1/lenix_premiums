import type { Event, Request } from 'lenix'
import type { Constants } from '../resource/common/config/constants'
import type { Character } from '@overextended/ox_core'

export type AtLeastOne<T> = {
	[K in keyof T]-?: { [P in K]: T[P] } & Partial<Omit<T, K>>
}[keyof T]

type Mapped<T> = {
	[K in keyof T]: T[K]
}

export namespace Warzone {
	export interface Events {
		open: Event<'warzone:open', []>
		playerInvited: Event<'warzone:playerInvited', [GamerProfile]>
		updateParty: Event<'warzone:updateParty', [Party]>
		updateStage: Event<'warzone:updateStage', [Stage]>
		newRound: Event<'warzone:newRound', [Party['gameMode'], CasualMatch]>
		updateRound: Event<'warzone:updateRound', [CasualMatch]>
	}

	export interface Requests {
		getProfile: Request<Profile, 'warzone:getProfile'>
		getGamerProfile: Request<GamerProfile, 'warzone:getGamerProfile'>
		getLeaderboard: Request<Leaderboard, 'warzone:getLeaderboard'>
		getParty: Request<Party, 'warzone:getParty'>
		setPartySize: Request<null, 'warzone:setPartySize', { size: number }>
		party: {
			getStats: Request<Record<string, Stats>, 'warzone:party:getStats', { profiles: string[] }>
		}
		getMatches: Request<Player['Match'][], 'warzone:getMatches'>
		getStats: Request<Stats, 'warzone:getStats'>
		getFriends: Request<Profile[], 'warzone:getFriends'>
		setStatus: Request<true, 'warzone:setStatus', { status: GamerProfile['status'] }>
		getProfiles: Request<Profile[], 'warzone:getProfiles'>
		invitePlayer: Request<null, 'warzone:invitePlayer', { invited: number }>
		acceptInvite: Request<null, 'warzone:acceptInvite', { inviter: number }>
		ignoreInvites: Request<null, 'warzone:ignoreInvites', { inviter: number }>
		updateReadiness: Request<null, 'warzone:updateReadiness', { status: boolean }>
		leaveParty: Request<null, 'warzone:leaveParty'>
		kickProfile: Request<null, 'warzone:kickProfile', { profile: number }>
		updateMatchmaking: Request<null, 'warzone:updateMatchmaking', { status: Party['status'] }>
		transferLeadership: Request<null, 'warzone:transferPartyLeadership', { leader: number }>
		updatePartyGameMode: Request<null, 'warzone:updatePartyGameMode', { mode: Party['gameMode'] }>
	}

	export interface APIs {
		getStats: (Pick<Stats, 'kills' | 'assists' | 'deaths'> & { result: 'win' | 'loss' })[]
		getProfilesStats: Record<string, APIs['getStats'][number]>
		prepareForMatch: boolean
	}

	export interface Player {
		Friend: GamerProfile['profile_id']
		Match: {
			match_id: number
			playedAt: number
			map: GameMap
			result: Performance['result']
			delta: number
			stats: {
				kills: Stats['kills']
				deaths: Stats['deaths']
				assits: Stats['assists']
			}
		}
	}

	export type Stats = {
		kills: number
		deaths: number
		assists: number
		wins: number
		losses: number
		winRate: number
		killsDeathsRatio: number
		matches: number
	}

	export interface Notification {
		id: string
		type: 'party_invite'
		title: string
		description: string
		createdAt: number
		author: {
			avatar: GamerProfile['avatar']
		}
	}
	export interface Performance {
		match_id: number
		profile_id: string
		result: 'win' | 'loss'
		kills: number
		deaths: number
		assists: number
	}

	export type GamerProfile = Omit<Profile, 'status'> & {
		sessionId: number
		status: Profile['status'] | 'in_game'
	}

	export type Profile = {
		profile_id: string
		name: string
		avatar: string | null
		status: 'online' | 'offline' | 'dnd'
	}

	export type Party = {
		profiles: (GamerProfile & {
			ready: boolean
		})[]
		leader: GamerProfile['sessionId']
		roomAvailable: number
		status: 'searching' | 'idle' | 'found'
		gameMode: Match['mode']
	}

	export type Match = {
		bucket: number
		mode: GameMode
		map: GameMap
		playedAt: number
		currentRound: number
		teams: {
			roundsWon: number
			players: {
				isDead: boolean
				avatar: string | null
				sessionId: number
			}[]
		}[]
		parties: {
			party: Party
			lastStatus: Record<string, GamerProfile['status']>
		}[]
	}

	export type Leaderboard = {
		place: number
		score: number
		profile_id: GamerProfile['profile_id']
		name: GamerProfile['name']
		avatar: GamerProfile['avatar']
	}[]

	export type GameModes = typeof Constants.warzone.game_modes
	export type GameMaps = typeof Constants.warzone.game_maps
	export type GameMode = keyof GameModes
	export type GameMap = keyof GameMaps

	export type Stage = 'lobby' | 'loading' | 'in-game'

	export type CasualMatch = Record<'own' | 'opponent', Match['teams'][number]>
}

export namespace Start {
	export interface Events {
		modeSelection: Event<'start:modeSelection', [Character[]]>
		pause: Event<'start:pause', []>
	}
	export interface Requests {
		selectMode: Request<null, 'start:selectMode', { mode: Mode; character: Mapped<Start.CharacterRespose> }>
		createCharacter: Request<null, 'start:createCharacter', { mode: Mode; character: Mapped<Character> }>
		exitGame: Request<null, 'start:exitGame'>
		logout: Request<null, 'start:logout'>
		getModeCharacter: Request<number | null, 'start:getModeCharacter', { mode: Mode; characters: Mapped<Character>[] }>
	}
	export type Mode = 'warzone' | 'police' | 'gang' | 'justice' | 'race'

	export type CharacterRespose = [Mapped<Character>, null] | [null, [string, string, string, number]]
}

export namespace Common {
	export type Hud = {
		health: number
		armor: number
		lungs: number
		weapon: {
			name: string
			image: string
			clipAmmo: number
			clipSize: number
			reserveAmmo: number
		}
	}
	export interface Events {
		displayHud: Event<'hud:display', [{ vitals: boolean; weaponary: boolean }]>
		updateHud: Event<'hud:update', [Hud]>
		updateTopscoreData: Event<'topscore:updateData', [Topscore.Data | null]>
	}

	export namespace Topscore {
		export type Data = Record<
			1 | 2 | 3,
			{
				scale: number
				bottom: number
				left: number
				visible: boolean
				name: string
				avatar: string
				stats: {
					kills: number
					deaths: number
					wins: number
					kd: number
				}
			}
		>

		export type ContextData = Record<1 | 2 | 3, Omit<Data[1], 'scale' | 'bottom' | 'left' | 'visible'>>
	}
}

export namespace Police {
	export interface Events {
		displayHud: Event<'hud:display', [{ vitals: boolean; weaponary: boolean }]>
		updateHud: Event<'hud:update', [Common.Hud]>
		addOfficer: Event<'roster:addOfficer', [Roster.Officer]>
		refreshOfficers: Event<'roster:refreshOfficers', [Roster.Officers]>
		displayRoster: Event<'roster:display', [boolean, number]>
	}

	export interface Requests {
		updateOfficer: Request<null, 'roster:updateOfficer', Roster.PartialOfficer>
		triggerCallsign: Request<null, 'roster:callsign'>
	}

	export namespace Roster {
		export type DutyState = 'on' | 'off' | 'break'
		export type TalkState = 'on' | 'off'

		export interface Officer {
			playerId: number
			callsign: string
			name: string
			duty_state: DutyState
			talk_state: TalkState
		}
		export type Officers = Record<number, Officer>

		export type OfficerUpdates = AtLeastOne<Omit<Officer, 'playerId'>>

		export type PartialOfficer = {
			playerId: Officer['playerId']
		} & OfficerUpdates
	}
}

export namespace Gang {
	export interface Events {
		displayIpad: Event<'ipad:display', []>
	}

	export interface Criminial {
		success: boolean
		error?: string
		item?: string
		amount?: number
		response?: string
	}

	export type Robbery = {
		leader: number
		members: number[]
	}
}
