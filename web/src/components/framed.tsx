import { cn } from 'cn'

export const Framed = ({
	children,
	className,
}: {
	children: React.ReactNode
	className?: React.ComponentProps<'div'>['className']
}) => (
	<div className={cn('relative', className)}>
		<span className='border-foreground/80 absolute top-0 left-0 size-1 border-t-2 border-l-2' />
		<span className='border-foreground/80 absolute top-0 right-0 size-1 border-t-2 border-r-2' />
		<span className='border-foreground/80 absolute bottom-0 left-0 size-1 border-b-2 border-l-2' />
		<span className='border-foreground/80 absolute right-0 bottom-0 size-1 border-r-2 border-b-2' />
		{children}
	</div>
)
