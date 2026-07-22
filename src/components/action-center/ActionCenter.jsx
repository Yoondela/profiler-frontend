import { Link, useLocation } from 'react-router-dom';

import { ListChevronsDownUp, ListChevronsUpDownIcon } from 'lucide-react';
import { useBookings } from '@/api/context/bookingsContext';

export default function ActionCenter() {
  let hasNew = false;
  try {
    const b = useBookings();
    hasNew = !!b?.hasNew;
  } catch (e) {
    hasNew = false;
  }

  return (
    <div>
      <Link
        to={'/actions'}
        className="group relative flex items-center justify-center text-current! transition cursor-pointer"
      >
        <ListChevronsUpDownIcon
          size={19}
          className="group-hover:hidden mt-[4px]"
        />
        <ListChevronsDownUp
          size={19}
          className="mt-[2px] hidden group-hover:block"
        />
        {hasNew && (
          <span className="absolute top-0 right-0 block h-[10px] w-[10px] rounded-full bg-red-600" />
        )}
      </Link>
    </div>
  );
}
