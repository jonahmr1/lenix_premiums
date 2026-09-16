import { clsx, type ClassValue } from 'clsx'
import { toast as sonner } from 'sonner'
import { twMerge } from 'tailwind-merge'

import click from '../assets/start/click.mp3'
import hover from '../assets/start/hover.mp3'

export const playAudio = (src: 'hover' | 'click' | 'custom', customAudio?: string, customVolume = 1.0) => {
	const audio = new Audio(src === 'hover' ? hover : src === 'click' ? click : customAudio)
	audio.volume = src === 'hover' ? 0.2 : src === 'click' ? 1.0 : customVolume
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