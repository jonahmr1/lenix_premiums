import { onNui } from "lenix/client"
import type { Start } from "types/index"
import { state } from "."
import { readKeybinds } from '../lib/keybinds'

onNui<Start.Requests['shutdownLoadingScreen']>('start:shutdownLoading', () => {
	ShutdownLoadingScreen()
	ShutdownLoadingScreenNui()
	state.loadingShutdown = true
	return null
})

onNui<Start.Requests['prepareGame']>('start:prepareGame', async () => {
	state.keybinds = await readKeybinds()
	return null
})
