import { playAudio } from "@/lib";
import { useEffect, useState } from "react";
import flashbang from '@workspace/ui/assets/competitive/flashbang/flashbang.wav'
import flashbangEffect from '@workspace/ui/assets/competitive/flashbang/flashbang-effect.wav'
import { waste } from "@lenix/lenix";

export const Flashbang = () => {
	const [progress, setProgress] = useState(0)


	const triggerFlashbang = async () => {
		setProgress(0)
		playAudio('custom', flashbang, 0.01)
		playAudio('custom', flashbangEffect, 0.1)
		await waste(3000)

		for (const i of Array(101).keys()) {
			await waste(25)
			setProgress(i)
		}
	}
	
	useEffect(() => {
		triggerFlashbang()
	}, [])

	return (
		<div
			className='absolute size-full z-10'
			style={{
				backgroundImage: `radial-gradient(circle, transparent ${(progress * 2) - 100}%, white ${progress * 2}%)`,
			}}
		/>
	);
}