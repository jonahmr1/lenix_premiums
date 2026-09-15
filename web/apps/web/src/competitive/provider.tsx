import { Outlet } from "react-router";
import { CompetitiveContext } from "./context";
import { useState } from "react";
import { MODES } from "./constants";
import { entries } from "@lenix/lenix";

export const CompetitiveProvider = () => {
	const [selectedMode, setSelectedMode] = useState<keyof typeof MODES>(entries(MODES)[0][0])

	return (
		<CompetitiveContext.Provider value={{ selectedMode, setSelectedMode }}>
			<Outlet />
		</CompetitiveContext.Provider>
	)
}