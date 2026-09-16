import { cn } from "@workspace/ui/lib/utils"

export const Layout = ({
	children,
	className,
	type = 'm',
	...prop
}: {
	children: React.ReactNode
	className?: React.ComponentProps<'div'>['className']
	type?: 'm' | 'p'
} & React.ComponentProps<'div'>) => (
	<div className={cn(type === 'm' ? 'mx-2xl my-xl' : 'px-2xl py-xl', className)} {...prop}>
		{children}
	</div>
)
