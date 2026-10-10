import type { MotionProps } from "motion/react";
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { fetchNui } from "lenix/nui";
import assets from './assets'

export const playAudio = (src: 'hover' | 'click' | 'custom', customAudio?: string, customVolume = 1.0) => {
	const audio = new Audio(src === 'hover' ? cdn('assets/audio/hover.wav') : src === 'click' ? cdn('assets/audio/click.wav') : customAudio)
	audio.volume = src === 'hover' ? 1.0 : src === 'click' ? 1.0 : customVolume
	audio.play()
}

export const audiobility = {
	onMouseEnter: () => playAudio('hover'),
	onMouseDown: () => playAudio('click')
}

export const audio = {
	error: () => playAudio('custom', cdn('assets/audio/error.wav')),
	unavailable: () => playAudio('custom', cdn('assets/audio/unavailable.ogg'), 0.4),
	cannot: () => playAudio('custom', cdn('assets/audio/cannot.ogg')),
	select: () => playAudio('custom', cdn('assets/audio/select.wav')),
	orchestra: () => playAudio('custom', cdn('assets/audio/orchestra.wav')),
	impact: () => playAudio('custom', cdn('assets/audio/impact.mp3'), 0.4),
}

dayjs.extend(duration)

export const anim = {
	initial: false,
	transition: { duration: 0.3, ease: 'easeOut' },
} satisfies MotionProps

/**
	@param length length of numbers to stop applying to; e.g. tens? hundreds? thousands? written as 1, 2, 3 ...
 */
export const zeroed = (value: string | number, length: number) => String(value).padStart(length, '0')

export const weaponImage = (weapon: string) => `https://docs-backend.fivem.net/weapons/${weapon}.png` as const

export const timestamp = (ms: number) => new Date(Date.now() + ms)

export const formatTime = (ms: number) => dayjs.duration(ms).format('mm:ss')

export const blurNui = () => fetchNui('blur', {})
export const unBlurNui = () => fetchNui('unBlur', {})

export const cdn = (src: typeof assets[number]) => `https://pub-48f954db5920416a828313c03c49ed1f.r2.dev/${src}`