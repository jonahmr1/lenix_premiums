import { Outlet } from "@tanstack/react-router";
import { Hud } from "./hud";
import { Roster } from "./roster";

export const Outlaw = () => (
	<>
		<Hud />
		<Roster />
		<Outlet />
		{/* <TopScore /> */}
	</>
)