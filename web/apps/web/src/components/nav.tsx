import type { Tab } from "@/types"
import { Button } from "@workspace/ui/components/button"
import { audiobility } from "@workspace/ui/lib/utils"
import { onKeyDown } from "lenix/nui"
import { useEffect } from "react"

const filterTabs = (tabs: Tab[]) => tabs.flatMap((mode, i) => mode.disabled ? [] : [i])

export const PreviousButton = ({ children, tabs, value, onValueChange }: {
	children: React.ReactNode
	tabs: Tab[]
	value: number
	onValueChange: (value: number) => void
}) => {
	const filteredTabs = filterTabs(tabs)

	const handlePrevious = () => {
		onValueChange(value === 0 ? filteredTabs[filteredTabs.length - 1] : filteredTabs[filteredTabs.indexOf(value) - 1])
		audiobility.onMouseEnter()
	}

	useEffect(() => onKeyDown('q', handlePrevious), [tabs, value, onValueChange])

	return (
		<Button
			size='lg'
			onClick={handlePrevious}
		>{children}</Button>
	)
}

export const NextButton = ({ children, tabs, value, onValueChange }: {
	children: React.ReactNode
	tabs: Tab[]
	value: number
	onValueChange: (value: number) => void
}) => {
	const filteredTabs = filterTabs(tabs)

	const handleNext = () => {
		onValueChange(value + 1 > filteredTabs[filteredTabs.length - 1] ? 0 : filteredTabs[filteredTabs.indexOf(value) + 1])
		audiobility.onMouseEnter()
	}

	useEffect(() => onKeyDown('e', handleNext), [value])

	return (
		<Button
			size='lg'
			onClick={handleNext}
		>{children}</Button>
	)
}