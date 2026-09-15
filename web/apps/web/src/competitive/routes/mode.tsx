import { NavKbd } from '@/components/kbd'
import deathmatch from '@workspace/ui/assets/competitive/lobby/deathmatch.png'
import { Button } from '@workspace/ui/components/button'
import { ButtonGroup } from '@workspace/ui/components/button-group'
import { KbdGroup } from '@workspace/ui/components/kbd'
import { useNavigate } from 'react-router'

export const Mode = () => {
	const nav = useNavigate()
	return (
		<div className="relative isolate h-screen w-full">
			<img
				src={deathmatch}
				alt=""
				className="absolute -z-2 size-full object-cover"
			/>
			<div className='absolute size-full -z-1 bg-linear-to-r from-neutral-950/90 to-transparent' />
			<div className="size-full flex items-start flex-col px-5xl py-xl">
				<div className='flex flex-10 justify-evenly flex-col'>
					<div className='uppercase text-fluid-12 font-black'>
						Deathmatch
					</div>
					<div>
						<ButtonGroup>
							<Button className='h-auto p-0 group relative'>
								<img src={deathmatch} className='max-w-[40vmin] group-hover:brightness-100 brightness-75' />
								<p className='absolute bottom-1/5 uppercase font-semibold text-fluid-3 text-foreground tracking-tighter'>Deathmatch</p>
							</Button>
						</ButtonGroup>
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