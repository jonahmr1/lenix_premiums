import { Game } from '@/screens/competitive/game'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/competitive/game')({
  component: Game,
})