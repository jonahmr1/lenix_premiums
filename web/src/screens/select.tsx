import { useState } from 'react'
import { anim, audio, audiobility } from '@/lib'
import { PageScreen } from '@/components/screen'
import { useRouter } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { toast } from 'sonner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { asserts, entries } from '@lenix/lenix'
import { fetchNui, fetchNuiServer, unFocusNui } from 'lenix/nui'
import type { Start } from 'types'
import { MODES } from '@/constants'
import { useStates } from '@/hooks'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FieldGroup, Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

// Shared boundaries keep every diagonal parallel and leave a 0.5vw gap.
function panelClip(index: number, count: number, inset = 0) {
  const width = 100 / count
  const tilt = width / 10
  const edge = (boundary: number, angle: number, direction: number) => {
    const outside = boundary === 0 || boundary === count
    return `calc(${boundary * width + (outside ? 0 : angle)}% + ${outside ? 0 : direction * 0.1}vw + ${direction * inset}px)`
  }
  const top = `${inset}px`
  const bottom = `calc(100% - ${inset}px)`

  return `polygon(${edge(index, tilt, 1)} ${top}, ${edge(index + 1, tilt, -1)} ${top}, ${edge(index + 1, -tilt, -1)} ${bottom}, ${edge(index, -tilt, 1)} ${bottom})`
}

const Star = () => <span className='text-destructive'>*</span>

export const Selection = () => {
  const [states] = useStates()
  const router = useRouter()
  const [modeState, setMode] = useState<keyof typeof MODES>(entries(MODES).find(([, self]) => !self.disabled)![0])
  const [dialog, setDialog] = useState(false)

  const hovered = MODES[modeState]

  const handleSelect = async (mode: Start.Mode) => {
    const characters = states.start.characters
    const charId = await fetchNuiServer<Start.Requests['getModeCharacter']>('start:getModeCharacter', { mode, characters })
    if (charId) {
      const character = characters.find((self) => self.charId === charId)
      asserts(character)

      await fetchNui<Start.Requests['selectMode']>('start:selectMode', { mode, character: [character, null] })
      router.navigate({ to: `/${mode}` })
			unFocusNui()
    } else setDialog(true)
  }

  return (
    <>
      <div className="h-screen bg-background">
        <div className="grid h-3/4 [-webkit-box-reflect:below_2vh_linear-gradient(transparent_60%,rgb(0_0_0/0.5))]">
          {entries(MODES).map(([mode, config], index) => (
            <button
              key={config.label}
              onMouseOver={() => setMode(mode)}
              onClick={() => {
                if (config.disabled) {
                  audio.unavailable()
                  toast('This mode is locked', { toasterId: 'notify' })
                  return
                }
                handleSelect(mode)
              }}
              style={{
                clipPath: panelClip(index, entries(MODES).length),
                backgroundColor: mode === modeState ? `#${hovered.color}` : undefined,
              }}
              className={`relative col-start-1 row-start-1 min-w-0 transition-[filter,background-color] duration-300 ${mode !== modeState && 'bg-border grayscale'}`}
              {...audiobility}
            >
              <div className="absolute inset-0 overflow-hidden" style={{ clipPath: panelClip(index, entries(MODES).length, 2) }}>
                <img
                  src={MODES[mode].image}
                  className="pointer-events-none absolute inset-0 size-full object-cover"
                  style={{
                    translate: `${MODES[mode].translate}% 0`,
                  }}
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/50 to-transparent" />
                <div
                  className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                  style={{
                    boxShadow: `inset 0 0 10px 5px #${MODES[mode].color}`,
                  }}
                />
              </div>
              {config.disabled && (
                <div className="pointer-events-none absolute top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-md border bg-card py-h-1 px-w-1 uppercase" style={{ left: `${((index + 0.5) / entries(MODES).length) * 100}%` }}>
                  <FontAwesomeIcon icon={faLock} />
                  <span>Locked</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      <Dialog open={dialog} onOpenChange={setDialog}>
				<DialogContent onEscapeKeyDown={(e) => e.stopPropagation()}>
					<form
						action={async (data) => {
							const first = data.get('first') as string
							const last = data.get('last') as string
							const gender = data.get('gender') as string
							
							if (!first.trim() || !last.trim()) {
								toast('Name cannot be empty', { toasterId: 'notify' })
								audio.error()
								return
							}

							await fetchNui<Start.Requests['selectMode']>('start:selectMode', { mode: modeState, character: [null, [first, last, gender, 946684800000]] })
							router.navigate({ to: `/${modeState}` })
							unFocusNui()
						}}
						className='contents'
					>
            <DialogHeader>
              <DialogTitle>Character Creation Form</DialogTitle>
              <DialogDescription>Please double check your information before you submit, this action cannot be undone or modified later.</DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="first">
                  First Name <Star />
                </FieldLabel>
                <Input name="first" id="first" autoComplete="off" placeholder="Jonah" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="last">
                  Last Name <Star />
                </FieldLabel>
                <Input name='last' id="last" autoComplete="off" placeholder="Marwan" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="gender">
                  Gender <Star />
                </FieldLabel>
                <Select name='gender' required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Create</Button>
            </DialogFooter>
					</form>
				</DialogContent>
      </Dialog>
      <PageScreen
        className="absolute bottom-0 z-10 h-fit max-w-2/3 justify-end gap-h-1 text-v-1.2 text-muted-foreground"
        kbds={[
          {
            icon: 'ESC',
            keybind: 'Escape',
            onClick: () => router.history.back(),
            children: 'Back',
          },
        ]}
      >
        <motion.div {...anim} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
          <span className="text-v-4 font-bold text-foreground uppercase italic">{hovered.label}</span>
          <p>{hovered.description}</p>
        </motion.div>
      </PageScreen>
    </>
  )
}

export default Selection
