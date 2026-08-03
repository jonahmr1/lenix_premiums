import type { Event } from 'lenix'

export interface Storage {
	theme: 'dark' | 'light'
}

export interface Events {
	rankDisplay: Event<'rank:display', [true]>
}