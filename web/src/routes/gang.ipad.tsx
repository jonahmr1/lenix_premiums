import { Ipad } from '@/screens/gang/ipad'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/gang/ipad')({
  component: Ipad,
})