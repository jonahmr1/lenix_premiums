import { onNui } from 'lenix/client'
import type { Start } from 'types/index'
import { state } from '.'
import { getSettingsCatalog } from '../lib/settings'

onNui<Start.Requests['shutdownLoadingScreen']>('start:shutdownLoading', () => {
	ShutdownLoadingScreen()
	ShutdownLoadingScreenNui()
	state.loadingShutdown = true
	return null
})

onNui<Start.Requests['prepareGame']>('start:prepareGame', async () => {
	state.settings = await getSettingsCatalog()
	return null
})
