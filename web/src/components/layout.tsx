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
	<div className={cn(invert ? 'mx-lg my-md' : 'px-4xl py-xl', className)} {...prop}>
		{children}
	</div>
)
