import { createContext } from "react";
import type { SetStatesOverload, States } from "./types";

export const CompetitiveContext = createContext<[States,	SetStatesOverload] | null>(null)