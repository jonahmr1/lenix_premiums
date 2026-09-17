import { entries } from "@lenix/lenix"
import { LabelItem } from "."
import { audiobility } from "@workspace/ui/lib/utils"
import { Tabs, TabsContent, TabsList } from "@workspace/ui/components/tabs"
import { useState } from "react"
import type { States } from "@/types"
import { Button } from "@workspace/ui/components/button"
import { useStates } from "@/hook"
import { Kbd } from "@workspace/ui/components/kbd"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@workspace/ui/components/dialog"

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
	// 	items: {},
	// },
	// combat: {
	// 	label: 'Combat',
	// 	items: {},
	// },
	// weaponSelect: {
	// 	label: 'Weapons Select',
	// 	items: {},
	// },
	// carsBikesBoats: {
	// 	label: 'Cars / Bikes / Boats',
	// 	items: {},
	// },
	// aircraft: {
	// 	label: 'Aircraft',
	// 	items: {},
	// },
	// submersibles: {
	// 	label: 'Submersibles',
	// 	items: {},
	// },
	// parachute: {
	// 	label: 'Parachute',
	// 	items: {},
	// },
	// cellphone: {
	// 	label: 'Cellphone',
	// 	items: {},
	// },
	// gtaOnline: {
	// 	label: 'GTA Online',
	// 	items: {},
	// },
	// gtaOnlineVehicles: {
	// 	label: 'GTA Online Vehicles',
	// 	items: {},
	// },
	// fivem: {
	// 	label: 'FiveM',
	// 	items: {},
	// },
} as const

export const Keybinds = () => {
	const [tab, setTab] = useState<keyof States['settings']['keybinds']>(entries(labels)[0][0])
	const [{ settings: { keybinds } }, setStates] = useStates()
	const [updating, setUpdating] = useState(false)

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
							{entries(data.items).map(([type, value]) => {
								return (
									<div key={type} className="flex bg-background/50 px-sm py-sm gap-md">
										<div className="w-1/2 text-fluid-2 font-black tracking-tight italic uppercase">{value}</div>
										{keybinds[title][type].map(key => (
											<Button
												key={key}
												variant='secondary'
												className="w-1/4 border border-border cursor-pointer"
												onClick={() => setUpdating(true)}
											>
												{key.length ? <Kbd>{key}</Kbd> : <></>}
											</Button>
										))}
									</div>
								)
							})}
						</TabsContent>
					))}
				</div>
			</Tabs>
			<Dialog open={updating} onOpenChange={setUpdating}>
				<DialogContent
					showCloseButton={false}
					className="sm:max-w-none justify-center bg-transparent ring-0"
				>
					<DialogTitle className="uppercase text-fluid-4 italic font-black">
						Press a key or mouse button
					</DialogTitle>
					<DialogDescription className="uppercase italic flex justify-center">
						Press Esc to cancel
					</DialogDescription>
				</DialogContent>
			</Dialog>
		</div>
	)
}