import { Ipad } from '@/screens/outlaw/ipad/App'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/outlaw/ipad')({
  component: Ipad,
})