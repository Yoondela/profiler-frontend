// src/components/LoadingSpinner.jsx
// src/components/Spinner.jsx
export default function Spinner({ text }) {
  return (
    <span className="flex items-center gap-2">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
      {text || ''}
    </span>
  );
}
