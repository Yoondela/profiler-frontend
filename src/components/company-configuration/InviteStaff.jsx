import { Users, UserPlus } from 'lucide-react';
import InviteStaffSearch from './InviteStaffSearch';
import StaffList from './StaffList';

export default function InviteStaff() {
  return (
    <div className="mx-auto mt-10 max-w-2xl p-6">
      <h2 className="text-xl font-semibold text-gray-900">Staff</h2>

      <p className="mt-1 text-sm text-gray-500">
        Search for people on the platform and invite them as staff.
      </p>

      <div className="mt-6 flex flex-col gap-12 bg-white p-2">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <Users className="h-5 w-5 text-gray-700" />
            <p className="text-sm font-medium text-gray-900">Staff list</p>
          </div>
          <StaffList />
        </div>

        <div>
          <div className="mb-4 flex items-center gap-3">
            <UserPlus className="h-5 w-5 text-gray-700" />
            <p className="text-sm font-medium text-gray-900">Search staff</p>
          </div>
          <InviteStaffSearch />
        </div>
      </div>
    </div>
  );
}
