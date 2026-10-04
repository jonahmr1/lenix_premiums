import 'common'
import './start'
import { onNui } from 'lenix/client'

onNui('blur', () => {
	TriggerScreenblurFadeIn(1000)
	SetTimecycleModifier('v_dark')

	return null
})

onNui('unBlur', () => {
	TriggerScreenblurFadeOut(1000)
	ClearTimecycleModifier()

	return null
})