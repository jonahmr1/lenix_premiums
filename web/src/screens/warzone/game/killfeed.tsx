import { Layout } from '@/components/layout'
import { anim } from '@/lib'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { random } from '@lenix/lenix'
import { CrosshairIcon, SkullIcon } from '@phosphor-icons/react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'

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
		const samples = [
			{
				killer: 'Abdullah',
				gun: 'https://docs-backend.fivem.net/weapons/WEAPON_COMBATSHOTGUN.png',
				victim: 'Lenix',
				type: 'headshot',
			},
			{
				killer: 'Lenix',
				gun: 'https://docs-backend.fivem.net/weapons/WEAPON_ASSAULTSHOTGUN.png',
				victim: 'Abdullah',
				type: 'roll',
			},
			{
				killer: 'Abdullah',
				gun: 'https://docs-backend.fivem.net/weapons/WEAPON_PISTOL_MK2.png',
				victim: 'Mazen',
				type: 'body',
			},
		] as const

		const interval = setInterval(() => {
			newFeed(samples[random(0, samples.length - 1)])
		}, 1000)
		return () => clearInterval(interval)
	}, [])

	if (!feeds) return null

	return (
		<Layout
			invert
			className='w-w-15 h-h-4 text-v-1 perspective-right-66 absolute top-0/100 right-0 font-normal uppercase'
		>
			<AnimatePresence>
				{feeds.map(feed => (
					<motion.div
						key={feed.id}
						layout
						{...anim}
						initial={{ opacity: 0, x: 30 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 30 }}
						transition={{ duration: 0.2, ease: 'easeOut' }}
						className={`flex size-full items-center justify-between border-l-2 px-2 italic ${feed.killer === name ? 'bg-background border-foreground' : 'bg-foreground border-background text-background'}`}
					>
						<p className={`${feed.killer === name && 'font-black tracking-normal'}`}>{feed.killer}</p>
						<div className='gap-w-0.5 flex h-2/5 items-center'>
							<img src={feed.gun} className={`h-full ${feed.killer === name ? 'brightness-200' : 'brightness-0'}`} />
							{feed.type === 'headshot' ? (
								<SkullIcon className='size-v-2' />
							) : feed.type === 'roll' ? (
								<FontAwesomeIcon icon={['fas', 'arrows-turn-to-dots']} />
							) : (
								<CrosshairIcon className='size-v-2' />
							)}
						</div>
						<p className={`${feed.victim === name && 'font-black tracking-normal'}`}>{feed.victim}</p>
					</motion.div>
				))}
			</AnimatePresence>
		</Layout>
	)
}
