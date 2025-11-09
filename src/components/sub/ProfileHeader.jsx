import { useEffect, useState } from 'react';
import ProfilePictureUpload from './ProfileImageUploader';
import BecomeProviderSwitch from './BecomeProviderSwitch';
import { updateProfile } from '@/api/sync/SyncProfile';
import { useAuth0 } from '@auth0/auth0-react';
import { getUserID } from '@/api/sync/SyncUser';
import toast from 'react-hot-toast';
import { useUserContext } from '@/api/context/userContext.jsx';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function ProfileHeader({ userName, userAuth0Id }) {
  const { user, getAccessTokenSilently } = useAuth0();
  const { setAvatarUrlCtx, isProviderCtx, setIsProviderCtx, appUser_ID } =
    useUserContext();
  const [userBackendId, setUserBackendId] = useState(appUser_ID);

  useEffect(() => {
    const fetchUser = async () => {
      if (!appUser_ID && user) {
        const id = await getUserID(getAccessTokenSilently, user.email);
        setUserBackendId(id);
      }
    };
    fetchUser();
  }, [appUser_ID, user]);

  const onUploadSuccess = async (newImgUrl) => {
    setAvatarUrlCtx(newImgUrl);

    await updateProfile(user.email, { avatarUrl: newImgUrl })
      .then((res) => {
        console.log('Profile updated successfully:', res);
      })
      .catch((err) => {
        toast.error('Failed to update profile image. Please try again.');
      });
  };

  const onBecomeProviderSuccess = () => {
    setIsProviderCtx(true);
  };

  return (
    <div className='flex items-center justify-center mt-9'>
      <div className="profile-page__head bg-gray-700">
        <ProfilePictureUpload onUploadSuccess={onUploadSuccess} />
        <strong>{userName}</strong>
        {isProviderCtx ? (
          <p className="text-green-600 font-medium">Provider badge</p>
        ) : (
          <BecomeProviderSwitch
            userId={userBackendId}
            onSuccess={onBecomeProviderSuccess}
          />
        )}
      </div>
    </div>
  );
}
