import { Ipad } from '@/screens/outlaw/ipad'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/outlaw/ipad')({
  component: Ipad,
})