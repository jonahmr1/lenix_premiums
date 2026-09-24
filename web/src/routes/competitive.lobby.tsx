import { Lobby } from '@/screens/competitive/lobby'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/competitive/lobby')({
  component: Lobby,
})