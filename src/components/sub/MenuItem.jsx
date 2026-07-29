import { Link } from 'react-router-dom';

export function MenuItem({ item, onClose }) {
  const { icon: Icon, label, to, action } = item;
  const handleClick = () => {
    action?.();
    onClose?.();
  };

  const content = (
    <>
      <div className="flex items-center gap-4">
        <Icon size={20} className="text-gray-600" />
        <span className="font-medium">{label}</span>
      </div>
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        onClick={handleClick}
        className="flex items-center justify-between w-full rounded-xl px-4 py-3 hover:bg-gray-100 transition"
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex items-center justify-between w-full rounded-xl px-4 py-3 hover:bg-gray-100 transition"
    >
      {content}
    </button>
  );
}
