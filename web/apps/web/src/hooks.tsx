import { useContext } from "react"
import { StatesContext } from "./context"
import { asserts } from "@lenix/lenix"

export const useStates = () => {
	const context = useContext(StatesContext)
	asserts(context, 'useStates must be used inside StatesProvider')

	return context
}