export const Layout = ({ children, ...prop }: {
	children: React.ReactNode
} & React.ComponentProps<'div'>) => (
	<div className="flex min-h-screen flex-col items-center justify-center" {...prop}>
		{children}
	</div>
)