import { Slider } from "@workspace/ui/components/slider"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { asserts, entries } from "@lenix/lenix"
import { Xbox } from "@/components/xbox"
import { useStates } from "@/hooks"
import type { States } from "@/types"
import { audiobility } from "@workspace/ui/lib/utils"
import { LabelItem } from "."
import { Button } from "@workspace/ui/components/button"

type Value = `${States['settings']['keyboardMouse'][keyof States['settings']['keyboardMouse']]}` | number

const labels: {
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

export const KeyboardMouse = () => {
	const [{ settings: { keyboardMouse } }, setStates] = useStates()

	return (
		<div className="size-full flex gap-md">
			<div className="w-3/5 overflow-y-scroll scrollbar pr-2xs space-y-2xs">
				{labels.map(setting => {
					const value = keyboardMouse[setting.key]
					const handle = (value: Value) => {
						setStates(null, { settings: { keyboardMouse: { [setting.key]: value } } })
						audiobility.onMouseEnter()
					}
					return (
						<LabelItem key={setting.key} title={setting.title} digest>
							<Button
								variant='ghost'
								onClick={() => {
									if (typeof value === 'number') setStates(null, { settings: { keyboardMouse: { [setting.key]: value ? value - 1 : 0 } } })
									else {
										asserts(setting.options)
										{/* @ts-ignore */ }
										const values = entries(setting.options).map(([key]) => key)
										const index = values.indexOf(value)
										setStates(null, { settings: { keyboardMouse: { [setting.key]: index === 0 ? values[values.length - 1] : values[index - 1] } } })
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
														setStates(null, { settings: { keyboardMouse: { [setting.key]: option } } })
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
									if (typeof value === 'number') setStates(null, { settings: { keyboardMouse: { [setting.key]: value < 8 ? value + 1 : 8 } } })
									else {
										asserts(setting.options)
										const values = entries(setting.options).map(([key]) => key)
										const index = values.indexOf(value)
										setStates(null, { settings: { keyboardMouse: { [setting.key]: index === values.length - 1 ? values[0] : values[index + 1] } } })
									}
								}}
							>
								<ChevronRight />
							</Button>
						</LabelItem>
					)
				})}
				<LabelItem title='Restore Defaults' {...audiobility}></LabelItem>
			</div>
			<div className="w-2/5">
				<Xbox />
			</div>
		</div>
	)
}