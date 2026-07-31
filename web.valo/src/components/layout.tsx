import { twMerge } from "tailwind-merge"

export const Layout = ({ children, className, ...prop }: {
	children: React.ReactNode
	className?: React.ComponentProps<'div'>['className']
} & React.ComponentProps<'div'>) => (
	<div className={twMerge("flex h-[95vh] flex-col items-center justify-center", className)} {...prop}>
		{children}
	</div>
)