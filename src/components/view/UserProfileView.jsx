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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const profileCompletion = profile?.profileCompletion ?? 0;

  const handleEdit = (section) => {
    console.log(`Edit clicked for: ${section}`);
    // You can replace this with modal or form toggle
  };

  return (
    <div className="profile-page">
      <h2>Profile</h2>

      {/* Profile Header */}
      <div className="profile-page__head">
        <img src="/user-profile-img/default.jpg" alt="Profile" />
        <strong>{userData.name}</strong>
      </div>

      <div className="profile-page__divider"></div>

      {/* Basic Information */}
      <div className="section-header">
        <h5>Basic Information</h5>
        <button onClick={() => handleEdit('basic')} className="edit-btn">Edit</button>
      </div>
      <div className="profile-page__info">
        <div className="info-block">
          <strong>Name</strong>
          <p>{userData.name}</p>
        </div>
        <div className="info-block">
          <strong>Email</strong>
          <p>{userData.email}</p>
        </div>
        <div className="info-block">
          <strong>Phone</strong>
          <p>{profile.phone || 'Not provided'}</p>
        </div>
        <div className="info-block">
          <strong>Home Address</strong>
          <p>{profile.address || 'Not provided'}</p>
        </div>
        <div className="info-block">
          <strong>Bio</strong>
          <p>{profile.bio || 'Not provided'}</p>
        </div>
        <div className="info-block">
          <strong>Joined</strong>
          <p>{profile.createdAt ? formatDate(profile.createdAt) : 'Unknown'}</p>
        </div>
      </div>

      <div className="profile-page__divider"></div>

      {/* Preferences & Enhancements */}
      <div className="section-header">
        <h5>Preferences</h5>
        <button onClick={() => handleEdit('preferences')} className="edit-btn">Edit</button>
      </div>
      <div className="profile-page__preferences">
        <div className="info-block">
          <strong>Preferred Contact</strong>
          <p>{profile.preferredContactMethod || 'Not set'}</p>
        </div>
        <div className="info-block">
          <strong>Notifications</strong>
          <p>
            {profile.notificationSettings?.email && profile.notificationSettings?.sms
              ? 'SMS and Email'
              : profile.notificationSettings?.email
              ? 'Email only'
              : profile.notificationSettings?.sms
              ? 'SMS only'
              : 'None'}
          </p>
        </div>
        <div className="info-block">
          <strong>Saved Addresses</strong>
          <ul>
            {profile.savedAddresses?.length > 0 ? (
              profile.savedAddresses.map((entry, idx) => (
                <li key={idx}>
                  <strong>{entry.label}:</strong> {entry.address}
                </li>
              ))
            ) : (
              <li>No saved addresses</li>
            )}
          </ul>
        </div>
        <div className="info-block">
          <strong>Profile Completion</strong>
          <div className="completion-bar">
            <div
              className="completion-fill"
              style={{ width: `${profileCompletion}%` }}
            ></div>
            <span>{profileCompletion}% complete</span>
          </div>
        </div>
      </div>
    </div>
  );
}
