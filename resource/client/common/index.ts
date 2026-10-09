import emotes from "./emotes";
import identities from "./identities";
import radialmenu from "./radialmenu";
import hud from "./hud";
import safezones from "./safezones";
import type { Start } from "types/index";

export default (mode: Start.Mode) => {
	const radialmenuMod = radialmenu(mode)
  const modules = [
    emotes,
    identities,
    radialmenuMod,
		hud,
    safezones,
  ];

  return () => {
    for (const disposes of modules) for (const dispose of disposes) dispose();
  };
};
