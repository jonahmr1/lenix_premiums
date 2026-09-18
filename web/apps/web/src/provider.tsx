import { StatesContext } from "./context";
import { useEffect, useState } from "react";
import { entries } from "@lenix/lenix";
import type { DeepPartial, SetStatesOverload, States } from "./types";
import { MODES } from "./competitive/constants";
import { DEV } from "./App";

const deepMerge = <T,>(current: T, patch: DeepPartial<T>): T => {
	if (patch === null || typeof patch !== 'object' || Array.isArray(patch)) return patch as T

	const result: Record<string, unknown> = {
		...(current as Record<string, unknown>)
	}

	for (const [key, value] of Object.entries(patch)) {
		if (value !== undefined) result[key] = deepMerge(result[key], value)
	}

	return result as T
}

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
						fineAimingControl: 'on',
						invertMouseLook: 'off',
						toggleAim: 'on',
						firstPersonAimType: 'normal',
						defaultMouseDrivingControl: 'camera',
						defaultMouseFlyingControl: 'camera',
						defaultMouseSubmarineControl: 'camera',
						mouseDrivingSensitivity: 4,
						mousePlaneSensitivity: 5,
						mouseHeliSensitivity: 6,
						mouseSubmarineSensitivity: 8,
						invertMouseFlying: 'off',
						invertMouseSubmarine: 'on',
						mouseFlyingControlType: 'roll',
						autoCenterMouseOnBikes: 2,
						autoCenterMouseInCars: 5,
						autoCenterMouseInAircraft: 5,
					},
					keybinds: {
						general: {
							pause: ['E', ''],
							radarZoomMultiplayerInformation: ['E', ''],
							cycleCamera: ['E', ''],
							toggleSpecialAbility: ['E', ''],
							characterSelector: ['E', ''],
							switchToMichael: ['E', ''],
							switchToFranklin: ['E', ''],
							switchToTrevor: ['E', ''],
							switchToGtaOnline: ['E', ''],
							interactionMenu: ['E', ''],
							startStopRecording: ['E', ''],
							startStopActionReplayRecording: ['E', ''],
							cancelRecording: ['E', ''],
							rockstarGamesOverlay: ['E', ''],
							contextAction: ['E', ''],
						},
					}
				},
			})
		})
	}, [])

	if (!state) return null/* loading? */

	const setState: SetStatesOverload = (...args) => {
		const [value, patch] = args

		setRawState(prev => {
			if (!prev) return prev

			if (value === null) return deepMerge<States>(prev, patch)

			return typeof value === 'function' ? value(prev) : value
		})
	}

	return (
		<StatesContext.Provider value={[state, setState]}>
			{children}
		</StatesContext.Provider>
	)
}