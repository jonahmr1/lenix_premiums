import { NavKbd } from "@/components/kbd"
import { Layout } from "@/components/layout"
import { NextButton, PreviousButton } from "@/components/nav"
import type { Tab } from "@/types"
import { Tabs, TabsList, TabsContent } from "@workspace/elite/components/tabs"
import { Button } from "@workspace/ui/components/button"
import { KbdGroup } from "@workspace/ui/components/kbd"
import { useState } from "react"
import { useNavigate } from "react-router"

const tabs: Tab[] = [
	{
		label: 'General',
		content: <p className="text-fluid-5">General...</p>
	},
	{
		label: 'Graphics', /* Advanced Graphics */
		content: <p className="text-fluid-5">...</p>,
	},
	{
		label: 'Keybinds',
		content: <p className="text-fluid-5">...</p>,
	},
	{
		label: 'Audio', /* Voice Chat */
		content: <p className="text-fluid-5">...</p>,
	},
	{
		label: 'Interface', /* Display */
		content: <p className="text-fluid-5">...</p>,
	},
	{
		label: 'Camera',
		content: <p className="text-fluid-5">...</p>,
	},
	{
		label: 'Keyboard / Mouse',
		content: <p className="text-fluid-5">...</p>,
	},
	{
		label: 'Gamepad',
		content: <p className="text-fluid-5">...</p>,
		disabled: true
	},
	{
		label: 'Brief',
		content: <p className="text-fluid-5">...</p>,
		disabled: true
	},
	{
		label: 'Stats',
		content: <p className="text-fluid-5">...</p>,
		disabled: true
	},
	{
		label: 'Gallery',
		content: <p className="text-fluid-5">...</p>,
		disabled: true
	},
	{
		label: 'Editor',
		content: <p className="text-fluid-5">...</p>,
		disabled: true
	},
]

export const Settings = () => {
	const [state, setState] = useState(0)
	const nav = useNavigate()

	return (
		<Layout type="p" className="h-screen w-full flex flex-col gap-sm">
			<h1 className="uppercase text-fluid-9 font-black italic leading-none">Settings</h1>
			<div className="flex justify-center *:text-fluid-2 size-full gap-xs px-sm">
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
								variant={state === i ? 'default' : 'outline'}
								className="flex-1 text-fluid-2! font-semibold italic"
								onClick={() => setState(i)}
								size='lg'
							>{tab.label}</Button>
						))}
					</TabsList>
					{tabs.map((tab, i) => (
						<TabsContent
							key={i}
							value={i.toString()}
							className="size-full place-content-center place-items-center bg-border"
						>{tab.content}</TabsContent>
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
			<KbdGroup className="px-3xl">
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