import { useState } from 'react'
import { anim, audio, audiobility } from '@/lib'
import { PageScreen } from '@/components/screen'
import { useRouter } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { asserts, entries } from '@lenix/lenix'
import { fetchNui, unFocusNui } from 'lenix/nui'
import type { Start } from 'types'
import { MODES } from '@/constants'
// Shared boundaries keep every diagonal parallel and leave a 0.5vw gap.
function panelClip(index: number, count: number, inset = 0) {
  const width = 100 / count
  const tilt = width / 10
  const edge = (boundary: number, angle: number, direction: number) => {
    const outside = boundary === 0 || boundary === count
    return `calc(${boundary * width + (outside ? 0 : angle)}% + ${outside ? 0 : direction * 0.1}vw + ${direction * inset}px)`
  }
  const top = `${inset}px`
  const bottom = `calc(100% - ${inset}px)`

  return `polygon(${edge(index, tilt, 1)} ${top}, ${edge(index + 1, tilt, -1)} ${top}, ${edge(index + 1, -tilt, -1)} ${bottom}, ${edge(index, -tilt, 1)} ${bottom})`
}

export const Select = () => {
	const router = useRouter()
  const [modeState, setMode] = useState<keyof typeof MODES>(entries(MODES).find(([, self]) => !self.disabled)![0])
	asserts(modeState)

	const selected = MODES[modeState]

  return (
		<>
			<div className='h-screen bg-background'>
				<div className="grid h-3/4 [-webkit-box-reflect:below_2vh_linear-gradient(transparent_60%,rgb(0_0_0/0.5))]">
					{entries(MODES).map(([mode, config], index) => (
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
							style={{
								clipPath: panelClip(index, entries(MODES).length),
								backgroundColor: mode === modeState ? `#${selected.color}` : undefined
							}}
							className={`relative col-start-1 row-start-1 min-w-0 transition-[filter,background-color] duration-300 ${mode !== modeState && 'bg-border grayscale'}`}
							{...audiobility}
						>
							<div className="absolute inset-0 overflow-hidden" style={{ clipPath: panelClip(index, entries(MODES).length, 2) }}>
								<img
									src={MODES[mode].image}
									className='pointer-events-none absolute inset-0 size-full object-cover'
									style={{
										translate: `${MODES[mode].translate}% 0`
									}}
								/>
								<div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/50 to-transparent" />
								<div
									className='pointer-events-none absolute inset-0 transition-opacity duration-300'
									style={{
										boxShadow: `inset 0 0 10px 5px #${MODES[mode].color}`,
									}}
								/>
							</div>
							{config.disabled && (
								<div
									className="pointer-events-none absolute top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-md border bg-card px-w-1 py-h-1 uppercase"
									style={{ left: `${((index + 0.5) / entries(MODES).length) * 100}%` }}
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
