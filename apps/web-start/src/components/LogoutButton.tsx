import { useAuth0 } from '@auth0/auth0-react'

export default function LogoutButton() {
  const { logout, isAuthenticated } = useAuth0()

  if (!isAuthenticated) return null

  return (
    <button
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
      style={{
        marginTop: '1rem',
        backgroundColor: '#b71c1c',
        color: 'white',
        padding: '0.5rem 1rem',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        width: '100%',
      }}
    >
      Log Out
    </button>
  )
}
