import 'common'
import './start'
import { onNui } from 'lenix/client'

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