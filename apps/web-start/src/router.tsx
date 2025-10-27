import * as React from "react"
import { createRouter } from "@tanstack/react-router"
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"
import { Auth0Provider } from "@auth0/auth0-react"
import * as TanstackQuery from "./integrations/root-provider"
import { routeTree } from "./routeTree.gen"

export const getRouter = () => {
  const rqContext = TanstackQuery.getContext()

  const router = createRouter({
    routeTree,
    context: { ...rqContext },
    defaultPreload: "intent",

    Wrap: ({ children }) => {
      const [isClient, setIsClient] = React.useState(false)

      // ✅ Client-only Auth0 to prevent hydration mismatch
      React.useEffect(() => {
        setIsClient(true)
      }, [])

      const app = (
        <TanstackQuery.Provider {...rqContext}>
          {children}
        </TanstackQuery.Provider>
      )

      // ✅ Server-side (no Auth0Provider)
      if (!isClient) return app

      // ✅ Browser-only => wrap in Auth0Provider
      return (
        <Auth0Provider
          domain={import.meta.env.VITE_AUTH0_DOMAIN}
          clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
          authorizationParams={{
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            redirect_uri: window.location.origin + "/home",
          }}
        >
          {app}
        </Auth0Provider>
      )
    },
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient: rqContext.queryClient,
  })

  return router
}
