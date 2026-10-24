import 'common'
import './start'
import { onEvent, onNui } from 'lenix/client'

onNui('blur', () => {
	TriggerScreenblurFadeIn(0)
	SetTimecycleModifier('v_dark')

	return null
})

onNui('unBlur', () => {
	TriggerScreenblurFadeOut(0)
	ClearTimecycleModifier()

	return null
})

onEvent('onResourceStop', re => console.warn({ re }))

RegisterCommand('time', args => {
	NetworkOverrideClockTime(args[0], 0, 0)
}, false)