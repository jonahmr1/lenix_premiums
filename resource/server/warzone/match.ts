import { asserts } from '@lenix/lenix'
import { sleep, triggerClientCallback } from '@overextended/ox_lib/server'
import { Constants } from 'common/config/constants'
import type { Vec3, Vec4 } from 'lenix'
import type { Warzone } from 'types/index'
import { Parties } from './party'
import { getSpawnPoints, getWallPoints } from './utils'

export abstract class MatchRegistry {
	protected static readonly matches = new Set<Warzone.Match>()

	protected static getClientMatch(client: number): Warzone.Match
	protected static getClientMatch(client: number, dontThrow: true): Warzone.Match | undefined
	protected static getClientMatch(client: number, dontThrow = false) {
		for (const match of this.matches) {
			const isClientInMatch = match.teams.some(team => team.players.some(player => player.sessionId === client))

			if (isClientInMatch) return match
		}
		asserts(dontThrow, `Failed to get client<${client}>'s match`)
	}

	protected static getClientTeam(client: number, from?: Warzone.Match['teams']) {
		const teams = from ?? this.getClientMatch(client).teams
		const team = teams.find(team => team.players.some(player => player.sessionId === client))
		asserts(team, `Failed to get client<${client}>'s team`)

		return team
	}

	protected static getPlayerByMatch(client: number, from?: Warzone.Match) {
		const match = from ?? this.getClientMatch(client)
		const player = match.teams.flatMap(team => team.players).find(player => player.sessionId === client)
		asserts(player, `Failed to get client<${client}>'s match player`)

		return player
	}

	protected static getClientRoundTeams(client: number, teams: Warzone.Match['teams']) {
		const own = teams.find(team => team.players.some(self => self.sessionId === client))

		const opponent = teams.find(team => !team.players.some(self => self.sessionId === client))

		asserts(own && opponent, 'Failed to resolve match teams')

		return { own, opponent }
	}

	protected static refreshTeams(teams: Warzone.Match['teams']) {
		for (const team of teams)
			for (const player of team.players)
				emitNet(
					'lenix:server:warzone:updateRound',
					player.sessionId,
					this.getClientRoundTeams(player.sessionId, teams) satisfies Warzone.CasualMatch,
				)
	}

	protected static getMatchByBucketId(bucket: number) {
		for (const match of this.matches) {
			if (match.bucket === bucket) return match
		}
	}

	protected static getPlayerSpawnPoint(
		player: Warzone.Match['teams'][number]['players'][number],
		match: Warzone.Match,
	): Vec4 {
		for (const [i, team] of match.teams.entries()) {
			const playerIndex = team.players.findIndex(self => self.sessionId === player.sessionId)

			if (playerIndex === -1) continue

			const teamStagingAreaSides = Constants.warzone.game_maps[match.map].pre_round_staging_area[i]

			asserts(teamStagingAreaSides?.length === 4, `Failed to find team staging area`)

			const spawnPoint = getSpawnPoints([...teamStagingAreaSides] as Vec3[], team.players.length)[playerIndex]

			asserts(spawnPoint?.length === 4, `Failed to find player<${player.sessionId}> spawn point`)

			return spawnPoint as Vec4
		}

		asserts(false, `Failed to get player<${player.sessionId}> spawn point`)
	}
}

export abstract class Matches extends MatchRegistry {
	private static bucketId = 1

	static async new(mode: Warzone.Match['mode'], map: Warzone.Match['map'], parties: Warzone.Party[]) {
		const bucket = this.bucketId++
		const match = {
			bucket,
			mode,
			map,
			playedAt: Math.floor(Date.now() / 1000),
			currentRound: 0,
			teams: parties.map(team => ({
				roundsWon: 0,
				players: team.profiles.map(profile => ({
					isDead: false,
					avatar: profile.avatar,
					sessionId: profile.sessionId,
				})),
			})),
			parties: parties.map(party => ({
				party,
				lastStatus: Object.fromEntries(party.profiles.map(profile => [profile.profile_id, profile.status])),
			})),
		}

		for (const team of match.teams)
			for (const player of team.players) {
				SetPlayerRoutingBucket(player.sessionId.toString(), bucket)
				emitNet('lenix:server:warzone:updateStage', player.sessionId, 'loading' satisfies Warzone.Stage)
			}

		try {
			for (const team of match.teams)
				for (const player of team.players) {
					const coords = this.getPlayerSpawnPoint(player, match)

					const loaded = await triggerClientCallback<boolean>('lenix:server:warzone:getPrepared', player.sessionId, [
						coords[0],
						coords[1],
						coords[2],
					] satisfies Vec3)
					asserts(loaded, `client<${player.sessionId}> was not ready to play this match`)

					emitNet('lenix:server:warzone:updateStage', player.sessionId, 'in-game' satisfies Warzone.Stage)
				}
		} catch (error) {
			for (const team of match.teams)
				for (const player of team.players) {
					SetPlayerRoutingBucket(player.sessionId.toString(), 0)

					emitNet('lenix:server:warzone:updateStage', player.sessionId, 'lobby' satisfies Warzone.Stage)
				}
			throw error
		}

		for (const party of parties) {
			party.status = 'found'
			for (const profile of party.profiles) profile.status = 'in_game'
			Parties.refreshPartyProfiles(party)
		}

		this.matches.add(match)
		this.nextRound(match)
	}

	private static abort(match: Warzone.Match) {
		if (!this.matches.delete(match)) return

		for (const team of match.teams) {
			for (const player of team.players) {
				SetPlayerRoutingBucket(player.sessionId.toString(), 0)
				emitNet('lenix:server:warzone:updateStage', player.sessionId, 'lobby' satisfies Warzone.Stage)
			}
		}

		for (const { party, lastStatus } of match.parties) {
			party.status = 'idle'

			for (const profile of party.profiles) {
				const status = lastStatus[profile.profile_id]
				asserts(status)
				profile.status = status
			}

			Parties.refreshPartyProfiles(party)
		}
	}

	private static startRound(match: Warzone.Match) {
		const round = ++match.currentRound
		const gameMode = Constants.warzone.game_modes[match.mode]

		for (const [teamIndex, team] of match.teams.entries()) {
			const teamStagingArea = Constants.warzone.game_maps[match.map].pre_round_staging_area[teamIndex]
			asserts(teamStagingArea?.length === 4, `Failed to find team staging area`)
			const walls = getWallPoints([...teamStagingArea] as Vec3[])

			for (const player of team.players) {
				const coords = this.getPlayerSpawnPoint(player, match)

				player.isDead = false
				emitNet(
					'lenix:server:warzone:newRound',
					player.sessionId,
					match.mode satisfies Warzone.Match['mode'],
					this.getClientRoundTeams(player.sessionId, match.teams) satisfies Warzone.CasualMatch,
					coords satisfies Vec4,
					walls satisfies Vec4[],
				)
				emitNet('lenix:client:medical:heal', player.sessionId)
			}
		}

		setTimeout(() => this.nextRound(match, round), (gameMode.round_time + gameMode.pre_and_post_round_time) * 1000)
	}

	private static nextRound(match: Warzone.Match, lastRound?: number) {
		const currentMatch = lastRound ? this.getMatchByBucketId(match.bucket) : match
		asserts(currentMatch)

		if (lastRound && currentMatch.currentRound !== lastRound) return

		const roundsToWin = Math.ceil(Constants.warzone.game_modes[currentMatch.mode].rounds / 2)

		const winner = currentMatch.teams.some(team => team.roundsWon >= roundsToWin)

		if (winner) {
			this.abort(currentMatch)
			return
		}
		this.startRound(currentMatch)
	}

	static async playerDied(client: number, killer?: number) {
		const match = this.getClientMatch(client, true)
		if (!match) return

		const victimTeam = this.getClientTeam(client, match.teams)
		asserts(victimTeam, `Failed to get client<${client}>'s team`)

		const victim = victimTeam.players.find(player => player.sessionId === client)
		asserts(victim && !victim.isDead)

		const gameMode = Constants.warzone.game_modes[match.mode]
		victim.isDead = true

		this.refreshTeams(match.teams)

		if (victimTeam.players.every(player => player.isDead)) {
			const winnerTeam = match.teams.find(team => team.players.every(player => player.sessionId !== client))
			asserts(winnerTeam)

			winnerTeam.roundsWon++

			await sleep(gameMode.pre_and_post_round_time * 1000)

			this.nextRound(match)
		}
	}

	static crash(client: number) {
		const match = this.getClientMatch(client, true)
		if (!match) return

		const team = this.getClientTeam(client, match.teams)
		team.players = team.players.filter(player => player.sessionId !== client)

		SetPlayerRoutingBucket(client.toString(), 0)

		this.refreshTeams(match.teams)

		if (!team.players.length) {
			this.abort(match)
		}
	}
}

onNet('baseevents:onPlayerDied', () => {
	Matches.playerDied(source)
})

onNet('baseevents:onPlayerKilled', (killer: number) => {
	Matches.playerDied(source, killer)
})
