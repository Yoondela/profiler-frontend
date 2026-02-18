import { useEffect, useState } from 'react';
import axios from 'axios';
import { Users } from 'lucide-react';
import { usePortfolioContext } from '@/api/context/portfolioContext';

export default function MembersList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { companyId } = usePortfolioContext();

  useEffect(() => {
    if (!companyId) return;

    const fetchMembers = async () => {
      try {
        const res = await axios.get(`/api/company/${companyId}/members`);
        setMembers(res.data);
      } catch (err) {
        console.error('Failed to load members', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [companyId]);

  return (
    <div className="bg-white p-0">
      <div className="mt-0 space-y-2">
        {loading && <p className="text-sm text-gray-500">Loading members…</p>}

        {!loading && members.length === 0 && (
          <p className="text-sm text-gray-500">No members yet.</p>
        )}

        {members.map((member) => (
          <div
            key={member.portfolioId}
            className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
          >
            <img
              src={member.avatarUrl || '/avatar-placeholder.png'}
              alt={member.name}
              className="h-8 w-8 rounded-full object-cover"
            />

            <span className="text-sm font-medium text-gray-900">
              {member.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
