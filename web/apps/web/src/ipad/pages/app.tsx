import { Button } from '@workspace/ui/components/button'
import { ButtonGroup } from '@workspace/ui/components/button-group'
import { Separator } from '@workspace/ui/components/separator'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { useNavigate } from 'react-router'

export const Index = ({ appName, children }: { appName: string; children: React.ReactNode }) => {
	const nav = useNavigate()

	return (
		<div className='size-full flex overflow-hidden flex-col'>
			<div className='bg-card h-6/100 w-full overflow-hidden px-2 items-center justify-between flex'>
				<div className='flex items-center gap-2'>
					<Button variant='destructive' className='px-1 rounded-full size-md!' onClick={() => nav('/')}>
						<X className='size-sm'/>
					</Button>
					<ButtonGroup>
						<Button variant='secondary' className='h-full size-lg' onClick={() => nav(-1)}>
							<ArrowLeft className='size-sm' />
						</Button>
						<Button variant='secondary' className='h-full size-lg' disabled>
							<ArrowRight className='size-sm' />
						</Button>
					</ButtonGroup>
				</div>
				<div>
					<p className='text-muted-foreground text-fluid-2 font-normal'>{appName}</p>
				</div>
			</div>
			<Separator className='bg-muted-foreground' />
			<div className='bg-card size-full overflow-hidden'>
				<div className='size-full relative flex items-center'>{children}</div>
			</div>
		</div>
	)
}
