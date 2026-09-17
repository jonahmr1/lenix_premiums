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
}

export type SetStatesOverload = (
	...args:
		| [value: Parameters<S<States>>[0]]
		| [value: null, patch: Partial<States>]
) => void