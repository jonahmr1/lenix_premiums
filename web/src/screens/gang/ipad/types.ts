import type { S } from '@lenix/lenix'
import type { Icon } from '@phosphor-icons/react'

export interface App {
  name: string
  styles: string
  icon: {
    element: Icon
    styles: string
  }
  element: ({ orientation, setOrientation }: { orientation: Orientation; setOrientation: S<Orientation> }) => React.JSX.Element
  disabled?: true
}

export interface Storage {
  theme: 'dark' | 'light'
  orientation: Orientation
}

export type Orientation = 'portrait' | 'landscape'
