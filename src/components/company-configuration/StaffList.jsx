import { useEffect, useState } from 'react';
import axios from 'axios';
import { usePortfolioContext } from '@/api/context/portfolioContext';
import EditStaffOptions from './EditStaffOptions';
import { editStaffRole, removeStaff } from '@/api/sync/SyncStaff';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'sonner';

export default function StaffList() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const { companyId } = usePortfolioContext();
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    if (!companyId) return;

    const fetchStaff = async () => {
      try {
        const token = await getAccessTokenSilently();
        const res = await axios.get(`/api/staff/${companyId}/staff`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStaff(
          res.data.map((staffMember) => ({
            staffId: staffMember._id,
            userId: staffMember.user._id,
            name: staffMember.user.name,
            avatarUrl: staffMember.user.profile?.avatarUrl || '',
            role: staffMember.role,
          }))
        );
      } catch (err) {
        console.error('Failed to load staff', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [companyId, getAccessTokenSilently]);

  const doRoleChange = async ({ user, role, password }) => {
    if (!companyId || !user?.staffId) {
      const error = new Error('Missing company or staff ID');
      toast.error(error.message);
      throw error;
    }
    try {
      const token = await getAccessTokenSilently();
      await editStaffRole(companyId, user.staffId, role, password, token);
      setStaff((prev) =>
        prev.map((member) =>
          member.staffId === user.staffId ? { ...member, role } : member
        )
      );
      toast.success('Staff role updated.');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Unable to update staff role.'
      );
      throw error;
    }
  };

  const doRemoveStaff = async ({ user, password }) => {
    if (!companyId || !user?.staffId) {
      const error = new Error('Missing company or staff ID');
      toast.error(error.message);
      throw error;
    }
    try {
      const token = await getAccessTokenSilently();
      await removeStaff(companyId, user.staffId, password, token);
      setStaff((prev) =>
        prev.filter((member) => member.staffId !== user.staffId)
      );
      toast.success('Staff member removed.');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Unable to remove staff member.'
      );
      throw error;
    }
  };

  function ShowRole({ role }) {
    if (role === 'owner') {
      return (
        <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
          {/* <Lock className="h-4 w-4" /> */}
          admin
        </span>
      );
    }

    if (role === 'admin') {
      return (
        <span className="flex items-center gap-1 text-xs font-medium text-green-600">
          {/* <UserCheck className="h-4 w-4" /> */}
          admin
        </span>
      );
    }

    if (role === 'manager') {
      return (
        <span className="flex items-center gap-1 text-xs font-medium text-green-600">
          {/* <UserCheck className="h-4 w-4" /> */}
          Manager
        </span>
      );
    }

    if (role === 'member') {
      return (
        <span className="text-xs font-medium text-yellow-600">member</span>
      );
    }
  }

  return (
    <div className="bg-white p-0">
      <div className="mt-0 space-y-2">
        {loading && <p className="text-sm text-gray-500">Loading staff…</p>}

        {!loading && staff.length === 0 && (
          <p className="text-sm text-gray-500">No staff yet.</p>
        )}

        {staff.map((person) => (
          <div
            key={person.staffId}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
          >
            <div className="flex items-center gap-3">
              <img
                src={person.avatarUrl || '/avatar-placeholder.svg'}
                alt={`${person.name} avatar`}
                className="h-8 w-8 rounded-full object-cover"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = '/avatar-placeholder.svg';
                }}
              />

              <span className="text-sm font-medium text-gray-900">
                {person.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <ShowRole role={person.role} />
              <div className="flex items-center justify-center h-7 w-7 rounded-full cursor-pointer hover:bg-gray-200">
                <EditStaffOptions
                  user={person}
                  onRemove={doRemoveStaff}
                  onUpdateRole={doRoleChange}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
