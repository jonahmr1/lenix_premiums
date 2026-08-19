import { asserts, random } from "@lenix/lenix";
import { createObject, sleep, triggerClientCallback } from "@overextended/ox_lib/server";
import { Config } from "common/config/competitive";
import type { Vec3, Vec4 } from "lenix";
import { server } from "lenix/server";
import type { Competitive } from "types/index";
import { Parties } from "./party";

export abstract class MatchRegistry {
	protected static readonly matches = new Set<Competitive.Match>()

	protected static getClientMatch(client: number): Competitive.Match
	protected static getClientMatch(client: number, dontThrow: true): Competitive.Match | undefined
	protected static getClientMatch(client: number, dontThrow = false) {
		for (const match of this.matches) {
			const isClientInMatch = match.teams.some(team =>
				team.players.some(player => player.sessionId === client)
			)

			if (isClientInMatch) return match
		}
		asserts(dontThrow, `Failed to get client<${client}>'s match`)
	}

	protected static getClientTeam(client: number, from?: Competitive.Match['teams']) {
		const teams = from ?? this.getClientMatch(client).teams
		const team = teams.find(team =>
			team.players.some(player => player.sessionId === client)
		)
		asserts(team, `Failed to get client<${client}>'s team`)

		return team
	}

	protected static getPlayerByMatch(client: number, from?: Competitive.Match) {
		const match = from ?? this.getClientMatch(client)
		const player = match.teams.flatMap(team => team.players).find(player => player.sessionId === client)
		asserts(player, `Failed to get client<${client}>'s match player`)

		return player
	}

	protected static getClientRoundTeams(client: number, teams: Competitive.Match['teams']) {
		const own = teams.find(team =>
			team.players.some(self => self.sessionId === client)
		)

		const opponent = teams.find(team =>
			!team.players.some(self => self.sessionId === client)
		)

		asserts(own && opponent, 'Failed to resolve match teams')

		return { own, opponent }
	}

	protected static refreshTeams(teams: Competitive.Match['teams']) {
		for (const team of teams) for (const player of team.players) emitNet(
			'lenix:server:competitive:updateRound',
			player.sessionId,
			this.getClientRoundTeams(player.sessionId, teams) satisfies Competitive.CasualMatch
		)
	}

	protected static getMatchByBucketId(bucket: number) {
		for (const match of this.matches) {
			if (match.bucket === bucket) return match
		}
	}

	protected static getPlayerSpawnPoint(
		player: Competitive.Match['teams'][number]['players'][number],
		match: Competitive.Match,
	): Vec4 {
		for (const [i, team] of match.teams.entries()) {
			const playerIndex = team.players.findIndex(
				self => self.sessionId === player.sessionId
			)

			if (playerIndex === -1) continue

			const teamSpawnPoints =
				Config.game_maps[match.map].team_spawn_points[i]

			asserts(teamSpawnPoints, `Failed to find team spawn side points`)

			const spawnPoint = teamSpawnPoints[playerIndex]

			asserts(
				spawnPoint?.length === 4,
				`Failed to find player<${player.sessionId}> spawn point`
			)

			return spawnPoint as Vec4
		}

		asserts(false, `Failed to get player<${player.sessionId}> spawn point`)
	}
}

export abstract class Matches extends MatchRegistry {
	private static bucketId = 1

	static async new(
		mode: Competitive.Match['mode'],
		map: Competitive.Match['map'],
		parties: Competitive.Party[]
	) {
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
					sessionId: profile.sessionId
				}))
			})),
			parties: parties.map(party => ({
				party,
				lastStatus: Object.fromEntries(
					party.profiles.map(profile => [
						profile.profile_id,
						profile.status
					])
				)
			}))
		}

		for (const team of match.teams) for (const player of team.players) {
			SetPlayerRoutingBucket(player.sessionId.toString(), bucket)
			emitNet('lenix:server:competitive:updateStage', player.sessionId, 'loading' satisfies Competitive.Stage)
		}

		try {
			for (const team of match.teams) for (const player of team.players) {
				const coords = this.getPlayerSpawnPoint(player, match)

				const loaded = await triggerClientCallback<boolean>(
					'lenix:server:competitive:getPrepared',
					player.sessionId,
					[coords[0], coords[1], coords[2]] satisfies Vec3
				)
				asserts(loaded, `client<${player.sessionId}> was not ready to play this match`)

				emitNet(
					'lenix:server:competitive:updateStage',
					player.sessionId,
					'in-game' satisfies Competitive.Stage
				)
			}
		} catch (error) {
			for (const team of match.teams) for (const player of team.players) {
				SetPlayerRoutingBucket(
					player.sessionId.toString(),
					0
				)

				emitNet(
					'lenix:server:competitive:updateStage',
					player.sessionId,
					'lobby' satisfies Competitive.Stage
				)
			}
			throw error
		}

		for (const party of parties) {
			party.status = 'found'
			for (const profile of party.profiles) profile.status = 'in_game'
			Parties.refreshPartyProfiles(party)
		}

		this.matches.add(match)
		this.startRound(match)
	}

	static abort(match: Competitive.Match) {
		if (!this.matches.delete(match)) return

		for (const team of match.teams) {
			for (const player of team.players) {
				SetPlayerRoutingBucket(player.sessionId.toString(), 0)
				emitNet(
					'lenix:server:competitive:updateStage',
					player.sessionId,
					'lobby' satisfies Competitive.Stage
				)
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

	static startRound(match: Competitive.Match) {
		const round = ++match.currentRound
		const gameMode = Config.game_modes[match.mode]

		for (const team of match.teams) for (const player of team.players) {
			const coords = this.getPlayerSpawnPoint(player, match)
			player.isDead = false
			emitNet(
				'lenix:server:competitive:newRound',
				player.sessionId,
				match.mode satisfies Competitive.Match['mode'],
				coords satisfies Vec4,
				this.getClientRoundTeams(player.sessionId, match.teams) satisfies Competitive.CasualMatch
			)
		}

		setTimeout(() => {
			const latestMatch = this.getMatchByBucketId(match.bucket)
			if (latestMatch?.currentRound !== round) return

			this.startRound(latestMatch)
		}, (gameMode.round_time + gameMode.pre_and_post_round_time) * 1000)
	}

	static async playerDied(client: number, killer?: number) {
		const match = this.getClientMatch(client, true)
		if (!match) return

		const victimTeam = this.getClientTeam(client, match.teams)
		asserts(victimTeam, `Failed to get client<${client}>'s team`)

		const victim = victimTeam.players.find(
			player => player.sessionId === client
		)
		asserts(victim && !victim.isDead)

		const gameMode = Config.game_modes[match.mode]
		victim.isDead = true

		this.refreshTeams(match.teams)

		if (victimTeam.players.every(player => player.isDead)) {
			const winnerTeam = match.teams.find(team => team.players.every(player => player.sessionId !== client))
			asserts(winnerTeam)

			winnerTeam.roundsWon++

			await sleep(gameMode.pre_and_post_round_time * 1000)

			gameMode.rounds === match.currentRound ? this.abort(match) : this.startRound(match)
		}
	}

	static crash(client: number) {
		const match = this.getClientMatch(client, true)
		if (!match) return

		const team = this.getClientTeam(client, match.teams)
		team.players = team.players.filter(player => player.sessionId !== client)


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

setTimeout(() => {
	createObject('ap1_01_d_wall_cap', ...GetEntityCoords(server.entity.handleBySource(1)) as Vec3, 0, false, false, false)
})
