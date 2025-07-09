import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserProfile() {
  const { getAccessTokenSilently, user, isAuthenticated } = useAuth0();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await axios.get('http://localhost:3000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [getAccessTokenSilently, isAuthenticated]);

  if (loading) return <p>Loadding profile...</p>;

  return (
    <div className="user-profile-page">
      <h2>Profile</h2>
      <p>
        <strong>Name:</strong> {userProfile?.name || user?.name}
      </p>
      <p>
        <strong>Email:</strong> {userProfile?.email || user?.email}
      </p>
    </div>
  );
}
