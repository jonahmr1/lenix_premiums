import "./db";
import type { Start } from "types/index";
import { oxmysql } from "@overextended/oxmysql";
import { asserts } from "@lenix/lenix";
import { onNuiServer } from "lenix/server";
import { GetPlayer } from "@overextended/ox_core/server";
import { table } from "../db";

const pendingCreations = new Map<number, Start.Mode>()

on("ox:createdCharacter", async (playerId: number, _userId: number, charId: number) => {
	const mode = pendingCreations.get(playerId)
	asserts(mode)
  await oxmysql.insert(`INSERT INTO ${table("start")} (charId, type) VALUES(?, ?)`, [charId, mode]);
	pendingCreations.delete(playerId)
});

onNuiServer<Start.Requests["getModeCharacter"]>("start:getModeCharacter", async (client, { mode, characters }) => {
  const player = GetPlayer(client);
  asserts(player, `Failed to get player<${client}> while fetching his mode characters`);

  const re = characters.length
		? await oxmysql.single(`SELECT charId FROM ${table("start")} WHERE type = ? AND charId IN (?)`, [
			mode,
			characters.map((char) => char.charId),
		])
		: null
	if (!re) pendingCreations.set(client, mode)
	else pendingCreations.delete(client)

  return (re?.charId as number) ?? re;
});

on('playerDropped', () => pendingCreations.delete(Number(source)))

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
