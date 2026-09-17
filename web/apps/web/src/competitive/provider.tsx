import { Outlet } from "react-router";
import { CompetitiveContext } from "./context";
import { useState } from "react";
import { MODES } from "./constants";
import { entries } from "@lenix/lenix";
import type { States } from "@/types";

export const CompetitiveProvider = () => {
	const [state, setState] = useState<States>({
		lobby: {
			mode: entries(MODES)[0][0]
		}
	})

	return (
		<CompetitiveContext.Provider value={{ state, setState }}>
			<Outlet />
		</CompetitiveContext.Provider>
	)
}