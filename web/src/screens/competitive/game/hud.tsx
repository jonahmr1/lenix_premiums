import { Layout } from "@/components/layout"
import { anim } from "@/lib"
import { random } from "@lenix/lenix"
import { CircleIcon } from "@phosphor-icons/react"
import { motion } from "motion/react"
import { useEffect, useRef, useState } from "react"

const healthSegments = 6
const maxHealth = 100
const segmentHealth = maxHealth / healthSegments

const weaponarySegments = 6

export const Hud = () => {
	const [state, setState] = useState<{
		health: number
		weaponary: {
			activeEquipment: number | null
			equipments: {
				ammo: number
				reserve: number
				name: string
				image: string
				isWeapon?: true
			}[]
		}
	}>({
		health: 25,
		weaponary: {
			activeEquipment: 3,
			equipments: [
				{
					ammo: 40,
					reserve: 125,
					name: 'Assault Shotgun',
					image: 'https://docs-backend.fivem.net/weapons/WEAPON_ASSAULTSHOTGUN.png',
					isWeapon: true
				},
				{
					ammo: 15,
					reserve: 40,
					name: 'Ceramic',
					image: 'https://docs-backend.fivem.net/weapons/WEAPON_CERAMICPISTOL.png',
					isWeapon: true
				},
				{
					ammo: 2,
					reserve: 4,
					name: 'Grenade',
					image: 'https://docs-backend.fivem.net/weapons/WEAPON_GRENADE.png',
				},
				{
					ammo: 3,
					reserve: 3,
					name: 'Flashbang',
					image: 'https://docs-backend.fivem.net/weapons/WEAPON_FLARE.png',
				},
				{
					ammo: 1,
					reserve: 2,
					name: 'Breach',
					image: 'https://docs-backend.fivem.net/weapons/WEAPON_STICKYBOMB.png',
				},
			]
		}
	})
	const previous = useRef(state?.health)
	const decreasing =
	state !== undefined &&
	previous.current !== undefined &&
	state.health < previous.current
	const activeEquipment = state?.weaponary.activeEquipment ? state.weaponary.equipments[state.weaponary.activeEquipment - 1] : null

	useEffect(() => {
		if (state?.health === undefined) return
		previous.current = state.health
	}, [state?.health])


	useEffect(() => {
		const interval = setInterval(() => {
			setState(prev => prev ? ({ health: random(0, 100), weaponary: { ...prev.weaponary, activeEquipment: random(1, 4) } }) : prev)
		}, 1000)

		return () => clearInterval(interval)
	}, [])

	if (!state) return null

	return (
		<>
			{/* Health */}
			<Layout invert className="absolute bottom-0 left-0 -perspective-left-25">
				<div className="flex items-end">
					<p className="leading-tight text-v-1.5">{state.health}</p>
					<p className="text-v-1">/{maxHealth}</p>
				</div>
				<div className="flex gap-px">
					{[...Array(healthSegments).keys()].map(index => (
						<div key={index} className="w-7 h-4 bg-foreground/50 rounded-xs overflow-hidden">
							<motion.div
								{...anim}
								initial={false}
								animate={{
									width: `${Math.min(
										100,
										Math.max(0, ((state.health - index * segmentHealth) / segmentHealth) * 100),
									)}%`,
								}}
								className="h-full rounded-xs bg-foreground"
								transition={{
									duration: 0.12,
									delay: (decreasing ? healthSegments - 1 - index : index) * 0.12,
									ease: 'linear',
								}}
							/>
						</div>
					))}
				</div>
			</Layout>
			{/* Weaponary */}
			<Layout invert className="absolute bottom-0 right-0 -perspective-right-5">
				<div className="space-y-h-0.5 font-medium">
					<div className="flex justify-between text-v-1.25">
						{activeEquipment && (
							<>
								<p>{activeEquipment.name}</p>
								<p>{activeEquipment.ammo}/{activeEquipment.reserve}</p>
							</>
						)}
					</div>
					<div className="flex">
						{[...Array(weaponarySegments).keys()].map(index => {
							const equipment = state.weaponary.equipments[index]

							return (
								<div className="space-y-h-0.5" key={index}>
									<div className={`relative rounded-md size-w-4 px-w-0.5 flex items-center justify-center ${state.weaponary.activeEquipment === index + 1 && 'bg-white'}`}>
										{equipment ? <>
											<img src={equipment.image} className={`${equipment.isWeapon ? '-scale-x-100 rotate-15 max-h-h-2.5 ' : '-rotate-105 max-w-w-2 '} ${state.weaponary.activeEquipment === index + 1 ? 'brightness-0' : 'brightness-200'}`} />
											<span className="absolute top-0 right-w-0.5 text-v-1 text-white mix-blend-difference">{equipment.ammo}</span>
										</> : <>
											<CircleIcon className="size-xs" />
										</>}
									</div>
									<div className="flex justify-center text-v-1.5">{index + 1}</div>
								</div>
							)
						})}
					</div>
				</div>
			</Layout>
		</>
	)
}