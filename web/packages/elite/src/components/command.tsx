import * as React from 'react'
import { Command as CommandPrimitive } from 'cmdk'
import { Search } from 'lucide-react'

import { cn } from '@workspace/elite/lib/utils'

function Command({
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive>) {
	return (
		<CommandPrimitive
			data-slot='command'
			className={cn(
				'flex h-full w-full flex-col overflow-hidden rounded-lg bg-popover text-popover-foreground',
				className,
			)}
			{...props}
		/>
	)
}

function CommandInput({
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
	return (
		<div className='flex items-center gap-2 border-b border-border/50 px-3' data-slot='command-input-wrapper'>
			<Search className='size-4 text-muted-foreground' />
			<CommandPrimitive.Input
				data-slot='command-input'
				className={cn(
					'flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
					className,
				)}
				{...props}
			/>
		</div>
	)
}

function CommandList({
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
	return (
		<CommandPrimitive.List
			data-slot='command-list'
			className={cn('max-h-72 overflow-x-hidden overflow-y-auto', className)}
			{...props}
		/>
	)
}

function CommandEmpty({
	className,
	...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
	return (
		<CommandPrimitive.Empty
			data-slot='command-empty'
			className={cn('py-6 text-center text-sm text-muted-foreground', className)}
			{...props}
		/>
	)
}

export { Command, CommandEmpty, CommandInput, CommandList }
