import { onNui } from 'lenix/client'
import type { Start } from 'types/index'
import { state } from '.'
import { getSettingsCatalog } from '../lib/settings'
import { isHiddenSettingsBusy } from '../lib/settings-menu'
import { repeat } from '@lenix/lenix'

onNui<Start.Requests['shutdownLoadingScreen']>('start:shutdownLoading', () => {
	ShutdownLoadingScreen()
	ShutdownLoadingScreenNui()
	state.loadingShutdown = true
	return null
})

onNui<Start.Requests['prepareGame']>('start:prepareGame', async () => {
	state.settings = await getSettingsCatalog(true)
	await repeat(() => {
		console.log({ $: isHiddenSettingsBusy()})
		return isHiddenSettingsBusy()
	}, true, 1000)
	return null
})
