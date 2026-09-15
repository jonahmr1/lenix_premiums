import { createContext } from "react";
import { MODES } from "./constants";

export const CompetitiveContext = createContext<{
	selectedMode: keyof typeof MODES
	setSelectedMode: (mode: keyof typeof MODES) => void
} | null>(null)