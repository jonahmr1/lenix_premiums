import { Outlaw } from '@/screens/outlaw'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/outlaw')({
  component: Outlaw,
})