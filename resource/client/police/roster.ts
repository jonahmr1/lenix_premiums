import { cache, checkDependency, inputDialog, notify } from "@overextended/ox_lib/client";
import { GetPlayer } from "@overextended/ox_core/client";
import { control, emitNui, onEvent, onNetEvent, onNui } from "lenix/client";
import { State } from "@lenix/lenix";
import type { Gang, Roster } from "types/index";
import { Constants } from "common/config/constants";

checkDependency("ox_lib", "3.39.0", true);

const state = new State({ display: false as boolean });

const changeCallsign = async () => {
  const input = await inputDialog(
    "Update Callsgin",
    [
      {
        type: "input",
        label: "Callsign",
      },
    ],
    {},
  );
  if (!input) return;

  const callsign = input[0]?.toString();
  if (!callsign?.length) return;

  if (callsign.length > Constants.roster.max_callsign_length) {
    notify({
      title: "Failed!",
      description: `Callsign can not be longer than ${Constants.roster.max_callsign_length} characters`,
      type: "error",
    });
    return;
  }

  emitNet("lenix:server:roster:updateOfficer", {
    playerId: cache.serverId,
    callsign,
  } satisfies Roster.PartialOfficer);
};

onNui<Gang.Requests["updateOfficer"]>("roster:updateOfficer", (partialData) => {
  emitNet("lenix:server:roster:updateOfficer", partialData);
  return null;
});

onNui<Gang.Requests["triggerCallsign"]>("roster:callsign", () => {
  changeCallsign();
  return null;
});

export default [
  onNetEvent("lenix:client:roster:refreshOfficers", (officers: Roster.Officers) => {
    emitNui<Gang.Events["refreshOfficers"]>("roster:refreshOfficers", officers);
  }),

  onEvent("lenix:client:roster:toggleDisplay", () => {
    const player = GetPlayer();
    if (typeof player.getGroup("police") !== "number") return;

    emitNui<Gang.Events["displayRoster"]>("roster:display", state.display, cache.serverId);
    state.display = !state.display;
  }),

  control.on({
    event: "press",
    key: "U",
    onEvent: () => emit("lenix:client:roster:toggleDisplay"),
  }),

  control.on({
    event: "press",
    key: "F11",
    onEvent: () => SetNuiFocus(true, true),
  }),
];
