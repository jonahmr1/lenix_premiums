import { entries } from "@lenix/lenix"
import { LabelItem } from "."
import { audiobility } from "@workspace/ui/lib/utils"
import { Tabs, TabsContent, TabsList } from "@workspace/ui/components/tabs"
import { useState } from "react"
import type { States } from "@/types"

export const Keybinds = () => {
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
		movement: {
			label: 'Movement',
			items: {},
		},
		combat: {
			label: 'Combat',
			items: {},
		},
		weaponSelect: {
			label: 'Weapons Select',
			items: {},
		},
		carsBikesBoats: {
			label: 'Cars / Bikes / Boats',
			items: {},
		},
		aircraft: {
			label: 'Aircraft',
			items: {},
		},
		submersibles: {
			label: 'Submersibles',
			items: {},
		},
		parachute: {
			label: 'Parachute',
			items: {},
		},
		cellphone: {
			label: 'Cellphone',
			items: {},
		},
		gtaOnline: {
			label: 'GTA Online',
			items: {},
		},
		gtaOnlineVehicles: {
			label: 'GTA Online Vehicles',
			items: {},
		},
		fivem: {
			label: 'FiveM',
			items: {},
		},
	}
	const [tab, setTab]	= useState<keyof States['settings']['keybinds']>(entries(labels)[0][0])

	return (
		<div className="size-full">
			<Tabs value={tab} orientation='vertical' className="gap-lg">
				<TabsList className="gap-1 bg-transparent cursor-default w-1/4">
					{entries(labels).map(([title, data]) => (
						<LabelItem
							key={title}
							title={data.label}
							onClick={() => setTab(title)}
							className={`${tab === title && 'invert'}`}
							{...audiobility} />
					))}
				</TabsList>
				<div className="w-3/4">
					{entries(labels).map(([title, data]) => (
						<TabsContent
							key={title}
							value={title}
							className=""
						>
							{/* @ts-ignore */}
							{entries(data.items).map(([type, value]) => (
								<div key={type}>{type}</div>
							))}
						</TabsContent>
					))}
				</div>
			</Tabs>
		</div>
	)
}