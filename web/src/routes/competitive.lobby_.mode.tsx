import { Mode } from '@/screens/competitive/lobby/mode'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/competitive/lobby_/mode')({
  component: Mode,
})