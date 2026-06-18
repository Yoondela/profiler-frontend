import { MessageSquareMore, MessageSquareText } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export function FlackContainer() {
  return (
    <div>
      <NavLink
        to="/flack"
        className="font-bold tracking-wide hover:text-gray-600 transition"
      >
        Flack
      </NavLink>
    </div>
  );
}
