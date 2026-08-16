import { asserts, random } from "@lenix/lenix";
import { Config } from "common/config/competitive";
import type { Vec4 } from "lenix";
import { server } from "lenix/server";
import type { Competitive } from "types/index";

export class Match {
	constructor(teams: Competitive.Player['Party'][]) {
		teams.forEach((team, iter) => {
			const allowedMaps = Config.game_modes[team.gameMode].maps_allowed
			const modeMap = allowedMaps[random(0, allowedMaps.length - 1)] as keyof typeof Config.game_maps
			asserts(modeMap, `Failed to find a map for a found match, expected 'string', got ${modeMap}`)

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
}