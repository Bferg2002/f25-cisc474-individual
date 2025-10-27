import { useAuth0 } from '@auth0/auth0-react'

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loginWithRedirect } = useAuth0()

  if (!isAuthenticated) {
    loginWithRedirect()
    return null
  }

  return <>{children}</>
}
