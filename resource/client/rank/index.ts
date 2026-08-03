import { addKeybind } from "@overextended/ox_lib/client";
import { emitEvent } from "lenix/client";
import type { Events } from 'types/index'

addKeybind({
	name: 'lenix:rank',
	description: 'Open Rank',
	defaultKey: 'G',
	onPressed: () => emitEvent<Events['rankDisplay']>('rank:display', true)
})