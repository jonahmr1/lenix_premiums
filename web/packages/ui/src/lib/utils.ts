import { clsx, type ClassValue } from 'clsx'
import { toast as sonner } from 'sonner'
import { twMerge } from 'tailwind-merge'

import click from '../assets/start/click.mp3'
import hover from '../assets/start/hover.mp3'

const playAudio = (src: 'hover' | 'click') => {
	const audio = new Audio(src === 'hover' ? hover : click)
	audio.volume = src === 'hover' ? 0.03 : 1.0
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