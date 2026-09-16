import { cn } from "@workspace/ui/lib/utils"

export const Layout = ({
	children,
	className,
	...prop
}: {
	children: React.ReactNode
	className?: React.ComponentProps<'div'>['className']
} & React.ComponentProps<'div'>) => (
	<div className={cn('mx-2xl my-xl', className)} {...prop}>
		{children}
	</div>
)
