import { Mode } from '@/screens/competitive/routes/mode'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/competitive/lobby/mode')({
  component: Mode,
})