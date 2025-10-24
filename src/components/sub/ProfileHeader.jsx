import ProfilePictureUpload from './ProfileImageUploader';
import BecomeProviderButton from './BecomeProviderSwitch';

export default function ProfileHeader({ userName, userId }) {
  return (
    <div>
      <div className="profile-page__head bg-gray-700">
        <ProfilePictureUpload />
        <strong>{userName}</strong>
        <BecomeProviderButton userId={userId} />
      </div>
    </div>
  );
}
