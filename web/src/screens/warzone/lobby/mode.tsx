import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { WARZONE_MODES } from '@/constants'
import { entries } from '@lenix/lenix'
import { Badge } from '@/components/ui/badge'
import { AnimatePresence, motion } from 'motion/react'
import { anim } from '@/lib'
import { audio } from '@/lib'
import { useStates } from '@/hooks'
import { toast } from 'sonner'
import { PageScreen } from '@/components/screen'
import { Constants } from 'common/config/constants'
import { useNavigate } from '@tanstack/react-router'

export const Mode = () => {
	const nav = useNavigate()
	const [{ lobby }, setState] = useStates()
	const [preview, setPreview] = useState(lobby.mode)

	const mode = WARZONE_MODES[preview]

	return (
		<div className='relative isolate h-screen w-full'>
			<AnimatePresence initial={false}>
				<motion.img
					key={mode.image}
					src={mode.image}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.1 }}
					className='absolute inset-0 -z-2 size-full object-cover'
				/>
			</AnimatePresence>
			<div className='absolute -z-1 size-full bg-linear-to-r from-neutral-950/90 from-5% to-transparent' />
			<PageScreen
				className='items-start'
				kbds={[
					{
						onClick: () => nav({ to: '/warzone', hash: 'relative' }),
						keybind: 'Escape',
						icon: 'ESC',
						children: 'Back',
					},
				]}
			>
				<div className='gap-h-15 flex size-full h-9/10 flex-col justify-end'>
					<div className='gap-h-2 flex w-full flex-3 flex-col justify-end'>
						<div>
							<p className='text-v-10 leading-none font-black uppercase'>{mode.label}</p>
							<p className='text-muted-foreground text-shadow-lg'>{mode.description}</p>
						</div>
						<div className='gap-w-0.5 flex'>
							{(() => {
								/* The shitiest so far */
								const classNames = ['text-v-1 uppercase', 'text-v-1 uppercase font-medium']
								return (
									<>
										<Badge>
											<span className={classNames[0]}>Maps: </span>
											<span className={classNames[1]}>
												{mode.maps.map(map => Constants.warzone.game_maps[map].label).join(' / ')}
											</span>
										</Badge>
										{'scoreLimit' in mode && (
											<Badge>
												<span className={classNames[0]}>Score Limit: </span>
												<span className={`${classNames[1]} uppercase`}>{mode.scoreLimit}</span>
											</Badge>
										)}
										{'duration' in mode && (
											<Badge>
												<span className={classNames[0]}>Duration: </span>
												<span className={`${classNames[1]} uppercase`}>{mode.duration / 1000 / 60} Minutes</span>
											</Badge>
										)}
										{'points' in mode && (
											<Badge>
												<span className={classNames[0]}>Points: </span>
												<span className={`${classNames[1]} uppercase`}>{mode.points.join(' / ')}</span>
											</Badge>
										)}
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
								)
							})()}
						</div>
					</div>
					<div className='gap-w-1 text-input flex min-h-0 w-full min-w-0 flex-1 items-end justify-between overflow-x-auto pb-1'>
						{entries(WARZONE_MODES).map(([mode, data]) => (
							<div
								key={mode}
								className={`flex h-full flex-col transition-all duration-300 ${preview === mode ? 'flex-2' : 'flex-1'}`}
							>
								<Button
									onClick={() => {
										if ('disabled' in data) {
											toast('This mode is not available yet', {
												toasterId: 'notify',
											})
											audio.unavailable()
											return
										}
										setState(null, { lobby: { mode } })
										audio.select()
									}}
									onMouseOver={() => setPreview(mode)}
									className='group border-border hover:border-primary relative min-h-0 w-full flex-1 overflow-hidden border p-0 transition-all duration-300'
								>
									<img
										src={data.image}
										className={`pointer-events-none h-full w-full object-cover transition-all duration-300 group-hover:brightness-100 ${preview !== mode && 'brightness-50'}`}
									/>
									<p
										className={`font-heading text-v-1.75 absolute bottom-2 font-normal tracking-tighter uppercase transition-all ${preview === mode ? 'font-bold!' : 'hidden'}`}
									>
										{data.label}
									</p>
								</Button>
								<div className='h-[calc(var(--spacing-md)+1px)] overflow-hidden'>
									<motion.p
										animate={{ y: lobby.mode === mode ? '0%' : '-100%' }}
										className='border-chart-5 bg-foreground text-background flex h-full items-center justify-center border-x border-b font-medium uppercase'
										{...anim}
									>
										Selected
									</motion.p>
								</div>
							</div>
						))}
					</div>
				</div>
			</PageScreen>
		</div>
	)
}
