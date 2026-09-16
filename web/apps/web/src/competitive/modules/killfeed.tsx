import { DEV } from "@/App"
import { Layout } from "@/components/layout"
import { anim } from "@/lib"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { random } from "@lenix/lenix"
import { Crosshair, Skull } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"

interface KillFeed {
	killer: string
	gun: string
	victim: string
	type: 'headshot' | 'roll' | 'body'
	id: string
}

export const KillFeed = () => {
	const [feeds, setFeeds] = useState<KillFeed[]>()
	const name = 'Lenix'

	const newFeed = (feed: Omit<KillFeed, 'id'>) => {
		const uniqueFeed = { ...feed, id: crypto.randomUUID() }

		setFeeds(prev => [...(prev ?? []), uniqueFeed])

		const timeout = setTimeout(() => {
			setFeeds(prev => prev?.filter(self => self.id !== uniqueFeed.id))
			clearTimeout(timeout)
		}, 5000)
	}

	useEffect(() => {
		return DEV(() => {
			const samples = [
				{ killer: 'Abdullah', gun: 'https://docs-backend.fivem.net/weapons/WEAPON_COMBATSHOTGUN.png', victim: 'Lenix', type: 'headshot' },
				{ killer: 'Lenix', gun: 'https://docs-backend.fivem.net/weapons/WEAPON_ASSAULTSHOTGUN.png', victim: 'Abdullah', type: 'roll' },
				{ killer: 'Abdullah', gun: 'https://docs-backend.fivem.net/weapons/WEAPON_PISTOL_MK2.png', victim: 'Mazen', type: 'body' },
			] as const

			const interval = setInterval(() => {
				newFeed(samples[random(0, samples.length - 1)])
			}, 1000)
			return () => clearInterval(interval)
		}, 'competitive')
	}, [])

	if (!feeds) return null

	return (
		<Layout className="absolute w-fluid-30 uppercase h-4/100 top-1/100 right-0 text-fluid-1.5 font-normal">
			<AnimatePresence initial={false}>
				{feeds.map(feed => (
					<motion.div
						key={feed.id}
						layout
						{...anim}
						initial={{ opacity: 0, x: 200 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 200 }}
						className={`flex size-full items-center justify-between px-2 bg-background border-l-2 border-foreground ${feed.killer !== name && 'invert'}`}
					>
						<p>{feed.killer}</p>
						<div className="flex h-2/5 gap-sm items-center">
							<img src={feed.gun} className="h-full brightness-0" />
							{feed.type === 'headshot'
								? <Skull className="size-sm" />
								: feed.type === 'roll'
									? <FontAwesomeIcon icon={['fas', 'arrows-turn-to-dots']} />
									: <Crosshair className="size-sm" />}
						</div>
						<p>{feed.victim}</p>
					</motion.div>
				))}
			</AnimatePresence>
		</Layout>
	)
}