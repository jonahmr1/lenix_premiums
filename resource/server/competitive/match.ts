import { asserts, random } from "@lenix/lenix";
import { Config } from "common/config/competitive";
import type { Vec4 } from "lenix";
import { server } from "lenix/server";
import type { Competitive } from "types/index";

export abstract class Matches {
	private static readonly matches = new Set<Omit<Competitive.Match, 'match_id'>>()

	static new(teams: Competitive.Player['Party'][]) {
		const allowedMaps = Config.game_modes[teams[0]!.gameMode].maps_allowed
		const modeMap = allowedMaps[random(0, allowedMaps.length - 1)] as keyof typeof Config.game_maps
		asserts(modeMap, `Failed to find a map for a found match, expected 'string', got ${modeMap}`)
		
		this.matches.add({
			map: modeMap,
			played_at: Math.floor(Date.now() / 1000)
		})

		teams.forEach((team, iter) => {
			const teamSpawnSide = Config.game_maps[modeMap].team_spawn_points[iter]
			asserts(teamSpawnSide, `Failed to find team spawn side points`)

			team.profiles.forEach((profile, iter) => {
				const playerSpawnPoint = teamSpawnSide[iter]
				asserts(playerSpawnPoint?.length === 4, `Failed to find player<${profile.sessionId}> spawn point`)

				const entity = server.entity.handleBySource(profile.sessionId)
				server.entity.teleport(entity, ...playerSpawnPoint as Vec4)
			})
		})
	}

	static crash(client: number) {
		
	}
}