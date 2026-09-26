import { PageScreen } from '@/components/screen'
import { useNavigate } from '@tanstack/react-router'

/* TODO: audio, scrollup */
export const Credit = () => {
  const nav = useNavigate()

  const credits = [
    {
      names: ['Lenix'],
      roles: ['Lead Developer'],
    },
    {
      names: ['Mazen'],
      roles: ['Gameplay Consultant'],
    },
    {
      names: ['3mr'],
      roles: ['Game Tester'],
    },
  ]

  return (
    <PageScreen
			className="flex h-screen flex-col bg-background"
			kbds={[
				{
					onClick: () => nav({ to: '/starting' }),
          icon: "ESC",
          keybind: "Escape",
					children: 'Back'
				}
			]}
		>
			<div className="flex w-full flex-col items-center justify-center gap-10">
				<p>Designed, Developed and Produced by</p>
				<div className="flex w-1/9 flex-col items-center gap-2">
					<img src="https://lenix.dev/lenixm.png" className="rounded" />
					<p className="text-3xl text-brand">LenixM</p>
				</div>
			</div>
			<div className="flex w-full flex-col justify-center gap-5 overflow-y-auto">
				{credits.map(({ names, roles }, i) => (
					<div key={i} className="flex gap-5">
						<div className="flex flex-1 flex-col items-end justify-start">
							{roles.map((role) => (
								<div
									key={role}
									className="flex flex-wrap justify-end gap-x-3 tracking-widest font-normal text-white/80 uppercase"
								>
									{role.split(' ').map((word, index) => (
										<span key={`${role}-${index}`}>{word}</span>
									))}
								</div>
							))}
						</div>
						<div className="flex-1">
							{names.map((name) => (
								<p key={name}>{name}</p>
							))}
						</div>
					</div>
				))}
			</div>
    </PageScreen>
  )
}
