import { asserts, random } from "@lenix/lenix";
import { createObject, triggerClientCallback } from "@overextended/ox_lib/server";
import { Config } from "common/config/competitive";
import type { Vec3 } from "lenix";
import { server } from "lenix/server";
import type { Competitive } from "types/index";

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
		teams.forEach(team => team.players.forEach(player =>
			emitNet(
				'lenix:server:competitive:updateRound',
				player.sessionId,
				this.getClientRoundTeams(player.sessionId, teams) satisfies Competitive.CasualMatch
			)
		))
	}

	protected static getMatchByBucketId(bucket: number) {
		for (const match of this.matches) {
			if (match.bucket === bucket) return match
		}
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
		}
		for (const team of match.teams) for (const player of team.players) {
			SetPlayerRoutingBucket(player.sessionId.toString(), bucket)
			emitNet('lenix:server:competitive:updateStage', player.sessionId, 'loading' satisfies Competitive.Stage)
		}

		try {
			for (const [iter, team] of match.teams.entries()) {
				const teamSpawnSide = Config.game_maps[map].team_spawn_points[iter]
				asserts(teamSpawnSide, `Failed to find team spawn side points`)

				for (const [iter, player] of team.players.entries()) {
					const playerSpawnPoint = teamSpawnSide[iter]
					asserts(playerSpawnPoint?.length === 4, `Failed to find player<${player.sessionId}> spawn point`)

					const loaded = await triggerClientCallback<boolean>(
						'lenix:server:competitive:getPrepared',
						player.sessionId,
						[playerSpawnPoint[0]!, playerSpawnPoint[1]!, playerSpawnPoint[2]!] satisfies Vec3
					)
					asserts(loaded, `client<${player.sessionId}> was not ready to play this match`)

					emitNet(
						'lenix:server:competitive:updateStage',
						player.sessionId,
						'in-game' satisfies Competitive.Stage
					)
				}
			}
		} catch (error) {
			for (const team of match.teams) {
				for (const player of team.players) {
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
			}
			throw error
		}

		this.matches.add(match)
		this.startRound(match)
	}

	static stop(match: Competitive.Match) {

	}

	static startRound(match: Competitive.Match) {
		const round = ++match.currentRound
		const gameMode = Config.game_modes[match.mode]

		for (const team of match.teams) {
			for (const player of team.players) {
				player.isDead = false
				emitNet(
					'lenix:server:competitive:newRound',
					player.sessionId,
					match.mode satisfies Competitive.Match['mode'],
					this.getClientRoundTeams(player.sessionId, match.teams) satisfies Competitive.CasualMatch
				)
			}
		}

		setTimeout(() => {
			const latestMatch = this.getMatchByBucketId(match.bucket)
			if (latestMatch?.currentRound !== round) return

			this.startRound(latestMatch)
		}, (gameMode.round_time + gameMode.pre_and_post_round_time) * 1000)
	}

	static playerDied(client: number, killer?: number) {
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

			if (gameMode.rounds === match.currentRound) {
				this.stop(match)
				return
			}
			setTimeout(() => {
				this.startRound(match)
			}, gameMode.pre_and_post_round_time * 1000)
		}
	}

	static crash(client: number) {
		const match = this.getClientMatch(client, true)
		if (!match) return

		const team = this.getClientTeam(client, match.teams)
		team.players = team.players.filter(player => player.sessionId !== client)


		this.refreshTeams(match.teams)

		if (!team.players.length) {
			this.stop(match)
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
