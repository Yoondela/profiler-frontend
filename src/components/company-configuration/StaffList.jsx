import { useEffect, useState } from 'react';
import axios from 'axios';
import { usePortfolioContext } from '@/api/context/portfolioContext';

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
      } catch (err) {
        console.error('Failed to load staff', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [companyId]);

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
            className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
          >
            <img
              src={person.avatarUrl || '/avatar-placeholder.png'}
              alt={person.name}
              className="h-8 w-8 rounded-full object-cover"
            />

            <span className="text-sm font-medium text-gray-900">
              {person.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
