import { cn } from 'cn'

export const Layout = ({
	children,
	className,
	invert,
	...prop
}: {
	children: React.ReactNode
	className?: React.ComponentProps<'div'>['className']
	invert?: true
} & React.ComponentProps<'div'>) => (
	<div className={cn(invert ? 'm-v-3' : 'p-v-3', className)} {...prop}>
		{children}
	</div>
)
