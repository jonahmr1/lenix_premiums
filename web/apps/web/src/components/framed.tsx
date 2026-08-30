import { cn } from "@workspace/ui/lib/utils";

export const Framed = ({ children, className }: { children: React.ReactNode, className?: React.ComponentProps<'div'>['className'] }) => (
	<div className={cn('relative', className)}>
		<span className="absolute left-0 top-0 size-1 border-l-2 border-t-2 border-foreground/80" />
		<span className="absolute right-0 top-0 size-1 border-r-2 border-t-2 border-foreground/80" />
		<span className="absolute bottom-0 left-0 size-1 border-b-2 border-l-2 border-foreground/80" />
		<span className="absolute bottom-0 right-0 size-1 border-b-2 border-r-2 border-foreground/80" />
		{children}
	</div>
)
