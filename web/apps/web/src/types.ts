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
			mouseInputMethod: string
			mouseLookSensitivity: number
			mouseSmoothingScale: number
			fineAimingControl: boolean
			invertMouseLook: boolean
			toggleAim: boolean
			firstPersonAimType: string
			defaultMouseDivingControl: string
			defaultMouseFlyingControl: string
			defaultMouseSubmarineControl: string
			mouseDrivingSensitivity: number
			mousePlaneSensitivity: number
			mouseHeliSensitivity: number
			mouseSubmarineSensitivity: number
			invertMouseFlying: boolean
			invertMouseSubmarine: boolean
			mouseFlyingControlType: string
			autoCenterMouseOnBikes: number
			autoCenterMouseInCars: number
			autoCenterMouseInAircraft: number
		}
	}
}

export type SetStatesOverload = (
	...args:
		| [value: Parameters<S<States>>[0]]
		| [value: null, patch: Partial<States>]
) => void