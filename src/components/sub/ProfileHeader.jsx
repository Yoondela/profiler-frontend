import ProfilePictureUpload from './ProfileImageUploader';
import BecomeProviderButton from './BecomeProviderSwitch';
import { updateProfile } from '@/api/sync/SyncProfile';
import { useAuth0 } from '@auth0/auth0-react';
import { getUserID } from '@/api/sync/SyncUser';
import toast from 'react-hot-toast';
import { useUserContext } from '@/api/context/userContext.jsx';

export default function ProfileHeader({ userName, userAuth0Id }) {
  const { user } = useAuth0();
  const { setAvatarUrlCtx } = useUserContext();

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
  return (
    <div>
      <div className="profile-page__head bg-gray-700">
        <ProfilePictureUpload onUploadSuccess={onUploadSuccess} />
        <strong>{userName}</strong>
        <BecomeProviderButton userId={userAuth0Id} />
      </div>
    </div>
  );
}
