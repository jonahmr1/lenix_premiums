import { createContext } from "react";
import type { SetStatesOverload, States } from "./types";

export const StatesContext = createContext<[States, SetStatesOverload] | null>(null)