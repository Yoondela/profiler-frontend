import { useState } from 'react';
import { MessageSquareMore, MessageSquareText } from 'lucide-react';

export function MessageContainer() {
  const [openMessages, setOpenMessages] = useState(false);

  return (
    <>
      <div
        className="group relative flex items-center justify-center transition cursor-pointer"
        onClick={() => setOpenMessages(true)}
      >
        <MessageSquareMore size={19} className="group-hover:hidden mt-[4px]" />
        <MessageSquareText
          size={19}
          className="mt-[2px] hidden group-hover:block"
        />
      </div>

      {openMessages && (
        <div className="fixed bottom-0 right-4 w-[400px] h-[600px] shadow-xl border bg-white z-50">
          <div className="flex justify-between p-2 border-b">
            <button onClick={() => setOpenMessages(false)}>✕</button>
          </div>

          <iframe
            src="http://localhost:3000"
            className="w-full h-full border-0"
          />
        </div>
      )}
    </>
  );
}
