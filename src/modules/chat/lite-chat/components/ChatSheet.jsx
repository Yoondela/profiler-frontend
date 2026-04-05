import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useState } from 'react';
import { DMList } from './DMList';
import { LiteChatView } from './LiteChatView';
import { MessageInput } from './MessageInput';
import { ExitChatView } from './ExitChatView';
import { MessageSquareMore, MessageSquareText } from 'lucide-react';

export function ChatSheet({ open, onOpenChange }) {
  const [activeUserId, setActiveUserId] = useState(null);
  // const { hasNew, clearNewFlag } = useNotifications();

  return (
    <div className="flex flex-wrap">
      <Sheet modal={false} open={open} onOpenChange={onOpenChange}>
        <SheetTrigger className="group relative flex items-center justify-center transition cursor-pointer">
          <MessageSquareMore
            size={19}
            className="group-hover:hidden mt-[4px]"
          />
          <MessageSquareText
            size={19}
            className="mt-[2px] hidden group-hover:block"
          />
          {/* {hasNew && (
              <span className="absolute top-0 right-0 block h-[10px] w-[10px] rounded-full bg-red-600" />
            )} */}
        </SheetTrigger>
        <SheetContent
          side={'right'}
          className="border-none w-[400px] sm:w-[500px] h-[93%] bg-[white] my-[50px] gap-0"
        >
          <SheetHeader>
            {activeUserId ? (
              <ExitChatView
                userId={activeUserId}
                onBack={() => setActiveUserId(null)}
              />
            ) : (
              <>
                <SheetTitle>Chats</SheetTitle>
                <SheetDescription>Direct messages</SheetDescription>
              </>
            )}
          </SheetHeader>
          <div className="no-scrollbar overflow-y-auto px-4">
            {!activeUserId ? (
              <DMList onSelect={setActiveUserId} />
            ) : (
              <LiteChatView
                userId={activeUserId}
                onBack={() => setActiveUserId(null)}
              />
            )}
          </div>
          <SheetFooter>
            {activeUserId ? (
              <div className="w-full border-">
                <MessageInput userId={activeUserId} />
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center w-full">
                  <p>Flack</p>
                </div>
              </>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
