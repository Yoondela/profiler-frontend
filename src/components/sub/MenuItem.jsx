export function MenuItem({ item }) {
  const { icon: Icon, label, to, action } = item;
  return (
    <button
      onClick={action}
      className="flex items-center justify-between w-full rounded-xl px-4 py-3 hover:bg-gray-100 transition"
    >
      <div className="flex items-center gap-4">
        <Icon size={20} className="text-gray-600" />
        <span className="font-medium">{label}</span>
      </div>

      {/* {rightContent} */}
    </button>
  );
}
