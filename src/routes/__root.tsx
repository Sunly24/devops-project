import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import Header from '../components/Header'
import { AuthProvider, useAuth } from '../contexts/AuthContext'

function RootComponent() {
  const { isAuthenticated } = useAuth()

  return (
    <>
      {isAuthenticated && <Header />}
      <Outlet />
      {import.meta.env.DEV && (
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      )}
    </>
  )
}

export const Route = createRootRoute({
  component: () => (
    <AuthProvider>
      <RootComponent />
    </AuthProvider>
  ),
})
