import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { Pencil } from 'lucide-react';
import ProfileHeader from '../  ProfileHeader';
import Spinner from '../LoadingSpinner';
import toast from 'react-hot-toast';

export default function UserProfileView() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  // Remote data
  const [userAccount, setUserAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit modes
  const [isEditingBasic, setIsEditingBasic] = useState(false);
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);

  // Button spinners
  const [savingBasic, setSavingBasic] = useState(false);
  const [savingPreferences, setSavingPreferences] = useState(false);

  // Forms
  const [basicFormData, setBasicFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
  });

  // Init as empty (will be filled after fetch)
  const [preferencesFormData, setPreferencesFormData] = useState({});

  // -------------------- Helpers -------------------- //
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Compute changed keys at shallow level
  const diffShallow = (original, updated) => {
    const changes = {};
    Object.keys(updated || {}).forEach((k) => {
      if (updated[k] !== (original ? original[k] : undefined)) {
        changes[k] = updated[k];
      }
    });
    return changes;
  };

  // Preferences diff (handles nested notificationSettings + array of savedAddresses)
  const diffPreferences = (original, updated) => {
    const changes = {};
    if (!original) original = {};

    if (
      updated.preferredContactMethod !==
      (original.preferredContactMethod ?? 'email')
    ) {
      changes.preferredContactMethod = updated.preferredContactMethod;
    }

    const origNotif = original.notificationSettings || {
      email: true,
      sms: false,
    };
    const updNotif = updated.notificationSettings || {
      email: true,
      sms: false,
    };
    if (updNotif.email !== origNotif.email || updNotif.sms !== origNotif.sms) {
      changes.notificationSettings = updNotif;
    }

    const origAddresses = JSON.stringify(original.savedAddresses || []);
    const updAddresses = JSON.stringify(updated.savedAddresses || []);
    if (origAddresses !== updAddresses) {
      changes.savedAddresses = updated.savedAddresses || [];
    }

    return changes;
  };

  // -------------------- Fetch profile -------------------- //
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

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      fetchProfile();
    }
  }, [isAuthenticated, isLoading, user]);

  // Populate form state after fetch
  useEffect(() => {
    if (!userAccount) return;
    const { user: userData, profile } = userAccount;

    setBasicFormData({
      name: userData?.name || '',
      email: userData?.email || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
      bio: profile?.bio || '',
    });

    setPreferencesFormData({
      preferredContactMethod: profile?.preferredContactMethod ?? 'email',
      notificationSettings: {
        email: profile?.notificationSettings?.email ?? true,
        sms: profile?.notificationSettings?.sms ?? false,
      },
      savedAddresses: profile?.savedAddresses ?? [],
    });
  }, [userAccount]);

  if (loading) return <p>Loading profile...</p>;
  if (!userAccount) return <p>No profile found.</p>;

  const { user: userData, profile } = userAccount;
  const profileCompletion = profile?.profileCompletion ?? 0;

  // -------------------- Handlers: Basic -------------------- //
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleBasicEdit = () => setIsEditingBasic((p) => !p);
  const togglePreferencesEdit = () => setIsEditingPreferences((p) => !p);

  const handleSaveBasic = async () => {
    // Build an original snapshot that matches basicFormData shape
    const originalBasic = {
      name: userData?.name || '',
      email: userData?.email || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
      bio: profile?.bio || '',
    };

    const changed = diffShallow(originalBasic, basicFormData);
    if (Object.keys(changed).length === 0) {
      toast('No changes to save');
      return;
    }

    try {
      setSavingBasic(true);
      const userEmail = user?.email;
      if (!userEmail) return;

      await axios.patch(
        `http://localhost:3000/api/profiles/update-by-mail/${userEmail}`,
        changed
      );

      toast.success('Profile updated!');
      await fetchProfile();
      setIsEditingBasic(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
      toast.error('Update failed!');
    } finally {
      setSavingBasic(false);
    }
  };

  // -------------------- Handlers: Preferences -------------------- //
  const handlePreferencesChange = (e) => {
    const { name, value, type, checked, dataset } = e.target;

    // Handle nested notificationSettings
    if (dataset.scope === 'notifications') {
      setPreferencesFormData((prev) => ({
        ...prev,
        notificationSettings: {
          ...(prev.notificationSettings || {}),
          [name]: type === 'checkbox' ? checked : value,
        },
      }));
      return;
    }

    // Top-level fields
    setPreferencesFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const addSavedAddress = () => {
    setPreferencesFormData((prev) => ({
      ...prev,
      savedAddresses: [
        ...(prev.savedAddresses || []),
        { label: '', address: '' },
      ],
    }));
  };

  const updateSavedAddress = (index, field, value) => {
    setPreferencesFormData((prev) => {
      const list = [...(prev.savedAddresses || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, savedAddresses: list };
    });
  };

  const removeSavedAddress = (index) => {
    setPreferencesFormData((prev) => {
      const list = [...(prev.savedAddresses || [])];
      list.splice(index, 1);
      return { ...prev, savedAddresses: list };
    });
  };

  const handleSavePreferences = async () => {
    const originalPrefs = {
      preferredContactMethod: profile?.preferredContactMethod ?? 'email',
      notificationSettings: {
        email: profile?.notificationSettings?.email ?? true,
        sms: profile?.notificationSettings?.sms ?? false,
      },
      savedAddresses: profile?.savedAddresses ?? [],
    };

    const changed = diffPreferences(originalPrefs, preferencesFormData);
    if (Object.keys(changed).length === 0) {
      toast('No changes to save');
      return;
    }

    try {
      setSavingPreferences(true);
      const userEmail = user?.email;
      if (!userEmail) return;

      await axios.patch(
        `http://localhost:3000/api/profiles/update-by-mail/${userEmail}`,
        changed
      );

      toast.success('Preferences updated!');
      await fetchProfile();
      setIsEditingPreferences(false);
    } catch (err) {
      console.error('Failed to update preferences:', err);
      toast.error('Update failed!');
    } finally {
      setSavingPreferences(false);
    }
  };

  // -------------------- Render -------------------- //
  return (
    <div className="profile-page">
      {/* Header */}
      <ProfileHeader userName={userData.name} />

      <div className="profile-page__divider" />

      <div className="profile-page__user-info-container">
        {/* BASIC INFO */}
        <div className="user-basic-info">
          <div className="user-basic-info__content">
            <div className="section-header">
              <h5>Basic Information</h5>
              <button onClick={toggleBasicEdit} className="edit-btn">
                <Pencil className="w-4 h-4" />
              </button>
            </div>

            <div className="profile-page__info">
              {/* Name */}
              <div className="info-block">
                <strong>User</strong>
                {isEditingBasic ? (
                  <input
                    className="edit-field"
                    type="text"
                    name="name"
                    value={basicFormData.name}
                    onChange={handleBasicInfoChange}
                  />
                ) : (
                  <p>{userData.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="info-block">
                <strong>Email</strong>
                {isEditingBasic ? (
                  <input
                    className="email-edit-field"
                    type="text"
                    name="email"
                    value={basicFormData.email}
                    onChange={handleBasicInfoChange}
                    disabled
                  />
                ) : (
                  <p>{userData.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className="info-block">
                <strong>Phone</strong>
                {isEditingBasic ? (
                  <input
                    className="edit-field"
                    type="text"
                    name="phone"
                    value={basicFormData.phone}
                    onChange={handleBasicInfoChange}
                    placeholder="Not provided"
                  />
                ) : (
                  <p>{profile.phone || 'Not provided'}</p>
                )}
              </div>

              {/* Address */}
              <div className="info-block">
                <strong>Home Address</strong>
                {isEditingBasic ? (
                  <input
                    className="edit-field"
                    type="text"
                    name="address"
                    value={basicFormData.address}
                    onChange={handleBasicInfoChange}
                    placeholder="Not provided"
                  />
                ) : (
                  <p>{profile.address || 'Not provided'}</p>
                )}
              </div>

              {/* Bio */}
              <div className="info-block">
                <strong>Bio</strong>
                {isEditingBasic ? (
                  <input
                    className="edit-field"
                    type="text"
                    name="bio"
                    value={basicFormData.bio}
                    onChange={handleBasicInfoChange}
                  />
                ) : (
                  <p>{profile.bio || 'Not provided'}</p>
                )}
              </div>

              {/* Joined Date */}
              <div className="info-block">
                <strong>Joined</strong>
                <p>
                  {profile.createdAt
                    ? formatDate(profile.createdAt)
                    : 'Unknown'}
                </p>
              </div>
            </div>
          </div>

          {/* Save Button (outside wrapper) */}
          {isEditingBasic && (
            <div className="profile-page__save-edit">
              <button
                onClick={handleSaveBasic}
                disabled={savingBasic}
                className="px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2 justify-center"
              >
                {savingBasic ? (
                  <>
                    <Spinner />
                    <span>Saving…</span>
                  </>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          )}
        </div>

        <div className="profile-page__divider" />

        {/* PREFERENCES */}
        <div className="user-pref">
          <div className="user-pref__content">
            <div className="section-header">
              <h5>Preferences</h5>
              <button onClick={togglePreferencesEdit} className="edit-btn">
                <Pencil className="w-4 h-4" />
              </button>
            </div>

            <div className="profile-page__preferences">
              {/* Preferred Contact */}
              <div className="info-block">
                <strong>Preferred Contact</strong>
                {isEditingPreferences ? (
                  <select
                    name="preferredContactMethod"
                    value={
                      preferencesFormData.preferredContactMethod ?? 'email'
                    }
                    onChange={handlePreferencesChange}
                  >
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="phone">Phone</option>
                  </select>
                ) : (
                  <p>{profile.preferredContactMethod || 'Not set'}</p>
                )}
              </div>

              {/* Notifications */}
              <div className="info-block">
                <strong>Notifications</strong>
                {isEditingPreferences ? (
                  <div className="notif-controls">
                    <label>
                      <input
                        type="checkbox"
                        name="email"
                        data-scope="notifications"
                        checked={Boolean(
                          preferencesFormData.notificationSettings?.email
                        )}
                        onChange={handlePreferencesChange}
                      />{' '}
                      Email
                    </label>
                    <label style={{ marginLeft: '1rem' }}>
                      <input
                        type="checkbox"
                        name="sms"
                        data-scope="notifications"
                        checked={Boolean(
                          preferencesFormData.notificationSettings?.sms
                        )}
                        onChange={handlePreferencesChange}
                      />{' '}
                      SMS
                    </label>
                  </div>
                ) : (
                  <p>
                    {profile.notificationSettings?.email &&
                    profile.notificationSettings?.sms
                      ? 'SMS and Email'
                      : profile.notificationSettings?.email
                        ? 'Email only'
                        : profile.notificationSettings?.sms
                          ? 'SMS only'
                          : 'None'}
                  </p>
                )}
              </div>

              {/* Saved Addresses */}
              <div className="info-block">
                <strong>Saved Addresses</strong>
                {isEditingPreferences ? (
                  <div className="saved-addresses-editor">
                    {(preferencesFormData.savedAddresses || []).map(
                      (entry, idx) => (
                        <div key={idx} className="saved-address-row">
                          <input
                            type="text"
                            placeholder="Label (e.g. Home)"
                            value={entry.label || ''}
                            onChange={(e) =>
                              updateSavedAddress(idx, 'label', e.target.value)
                            }
                            className="edit-field"
                          />
                          <input
                            type="text"
                            placeholder="Address"
                            value={entry.address || ''}
                            onChange={(e) =>
                              updateSavedAddress(idx, 'address', e.target.value)
                            }
                            className="edit-field"
                          />
                          <button
                            type="button"
                            onClick={() => removeSavedAddress(idx)}
                            className="btn-remove"
                          >
                            Remove
                          </button>
                        </div>
                      )
                    )}
                    <button
                      type="button"
                      onClick={addSavedAddress}
                      className="btn-add"
                    >
                      + Add address
                    </button>
                  </div>
                ) : (
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
                )}
              </div>
            </div>
          </div>

          {/* Save Button (outside wrapper) */}
          {isEditingPreferences && (
            <div className="profile-page__save-edit">
              <button
                onClick={handleSavePreferences}
                disabled={savingPreferences}
                className="px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2 justify-center"
              >
                {savingPreferences ? (
                  <>
                    <Spinner />
                    <span>Saving…</span>
                  </>
                ) : (
                  'Save'
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Completion */}
      <div className="info-block profile-completion">
        <strong>Profile Completion</strong>
        <div className="completion-bar">
          <div
            className="completion-fill"
            style={{ width: `${profileCompletion}%` }}
          />
          <span>{profileCompletion}% complete</span>
        </div>
      </div>
    </div>
  );
}
