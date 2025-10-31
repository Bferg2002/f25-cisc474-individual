import { useAuth0 } from '@auth0/auth0-react';

export default function LoginButton() {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  if (isAuthenticated) {
    return (
      <button
        onClick={() =>
          logout({ logoutParams: { returnTo: window.location.origin } })
        }
      >
        Log Out
      </button>
    );
  }

  return (
    <button
      onClick={() =>
        loginWithRedirect({
          authorizationParams: { redirect_uri: window.location.origin + '/home' },
        })
      }
    >
      Log In
    </button>
  );
}
