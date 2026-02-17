import { Lock, UserCheck } from 'lucide-react';

export default function InviteAction({ status }) {
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

  if (status === 'pending') {
    return (
      <span className="text-xs font-medium text-yellow-600">
        Invite sent
      </span>
    );
  }

  return (
    <button className="rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800">
      Invite
    </button>
  );
}
