// components/RequireAuth.tsx
import { useAuth0 } from "@auth0/auth0-react"

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0()

  // ⏳ Wait until Auth0 finishes checking session
  if (isLoading) {
    return <p>Loading authentication...</p>
  }

  // ❌ Only redirect once we are certain they are not logged in
  if (!isAuthenticated) {
    loginWithRedirect()
    return null
  }

  // ✅ User is authenticated — show protected page
  return <>{children}</>
}
