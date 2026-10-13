import 'common'
import './start'
import { onNui } from 'lenix/client'

onNui('blur', () => {
	TriggerScreenblurFadeIn(500)
	SetTimecycleModifier('v_dark')

	return null
})

onNui('unBlur', () => {
	TriggerScreenblurFadeOut(500)
	ClearTimecycleModifier()

	return null
})