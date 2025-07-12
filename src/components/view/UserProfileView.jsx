import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

export default function UserProfileView() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [userAccount, setUserAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userEmail = user?.email;

        if (!userEmail) return;

        const res = await axios.get(
          `http://localhost:3000/api/profiles/me/mail/${userEmail}`
        );
        setUserAccount(res.data.userAccount);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && !isLoading) {
      fetchProfile();
    }
  }, [isAuthenticated, isLoading, user]);

  if (loading) return <p>Loading profile...</p>;

  if (!userAccount) return <p>No profile found.</p>;

  const { user: userData, profile } = userAccount;

  return (
    <div className="profile-page">
      <h2>Profile</h2>
      <p>
        <strong>Name:</strong> {userData.name}
      </p>
      <p>
        <strong>Email:</strong> {userData.email}
      </p>
      <p>
        <strong>Phone:</strong> {profile.phone}
      </p>
      <p>
        <strong>Bio:</strong> {profile.bio}
      </p>
    </div>
  );
}
