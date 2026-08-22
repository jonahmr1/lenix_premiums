import { NavKbd } from "@workspace/ui/elements/kbd"
import { Layout } from "@workspace/ui/elements/layout"
import { ArrowBigLeft } from "lucide-react"
import { useNavigate } from "react-router"


/* TODO: audio, scrollup */
export const Credit = () => {
	const nav = useNavigate()

	const credits = [
		{
			name: 'Lenix',
			roles: [
				'Front End Director',
			]
		},
		{
			name: 'WinkyQx',
			roles: [
				'UI/UX Designer',
				'Front End Director'
			]
		},
	]

	return (
		<Layout className="h-screen bg-background gap-20">
			<div className="flex flex-col items-center gap-10 w-full">
				<p>Designed, Developed, Maintained by</p>
				<img src={'https://business.lenix.dev/lenixm.png'} className="w-1/9 rounded" />
				<p className="text-3xl font-bold text-shadow-sm italic text-shadow-white">LenixM</p>
			</div>
			<div className="flex flex-col gap-10 w-full">
				{credits.map(({ name, roles }) => (
					<div key={name} className="flex gap-5">
						<div className="flex flex-col items-end flex-1">
							{roles.map(role => (
								<p className="justify-self-end flex font-light text-white/80 tracking-widest [word-spacing:0.3em] uppercase">{role}</p>
							))}
						</div>
						<p className="flex-1">{name}</p>
					</div>
				))}
			</div>
			<NavKbd
				onClick={() => nav('/')}
				icon='Esc'
			>
				back
			</NavKbd>
		</Layout>
	)
}