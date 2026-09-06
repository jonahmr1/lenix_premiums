import { playAudio } from "@workspace/ui/lib/utils";
import { useEffect, useState } from "react";
import flashbang from '@workspace/ui/assets/competitive/flashbang/flashbang.wav'
import flashbangEffect from '@workspace/ui/assets/competitive/flashbang/flashbang-effect.wav'
import { waste } from "@lenix/lenix";

export const Flashbang = () => {
	const [opacity, setOpacity] = useState(0)

	useEffect(() => {
		triggerFlashbang()
	}, [])

	const triggerFlashbang = async () => {
		setOpacity(1)
		playAudio('custom', flashbang, 0.01)
		playAudio('custom', flashbangEffect, 0.1)
		await waste(3000)

		for (const i of Array(100).keys()) {
			await waste(25)
			setOpacity((99 - i) / 100)
		}
	}

	return (
		<div
			className='absolute size-full bg-white'
			style={{
				opacity
			}}
		/>
	);
}