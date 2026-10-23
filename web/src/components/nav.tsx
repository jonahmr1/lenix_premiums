import type { Tab } from '@/types'
import { Button } from '@/components/ui/button'
import { Kbd } from '@/components/ui/kbd'
import { audiobility } from '@/lib'
import { onKeyDown } from 'lenix/nui'
import { useEffect } from 'react'
import { cn } from 'cn'

export const NavButton = ({
	children,
	type,
	tabs,
	value,
	onValueChange,
	variant = 'background',
	className,
}: {
	children: React.ReactNode
	type: 'previous' | 'next'
	tabs: Tab[]
	value: number
	onValueChange: (value: number) => void
	variant?: React.ComponentProps<typeof Button>['variant']
	className?: React.ComponentProps<typeof Button>['className']
}) => {
	const filteredTabs = tabs.flatMap((mode, i) => (mode.disabled ? [] : [i]))

	const handle = () => {
		onValueChange(
			type === 'previous'
				? value === 0
					? filteredTabs[filteredTabs.length - 1]
					: filteredTabs[filteredTabs.indexOf(value) - 1]
				: value + 1 > filteredTabs[filteredTabs.length - 1]
					? 0
					: filteredTabs[filteredTabs.indexOf(value) + 1],
		)
		audiobility.onMouseEnter()
	}

	useEffect(() => onKeyDown(type === 'previous' ? 'q' : 'e', handle), [tabs, value, onValueChange])

	return (
		<Button size='lg' onClick={handle} variant={variant} className={cn('px-w-0.5 group', className)} audioDisabled>
			<Kbd className='bg-foreground text-background text-v-1 font-bold group-hover:invert'>{children}</Kbd>
		</Button>
	)
}
