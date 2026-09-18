import type { S } from "@lenix/lenix"
import type { MODES } from "./competitive/constants"

export interface Storage {
	hudVariant: 'progress' | 'bar'
}
export interface Tab {
	label: string
	content: React.ReactNode
	disabled?: true
}
export interface ButtonStart {
	label: string
	onClick: () => void
	disabled?: true
	styles?: string
}

export interface States {
	lobby: {
		mode: keyof typeof MODES
	}
	settings: {
		keyboardMouse: {
			mouseInputMethod: 'raw' | 'other',
			mouseLookSensitivity: 3,
			mouseSmoothingScale: 3,
			fineAimingControl: 'on' | 'off',
			invertMouseLook: 'on' | 'off',
			toggleAim: 'on' | 'off',
			firstPersonAimType: 'normal' | 'other',
			defaultMouseDrivingControl: 'camera' | 'other',
			defaultMouseFlyingControl: 'camera' | 'other',
			defaultMouseSubmarineControl: 'camera' | 'other',
			mouseDrivingSensitivity: 4,
			mousePlaneSensitivity: 5,
			mouseHeliSensitivity: 6,
			mouseSubmarineSensitivity: 8,
			invertMouseFlying: 'on' | 'off',
			invertMouseSubmarine: 'on' | 'off',
			mouseFlyingControlType: 'roll' | 'pitch' | 'other',
			autoCenterMouseOnBikes: 2,
			autoCenterMouseInCars: 5,
			autoCenterMouseInAircraft: 5,
		},
		keybinds: {
			general: Record<
				| 'pause'
				| 'radarZoomMultiplayerInformation'
				| 'cycleCamera'
				| 'toggleSpecialAbility'
				| 'characterSelector'
				| 'switchToMichael'
				| 'switchToFranklin'
				| 'switchToTrevor'
				| 'switchToGtaOnline'
				| 'interactionMenu'
				| 'startStopRecording'
				| 'startStopActionReplayRecording'
				| 'cancelRecording'
				| 'rockstarGamesOverlay'
				| 'contextAction'
			, [string, string]>
			// movement: []
			// combat: []
			// weaponSelect: []
			// carsBikesBoats: []
			// aircraft: []
			// submersibles: []
			// parachute: []
			// cellphone: []
			// gtaOnline: []
			// gtaOnlineVehicles: []
			// fivem: []
		}
	}
}

export type DeepPartial<T> =
	T extends readonly unknown[] ? T :
	T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } :
	T

export type SetStatesOverload = (
	...args:
		| [value: Parameters<S<States>>[0]]
		| [value: null, patch: DeepPartial<States>]
) => void

export interface MatchScore {
	own: number
	opponent: number
}