import { NavKbd } from "@/components/kbd"
import { Layout } from "@/components/layout"
import { NextButton, PreviousButton } from "@/components/nav"
import type { Tab } from "@/types"
import { Tabs, TabsList, TabsContent } from "@workspace/elite/components/tabs"
import { Button } from "@workspace/ui/components/button"
import { Item, ItemActions, ItemContent, ItemTitle } from "@workspace/ui/components/item"
import { KbdGroup } from "@workspace/ui/components/kbd"
import { Slider } from "@workspace/ui/components/slider"
import { audiobility } from "@workspace/ui/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router"

const KeyboardMouse = () => {
	const settings = [
		{
			title: 'Mouse Input Method',
			options: ['Raw Input', 'Something Else']
		},
		{
			title: 'Mouse Look Sensitivity',
			options: 'slider'
		},
		{
			title: 'Mouse Smoothing Scale',
			options: 'slider'
		},
		{
			title: 'Fine Aiming Control',
			options: ['On', 'Off']
		},
		{
			title: 'Invert Mouse Look',
			options: ['On', 'Off']
		},
		{
			title: 'Toggle Aim',
			options: ['On', 'Off']
		},
		{
			title: 'First Person Aim Type',
			options: ['Normal', 'Something Else']
		},
		{
			title: 'Default Mouse Driving Control',
			options: ['Camera', 'Something Else']
		},
		{
			title: 'Default Mouse Flying Control',
			options: ['Camera', 'Something Else']
		},
		{
			title: 'Default Mouse Submarine Control',
			options: ['Camera', 'Something Else']
		},
		{
			title: 'Mouse Driving Sensitivity',
			options: 'slider'
		},
		{
			title: 'Mouse Plane Sensitivity',
			options: 'slider'
		},
		{
			title: 'Mouse Heli Sensitivity',
			options: 'slider'
		},
		{
			title: 'Mouse Submarine Sensitivity',
			options: 'slider'
		},
		{
			title: 'Invert Mouse Flying',
			options: ['On', 'Off']
		},
		{
			title: 'Invert Mouse Submarine',
			options: ['On', 'Off']
		},
	]

	return (
		<div className="size-full flex">
			<div className="w-3/5 overflow-y-scroll scrollbar pr-2xs space-y-2xs">
				{settings.map(setting => (
					<Item className="bg-background px-md hover:invert text-fluid-2 font-black tracking-normal" onMouseEnter={audiobility.onMouseEnter}>
						<ItemContent>
							<ItemTitle className="uppercase italic tracking-normal text-fluid-2 font-black">{setting.title}</ItemTitle>
						</ItemContent>
						<ItemActions>
							<Button
								variant='ghost'
							>
								<ChevronLeft />
							</Button>
							<div className="w-fluid-25">
								{setting.options === 'slider'
									? <Slider step={1} max={8} defaultValue={[3]} onValueChange={() => { audiobility.onMouseEnter() }} />
									: Array.isArray(setting.options)
									? <div className="w-full">
										<p className="text-center italic uppercase">{setting.options[0]}</p>
										<div className="flex gap-4">
											{setting.options.map((_, i) => (
												<div className={`w-full h-0.5 ${i === 0 ? 'bg-foreground' : 'bg-muted'}`} />
											))}
										</div>
									</div>
									: <></> }
							</div>
							<Button
								variant='ghost'
							>
								<ChevronRight />
							</Button>
						</ItemActions>
					</Item>
				))}
			</div>
			<div className="w-2/5">
			
			</div>
		</div>
	)
}

const tabs: Tab[] = [
	{
		label: 'General',
		content: <p className="text-fluid-5">...</p>
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
		content: <KeyboardMouse />,
	},
	{
		label: 'Gamepad',
		content: '',
		disabled: true
	},
	{
		label: 'Brief',
		content: '',
		disabled: true
	},
	{
		label: 'Stats',
		content: '',
		disabled: true
	},
	{
		label: 'Gallery',
		content: '',
		disabled: true
	},
	{
		label: 'Editor',
		content: '',
		disabled: true
	},
]

export const Settings = () => {
	const [state, setState] = useState(0)
	const nav = useNavigate()

	return (
		<Layout type="p" className="h-screen w-full flex flex-col gap-sm backdrop-blur-sm">
			<h1 className="uppercase text-fluid-9 font-black italic leading-none">Settings</h1>
			<div className="flex justify-center *:text-fluid-2 min-h-0 w-full gap-xs px-sm">
				<PreviousButton
					tabs={tabs}
					value={state}
					onValueChange={setState}
				>Q</PreviousButton>
				<Tabs
					value={state.toString()}
					onValueChange={$ => setState(Number($))}
					className="flex-1"
				>
					<TabsList className="bg-transparent w-full p-0 gap-xs">
						{tabs.map((tab, i) => (
							<Button
								key={i}
								disabled={tab.disabled}
								variant={state === i ? 'default' : 'secondary'}
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
							className="overflow-hidden"
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