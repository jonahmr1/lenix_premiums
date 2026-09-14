import { Button } from "@workspace/ui/components/button"
import { audiobility } from "@workspace/ui/lib/utils"
import { onKeyDown } from "lenix/nui"
import { useEffect } from "react"

export const PreviousButton = ({ children, list, value, onValueChange }: {
	children: React.ReactNode
	list: number[]
	value: number
	onValueChange: (value: number) => void
}) => {
	const handlePrevious = () => {
		onValueChange(value === 0 ? list[list.length - 1] : list[list.indexOf(value) - 1])
		audiobility.onMouseEnter()
	}

	useEffect(() => onKeyDown('q', handlePrevious), [list, value, onValueChange])

	return (
		<Button
			size='lg'
			onClick={handlePrevious}
		>{children}</Button>
	)
}

export const NextButton = ({ children, list, value, onValueChange }: {
	children: React.ReactNode
	list: number[]
	value: number
	onValueChange: (value: number) => void
}) => {
	const handleNext = () => {
		onValueChange(value + 1 > list[list.length - 1] ? 0 : list[list.indexOf(value) + 1])
		audiobility.onMouseEnter()
	}

	useEffect(() => onKeyDown('e', handleNext), [list, value, onValueChange])

	return (
		<Button
			size='lg'
			onClick={handleNext}
		>{children}</Button>
	)
}