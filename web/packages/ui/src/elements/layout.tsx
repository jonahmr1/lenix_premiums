import { cn } from "@workspace/ui/lib/utils"

export const Layout = ({
	children,
	className,
	...prop
}: {
	children: React.ReactNode
	className?: React.ComponentProps<'div'>['className']
} & React.ComponentProps<'div'>) => (
	<div className={cn('flex h-9/10 flex-col items-center justify-center', className)} {...prop}>
		{children}
	</div>
)
