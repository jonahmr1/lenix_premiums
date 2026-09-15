import { NavKbd } from '@/components/kbd'
import { Button } from '@workspace/ui/components/button'
import { ButtonGroup } from '@workspace/ui/components/button-group'
import { KbdGroup } from '@workspace/ui/components/kbd'
import { useContext } from 'react'
import { useNavigate } from 'react-router'
import { MAPS, MODES } from '../constants'
import { asserts, entries } from '@lenix/lenix'
import { CompetitiveContext } from '../context'
import { Badge } from '@workspace/ui/components/badge'

export const Mode = () => {
	const nav = useNavigate()
	const context = useContext(CompetitiveContext)
	asserts(context, `Failed to use competitive context`)
	
	const { selectedMode, setSelectedMode } = context
	const mode = MODES[selectedMode]

	return (
		<div className="relative isolate h-screen w-full">
			<img
				src={mode.image}
				className="absolute -z-2 size-full object-cover"
			/>
			<div className='absolute size-full -z-1 bg-linear-to-r from-neutral-950/90 to-transparent' />
			<div className="size-full flex items-start flex-col px-5xl py-xl">
				<div className='flex flex-10 justify-evenly flex-col'>
					<div className='flex flex-col gap-md'>
						<div>
							<p className='uppercase text-fluid-12 leading-none font-black text-neutral-100'>{mode.label}</p>
							<p>{mode.description}</p>
						</div>
						<div className='flex gap-sm'>
							{(() => {
								const classNames = [
									'text-fluid-2 uppercase',
									'text-fluid-2 uppercase font-semibold'
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
					<div>
						<div className='flex gap-md'>
							{entries(MODES).map(([mode, data]) => (
								<Button
									onClick={() => setSelectedMode(mode)}
									className='h-auto p-0 group relative border border-dark overflow-hidden'
								>
									<img src={data.image} className={`max-w-[30vmin] group-hover:brightness-100 ${selectedMode !== mode && 'brightness-50'}`} />
									<p className={`absolute bottom-1/6 uppercase text-fluid-3 tracking-tighter ${selectedMode === mode ? 'text-neutral-50 font-black' : 'text-neutral-300'}`}>{data.label}</p>
								</Button>
							))}
						</div>
					</div>
				</div>
				<KbdGroup className='flex-1'>
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