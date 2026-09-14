import { NavKbd } from "@/components/kbd"
import { Layout } from "@/components/layout"
import { NextButton, PreviousButton } from "@/components/nav"
import type { Tab } from "@/types"
import { Tabs, TabsList, TabsContent } from "@workspace/elite/components/tabs"
import { Button } from "@workspace/ui/components/button"
import { KbdGroup } from "@workspace/ui/components/kbd"
import { audiobility } from "@workspace/ui/lib/utils"
import { useState } from "react"
import { useNavigate } from "react-router"


const tabs: Tab[] = [
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
		label: 'Audio / Voice Chat',
	},
	{
		label: 'Display (Interface)',
	},
	// {
	// 	label: 'Camera',
	// },
	// {
	// 	label: 'Keyboard / Mouse',
	// },
	// {
	// 	label: 'Gamepad',
	// },
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
	const nav = useNavigate()


	return (
		<Layout className="h-screen w-full flex flex-col gap-sm">
			<h1 className="uppercase text-fluid-9">Options</h1>
			<div className="flex justify-center *:text-fluid-2 size-full">
				<PreviousButton
					tabs={tabs}
					value={state}
					onValueChange={setState}
				>Q</PreviousButton>
				<Tabs
					value={state.toString()}
					onValueChange={$ => setState(Number($))}
					className="size-full"
				>
					<TabsList className="bg-transparent w-full p-0 gap-xs">
						{tabs.map((tab, i) => (
							<Button
								key={i}
								disabled={tab.disabled}
								variant={state === i ? 'default' : 'secondary'}
								className="flex-1 text-fluid-2!"
								onClick={() => setState(i)}
								size='lg'
								{...audiobility}
							>{tab.label}</Button>
						))}
					</TabsList>
					{tabs.map((tab, i) => (
						<TabsContent
							key={i}
							value={i.toString()}
							className="size-full place-content-center place-items-center bg-muted"
						>{tab.content ?? <p className="text-fluid-5">{tab.label}...</p>}</TabsContent>
					))}
				</Tabs>
				<NextButton
					tabs={tabs}
					value={state}
					onValueChange={setState}
				>
					E
				</NextButton>
			</div>
			<KbdGroup>
				<NavKbd
					onClick={() => nav(-1)}
					icon='Esc'
					keybind="Escape"
				>
					Back
				</NavKbd>
			</KbdGroup>
		</Layout>
	)
}