import { NavKbd } from '@/components/kbd'
import { Button } from '@workspace/ui/components/button'
import { ButtonGroup } from '@workspace/ui/components/button-group'
import { KbdGroup } from '@workspace/ui/components/kbd'
import { useContext } from 'react'
import { useNavigate } from 'react-router'
import { MODES } from '../constants'
import { asserts, entries } from '@lenix/lenix'
import { CompetitiveContext } from '../context'

export const Mode = () => {
	const nav = useNavigate()
	const context = useContext(CompetitiveContext)
	asserts(context, `Failed to use competitive context`)
	
	const { selectedMode, setSelectedMode } = context

	return (
		<div className="relative isolate h-screen w-full">
			<img
				src={MODES[selectedMode].image}
				className="absolute -z-2 size-full object-cover"
			/>
			<div className='absolute size-full -z-1 bg-linear-to-r from-neutral-950/90 to-transparent' />
			<div className="size-full flex items-start flex-col px-5xl py-xl">
				<div className='flex flex-10 justify-evenly flex-col'>
					<div className='uppercase text-fluid-12 font-black text-neutral-100'>
						{MODES[selectedMode].label}
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