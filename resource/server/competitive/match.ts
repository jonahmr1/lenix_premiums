import { asserts, random } from "@lenix/lenix";
import { triggerClientCallback } from "@overextended/ox_lib/server";
import { Config } from "common/config/competitive";
import type { Vec3 } from "lenix";
import { server } from "lenix/server";
import type { Competitive } from "types/index";

export abstract class Matches {
	private static readonly matches = new Set<
		Omit<Competitive.Match, 'match_id'> & {
			teams: Competitive.Party[]
			bucket: number
		}
	>()
	private static bucketId = 1

	static async request(teams: Competitive.Party[]) {
		const allowedMaps = Config.game_modes[teams[0]!.gameMode].maps_allowed
		const map = allowedMaps[random(0, allowedMaps.length - 1)] as keyof typeof Config.game_maps
		asserts(map, `Failed to find a map for a found match, expected 'string', got ${map}`)

		const bucket = this.bucketId++
		this.matches.add({
			map,
			played_at: Math.floor(Date.now() / 1000),
			teams,
			bucket
		})

		for (const team of teams) for (const profile of team.profiles) {
			SetPlayerRoutingBucket(profile.sessionId.toString(), bucket)
			emitNet('lenix:server:competitive:updateStage', profile.sessionId, 'loading' satisfies Competitive.Stage)
		}

		for (const [iter, team] of teams.entries()) {
			const teamSpawnSide = Config.game_maps[map].team_spawn_points[iter]
			asserts(teamSpawnSide, `Failed to find team spawn side points`)

			for (const [iter, profile] of team.profiles.entries()) {
				const playerSpawnPoint = teamSpawnSide[iter]
				asserts(playerSpawnPoint?.length === 4, `Failed to find player<${profile.sessionId}> spawn point`)

				const loaded = await triggerClientCallback<boolean>(
					'lenix:server:competitive:getPrepared',
					profile.sessionId, [playerSpawnPoint[0]!, playerSpawnPoint[1]!, playerSpawnPoint[2]!] satisfies Vec3
				)
				asserts(loaded, `client<${profile.sessionId}> was not ready to play this match`)

				emitNet(
					'lenix:server:competitive:updateStage',
					profile.sessionId,
					'in-game' satisfies Competitive.Stage
				)
			}
		}

		this.start(teams)
	}

	static start(teams: Competitive.Party[]) {
		const gameMode = Config.game_modes[teams[0]!.gameMode]

		for (const team of teams) {
			for (const profile of team.profiles) {
				const ownTeam = teams.find(team =>
					team.profiles.some(self => self.sessionId === profile.sessionId)
				)

				const opponentTeam = teams.find(team =>
					!team.profiles.some(self => self.sessionId === profile.sessionId)
				)

				asserts(ownTeam && opponentTeam, 'Failed to resolve match teams')

				emitNet(
					'lenix:server:competitive:newRound',
					profile.sessionId,
					team.gameMode,
					{
						own: {
							roundsWon: 0,
							players: ownTeam.profiles.map(profile => ({
								isDead: false,
								avatar: profile.avatar ?? ''
							}))
						},
						opponent: {
							roundsWon: 0,
							players: opponentTeam.profiles.map(profile => ({
								isDead: false,
								avatar: profile.avatar ?? ''
							}))
						}
					} satisfies Competitive.RoundTeams
				)
			}
		}

		on(
			'weaponDamageEvent',
			(attacker: number, data: { willKill: boolean; hitGlobalId?: number }) => {
				if (!data.willKill || data.hitGlobalId === undefined) return

				const attackerTeam = teams.find(team =>
					team.profiles.some(profile => profile.sessionId === attacker)
				)

				if (!attackerTeam) return

				const victimEntity = server.entity.handle(data.hitGlobalId)
				if (!victimEntity || !DoesEntityExist(victimEntity)) return

				const victim = NetworkGetEntityOwner(victimEntity)

				const victimTeam = teams.find(team =>
					team.profiles.some(profile => profile.sessionId === victim)
				)

				if (!victimTeam || victimTeam === attackerTeam) return

				teams.forEach(team => team.profiles.forEach(profile =>
					emitNet('lenix:server:competitive:updateRound', profile.sessionId)
				))
			}
		)

		setTimeout(() => {
			this.finishRound()
		}, (gameMode.round_time + gameMode.pre_and_post_round_time) * 1000);
	}

	static startRound() {

	}

	static finishRound() {

	}

	static crash(client: number) {

	}
}