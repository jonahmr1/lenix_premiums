import { clsx, type ClassValue } from 'clsx'
import { toast as sonner } from 'sonner'
import { twMerge } from 'tailwind-merge'

import click from '../assets/audio/click.wav'
import hover from '../assets/audio/hover.wav'
import select from '../assets/audio/select.wav'
import error from '../assets/audio/error.wav'
import unavailable from '../assets/audio/unavailable.ogg'
import cannot from '../assets/audio/cannot.ogg'
import orchestra from '../assets/audio/orchestra.wav'
import impact from '../assets/audio/impact.mp3'

export const playAudio = (src: 'hover' | 'click' | 'custom', customAudio?: string, customVolume = 1.0) => {
	const audio = new Audio(src === 'hover' ? hover : src === 'click' ? click : customAudio)
	audio.volume = src === 'hover' ? 1.0 : src === 'click' ? 1.0 : customVolume
	audio.play()
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const toast = sonner

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
