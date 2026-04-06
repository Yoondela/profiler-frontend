'use client';

export function ExitChatView({ userId, onBack }) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 flex items-center gap-2">
        <button onClick={onBack}>←</button>
        <span className="font-semibold">{userId}</span>
      </div>
    </div>
  );
}
