import { Mode } from '@/screens/competitive/mode'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/competitive/lobby_/mode')({
  component: Mode,
})