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
        modal={false}
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
          className="border-none w-[400px] sm:w-[500px] h-[93%] bg-[white] my-[50px] gap-0"
        >
          <SheetHeader className="mt-7 px-2 py-0">
            <SheetTitle className="text-xl text-green-200">
              Notifications
            </SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto m-0 p-0">
            <NotificationList />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
