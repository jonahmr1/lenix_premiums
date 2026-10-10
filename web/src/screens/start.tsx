import { fetchNuiServer } from 'lenix/nui'
import type { Start as Starting } from 'types'
import { Button } from '@/components/ui/button'
import { Layout } from '@/components/layout'
import { useNavigate } from '@tanstack/react-router'

export const Start = () => {
  const nav = useNavigate()

  return (
    <div className="relative h-screen flex-row justify-start overflow-hidden bg-linear-to-t from-neutral-950/50 to-transparent p-0">
      <div className="absolute -z-1 size-full bg-linear-to-r from-neutral-950/50 to-transparent" />
      <Layout className="flex flex-col size-full
				*:flex *:flex-col *:items-start *:justify-center *:-perspective-left-5
				[&>*>*]:bg-transparent [&>*>*]:text-v-2 [&>*>*]:text-muted-foreground [&>*>*]:uppercase [&>*>*]:duration-0 [&>*>*]:hover:bg-current/20"
			>
				<div className='flex-1'></div>
				<div className='flex-1 *:text-v-3! *:py-h-2 gap-h-2'>
					<Button
						variant="default"
						onClick={() => nav({ to: '/starting/select' })}
					>
						Multiplayer
					</Button>
					<Button
						variant="default"
						disabled
					>
						Campaign
					</Button>
				</div>
				<div className='flex-1'>
					<Button
						variant="default"
						onClick={() => nav({ to: '/', hash: 'settings' })}
					>
						Settings
					</Button>
					<Button
						variant="default"
						onClick={() => nav({ to: '/starting/credit' })}
					>
						Credit
					</Button>
					<Button
						variant="default"
						onClick={() => fetchNuiServer<Starting.Requests['exitGame']>('start:exitGame', {})}
						className='text-red-700! hover:text-red-500! text-shadow-red-700! hover:drop-shadow-red-500/50! mt-h-3!'
					>
						Quit
					</Button>
				</div>
      </Layout>
    </div>
  )
}
