import "./db";
import type { Start } from "types/index";
import { oxmysql } from "@overextended/oxmysql";
import { table } from "./utils";
import { asserts } from "@lenix/lenix";
import { onNuiServer } from "lenix/server";
import { GetPlayer } from "@overextended/ox_core/server";

on("ox:createdCharacter", async (charId: number, mode: Start.Mode) => {
  await oxmysql.insert(`INSERT INTO ${table("modes")} (charId, type) VALUES(?, ?)`, [charId, mode]);
});

onNuiServer<Start.Requests['getModeCharacter']>('start:getModeCharacter', async (client, { mode, characters }) => {
	const player = GetPlayer(client);
  asserts(player, `Failed to get player<${client}> while fetching his mode characters`);

	const re = await oxmysql.single(
		`SELECT charId FROM ${table("modes")} WHERE type = ? AND charId IN (?)`,
		[mode, characters.map((char) => char.charId)],
	);
	
	return re?.charId as number ?? re
})

onNuiServer<Start.Requests["logout"]>("start:logout", (client) => {
  const player = GetPlayer(client);
  asserts(player, `Failed to get player<${client}> to logout`);

  player.logout();
  return null;
});

onNuiServer<Start.Requests["exitGame"]>("start:exitGame", (client) => {
  const player = GetPlayer(client);
  asserts(player, `Failed to get player<${client}> to disconnect`);

  player.logout(true, true);
  DropPlayer(client.toString(), "You exited the game");

  return null;
});