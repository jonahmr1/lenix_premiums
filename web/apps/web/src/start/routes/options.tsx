import { Tabs, TabsList, TabsTrigger, TabsContent } from "@workspace/elite/components/tabs"
import { Button } from "@workspace/ui/components/button"
import { audiobility } from "@workspace/ui/lib/utils"
import { onKeyDown } from "lenix/nui"
import { useEffect, useState } from "react"

export const Options = () => {
	const [state, setState] = useState(0)
	console.log(state)

	const handlePrevious = () => {
		setState(prev => prev === 0 ? tabs.length - 1 : prev - 1)
		audiobility.onMouseEnter()
	}

	const handleNext = () => {
		setState(prev => prev + 1 === tabs.length ? 0 : prev + 1)
		audiobility.onMouseEnter()
	}

	useEffect(() => {
		const disposes = [
			onKeyDown('q', handlePrevious),
			onKeyDown('e', handleNext)
		]

		return () => disposes.forEach(dis => dis())
	}, [])

	const Preview = () => (
		<p className="text-fluid-5">Coming Soon...</p>
	)

	const tabs = [
		{
			label: 'Settings',
			content: <Preview />
		},
		{
			label: 'Brief',
		},
		{
			label: 'Stats',
		},
		{
			label: 'Gallery',
		},
		{
			label: 'Editor',
		},
	]

	return (
		<div className="h-screen w-full bg-dark/80 flex justify-center p-md *:text-fluid-2 gap-md">
			<Button
				variant='secondary'
				className="bg-background hover:bg-background hover:opacity-80"
				size='lg'
				onClick={handlePrevious}
			>Q</Button>
			<Tabs
				value={state.toString()}
				onValueChange={$ => setState(Number($))}
				className="size-full"
			>
				<TabsList className="bg-transparent w-full p-0 gap-md">
					{tabs.map((tab, i) => (
						<TabsTrigger
							key={i}
							className="uppercase text-[2.5vmin] h-full bg-background text-foreground! hover:opacity-80 m-0 data-active:bg-foreground! data-active:text-background!" value={i.toString()}
						>{tab.label}</TabsTrigger>
					))}
				</TabsList>
				{tabs.map((tab, i) => (
					<TabsContent
						key={i}
						value={i.toString()}
						className="size-full place-content-center place-items-center"
					>{tab.content ?? <Preview />}</TabsContent>
				))}
			</Tabs>
			<Button
				variant='secondary'
				className="bg-background hover:bg-background hover:opacity-80"
				size='lg'
				onClick={handleNext}
			>E</Button>
		</div>
	)
}