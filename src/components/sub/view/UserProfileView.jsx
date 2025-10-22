import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import ProfileHeader from '../  ProfileHeader';
import Spinner from '../LoadingSpinner';
import {
  diffShallow,
  diffPreferences,
  fetchProfile,
  updateProfile,
} from '../sync/SyncProfile'; // adjust path as needed

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

  const [preferencesFormData, setPreferencesFormData] = useState({});

  // -------------------- Helpers -------------------- //
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // -------------------- Fetch profile -------------------- //
  const loadUserProfile = async () => {
    try {
      if (!user?.email) return;
      const account = await fetchProfile(user.email);
      setUserAccount(account);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      loadUserProfile();
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
      await updateProfile(user.email, changed);
      toast.success('Profile updated!');
      await loadUserProfile();
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
      await updateProfile(user.email, changed);
      toast.success('Preferences updated!');
      await loadUserProfile();
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
              {[
                { label: 'User', name: 'name', value: userData.name },
                { label: 'Email', name: 'email', value: userData.email },
                { label: 'Phone', name: 'phone', value: profile.phone },
                {
                  label: 'Home Address',
                  name: 'address',
                  value: profile.address,
                },
                { label: 'Bio', name: 'bio', value: profile.bio },
              ].map(({ label, name, value }) => (
                <div key={name} className="info-block">
                  <strong>{label}</strong>
                  {isEditingBasic && name !== 'email' ? (
                    <input
                      className="edit-field"
                      type="text"
                      name={name}
                      value={basicFormData[name]}
                      onChange={handleBasicInfoChange}
                      placeholder="Not provided"
                      disabled={name === 'email'}
                    />
                  ) : (
                    <p>{value || 'Not provided'}</p>
                  )}
                </div>
              ))}

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
                    {['email', 'sms'].map((type) => (
                      <label key={type} style={{ marginRight: '1rem' }}>
                        <input
                          type="checkbox"
                          name={type}
                          data-scope="notifications"
                          checked={Boolean(
                            preferencesFormData.notificationSettings?.[type]
                          )}
                          onChange={handlePreferencesChange}
                        />{' '}
                        {type.toUpperCase()}
                      </label>
                    ))}
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
