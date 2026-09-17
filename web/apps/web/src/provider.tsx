import { StatesContext } from "./context";
import { useState } from "react";
import { entries } from "@lenix/lenix";
import type { SetStatesOverload, States } from "./types";
import { MODES } from "./competitive/constants";

export const StatesProvider = ({ children }: { children: React.ReactNode }) => {
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
		<StatesContext.Provider value={[state, setState]}>
			{children}
		</StatesContext.Provider>
	)
}