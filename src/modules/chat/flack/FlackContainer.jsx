import { MessageSquareMore, MessageSquareText } from 'lucide-react';
import { IoAtCircle } from 'react-icons/io5';
import { NavLink } from 'react-router-dom';

export function FlackContainer() {
  return (
    <div className="flex items-center rounded-lg transition cursor-pointer">
      <NavLink to="/flack" className="font-bold tracking-wide transition">
        <div className="flex items-center">
          <span className="text-sm text-[white] font-semibold">Fl</span>
          <IoAtCircle size={16} color="white" />
          <span className="text-sm text-[white] font-semibold">ck</span>
        </div>
      </NavLink>
    </div>
  );
}
