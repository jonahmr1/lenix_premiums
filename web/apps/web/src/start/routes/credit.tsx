import { NavKbd } from "@workspace/ui/elements/kbd"
import { Layout } from "@workspace/ui/elements/layout"
import { onKeyDown } from "lenix/nui"
import { useEffect } from "react"
import { useNavigate } from "react-router"


/* TODO: audio, scrollup */
export const Credit = () => {
	const nav = useNavigate()

	useEffect(() => {
		const dispose = onKeyDown('Escape', () => nav('/'))
		return dispose
	}, [])

	const credits = [
		{
			names: ['Lenix'],
			roles: [
				'Lead Developer',
				'Lead Developer',
				'Lead Developer',
				'Lead Developer',
			],
		},
		{
			names: ['WinkyQx'],
			roles: [
				'UI/UX Consultant',
				'Game Tester',
			],
		},
	]

	return (
		<Layout className="h-screen bg-background gap-20 justify-between py-10">
			<div className="flex flex-col items-center gap-10 w-full">
				<p>Designed, Developed, Maintained by</p>
				<img src={'https://business.lenix.dev/lenixm.png'} className="w-1/9 rounded" />
				<p className="text-3xl font-bold text-shadow-sm italic text-shadow-white">LenixM</p>
			</div>
			<div className="flex flex-col gap-5 w-full">
				{credits.map(({ names, roles }, i) => (
					<div key={i} className="flex gap-5">
						<div className="flex flex-col items-end flex-1">
							{roles.map(role => (
								<div key={role} className="flex flex-wrap justify-end gap-x-2 text-sm font-light text-white/80 tracking-widest uppercase">
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
					onClick={() => nav('/')}
					icon='Esc'
				>
					Back
				</NavKbd>
			</div>
		</Layout>
	)
}
