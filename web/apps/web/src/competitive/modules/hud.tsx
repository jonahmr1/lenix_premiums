import { DEV } from "@/App"
import { Layout } from "@/components/layout"
import { anim } from "@/lib"
import { random } from "@lenix/lenix"
import { motion } from "motion/react"
import { useEffect, useRef, useState } from "react"

const segments = 6
const maxHealth = 100
const segmentHealth = maxHealth / segments

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
				className?: React.ComponentProps<'img'>['className']
			}[]
		}
	}>()
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
		return DEV(() => {
			setState({
				health: 25,
				weaponary: {
					activeEquipment: 3,
					equipments: [
						{
							ammo: 40,
							reserve: 125,
							name: 'Assault Shotgun',
							image: 'https://docs-backend.fivem.net/weapons/WEAPON_ASSAULTSHOTGUN.png',
							className: '-scale-x-100 rotate-15'
						},
						{
							ammo: 2,
							reserve: 4,
							name: 'Grenade',
							image: 'https://docs-backend.fivem.net/weapons/WEAPON_GRENADE.png',
							className: 'max-w-[3.5vmin]',
						},
						{
							ammo: 3,
							reserve: 3,
							name: 'Flashbang',
							image: 'https://docs-backend.fivem.net/weapons/WEAPON_FLARE.png',
							className: 'max-w-[3.5vmin]',
						},
						{
							ammo: 1,
							reserve: 2,
							name: 'Breach',
							image: 'https://docs-backend.fivem.net/weapons/WEAPON_STICKYBOMB.png',
							className: 'max-w-[3.5vmin]',
						},
					]
				}
			})

			const interval = setInterval(() => {
				setState(prev => prev ? ({ health: random(0, 100), weaponary: { ...prev.weaponary, activeEquipment: random(1, 4) } }) : prev)
			}, 1000)

			return () => clearInterval(interval)
		}, 'competitive')
	}, [])

	if (!state) return null

	return (
		<>
			{/* Health */}
			<Layout className="absolute bottom-0 left-0 -perspective-left-50">
				<div className="flex items-end text-light">
					<p className="leading-tight text-fluid-2">{state.health}</p>
					<p className="text-fluid-1.5 text-light/70">/{maxHealth}</p>
				</div>
				<div className="flex gap-px">
					{[...Array(segments).keys()].map(index => (
						<div key={index} className="w-7 h-4 bg-white/25 rounded-xs overflow-hidden">
							<motion.div
								{...anim}
								initial={false}
								animate={{
									width: `${Math.min(
										100,
										Math.max(0, ((state.health - index * segmentHealth) / segmentHealth) * 100),
									)}%`,
								}}
								className="bg-light h-full rounded-xs"
								transition={{
									duration: 0.12,
									delay: (decreasing ? segments - 1 - index : index) * 0.12,
									ease: 'linear',
								}}
							/>
						</div>
					))}
				</div>
			</Layout>
			{/* Weaponary */}
			<Layout className="absolute bottom-0 right-0 -perspective-right-20 text-light">
				<div className="space-y-xs font-medium">
					<div className="flex justify-between text-fluid-1.75">
						{activeEquipment && (
							<>
								<p>{activeEquipment.name}</p>
								<p>{activeEquipment.ammo}/{activeEquipment.reserve}</p>
							</>
						)}
					</div>
					<div className="flex">
						{state.weaponary.equipments.map((equipment, index) => (
							<div className="space-y-xs">
								<div className={`relative rounded-md size-2xl px-2xs flex items-center justify-center ${state.weaponary.activeEquipment === index + 1 && 'bg-white'}`}>
									<img src={equipment.image} className={`-rotate-105 ${equipment.className} ${state.weaponary.activeEquipment === index + 1 ? 'brightness-0' : 'brightness-200'}`} />
									<span className="absolute top-0 right-2xs text-fluid-1.5 text-white mix-blend-difference">{equipment.ammo}</span>
								</div>
								<div className="flex justify-center text-fluid-2">{index + 1}</div>
							</div>
						))}
					</div>
				</div>
			</Layout>
		</>
	)
}