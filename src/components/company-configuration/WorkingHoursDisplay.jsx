import React from 'react';
import { usePortfolioContext } from '@/api/context/portfolioContext';

const days = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

function formatRange(dayObj) {
  if (!dayObj || !dayObj.isOpen) return 'Closed';
  const start = dayObj.opensAt || '';
  const end = dayObj.closesAt || '';
  if (!start || !end) return 'Closed';
  return `${start} – ${end}`;
}

export default function WorkingHoursDisplay({ className = '' }) {
  const { getWorkingHours } = usePortfolioContext();
  const workingHours = getWorkingHours();

  if (!workingHours) return null;

  const { timezone, weeklySchedule = {} } = workingHours;

  return (
    <div className={className}>
      <div className="text-sm text-gray-500">Timezone: {timezone || 'UTC'}</div>
      <ul className="mt-2 space-y-1 text-sm text-gray-900">
        {days.map((d) => (
          <li key={d} className="flex justify-between">
            <span className="capitalize">{d}</span>
            <span className="text-gray-600">{formatRange(weeklySchedule[d])}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
