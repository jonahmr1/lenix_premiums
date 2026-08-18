import { asserts, random } from "@lenix/lenix";
import { createObject, triggerClientCallback } from "@overextended/ox_lib/server";
import { Config } from "common/config/competitive";
import type { Vec3 } from "lenix";
import { server } from "lenix/server";
import type { Competitive } from "types/index";

export abstract class Matches {
	private static readonly matches = new Set<Competitive.Match>()
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

		this.matches.add(match)

		for (const team of match.teams) for (const player of team.players) {
			SetPlayerRoutingBucket(player.sessionId.toString(), bucket)
			emitNet('lenix:server:competitive:updateStage', player.sessionId, 'loading' satisfies Competitive.Stage)
		}

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

		this.startRound(match)
	}

	static startRound(match: Competitive.Match) {
		const gameMode = Config.game_modes[match.mode]

		for (const team of match.teams) {
			for (const player of team.players) {
				emitNet(
					'lenix:server:competitive:newRound',
					player.sessionId,
					match.mode satisfies Competitive.Match['mode'],
					this.getClientRoundTeams(player.sessionId, match.teams) satisfies Competitive.CasualMatch
				)
			}
		}

		setTimeout(() => {
			this.finishRound()
		}, (gameMode.round_time + gameMode.pre_and_post_round_time) * 1000)
	}

	static finishRound() {

	}

	static crash(client: number) {

	}

	static onPlayerDead(client: number, killer?: number) {
		const victimTeam = this.getClientTeam(client)
		if (!victimTeam) return

		const victim = victimTeam.players.find(
			player => player.sessionId === client
		)

		asserts(victim)
		asserts(victim.isDead)

		const match = this.getClientMatch(client)
		asserts(match, `Failed to get client<${client}>'s match`)

		victim.isDead = true

		match.teams.forEach(team => team.players.forEach(player =>
			emitNet(
				'lenix:server:competitive:updateRound',
				player.sessionId,
				this.getClientRoundTeams(player.sessionId, match.teams) satisfies Competitive.CasualMatch
			)
		))

		if (victimTeam.players.every(player => player.isDead)) setTimeout(
			() => this.startRound(match),
			Config.game_modes[match.mode].pre_and_post_round_time * 1000
		)
	}

	static getClientMatch(client: number) {
		for (const match of this.matches) {
			const isClientInMatch = match.teams.some(team =>
				team.players.some(player => player.sessionId === client)
			)

			if (isClientInMatch) return match
		}
	}

	static getClientTeam(client: number) {
		for (const match of this.matches) {
			const team = match.teams.find(team =>
				team.players.some(player => player.sessionId === client)
			)

			if (team) return team
		}
	}

	static getClientRoundTeams(client: number, teams: Competitive.Match['teams']) {
		const own = teams.find(team =>
			team.players.some(self => self.sessionId === client)
		)

		const opponent = teams.find(team =>
			!team.players.some(self => self.sessionId === client)
		)

		asserts(own && opponent, 'Failed to resolve match teams')

		return { own, opponent }
	}
}

onNet('baseevents:onPlayerDied', () => {
	Matches.onPlayerDead(source)
})

onNet('baseevents:onPlayerKilled', (killer: number) => {
	Matches.onPlayerDead(source, killer)
})

setTimeout(() => {
	createObject('ap1_01_d_wall_cap', ...GetEntityCoords(server.entity.handleBySource(1)) as Vec3, 0, false, false, false)
})
