import type { S } from "@lenix/lenix"
import type { MODES } from "./constants"

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