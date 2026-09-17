import { createContext } from "react";
import type { SetStatesOverload, States } from "./types";

	export const CompetitiveContext = createContext<{
		state: States
		setState: SetStatesOverload
	} | null>(null)