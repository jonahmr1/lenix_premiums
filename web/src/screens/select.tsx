import { useState } from 'react'
import warzone from '@/assets/start/warzone.png'
import law from '@/assets/start/law.png'
import undercover from '@/assets/start/undercover.jpeg'
import crime from '@/assets/start/crime.png'
import pursuit from '@/assets/start/pursuit.png'
import { audiobility } from '@/lib'
import { PageScreen } from '@/components/screen'
import { useRouter } from '@tanstack/react-router'

const modes = [
  {
    label: 'Warzone',
    description: 'Pure high-intensity FPS combat. Team-based firefights, tactical battles, and competitive gunplay with no roleplay.',
    image: warzone,
  },
  {
    label: 'Law Enforcement',
    description: 'Step into the role of law enforcement. Patrol the streets, respond to incidents, and serve as Police, SWAT, Sheriff, and other units.',
    image: law,
  },
  {
    label: 'Undercover',
    description: 'Work in the shadows. Take on covert operations, investigate dangerous organizations, gather information, and operate undercover.',
    image: undercover,
  },
  {
    label: 'Crime',
    description: 'Build your criminal life. Join gangs, plan robberies, run illegal businesses, make money, and fight for control of the streets.',
    image: crime,
  },
  {
    label: 'Pursuit',
    description: 'Push your limits behind the wheel. Race through the streets, escape the law, chase targets, and compete in high-speed pursuits.',
    image: pursuit,
  },
]

// Shared boundaries keep every diagonal parallel and leave a 0.5vw gap.
function panelClip(index: number, count: number, inset = 0) {
  const width = 100 / count
  const tilt = width / 10
  const edge = (boundary: number, angle: number, direction: number) => {
    const outside = boundary === 0 || boundary === count
    const position = boundary * width + (outside ? 0 : angle)
    const gap = outside ? 0 : direction * 0.25
    return `calc(${position}% + ${gap}vw + ${direction * inset}px)`
  }
  const top = `${inset}px`
  const bottom = `calc(100% - ${inset}px)`

  return `polygon(${edge(index, tilt, 1)} ${top}, ${edge(index + 1, tilt, -1)} ${top}, ${edge(index + 1, -tilt, -1)} ${bottom}, ${edge(index, -tilt, 1)} ${bottom})`
}

export const Select = () => {
	const router = useRouter()
  const [selected, setSelected] = useState(modes[0])

  return (
		<>
			<div className='h-screen bg-background'>
				<div className="grid h-3/4 [-webkit-box-reflect:below_2vh_linear-gradient(transparent_60%,rgb(0_0_0/0.5))]">
					{modes.map((mode, index) => (
						<button
							key={mode.label}
							onMouseOver={() => setSelected(mode)}
							style={{ clipPath: panelClip(index, modes.length) }}
							className={`relative col-start-1 row-start-1 min-w-0 cursor-pointer transition-[filter,background-color] duration-300 ${selected === mode ? 'bg-primary' : 'bg-border grayscale'}`}
							{...audiobility}
						>
							<div className="absolute inset-0 overflow-hidden" style={{ clipPath: panelClip(index, modes.length, 2) }}>
								<img
									src={selected.image}
									className='pointer-events-none absolute inset-0 size-full object-cover'
								/>
								<div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/80 to-transparent" />
								<div className={`pointer-events-none absolute inset-0 shadow-[inset_0_0_20px_3px_var(--primary)] transition-opacity duration-300 ${selected === mode ? 'opacity-100' : 'opacity-0'}`} />
							</div>
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
				<div>
					<span className="text-v-4 font-extrabold uppercase italic text-foreground">
						{selected.label}
					</span>
					<p>
						{selected.description}
					</p>
				</div>
			</PageScreen>
		</>
  )
}

export default Select
