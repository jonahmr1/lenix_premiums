import { NavKbd } from "@/components/kbd"
import { useNavigate } from "react-router"
import lenixm from '@workspace/ui/assets/start/lenixm.png'


/* TODO: audio, scrollup */
export const Credit = () => {
	const nav = useNavigate()

	const credits = [
		{
			names: ['Lenix'],
			roles: [
				'Lead Developer',
			],
		},
		{
			names: ['WinkyQx'],
			roles: [
				'UI/UX Consultant',
			],
		},
		{
			names: ['Mazen'],
			roles: [
				'Gameplay Consultant',
			],
		},
		{
			names: ['WinkyQx', '3mr'],
			roles: [
				'Game Tester',
			],
		},
	]

	return (
		<div className="h-screen flex flex-col items-center bg-background gap-20 justify-evenly py-10">
			<div className="flex flex-col items-center gap-10 w-full">
				<p>Designed, Developed and Produced by</p>
				<div className="w-1/9 flex flex-col items-center gap-2">
					<img
						src={lenixm}
						className="rounded"
					/>
					<p className="text-3xl text-red-600">LenixM</p>
				</div>
			</div>
			<div className="flex flex-col gap-5 w-full overflow-y-auto">
				{credits.map(({ names, roles }, i) => (
					<div key={i} className="flex gap-5">
						<div className="flex flex-col items-end justify-start flex-1">
							{roles.map(role => (
								<div key={role} className="flex flex-wrap justify-end gap-x-3 text-white/80 tracking-widest uppercase">
									{role.split(' ').map((word, index) => (
										<span key={`${role}-${index}`}>{word}</span>
									))}
								</div>
							))}
						</div>
						<div className="flex-1">
							{names.map(name => (
								<p key={name}>{name}</p>
							))}
						</div>
					</div>
				))}
			</div>
			<div className="w-full flex justify-end px-20">
				<NavKbd
					onClick={() => nav(-1)}
					icon='Esc'
					keybind="Escape"
				>
					Back
				</NavKbd>
			</div>
		</div>
	)
}
