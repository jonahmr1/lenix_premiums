import { NavKbd } from "@/components/kbd"
import { Layout } from "@/components/layout"
import { NextButton, PreviousButton } from "@/components/nav"
import type { Tab } from "@/types"
import { Tabs, TabsList, TabsContent } from "@workspace/elite/components/tabs"
import { Button } from "@workspace/ui/components/button"
import { Item, ItemActions, ItemContent, ItemTitle } from "@workspace/ui/components/item"
import { KbdGroup } from "@workspace/ui/components/kbd"
import { audiobility, cn } from "@workspace/ui/lib/utils"
import { useState } from "react"
import { useNavigate } from "react-router"
import { Keybinds } from "./keybinds"
import { KeyboardMouse } from "./keyboardMouse"
import { Header } from "@/components/header"
import { motion } from "motion/react"
import { anim } from "@/lib"

export const LabelItem = ({ children, title, className, digest, ...props }: {
	children?: React.ReactNode,
	title: React.ReactNode
	className?: React.ComponentProps<typeof Item>['className']
	digest?: true
} & React.ComponentProps<typeof Item>) => (
	<Item
		className={cn('bg-background/50 px-md hover:invert hover:bg-background text-fluid-1.5 font-black tracking-normal text-foreground', className)}
		onMouseEnter={audiobility.onMouseEnter}
		{...props}
	>
		<ItemContent>
			<ItemTitle className={`uppercase italic text-fluid-2 font-bold ${digest && 'font-black'}`}>{title}</ItemTitle>
		</ItemContent>
		<ItemActions>
			{children}
		</ItemActions>
	</Item>
)

const tabs: Tab[] = [
	{
		label: 'General',
		content: <p className="text-fluid-5">...</p>
	},
	{
		label: 'Graphics', /* Advanced Graphics */
		content: <p className="text-fluid-5">...</p>,
	},
	{
		label: 'Keybinds',
		content: <Keybinds />,
	},
	{
		label: 'Audio', /* Voice Chat */
		content: <p className="text-fluid-5">...</p>,
	},
	{
		label: 'Interface', /* Display */
		content: <p className="text-fluid-5">...</p>,
	},
	{
		label: 'Camera',
		content: <p className="text-fluid-5">...</p>,
	},
	{
		label: 'Keyboard / Mouse',
		content: <KeyboardMouse />,
	},
	{
		label: 'Gamepad',
		content: '',
		disabled: true
	},
	{
		label: 'Brief',
		content: '',
		disabled: true
	},
	{
		label: 'Stats',
		content: '',
		disabled: true
	},
	{
		label: 'Gallery',
		content: '',
		disabled: true
	},
	{
		label: 'Editor',
		content: '',
		disabled: true
	},
]

export const Settings = () => {
	const [tab, setTab] = useState(2)
	const nav = useNavigate()

	return (
		<Layout type="p" className="h-screen w-full flex flex-col gap-sm backdrop-blur-sm">
			<motion.div
				{...anim}
				initial={{ opacity: 0, y: -50 }}
				animate={{ opacity: 1, y: 0 }}
			>
				<Header>Settings</Header>
			</motion.div>
			<div className="flex justify-center *:text-fluid-2 min-h-0 w-full gap-xs px-sm">
				<PreviousButton
					tabs={tabs}
					value={tab}
					onValueChange={setTab}
				>Q</PreviousButton>
				<Tabs
					value={tab.toString()}
					className="flex-1"
				>
					<TabsList className="bg-transparent w-full p-0 gap-xs h-full">
						{tabs.map(({ disabled, label }, i) => (
							<Button
								key={i}
								disabled={disabled}
								variant={tab === i ? 'default' : 'secondary'}
								className="flex-1 text-fluid-2! font-bold italic"
								onClick={() => setTab(i)}
								size='lg'
							>{label}</Button>
						))}
					</TabsList>
					{tabs.map((tab, i) => (
						<TabsContent
							key={i}
							value={i.toString()}
							className="overflow-hidden"
						>{tab.content}</TabsContent>
					))}
				</Tabs>
				<NextButton
					tabs={tabs}
					value={tab}
					onValueChange={setTab}
				>
					E
				</NextButton>
			</div>
			<KbdGroup>
				<NavKbd
					onClick={() => nav(-1)}
					icon='Esc'
					keybind="Escape"
				>
					Back
				</NavKbd>
			</KbdGroup>
		</Layout>
	)
}