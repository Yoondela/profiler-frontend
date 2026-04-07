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
import { useChatStore } from '@/modules/chat/store/chatStore';

export function LiteChat({ open, onOpenChange }) {
  const [activeChannelId, setActiveChannelId] = useState(null);
  const totalUnread = useChatStore((s) => s.getTotalUnread());
  const clearViewedChannel = useChatStore((s) => s.clearViewedChannel);
  const isNew = useChatStore((s) => s.isNew());

  const handleBack = () => {
    clearViewedChannel();
    setActiveChannelId(null);
  };

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
          {totalUnread > 0 && (
            <div className="absolute flex items-center justify-center top-0 right-0 block h-[13px] w-[13px] rounded-full bg-red-600">
              <span className="text-[8px] text-white">{totalUnread}</span>
            </div>
          )}

          {isNew && totalUnread < 1 && (
            <span className="absolute flex items-center justify-center top-1 right-0 block h-[8px] w-[8px] rounded-full bg-red-600" />
          )}
        </SheetTrigger>
        <SheetContent
          side={'right'}
          className="border-none w-[400px] sm:w-[500px] h-[93%] bg-[white] my-[50px] gap-0"
        >
          <SheetHeader>
            {activeChannelId ? (
              <ExitChatView
                channelId={activeChannelId}
                onBack={handleBack}
              />
            ) : (
              <>
                <SheetTitle>Chats</SheetTitle>
                <SheetDescription>Direct messages</SheetDescription>
              </>
            )}
          </SheetHeader>
          <div className="no-scrollbar overflow-y-auto px-4">
            {!activeChannelId ? (
              <DMList onSelect={setActiveChannelId} />
            ) : (
              <LiteChatView userId={activeChannelId} onBack={handleBack} />
            )}
          </div>
          <SheetFooter>
            {activeChannelId ? (
              <div className="w-full border-">
                <MessageInput userId={activeChannelId} />
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
