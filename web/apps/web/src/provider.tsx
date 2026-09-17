import { StatesContext } from "./context";
import { useEffect, useState } from "react";
import { entries } from "@lenix/lenix";
import type { SetStatesOverload, States } from "./types";
import { MODES } from "./competitive/constants";
import { DEV } from "./App";

export const StatesProvider = ({ children }: { children: React.ReactNode }) => {
	const [state, setRawState] = useState<States>()

	useEffect(() => {
		DEV(() => {
			setRawState({
				lobby: {
					mode: entries(MODES)[0][0]
				},
				settings: {
					keyboardMouse: {
						mouseInputMethod: 'raw',
						mouseLookSensitivity: 3,
						mouseSmoothingScale: 3,
						fineAimingControl: true,
						invertMouseLook: false,
						toggleAim: true,
						firstPersonAimType: 'normal',
						defaultMouseDivingControl: 'camera',
						defaultMouseFlyingControl: 'camera',
						defaultMouseSubmarineControl: 'camera',
						mouseDrivingSensitivity: 4,
						mousePlaneSensitivity: 5,
						mouseHeliSensitivity: 6,
						mouseSubmarineSensitivity: 8,
						invertMouseFlying: false,
						invertMouseSubmarine: true,
						mouseFlyingControlType: 'roll',
						autoCenterMouseOnBikes: 2,
						autoCenterMouseInCars: 5,
						autoCenterMouseInAircraft: 5,
					}
				}
			})
		})
	}, [])

	if (!state) return null/* loading? */

	const setState: SetStatesOverload = (...args) => {
		const [value, patch] = args

		setRawState(prev => {
			if (!prev) return prev

			if (value === null) return { ...prev, ...patch }
			return typeof value === 'function' ? value(prev) : value
		})
	}

	return (
		<StatesContext.Provider value={[state, setState]}>
			{children}
		</StatesContext.Provider>
	)
}