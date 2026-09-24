import { Button } from "@/components/ui/button"
import { useState } from "react"
import { audiobility } from "@/lib"
import { NavKbd } from "@/components/kbd"
import { PreviousButton, NextButton } from "@/components/nav"
import { Tabs, TabsList, TabsContent } from "@/components/ui/tabs"
import type { Tab } from "@/types"
import { Play } from "./pages/play"
import { KbdGroup } from "@/components/ui/kbd"
import { Layout } from "@/components/layout"
import { motion } from "motion/react"
import { anim } from "@/lib"
import { useNavigate } from "@tanstack/react-router"
// import logo from '@/assets/ui/competitive/lobby/logo.png'

export const Lobby = () => {
	const [tab, setTab] = useState(0)
	const nav = useNavigate()

	const tabs: Tab[] = [
		{
			label: 'Play',
			content: <Play />
		},
		{
			label: 'Arsenal',
			content: '',
			disabled: true
		},
		{
			label: 'Operator',
			content: '',
			disabled: true
		},
		{
			label: 'Battlepass',
			content: '',
			disabled: true
		},
		{
			label: 'Store',
			content: '',
			disabled: true
		},
	]

	return <>
		<Layout type="p" className="w-full h-screen flex flex-col">
			<Tabs
				value={tab.toString()}
				onValueChange={$ => setTab(Number($))}
				className="w-full h-full"
			>
				<motion.div
					className="w-full flex flex-row"
					{...anim}
					initial={{ opacity: 0, y: '-40%' }}
					animate={{ opacity: 1, y: 0 }}
				>
					<div className="flex flex-1 justify-center items-center">
						{/* <img src={logo} className="size-5xl" /> */}
						<p className="font-black italic text-fluid-4">FightM</p>
					</div>
					<div className="flex flex-2 items-center">
						<PreviousButton
							tabs={tabs}
							value={tab}
							onValueChange={setTab}
							variant='ghost'
						>Q</PreviousButton>
						<TabsList className="bg-transparent w-full p-0 gap-xs">
							{tabs.map((self, i) => (
								<Button
									key={i}
									disabled={self.disabled}
									variant={tab === i ? 'default' : 'outline'}
									className="flex-1 font-black tracking-normal text-fluid-2! font-sans italic hover:invert"
									onClick={() => setTab(i)}
									size='lg'
								>{self.label}</Button>
							))}
						</TabsList>
						<NextButton
							tabs={tabs}
							value={tab}
							onValueChange={setTab}
							variant='ghost'
						>
							E
						</NextButton>
					</div>
					<div>{/* top right side */}</div>
				</motion.div>
				{tabs.map((tab, i) => (
					<TabsContent
						key={i}
						value={i.toString()}
						className="size-full place-content-center place-items-center py-xl"
					>{tab.content}</TabsContent>
				))}
			</Tabs>
			<KbdGroup>
				<NavKbd
					icon='Esc'
					onClick={() => {
						audiobility.onMouseDown()
						// nav({ to: '' })
						/* TODO */
					}}
					keybind="Escape"
				>
					Exit
				</NavKbd>
			</KbdGroup>
		</Layout>
	</>
}
