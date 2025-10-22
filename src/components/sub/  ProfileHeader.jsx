import ProfilePictureUpload from './ProfileImageUploader';

export default function ProfileHeader({ userName }) {
  return (
    <>
      <div className="profile-page__head bg-gray-700">
        <ProfilePictureUpload />
        <strong>{userName}</strong>
      </div>
    </>
  );
}
