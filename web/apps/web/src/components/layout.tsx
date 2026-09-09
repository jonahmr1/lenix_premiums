import { cn } from "@workspace/ui/lib/utils"

export const Layout = ({
	children,
	className,
	...prop
}: {
	children: React.ReactNode
	className?: React.ComponentProps<'div'>['className']
} & React.ComponentProps<'div'>) => (
	<div className={cn('mx-10 my-7', className)} {...prop}>
		{children}
	</div>
)
