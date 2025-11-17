import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useServiceRequest } from '../contexts/ServiceRequestContext';
import { useServiceBooking } from '../contexts/ServiceBookingContext';
import { ArrowUp } from 'lucide-react';

export function RequestDrawer({ mode, open, onOpenChange }) {
  const bookingState = useServiceBooking();
  const requestState = useServiceRequest();
  const [sending, setSending] = useState(false);
  const [localNote, setLocalNote] = useState(null);

  // Shared state depending on mode
  const {
    userService,
    userLocation,
    subjectSize,
    serviceTasks,
    setNote,
    note,
  } = mode === 'booking' ? bookingState : requestState;

  const handleConfirm = () => {
    const payload = {
      userService,
      userLocation,
      subjectSize,
      note, // <-- note now included
    };

    alert(JSON.stringify(payload, null, 2));
  };

  const handleNotechange = (e) => {
    setNote(e.target.value);
    setLocalNote(e.target.value);
  };

  const handleNoteSubmit = () => {
    if (!note || sending) return;
    setSending(true);
    console.log('Note submitted:', note);
    setTimeout(() => {
      setLocalNote('');
      setSending(false);
    }, 250);
  };

  return (
    <div className="flex justify-center items-center">
      <Drawer open={open} onOpenChange={onOpenChange} className="bg-white">
        <DrawerContent className="bg-white">
          <DrawerHeader className="mt-3">
            <DrawerTitle>Confirm request</DrawerTitle>
            <DrawerDescription>
              You're requesting a <strong>{userService}</strong> service for{' '}
              <strong>{userLocation?.address}</strong>.
            </DrawerDescription>
          </DrawerHeader>

          <DrawerFooter>
            <div className="flex justify-center">
              <Button
                variant="outline"
                className="w-auto bg-black text-white cursor-pointer"
                onClick={handleConfirm}
              >
                Confirm
              </Button>
            </div>
          </DrawerFooter>

          {/* NOTE FIELD */}
          <div className="flex justify-center w-full p-0 m-0">
            <div className="relative lg:w-120 sm:w-70 w-50 mb-5">
              <Textarea
                placeholder="You can leave them a message here"
                className={`w-full pr-14 transition-all duration-200 ${
                  sending ? 'opacity-60 scale-[0.98]' : 'opacity-100 scale-100'
                }`}
                value={localNote}
                onChange={handleNotechange}
              />

              <Button
                variant="outline"
                disabled={sending}
                className={`
                  absolute 
                  bottom-2 
                  right-2 
                  h-10 
                  w-10 
                  rounded-full 
                  bg-black 
                  text-white 
                  flex 
                  items-center 
                  justify-center
                  cursor-pointer
                  transition-all
                  duration-200
                    ${sending ? 'scale-75 opacity-60' : 'scale-100'}
                  `}
                onClick={handleNoteSubmit}
              >
                <ArrowUp className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
