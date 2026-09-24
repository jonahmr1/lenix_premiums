import { Spinner } from '@workspace/ui/components/spinner'
import { cn } from '@workspace/ui/lib/utils'

export const Loading = ({ className }: { className: React.ComponentProps<'div'>['className'] }) => (
	<div className={cn('flex items-center justify-center bg-background', className)}>
		<Spinner />
	</div>
)
