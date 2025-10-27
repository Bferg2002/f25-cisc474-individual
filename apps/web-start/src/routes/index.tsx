import { createFileRoute } from '@tanstack/react-router'
import { useAuth0 } from '@auth0/auth0-react'
import { LoginButton } from '../components/LoginButton'
import LogoutButton from '../components/LogoutButton'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const { isAuthenticated } = useAuth0()

  return (
    <div>
      <h1>Welcome!</h1>

      {!isAuthenticated && (
        <>
          <p>Please log in to access course data.</p>
          <LoginButton />
        </>
      )}

      {isAuthenticated && (
        <>
          <p>You are logged in!</p>
          <LogoutButton />
          <p>Navigate to /courses or /home to see protected data.</p>
        </>
      )}
    </div>
  )
}
