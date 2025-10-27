import { useAuth0 } from "@auth0/auth0-react"

export default function LogoutButton() {
  const { logout, isAuthenticated } = useAuth0()

  if (!isAuthenticated) return null // ✅ Hide until logged in

  return (
    <button
      onClick={() => logout({ logoutParams: { returnTo: `${window.location.origin}/home`,} })}
      style={{
        marginTop: "20px",
        padding: "10px 16px",
        backgroundColor: "#b91c1c",
        color: "white",
        borderRadius: "6px",
        cursor: "pointer",
      }}
    >
      Log Out
    </button>
  )
}
