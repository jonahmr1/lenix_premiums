export { cn } from "cn"
import hover from '../assets/audio/hover.ogg'
import click from '../assets/audio/click.ogg'
import error from '../assets/audio/error.ogg'
import unavailable from '../assets/audio/unavailable.ogg'
import cannot from '../assets/audio/cannot.ogg'
import select from '../assets/audio/select.ogg'
import orchestra from '../assets/audio/orchestra.ogg'
import impact from '../assets/audio/impact.ogg'

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
