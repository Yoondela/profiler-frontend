import axios from 'axios';
import EditModal from './EditModal';

export default function EditForm({
  isOpen,
  onClose,
  title,
  currentSection,
  onSaveSuccess,
  user,
}) {
  console.log('EditForm props:', { isOpen, currentSection, user });

  if (!user) return null;

  const { user: userInfo, profile } = user;

  console.log('userInfo:', userInfo);
  console.log('profile:', profile);

  return (
    <EditModal isOpen={isOpen} onClose={onClose} title={`Edit ${title}`}>
      {currentSection === 'basic' && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            const formData = {
              name: e.target.name.value,
              phone: e.target.phone.value,
              address: e.target.address.value,
              bio: e.target.bio.value,
            };

            try {
              const res = await axios.patch(
                `http://localhost:3000/api/profiles/update-by-mail/${userInfo.email}`,
                formData
              );

              if (onSaveSuccess) await onSaveSuccess();
              onClose();
              console.log('Profile updated:', res.data);
            } catch (err) {
              console.error('Failed to update profile:', err);
            }
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              name="name"
              defaultValue={userInfo.name}
              className="mt-1 block w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              name="phone"
              defaultValue={profile?.phone || ''}
              className="mt-1 block w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              name="address"
              defaultValue={profile?.address || ''}
              className="mt-1 block w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              name="bio"
              defaultValue={profile?.bio || ''}
              className="mt-1 block w-full border border-gray-300 p-2 rounded"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      )}

      {currentSection === 'preferences' && (
        <div className="text-gray-500">Preferences editing coming soon.</div>
      )}
    </EditModal>
  );
}
