import { Layout } from "@/components/layout"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@workspace/elite/components/tabs"
import { Button } from "@workspace/ui/components/button"
import { audiobility } from "@workspace/ui/lib/utils"
import { onKeyDown } from "lenix/nui"
import { useEffect, useState } from "react"

const Preview = () => (
	<p className="text-fluid-5">...</p>
)

const tabs: { label: string, disabled?: true, content?: React.ReactNode }[] = [
	{
		label: 'General',
	},
	{
		label: 'Graphics / Advanced Graphics',
	},
	{
		label: 'Keybinds',
	},
	{
		label: 'Display',
	},
	{
		label: 'Audio',
	},
	{
		label: 'Camera',
	},
	{
		label: 'Keyboard / Mouse',
	},
	{
		label: 'Gamepad',
	},
	{
		label: 'Brief',
		disabled: true
	},
	{
		label: 'Stats',
		disabled: true
	},
	{
		label: 'Gallery',
		disabled: true
	},
	{
		label: 'Editor',
		disabled: true
	},
]

export const Options = () => {
	const [state, setState] = useState(0)
	
	const filteredIndexes = tabs.flatMap((mode, i) => mode.disabled ? [] : [i])

	const handlePrevious = () => {
		setState(prev => prev === 0 ? filteredIndexes[filteredIndexes.length - 1] : filteredIndexes[filteredIndexes.indexOf(prev) - 1])
		audiobility.onMouseEnter()
	}

	const handleNext = () => {
		setState(prev => prev + 1 > filteredIndexes[filteredIndexes.length - 1] ? 0 : filteredIndexes[filteredIndexes.indexOf(prev) + 1])
		audiobility.onMouseEnter()
	}

	useEffect(() => {
		const disposes = [
			onKeyDown('q', handlePrevious),
			onKeyDown('e', handleNext)
		]

		return () => disposes.forEach(dis => dis())
	}, [])

	return (
		<Layout className="h-screen w-full bg-dark/80 flex justify-center *:text-fluid-2 gap-md">
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
				<TabsList className="bg-transparent w-full p-0 gap-xs">
					{tabs.map((tab, i) => (
						<TabsTrigger
							key={i}
							disabled={tab.disabled}
							className="uppercase text-[2vmin] h-full text-foreground! hover:bg-background m-0 data-active:bg-foreground! data-active:text-background!" value={i.toString()}
							{...audiobility}
						>{tab.label}</TabsTrigger>
					))}
				</TabsList>
				{tabs.map((tab, i) => (
					<TabsContent
						key={i}
						value={i.toString()}
						className="size-full place-content-center place-items-center bg-muted/50"
					>{tab.content ?? <Preview />}</TabsContent>
				))}
			</Tabs>
			<Button
				variant='secondary'
				className="bg-background hover:bg-background hover:opacity-80"
				size='lg'
				onClick={handleNext}
			>E</Button>
		</Layout>
	)
}