import { useContext } from "react"
import { asserts } from "@lenix/lenix"
import { StatesContext } from "./provider"

export const useStates = () => {
	const context = useContext(StatesContext)
	asserts(context, 'useStates must be used inside StatesProvider')

	return context
}