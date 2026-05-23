import { useEffect, useState } from 'react';
import axios from 'axios';
import { usePortfolioContext } from '@/api/context/portfolioContext';
import EditStaffOptions from './EditStaffOptions';
import { editStaffRole, removeStaff } from '@/api/sync/SyncStaff';

export default function StaffList() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const { companyId } = usePortfolioContext();

  useEffect(() => {
    if (!companyId) return;

    const fetchStaff = async () => {
      try {
        const res = await axios.get(`/api/company/${companyId}/staff`);
        setStaff(res.data);
        console.log('Staff List', res.data);
      } catch (err) {
        console.error('Failed to load staff', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [companyId]);

  const doRoleChange = async ({ user, role, password }) => {
    if (!companyId || !user?._id) return;
    try {
      await editStaffRole(companyId, user._id, role, password);
      setStaff((prev) =>
        prev.map((member) =>
          member._id === user._id ? { ...member, role } : member
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const doRemoveStaff = async ({ user, password }) => {
    if (!companyId || !user?._id) return;
    try {
      await removeStaff(companyId, user._id, password);
      setStaff((prev) => prev.filter((member) => member._id !== user._id));
    } catch (error) {
      console.log(error);
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
            key={person.portfolioId}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
          >
            <div className="flex items-center gap-3">
              <img
                src={person.avatarUrl || '/avatar-placeholder.png'}
                alt={person.name}
                className="h-8 w-8 rounded-full object-cover"
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
