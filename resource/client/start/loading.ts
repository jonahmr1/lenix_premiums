import { onNui } from 'lenix/client'
import type { Start } from 'types/index'
import { state } from '.'
import { getSettingsCatalog } from '../lib/settings'
import { isHiddenSettingsBusy } from '../lib/settings-menu'

onNui<Start.Requests['shutdownLoadingScreen']>('start:shutdownLoading', () => {
	console.log({ $: isHiddenSettingsBusy(), $$: state.settings })
	ShutdownLoadingScreen()
	ShutdownLoadingScreenNui()
	state.loadingShutdown = true
	return null
})

onNui<Start.Requests['prepareGame']>('start:prepareGame', async () => {
	state.settings = await getSettingsCatalog(true)
	return null
})
