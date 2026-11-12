import ProfilePictureUpload from './ProfileImageUploader';
import { updateProfile } from '@/api/sync/SyncProfile';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'sonner';
import { useUserContext } from '@/api/context/userContext.jsx';
import BecomeProviderDialog from './view/BecomeProviderDialog';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function ProfileHeader({ userName }) {
  const { user } = useAuth0();
  const { setAvatarUrlCtx, isProviderCtx } = useUserContext();

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
    <div className="flex items-center justify-center">
      <div className="profile-page__head">
        <ProfilePictureUpload onUploadSuccess={onUploadSuccess} />
	<div className="flex flex-col">
          <strong>{userName}</strong>
          {isProviderCtx ? (
            <p className="text-green-600 text-sm">Service provider</p>
        ) : null}
	</div>
      </div>
    </div>
  );
}
