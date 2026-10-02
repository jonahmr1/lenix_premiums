import { cdn, playAudio } from "@/lib";
import { useEffect, useState } from "react";
import { waste } from "@lenix/lenix";

export const Flashbang = () => {
	const [progress, setProgress] = useState(0)

	useEffect(() => {
		const timeout = setTimeout(async () => {
			setProgress(0)
			playAudio('custom', cdn('assets/competitive/flashbang/flashbang.wav'), 0.01)
			playAudio('custom', cdn('assets/competitive/flashbang/flashbang-effect.wav'), 0.1)
			await waste(3000)

			for (const i of Array(101).keys()) {
				await waste(25)
				setProgress(i)
			}
		})

		return () => clearTimeout(timeout)
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