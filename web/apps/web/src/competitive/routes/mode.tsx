import { NavKbd } from '@/components/kbd'
import { Button } from '@workspace/ui/components/button'
import { KbdGroup } from '@workspace/ui/components/kbd'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router'
import { MAPS, MODES } from '../constants'
import { asserts, entries } from '@lenix/lenix'
import { CompetitiveContext } from '../context'
import { Badge } from '@workspace/ui/components/badge'
import { motion } from 'motion/react'
import { anim } from '@/lib'

export const Mode = () => {
	const nav = useNavigate()
	const context = useContext(CompetitiveContext)
	asserts(context, `Failed to use competitive context`)

	const { selectedMode, setSelectedMode } = context
	const [preview, setPreview] = useState<keyof typeof MODES>(selectedMode)

	const mode = MODES[preview]

	return (
		<div className="relative isolate h-screen w-full">
			<img
				src={mode.image}
				className="absolute -z-2 size-full object-cover"
			/>
			<div className='absolute size-full -z-1 bg-linear-to-r from-neutral-950/90 to-transparent' />
			<div className="size-full flex items-start flex-col px-5xl">
				<div className='size-full flex h-9/10 justify-evenly flex-col gap-5xl'>
					<div className='w-full h-2/4 flex flex-col justify-end gap-md'>
						<div>
							<p className='uppercase text-fluid-12 leading-none font-black text-neutral-50'>{mode.label}</p>
							<p className='text-light'>{mode.description}</p>
						</div>
						<div className='flex gap-sm'>
							{(() => {
								const classNames = [
									'text-fluid-2 uppercase',
									'text-fluid-2 uppercase font-semibold',
								]
								return <>
									<Badge>
										<span className={classNames[0]}>Maps: </span>
										<span className={classNames[1]}>{mode.maps.map(map => MAPS[map].label).join(' / ')}</span>
									</Badge>
									{'scoreLimit' in mode && <Badge>
										<span className={classNames[0]}>Score Limit: </span>
										<span className={`${classNames[1]} uppercase`}>{mode.scoreLimit}</span>
									</Badge>}
									{'duration' in mode && <Badge>
										<span className={classNames[0]}>Duration: </span>
										<span className={`${classNames[1]} uppercase`}>{(mode.duration / 1000) / 60} Minutes</span>
									</Badge>}
									{'points' in mode && <Badge>
										<span className={classNames[0]}>Points: </span>
										<span className={`${classNames[1]} uppercase`}>{mode.points.join(' / ')}</span>
									</Badge>}
									<Badge>
										<span className={classNames[0]}>Teams: </span>
										<span className={classNames[1]}>{mode.teams}</span>
									</Badge>
									<Badge>
										<span className={classNames[0]}>Players: </span>
										<span className={classNames[1]}>{mode.players}</span>
									</Badge>
									<Badge>
										<span className={classNames[0]}>Total Players: </span>
										<span className={classNames[1]}>{mode.teams * mode.players}</span>
									</Badge>
								</>
							})()}
						</div>
					</div>
					<div className='
						flex items-end gap-md overflow-x-scroll pb-xs
						[&::-webkit-scrollbar]:h-xs
						hover:[--scrollbar-fix:1]
						[&:hover::-webkit-scrollbar-track]:bg-card
						[&::-webkit-scrollbar-track]:border-front/20
						[&::-webkit-scrollbar-track]:rounded-md
						[&:hover::-webkit-scrollbar-thumb]:bg-front
						[&::-webkit-scrollbar-thumb]:rounded-md
						[&:hover::-webkit-scrollbar-thumb:hover]:bg-foreground
						'>
						{entries(MODES).map(([mode, data]) => (
							<div className='flex flex-col'>
								<Button
									onClick={() => setSelectedMode(mode)}
									onMouseOver={() => setPreview(mode)}
									className='h-auto p-0 group relative border border-chart-3 hover:border-front overflow-hidden'
								>
									<img src={data.image} className={`max-w-[30vmin] group-hover:brightness-100 ${preview !== mode && 'brightness-50'}`} />
									<p className={`absolute bottom-1/6 uppercase text-fluid-2 tracking-tighter transition-all ${preview === mode ? 'text-neutral-50 font-black' : 'text-neutral-300'}`}>{data.label}</p>
								</Button>
								<div className="h-[calc(var(--spacing-md)+1px)] overflow-hidden">
									<motion.p
										animate={{ y: selectedMode === mode ? '0%' : '-100%' }}
										className="flex h-full items-center justify-center border-b border-x border-chart-5 bg-foreground text-background uppercase font-semibold"
										{...anim}
									>
										Selected
									</motion.p>
								</div>
							</div>
						))}
					</div>
				</div>
				<KbdGroup className='h-1/10'>
					<NavKbd
						onClick={() => nav(-1)}
						keybind='Escape'
						icon='Esc'
					>
						Back
					</NavKbd>
				</KbdGroup>
			</div>
		</div>
	)
}