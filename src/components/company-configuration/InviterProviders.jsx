import { UserPlus } from 'lucide-react';
import InviteProvidersSearch from './InviteProvidersSearch';

export default function InviteProviders() {
  return (
    <div className="max-w-2xl mx-auto p-6 mt-10">
      <h2 className="text-xl font-semibold text-gray-900">
        Invite providers
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Search for providers on the platform and invite them to your company.
      </p>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-3 mb-4">
          <UserPlus className="h-5 w-5 text-gray-700" />
          <p className="text-sm font-medium text-gray-900">
            Search providers
          </p>
        </div>

        <InviteProvidersSearch />
      </div>
    </div>
  );
}
