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
import { useApiClient } from '@/api/useApiClient';
import { createBooking } from '@/api/sync/SyncBooking';
import { createRequest } from '@/api/sync/SyncRequest';
import { ArrowUp } from 'lucide-react';

export function RequestDrawer({ mode, open, onOpenChange }) {
  const bookingState = useServiceBooking();
  const requestState = useServiceRequest();
  const [sending, setSending] = useState(false);
  const [localNote, setLocalNote] = useState(null);
  const api = useApiClient();

  // Shared state depending on mode
  const {
    userService,
    userLocation,
    subjectSize,
    serviceTasks,
    setNote,
    note,
    bookingPayload,
    requestPayload,
  } = mode === 'booking' ? bookingState : requestState;

  const handleConfirm = () => {
    console.log(
      'Confirming with payload:',
      mode === 'booking' ? bookingPayload : requestPayload
    );
    try {
      if (mode === 'booking') {
        // Call createBooking API
        createBooking(api, bookingPayload)
          .then((data) => {
            console.log('✅ Booking created:', data);
            alert('Booking successfully created!');
          })
          .catch((err) => {
            console.error('❌ createBooking failed', err);
            const message =
              err?.data?.message || err?.message || 'Something went wrong';
            alert(`Booking failed: ${message}`);
          });
      } else {
        // Call createBooking API
        createRequest(api, requestPayload)
          .then((data) => {
            console.log('✅ Request created:', data);
          })
          .catch((err) => {
            console.error('❌ createRequest failed', err);
            const message =
              err?.data?.message || err?.message || 'Something went wrong';
            console.log(`Request failed: ${message}`);
            alert(`Request failed: ${message}`);
          });
      }
    } catch (err) {
      console.error('Error during confirmation:', err);
      alert('An error occurred. Please try again.');
    }
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
