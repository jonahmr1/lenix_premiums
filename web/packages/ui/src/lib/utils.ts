import { clsx, type ClassValue } from 'clsx'
import { toast as sonner } from 'sonner'
import { twMerge } from 'tailwind-merge'

import click from '../assets/click.wav'
import hover from '../assets/hover.wav'
import select from '../assets/select.wav'
import error from '../assets/error.wav'
import unavailable from '../assets/unavailable.ogg'
import cannot from '../assets/cannot.ogg'

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
}
