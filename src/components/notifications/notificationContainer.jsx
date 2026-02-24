import { Bell } from 'lucide-react';
import NotificationList from './notificationList';
import { useNotifications } from '@/api/context/notificationContext';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export default function NotificationContainer() {
  const { hasNew, clearNewFlag } = useNotifications();

  return (
    <div>
      <Sheet
        onOpenChange={(open) => {
          if (!open) {
            clearNewFlag();
          }
        }}
      >
        <SheetTrigger className="relative flex items-center">
          <Bell />
          {hasNew && (
            <span className="absolute top-0 right-0 block h-[10px] w-[10px] rounded-full bg-red-600" />
          )}
        </SheetTrigger>
        <SheetContent
          side="right"
          className="border-none w-[400px] sm:w-[500px] bg-[white] pt-[50px]"
        >
          <SheetHeader className="py-0 my-0 border-b border-gray-200">
            <SheetTitle className="text-xl text-green-200">
              Notifications
            </SheetTitle>
          </SheetHeader>
          <div className="m-0">
            <NotificationList />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
