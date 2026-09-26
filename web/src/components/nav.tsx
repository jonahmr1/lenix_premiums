import type { Tab } from "@/types"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { audiobility } from "@/lib"
import { onKeyDown } from "lenix/nui"
import { useEffect } from "react"

const filterTabs = (tabs: Tab[]) => tabs.flatMap((mode, i) => mode.disabled ? [] : [i])

export const PreviousButton = ({ children, tabs, value, onValueChange, variant = 'secondary'}: {
	children: React.ReactNode
	tabs: Tab[]
	value: number
	onValueChange: (value: number) => void
	variant?: React.ComponentProps<typeof Button>['variant']
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
			variant={variant}
			className="px-w-0.5"
			audioDisabled
		>
			<Kbd>{children}</Kbd>
		</Button>
	)
}

export const NextButton = ({ children, tabs, value, onValueChange, variant = 'secondary'}: {
	children: React.ReactNode
	tabs: Tab[]
	value: number
	onValueChange: (value: number) => void
	variant?: React.ComponentProps<typeof Button>['variant']
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
			variant={variant}
			className="px-w-0.5"
			audioDisabled
		>
			<Kbd>{children}</Kbd>
		</Button>
	)
}