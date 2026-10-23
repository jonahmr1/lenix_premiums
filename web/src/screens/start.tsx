import { fetchNuiServer } from 'lenix/nui'
import type { Start as Starting } from 'types'
import { Button } from '@/components/ui/button'
import { Layout } from '@/components/layout'
import { useNavigate } from '@tanstack/react-router'

export const Start = () => {
	const nav = useNavigate()

	return (
		<div className='relative h-screen flex-row justify-start overflow-hidden bg-linear-to-t from-neutral-950/50 to-transparent p-0'>
			<div className='absolute -z-1 size-full bg-linear-to-r from-neutral-950/50 to-transparent' />
			<Layout
				className='[&>*>*]:text-v-2 [&>*>*]:text-muted-foreground flex size-full flex-col *:flex *:flex-col *:items-start *:justify-center [&>*>*]:bg-transparent [&>*>*]:uppercase [&>*>*]:duration-0'
			>
				<div className='flex-1'></div>
				<div className='*:text-v-3! *:py-h-2 gap-h-2 flex-1'>
					<Button variant='ghost' onClick={() => nav({ to: '/starting/select' })}>
						Multiplayer
					</Button>
					<Button variant='ghost' disabled>
						Campaign
					</Button>
				</div>
				<div className='-perspective-left-2 flex-1'>
					<Button variant='ghost' onClick={() => nav({ to: '/', hash: 'settings' })}>
						Settings
					</Button>
					<Button variant='ghost' onClick={() => nav({ to: '/starting/credit' })}>
						Credit
					</Button>
					<Button
						variant='ghost'
						onClick={() => fetchNuiServer<Starting.Requests['exitGame']>('start:exitGame', {})}
						className='mt-h-2! text-red-700! text-shadow-red-700! hover:text-red-500! hover:drop-shadow-red-500/50!'
					>
						Quit
					</Button>
				</div>
			</Layout>
		</div>
	)
}
