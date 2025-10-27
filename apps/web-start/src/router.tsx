import * as React from 'react'
import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { Auth0Provider } from '@auth0/auth0-react'
import * as TanstackQuery from './integrations/root-provider'
import { routeTree } from './routeTree.gen'

export const getRouter = () => {
  const rqContext = TanstackQuery.getContext()

  const router = createRouter({
    routeTree,
    context: { ...rqContext },
    defaultPreload: 'intent',

    Wrap: (props: { children: React.ReactNode }) => {
      return (
        <TanstackQuery.Provider {...rqContext}>
          {typeof window !== 'undefined' ? (
            <Auth0Provider
              domain={import.meta.env.VITE_AUTH0_DOMAIN}
              clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
              authorizationParams={{
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                redirect_uri: window.location.origin + '/home',
              }}
            >
              {props.children}
            </Auth0Provider>
          ) : (
            props.children
          )}
        </TanstackQuery.Provider>
      )
    },
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient: rqContext.queryClient,
  })

  return router
}
