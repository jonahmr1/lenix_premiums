import { NavKbd } from "@/components/kbd"
import { useNavigate } from "react-router"
import { Layout } from "@/components/layout"


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
			names: ['Mazen'],
			roles: [
				'Gameplay Consultant',
			],
		},
		{
			names: ['3mr'],
			roles: [
				'Game Tester',
			],
		},
	]

	return (
		<Layout type="p" className="h-screen flex flex-col items-center bg-background">
			<div className="h-full flex flex-col justify-evenly">
				<div className="flex flex-col items-center justify-center gap-10 w-full">
					<p>Designed, Developed and Produced by</p>
					<div className="w-1/9 flex flex-col items-center gap-2">
						<img
							src='https://lenix.dev/lenixm.png'
							className="rounded"
						/>
						<p className="text-3xl text-brand">LenixM</p>
					</div>
				</div>
				<div className="flex flex-col gap-5 w-full justify-center overflow-y-auto">
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
								{names.map(name => <p key={name}>{name}</p>)}
							</div>
						</div>
					))}
				</div>
			</div>
			<div className="flex w-full items-start">
				<NavKbd
					onClick={() => nav(-1)}
					icon='Esc'
					keybind="Escape"
				>
					Back
				</NavKbd>
			</div>
		</Layout>
	)
}
