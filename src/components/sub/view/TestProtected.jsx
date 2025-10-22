import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';

function ProtectedFetcher() {
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect, logout } =
    useAuth0();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return; // 👈 only run when logged in

    const fetchProtected = async () => {
      try {
        const token = await getAccessTokenSilently({
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        });

        const res = await fetch('http://localhost:3000/api/protected', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Error fetching protected route:', err);
      }
    };

    fetchProtected();
  }, [isAuthenticated, getAccessTokenSilently]);

  return (
    <div>
      <h2>Protected Route</h2>

      {!isAuthenticated && (
        <button onClick={() => loginWithRedirect()}>Login</button>
      )}

      {isAuthenticated && (
        <>
          <button onClick={() => logout({ returnTo: window.location.origin })}>
            Logout
          </button>
          {data ? (
            <pre>{JSON.stringify(data, null, 2)}</pre>
          ) : (
            <p>Loading...</p>
          )}
        </>
      )}
    </div>
  );
}

export default ProtectedFetcher;
