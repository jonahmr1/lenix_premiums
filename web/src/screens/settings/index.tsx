import { NavButton } from '@/components/nav'
import type { Tab } from '@/types'
import { Tabs, TabsList, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Item, ItemActions, ItemContent, ItemTitle } from '@/components/ui/item'
import { audiobility } from '@/lib'
import { useState } from 'react'
import { Keybinds } from './keybinds'
import { KeyboardMouse } from './keyboardMouse'
import { Header } from '@/components/header'
import { motion } from 'motion/react'
import { anim } from '@/lib'
import { cn } from 'cn'
import { useRouter } from '@tanstack/react-router'
import { PageScreen } from '@/components/screen'

export const LabelItem = ({
	children,
	title,
	className,
	...props
}: {
	children?: React.ReactNode
	title: React.ReactNode
	className?: React.ComponentProps<typeof Item>['className']
	digest?: true
} & React.ComponentProps<typeof Item>) => (
	<Item
		className={cn('group bg-background/50 px-w-1 text-foreground hover:bg-background italic hover:invert', className)}
		onMouseEnter={audiobility.onMouseEnter}
		{...props}
	>
		<ItemContent>
			<ItemTitle className='text-v-1.5 font-bold uppercase'>{title}</ItemTitle>
		</ItemContent>
		<ItemActions>{children}</ItemActions>
	</Item>
)

const tabs: Tab[] = [
	{
		label: 'General',
		content: <div className='text-v-4 flex size-full items-center justify-center'>General Soon...</div>,
	},
	{
		label: 'Graphics' /* Advanced Graphics */,
		content: <div className='text-v-4 flex size-full items-center justify-center'>Graphics Soon...</div>,
	},
	{
		label: 'Keybinds',
		content: <Keybinds />,
	},
	{
		label: 'Audio' /* Voice Chat */,
		content: <div className='text-v-4 flex size-full items-center justify-center'>Audio Soon...</div>,
	},
	{
		label: 'Interface' /* Display */,
		content: <div className='text-v-4 flex size-full items-center justify-center'>Display Soon...</div>,
	},
	{
		label: 'Camera',
		content: <div className='text-v-4 flex size-full items-center justify-center'>Display Soon...</div>,
	},
	{
		label: 'Keyboard / Mouse',
		content: <KeyboardMouse />,
	},
	{
		label: 'Gamepad',
		content: '',
		disabled: true,
	},
	{
		label: 'Brief',
		content: '',
		disabled: true,
	},
	{
		label: 'Stats',
		content: '',
		disabled: true,
	},
	{
		label: 'Gallery',
		content: '',
		disabled: true,
	},
	{
		label: 'Editor',
		content: '',
		disabled: true,
	},
]

export const Settings = () => {
	const [tab, setTab] = useState(0)
	const router = useRouter()

	return (
		<PageScreen
			className='gap-h-1 absolute z-2 flex h-screen w-full flex-col'
			kbds={[
				{
					onClick: () => router.history.back(),
					icon: 'ESC',
					keybind: 'Escape',
					children: 'Back',
				},
			]}
		>
			<motion.div {...anim} initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }}>
				<Header>Settings</Header>
			</motion.div>
			<div className='gap-w-0.5 flex size-full min-h-0 justify-center'>
				<NavButton type='previous' tabs={tabs} value={tab} onValueChange={setTab}>
					Q
				</NavButton>
				<Tabs value={tab.toString()} className='size-full flex-1'>
					<TabsList className='gap-w-0.5 size-full bg-transparent p-0'>
						{tabs.map(({ disabled, label }, i) => (
							<Button
								key={i}
								disabled={disabled}
								variant={tab === i ? 'default' : 'background'}
								className='text-v-1.6 flex-auto font-medium uppercase italic'
								onClick={() => setTab(i)}
								size='lg'
							>
								{label}
							</Button>
						))}
					</TabsList>
					{tabs.map((tab, i) => (
						<TabsContent key={i} value={i.toString()} className='size-full overflow-hidden'>
							{tab.content}
						</TabsContent>
					))}
				</Tabs>
				<NavButton type='next' tabs={tabs} value={tab} onValueChange={setTab}>
					E
				</NavButton>
			</div>
		</PageScreen>
	)
}
