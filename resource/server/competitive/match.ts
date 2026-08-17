import { asserts, random } from "@lenix/lenix";
import { triggerClientCallback } from "@overextended/ox_lib/server";
import { Config } from "common/config/competitive";
import type { Vec3 } from "lenix";
import type { Competitive } from "types/index";

export abstract class Matches {
	private static readonly matches = new Set<
		Omit<Competitive.Match, 'match_id'> & {
			teams: Competitive.Player['Party'][]
			bucket: number
		}
	>()
	private static bucketId = 0

	static async prepare(teams: Competitive.Player['Party'][]) {
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
			emitNet('lenix:server:competitive:matchStarted', profile.sessionId)
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
			}
		}

		this.start(teams)
	}

	static start(teams: Competitive.Player['Party'][]) {
		for (const team of teams) for (const profile of team.profiles) {
			emitNet('lenix:server:competitive:updateStage', profile.sessionId, 'in-game' satisfies Competitive.Stage)
			emitNet('lenix:server:competitive:newRound', profile.sessionId)
		}
	}

	static crash(client: number) {

	}
}