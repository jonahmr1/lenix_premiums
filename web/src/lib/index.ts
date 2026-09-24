import type { MotionProps } from "motion/react";
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import hover from '../assets/audio/hover.ogg'
import click from '../assets/audio/click.wav'
import error from '../assets/audio/error.wav'
import unavailable from '../assets/audio/unavailable.ogg'
import cannot from '../assets/audio/cannot.ogg'
import select from '../assets/audio/select.wav'
import orchestra from '../assets/audio/orchestra.wav'
import impact from '../assets/audio/impact.mp3'

export const playAudio = (src: 'hover' | 'click' | 'custom', customAudio?: string, customVolume = 1.0) => {
	const audio = new Audio(src === 'hover' ? hover : src === 'click' ? click : customAudio)
	audio.volume = src === 'hover' ? 1.0 : src === 'click' ? 1.0 : customVolume
	audio.play()
}

export const audiobility = {
	onMouseEnter: () => playAudio('hover'),
	onMouseDown: () => playAudio('click')
}

export const audio = {
	error: () => playAudio('custom', error),
	unavailable: () => playAudio('custom', unavailable, 0.4),
	cannot: () => playAudio('custom', cannot),
	select: () => playAudio('custom', select),
	orchestra: () => playAudio('custom', orchestra),
	impact: () => playAudio('custom', impact, 0.4),
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