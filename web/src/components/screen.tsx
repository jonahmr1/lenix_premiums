import { cn } from 'cn'
import { Layout } from './layout'
import { NavKbd } from '@/components/kbd'
import { KbdGroup } from '@/components/ui/kbd'

export const PageScreen = ({
  children,
  className,
  kbds,
  ...props
}: {
  children: React.ReactNode
  className?: React.ComponentProps<typeof Layout>['className']
  kbds?: (React.ComponentProps<typeof NavKbd> & { children: React.ReactNode })[]
} & React.ComponentProps<typeof Layout>) => (
  <Layout
    className={cn('flex size-full flex-col justify-between', className)}
    {...props}
  >
    {children}
    {kbds && (
      <KbdGroup>
        {kbds.map(({ children, ...kbd }, i) => (
          <NavKbd key={i} {...kbd}>{children}</NavKbd>
        ))}
      </KbdGroup>
    )}
  </Layout>
)
