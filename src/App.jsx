import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import UserProfile from './components/view/UserProfileView';

function App() {
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  if (isLoading || !isAuthenticated) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      <UserProfile />
      {/* <Welcome /> */}
    </div>
  );
}

export default App;
