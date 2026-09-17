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