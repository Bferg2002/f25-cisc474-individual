import { createRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import { Auth0Provider } from '@auth0/auth0-react';
import * as TanstackQuery from './integrations/root-provider';

// Import the generated route tree
import { routeTree } from './routeTree.gen';

// Create a new router instance
export const getRouter = () => {
  const rqContext = TanstackQuery.getContext();

  // Create the redirect URI based on the current origin, which may be undefined during SSR
  const redirect_uri =
    typeof window !== 'undefined'
      ? window.location.origin + '/home'
      : undefined;

  const router = createRouter({
    routeTree,
    context: { ...rqContext },
    defaultPreload: 'intent',
    Wrap: (props: { children: React.ReactNode }) => {
      return (
        <Auth0Provider
          domain={import.meta.env.VITE_AUTH0_DOMAIN}
          clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
          authorizationParams={{
            redirect_uri: redirect_uri,
          }}
        >
          <TanstackQuery.Provider {...rqContext}>
            {props.children}
          </TanstackQuery.Provider>
        </Auth0Provider>
      );
    },

    // 🧩 Added fallback for undefined routes (fixes NotFound warning)
    defaultNotFoundComponent: () => (
      <div
        style={{
          padding: '2rem',
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <h2>404 – Page Not Found</h2>
        <p>The route you’re looking for doesn’t exist.</p>
      </div>
    ),
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient: rqContext.queryClient,
  });

  return router;
};
