import { useState } from 'react'
import { anim, audio, audiobility, cdn } from '@/lib'
import { PageScreen } from '@/components/screen'
import { useRouter } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { asserts, entries } from '@lenix/lenix'
import { fetchNui, unFocusNui } from 'lenix/nui'
import type { Start } from 'types'

const modes = {
  warzone: {
    label: 'Warzone',
    description: 'Pure high-intensity FPS combat. Team-based firefights, tactical battles, and competitive gunplay with no roleplay.',
    image: cdn('assets/start/warzone.png'),
		disabled: false
  },
  police: {
    label: 'Law Enforcement',
    description: 'Step into the role of law enforcement. Patrol the streets, respond to incidents, and serve as Police, SWAT, Sheriff, and other units.',
    image: cdn('assets/start/law.png'),
		disabled: false
  },
	gang: {
		label: 'Crime',
		description: 'Build your criminal life. Join gangs, plan robberies, run illegal businesses, make money, and fight for control of the streets.',
		image: cdn('assets/start/crime.png'),
		disabled: false
	},
  justice: {
    label: 'Undercover',
    description: 'Work in the shadows. Take on covert operations, investigate dangerous organizations, gather information, and operate undercover.',
    image: cdn('assets/start/undercover.jpeg'),
		disabled: true
  },
  race: {
    label: 'Pursuit',
    description: 'Push your limits behind the wheel. Race through the streets, escape the law, chase targets, and compete in high-speed pursuits.',
    image: cdn('assets/start/pursuit.png'),
		disabled: true
  },
} satisfies Record<Start.Mode, object>

// Shared boundaries keep every diagonal parallel and leave a 0.5vw gap.
function panelClip(index: number, count: number, inset = 0) {
  const width = 100 / count
  const tilt = width / 10
  const edge = (boundary: number, angle: number, direction: number) => {
    const outside = boundary === 0 || boundary === count
    return `calc(${boundary * width + (outside ? 0 : angle)}% + ${outside ? 0 : direction * 0.25}vw + ${direction * inset}px)`
  }
  const top = `${inset}px`
  const bottom = `calc(100% - ${inset}px)`

  return `polygon(${edge(index, tilt, 1)} ${top}, ${edge(index + 1, tilt, -1)} ${top}, ${edge(index + 1, -tilt, -1)} ${bottom}, ${edge(index, -tilt, 1)} ${bottom})`
}

export const Select = () => {
	const router = useRouter()
  const [modeState, setMode] = useState<keyof typeof modes>(entries(modes).find(([, self]) => !self.disabled)![0])
	asserts(modeState)

	const selected = modes[modeState]

  return (
		<>
			<div className='h-screen bg-background'>
				<div className="grid h-3/4 [-webkit-box-reflect:below_2vh_linear-gradient(transparent_60%,rgb(0_0_0/0.5))]">
					{entries(modes).map(([mode, config], index) => (
						<button
							key={config.label}
							onMouseOver={() => setMode(mode)}
							onClick={() => {
								if (config.disabled) {
									audio.unavailable()
									toast('This mode is locked', { toasterId: 'notify' })
									return
								}
								router.navigate({ to: `/${mode}` })
								fetchNui<Start.Requests['selectMode']>('start:selectMode', { mode })
								unFocusNui()
							}}
							style={{ clipPath: panelClip(index, entries(modes).length) }}
							className={`relative col-start-1 row-start-1 min-w-0 transition-[filter,background-color] duration-600 ${mode === modeState ? 'bg-primary' : 'bg-border grayscale'}`}
							{...audiobility}
						>
							<div className="absolute inset-0 overflow-hidden" style={{ clipPath: panelClip(index, entries(modes).length, 2) }}>
								<img
									src={selected.image}
									className='pointer-events-none absolute inset-0 size-full object-cover'
								/>
								<div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/80 to-transparent" />
								<div className={`pointer-events-none absolute inset-0 shadow-[inset_0_0_5px_5px_var(--primary)] transition-opacity duration-300 ${mode === modeState ? 'opacity-100' : 'opacity-0'}`} />
							</div>
							{config.disabled && (
								<div
									className="pointer-events-none absolute top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-md border bg-card px-w-1 py-h-1 uppercase"
									style={{ left: `${((index + 0.5) / entries(modes).length) * 100}%` }}
								>
									<FontAwesomeIcon icon={faLock} />
									<span>Locked</span>
								</div>
							)}
						</button>
					))}
				</div>
			</div>
			<PageScreen
				className='absolute bottom-0 h-fit z-10 max-w-2/3 text-muted-foreground text-v-1.2 justify-end gap-h-1'
				kbds={[
					{
						icon: 'ESC',
						keybind: 'Escape',
						onClick: () => router.history.back(),
						children: 'Back'
					}
				]}
			>
				<motion.div {...anim} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
					<span className="text-v-4 font-extrabold uppercase italic text-foreground">
						{selected.label}
					</span>
					<p>
						{selected.description}
					</p>
				</motion.div>
			</PageScreen>
		</>
  )
}

export default Select
