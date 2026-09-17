import { Outlet } from "react-router";
import { CompetitiveContext } from "./context";
import { useState } from "react";
import { MODES } from "./constants";
import { entries, type S } from "@lenix/lenix";
import type { SetStatesOverload, States } from "./types";

export const CompetitiveProvider = () => {
	const [state, setRawState] = useState<States>({
		lobby: {
			mode: entries(MODES)[0][0]
		}
	})

	const setState: SetStatesOverload = (...args) => {
		const [value, patch] = args

		if (value === null) {
			setRawState(prev => ({ ...prev, ...patch }))
		} else {
			setRawState(value)
		}
	}

	return (
		<CompetitiveContext.Provider value={{ state, setState }}>
			<Outlet />
		</CompetitiveContext.Provider>
	)
}