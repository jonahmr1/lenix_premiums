import { entries } from "@lenix/lenix"
import { LabelItem } from "."
import { audiobility } from "@workspace/ui/lib/utils"
import { Tabs, TabsContent, TabsList } from "@workspace/ui/components/tabs"
import { useEffect, useState } from "react"
import type { States } from "@/types"
import { Button } from "@workspace/ui/components/button"
import { useStates } from "@/hooks"
import { Kbd } from "@workspace/ui/components/kbd"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@workspace/ui/components/dialog"

const labels = {
	general: {
		label: 'General',
		items: {
			pause: 'Pause',
			radarZoomMultiplayerInformation: 'Radar Zoom / Multiplayer Information',
			cycleCamera: 'Cycle Camera',
			toggleSpecialAbility: 'Toggle Special Ability',
			characterSelector: 'Character Selector',
			switchToMichael: 'Switch to Michael',
			switchToFranklin: 'Switch to Franklin',
			switchToTrevor: 'Switch to Trevor',
			switchToGtaOnline: 'Switch to GTA Online',
			interactionMenu: 'Interaction Menu',
			startStopRecording: 'Start / Stop Recording',
			startStopActionReplayRecording: 'Start / Stop Action Replay Recording',
			cancelRecording: 'Cancel Recording',
			rockstarGamesOverlay: 'Rockstar Games Overlay',
			contextAction: 'Context Action',
		}
	},
	// movement: {
	// 	label: 'Movement',
	// },
	// combat: {
	// 	label: 'Combat',
	// },
	// weaponSelect: {
	// 	label: 'Weapons Select',
	// },
	// carsBikesBoats: {
	// 	label: 'Cars / Bikes / Boats',
	// },
	// aircraft: {
	// 	label: 'Aircraft',
	// },
	// submersibles: {
	// 	label: 'Submersibles',
	// },
	// parachute: {
	// 	label: 'Parachute',
	// },
	// cellphone: {
	// 	label: 'Cellphone',
	// },
	// gtaOnline: {
	// 	label: 'GTA Online',
	// },
	// gtaOnlineVehicles: {
	// 	label: 'GTA Online Vehicles',
	// },
	// fivem: {
	// 	label: 'FiveM',
	// },
} as const

export const Keybinds = () => {
	const [tab, setTab] = useState<keyof States['settings']['keybinds']>(entries(labels)[0][0])
	const [{ settings: { keybinds } }, setStates] = useStates()

	const KbdDialog = ({ children, binding, order }: {
		children: React.ReactNode
		binding: keyof States['settings']['keybinds'][keyof States['settings']['keybinds']]
		order: number
	}) => {
		const [updating, setUpdating] = useState(false)

		const updateBind = (value: string) => {
			setStates(prev => {
				const bindings = [...prev.settings.keybinds[tab][binding]]
				bindings[order] = value

				return {
					...prev,
					settings: {
						...prev.settings,
						keybinds: {
							...prev.settings.keybinds,
							[tab]: {
								...prev.settings.keybinds[tab],
								[binding]: bindings,
							},
						},
					},
				}
			})
		}

		useEffect(() => {
			if (!updating) return

			const handleKey = (event: KeyboardEvent) => {
				event.preventDefault()
				event.stopImmediatePropagation()

				const key = event.key
				if (key !== 'Escape') {
					updateBind(key === ' ' ? event.code : key)
				}
				setUpdating(false)
			}

			const handleMouse = (event: MouseEvent) => {
				event.preventDefault()

				const key = event.button
				updateBind(key === 0 ? 'MOUSE_LEFT' : key === 1 ? 'MOUSE_MIDDLE' : key === 2 ? 'MOUSE_RIGHT' : 'Unknown')

				setUpdating(false)
			}

			window.addEventListener('keydown', handleKey, true)
			window.addEventListener('mousedown', handleMouse, true)

			return () => {
				window.removeEventListener('keydown', handleKey, true)
				window.removeEventListener('mousedown', handleMouse, true)
			}

		}, [updating])

		return (
			<Dialog open={updating} onOpenChange={setUpdating}>
				<DialogTrigger asChild>
					<Button
						variant='secondary'
						className="w-1/4 border border-border cursor-pointer"
						onClick={() => setUpdating(true)}
					>
						{children}
					</Button>
				</DialogTrigger>
				<DialogContent
					showCloseButton={false}
					className="sm:max-w-none justify-center bg-transparent ring-0"
				>
					<DialogTitle className="uppercase text-fluid-6 italic font-black">
						Press a key or mouse button
					</DialogTitle>
					<DialogDescription className="uppercase italic text-fluid-2 flex justify-center">
						Press Esc to cancel
					</DialogDescription>
				</DialogContent>
			</Dialog>
		)
	}

	return (
		<div className="size-full">
			<Tabs value={tab} orientation='vertical' className="gap-lg h-full">
				<TabsList className="gap-1 bg-transparent cursor-default w-1/4">
					{entries(labels).map(([title, data]) => (
						<LabelItem
							key={title}
							title={data.label}
							onClick={() => setTab(title)}
							className={`${tab === title && 'invert bg-background'}`}
							{...audiobility} />
					))}
				</TabsList>
				<div className="w-3/4 overflow-y-auto scrollbar pr-xs">
					{entries(labels).map(([title, data]) => (
						<TabsContent
							key={title}
							value={title}
							className="flex flex-col gap-xs"
						>
							{entries(data.items).map(([binding, label]) => {
								return (
									<div key={binding} className="flex bg-background/50 px-sm py-sm gap-md">
										<div className="w-1/2 text-fluid-2 font-black tracking-tight italic uppercase">{label}</div>
										{keybinds[title][binding].map((key, i) => (
											<KbdDialog
												key={key}
												binding={binding}
												order={i}
											>
												{key.length ? <Kbd>{key}</Kbd> : <></>}
											</KbdDialog>
										))}
									</div>
								)
							})}
						</TabsContent>
					))}
				</div>
			</Tabs>
		</div>
	)
}