import { NavKbd } from "@/components/kbd"
import { Layout } from "@/components/layout"
import { NextButton, PreviousButton } from "@/components/nav"
import type { States, Tab } from "@/types"
import { Tabs, TabsList, TabsContent } from "@workspace/elite/components/tabs"
import { Button } from "@workspace/ui/components/button"
import { Item, ItemActions, ItemContent, ItemTitle } from "@workspace/ui/components/item"
import { KbdGroup } from "@workspace/ui/components/kbd"
import { Slider } from "@workspace/ui/components/slider"
import { audiobility } from "@workspace/ui/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router"
import { useStates } from "./hook"
import { asserts, entries } from "@lenix/lenix"
import { Xbox } from "./components/xbox"

const KeyboardMouse = () => {
	const [{ settings: { keyboardMouse }}, setStates] = useStates()

	type Value = `${States['settings']['keyboardMouse'][keyof States['settings']['keyboardMouse']]}` | number

	const settings: {
		key: keyof States['settings']['keyboardMouse']
		title: string
		options?: Partial<Record<Value, string>>
	}[] = [
		{
			key: 'mouseInputMethod',
			title: 'Mouse Input Method',
			options: {
				raw: 'Raw Input',
				other: 'Something Else'
			}
		},
		{
			key: 'mouseLookSensitivity',
			title: 'Mouse Look Sensitivity',
		},
		{
			key: 'mouseSmoothingScale',
			title: 'Mouse Smoothing Scale',
		},
		{
			key: 'fineAimingControl',
			title: 'Fine Aiming Control',
			options: {
				off: 'Off',
				on: 'On',
			}
		},
		{
			key: 'invertMouseLook',
			title: 'Invert Mouse Look',
			options: {
				off: 'Off',
				on: 'On',
			}
		},
		{
			key: 'toggleAim',
			title: 'Toggle Aim',
			options: {
				off: 'Off',
				on: 'On',
			}
		},
		{
			key: 'firstPersonAimType',
			title: 'First Person Aim Type',
			options: {
				normal: 'Normal',
				other: 'Something Else'
			}
		},
		{
			key: 'defaultMouseDrivingControl',
			title: 'Default Mouse Driving Control',
			options: {
				camera: 'Camera',
				other: 'Something Else'
			}
		},
		{
			key: 'defaultMouseFlyingControl',
			title: 'Default Mouse Flying Control',
			options: {
				camera: 'Camera',
				other: 'Something Else'
			}
		},
		{
			key: 'defaultMouseSubmarineControl',
			title: 'Default Mouse Submarine Control',
			options: {
				camera: 'Camera',
				other: 'Something Else'
			}
		},
		{
			key: 'mouseDrivingSensitivity',
			title: 'Mouse Driving Sensitivity',
		},
		{
			key: 'mousePlaneSensitivity',
			title: 'Mouse Plane Sensitivity',
		},
		{
			key: 'mouseHeliSensitivity',
			title: 'Mouse Heli Sensitivity',
		},
		{
			key: 'mouseSubmarineSensitivity',
			title: 'Mouse Submarine Sensitivity',
		},
		{
			key: 'invertMouseFlying',
			title: 'Invert Mouse Flying',
			options: {
				off: 'Off',
				on: 'On',
			}
		},
		{
			key: 'invertMouseSubmarine',
			title: 'Invert Mouse Submarine',
			options: {
				off: 'Off',
				on: 'On',
			}
		},
		{
			key: 'mouseFlyingControlType',
			title: 'Mouse Flying Control Type',
			options: {
				roll: 'Roll',
				pitch: 'Pitch',
				other: 'Other'
			}
		},
		{
			key: 'autoCenterMouseOnBikes',
			title: 'Auto Center Mouse On Bikes',
		},
		{
			key: 'autoCenterMouseInCars',
			title: 'Auto-Center Mouse In Cars',
		},
		{
			key: 'autoCenterMouseInAircraft',
			title: 'Auto-Center Mouse In Aircraft',
		},
	]

	return (
		<div className="size-full flex gap-md">
			<div className="w-3/5 overflow-y-scroll scrollbar pr-2xs space-y-2xs">
				{settings.map(setting => {
					const value = keyboardMouse[setting.key]
					const handle = (value: Value) => {
						setStates(null, { settings: { keyboardMouse: { [setting.key]: value } } })
						audiobility.onMouseEnter()
					}
					return (
						<Item key={setting.key} className="bg-background px-md hover:invert text-fluid-2 font-bold" onMouseEnter={audiobility.onMouseEnter}>
							<ItemContent>
								<ItemTitle className="uppercase italic text-fluid-2 font-bold">{setting.title}</ItemTitle>
							</ItemContent>
							<ItemActions>
								<Button
									variant='ghost'
									onClick={() => {
										if (typeof value === 'number') setStates(null, { settings: { keyboardMouse: { [setting.key]: value ? value - 1 : 0 }}})
										else {
											asserts(setting.options)
											{/* @ts-ignore */}
											const values = entries(setting.options).map(([key]) => key)
											const index = values.indexOf(value)
											setStates(null, { settings: { keyboardMouse: { [setting.key]: index === 0 ? values[values.length - 1] : values[index - 1] } }})
										}
									}}
								>
									<ChevronLeft />
								</Button>
								<div className="w-fluid-25">
									{typeof value === 'number' ? (
										<Slider
											step={1}
											max={8}
											value={[value]}
											onValueChange={value => handle(value[0])}
										/>
									) : setting.options && (
										<div className="w-full">
											<p className="text-center italic uppercase">{setting.options[value]}</p>
											<div className="flex gap-4">
												{/* @ts-ignore */}
												{entries(setting.options).map(([option], i) => (
													<div
														key={i}
														className={`w-full h-0.5 ${option === value ? 'bg-foreground' : 'bg-muted hover:bg-foreground/50'}`}
														onClick={() => {
															setStates(null, { settings: { keyboardMouse: { [setting.key]: option } }})
															audiobility.onMouseDown()
														}}
													/>
												))}
											</div>
										</div>
									)}
								</div>
								<Button
									variant='ghost'
									onClick={() => {
										if (typeof value === 'number') setStates(null, { settings: { keyboardMouse: { [setting.key]: value < 8 ? value + 1 : 8 }}})
										else {
											asserts(setting.options)
											const values = entries(setting.options).map(([key]) => key)
											const index = values.indexOf(value)
											setStates(null, { settings: { keyboardMouse: { [setting.key]: index === values.length - 1 ? values[0] : values[index + 1] } }})
										}
									}}
								>
									<ChevronRight />
								</Button>
							</ItemActions>
						</Item>
					)
				})}
			</div>
			<div className="w-2/5">
				<Xbox />
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