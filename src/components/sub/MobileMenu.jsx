import { X } from 'lucide-react';
import UserAvatar from './common/UserAvatar';

export default function MobileMenu({ isOpen, onClose, user, children }) {

  function MenuItem({ icon: Icon, label, onClick }) {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-4 w-full rounded-lg px-4 py-3 hover:bg-gray-100 transition"
      >
        <Icon size={20} />
        <span>{label}</span>
      </button>
    );
  }
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 bg-black/40 z-40 md:hidden
          transition-opacity duration-300
          ${isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'}
        `}
      />

      {/* Drawer */}
      <aside
        className={`
          fixed top-0 right-0 h-screen w-[85vw] max-w-80 bg-white shadow-xl z-50 md:hidden
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="relative border-b p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4"
          >
            <X size={22} />
          </button>
                
          <div className="flex flex-col items-center">
                
            <UserAvatar user={user} />
                
            <h2 className="mt-3 font-semibold">
              {user?.name}
            </h2>
                
            <p className="text-sm text-gray-500">
              {user?.email}
            </p>
                
          </div>
                
        </div>

        <div className="p-4">
          {children}
        </div>
      </aside>
    </>
  );
}