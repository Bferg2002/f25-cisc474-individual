import * as React from 'react'
import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { Auth0Provider } from '@auth0/auth0-react'
import * as TanstackQuery from './integrations/root-provider'
import { routeTree } from './routeTree.gen'

// Get Auth0 env vars
const domain = import.meta.env.VITE_AUTH0_DOMAIN
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID
const audience = import.meta.env.VITE_AUTH0_AUDIENCE

// Create router with React Query context
export const getRouter = () => {
  const rqContext = TanstackQuery.getContext()

  const router = createRouter({
    routeTree,
    context: { ...rqContext },
    defaultPreload: 'intent',
    Wrap: (props: { children: React.ReactNode }) => (
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{
          audience,
          redirect_uri: window.location.origin + '/home',
        }}
      >
        <TanstackQuery.Provider {...rqContext}>
          {props.children}
        </TanstackQuery.Provider>
      </Auth0Provider>
    ),
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient: rqContext.queryClient,
  })

  return router
}
