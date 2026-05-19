import { useEffect, useState } from 'react';
import { Lock, UserCheck } from 'lucide-react';
import { sendStaffInvite } from '@/api/sync/SyncInvite';
import { getUserID } from '@/api/sync/SyncUser';
import { useAuth0 } from '@auth0/auth0-react';

export default function StaffInviteAction({ status, targetUserId, companyId }) {
  const { getAccessTokenSilently, user } = useAuth0();

  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    setLoading(true);

    const appUser_ID = await getUserID(getAccessTokenSilently, user.email);

    try {
      const result = await sendStaffInvite(companyId, appUser_ID, targetUserId);
      console.log('Invite sent successfully:', result);
    } catch (error) {
      console.error('Error sending invite:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'owner') {
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
        <Lock className="h-4 w-4" />
        Owner
      </span>
    );
  }

  if (status === 'already_member') {
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-green-600">
        <UserCheck className="h-4 w-4" />
        Member
      </span>
    );
  }

  if (status === 'pending_invite') {
    return (
      <span className="text-xs font-medium text-yellow-600">Invite sent</span>
    );
  }

  return (
    <button
      onClick={handleInvite}
      className="rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800"
    >
      {loading ? 'Inviting...' : 'Invite'}
    </button>
  );
}
