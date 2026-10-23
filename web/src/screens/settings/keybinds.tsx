import { entries } from '@lenix/lenix'
import { LabelItem } from '.'
import { audiobility } from '@/lib'
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs'
import { useEffect, useState } from 'react'
import type { States } from '@/types'
import { Button } from '@/components/ui/button'
import { useStates } from '@/hooks'
import { Kbd } from '@/components/ui/kbd'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

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
		},
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
	const [
		{
			settings: { keybinds },
		},
		setStates,
	] = useStates()

	const KbdDialog = ({
		children,
		binding,
		order,
	}: {
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

				const key = event.code
				if (key !== 'Escape') updateBind(key.replace(/^Key/, ''))
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
						variant='background'
						className='border-border bg-background/70 w-1/4 cursor-pointer border'
						onClick={() => setUpdating(true)}
					>
						{children}
					</Button>
				</DialogTrigger>
				<DialogContent showCloseButton={false} className='justify-center bg-transparent ring-0 sm:max-w-none'>
					<DialogTitle className='text-v-5 font-sans font-black uppercase italic'>
						Press a key or mouse button
					</DialogTitle>
					<DialogDescription className='text-v-1.5 flex justify-center font-normal italic'>
						Press Esc to cancel
					</DialogDescription>
				</DialogContent>
			</Dialog>
		)
	}

	return (
		<Tabs value={tab} orientation='vertical' className='gap-w-1 h-full'>
			<TabsList className='w-1/4 cursor-default gap-1 bg-transparent'>
				{entries(labels).map(([title, data]) => (
					<LabelItem
						key={title}
						title={data.label}
						onClick={() => setTab(title)}
						className={`${tab === title && 'bg-background invert'}`}
						{...audiobility}
					/>
				))}
			</TabsList>
			<div className='scrollbar pr-w-0.5 w-3/4 overflow-y-auto'>
				{entries(labels).map(([title, data]) => (
					<TabsContent key={title} value={title} className='gap-h-0.5 flex flex-col'>
						{entries(data.items).map(([binding, label]) => (
							<div key={binding} className='p-v-1 gap-w-1 bg-background/60 flex items-center'>
								<div className='text-v-1.5 w-1/2 uppercase italic'>{label}</div>
								{keybinds[title][binding].map((key, i) => (
									<KbdDialog key={key} binding={binding} order={i}>
										{key.length ? (
											<Kbd className='text-md bg-foreground text-background font-bold [button:hover>&]:invert'>
												{key}
											</Kbd>
										) : <></>}
									</KbdDialog>
								))}
							</div>
						))}
					</TabsContent>
				))}
			</div>
		</Tabs>
	)
}
