import { useContext } from "react"
import { CompetitiveContext } from "./context"
import { asserts } from "@lenix/lenix"

export const useCompetitive = () => {
	const context = useContext(CompetitiveContext)
	asserts(context, `Failed to use competitive context`)

	return context
}