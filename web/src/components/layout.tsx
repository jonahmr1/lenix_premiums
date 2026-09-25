import { cn } from "cn"

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
	<div className={cn(invert ? 'm-v-5' : 'p-v-5', className)} {...prop}>
		{children}
	</div>
)
