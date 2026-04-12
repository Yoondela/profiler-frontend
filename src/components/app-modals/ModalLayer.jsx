import RequestModal from './RequestModal';
import { useServiceWSRequest } from '@/api/context/ServiceRequestSocketContext';
import BookingModal from './BookingModal';
import { useServiceWSBooking } from '@/api/context/ServiceBookingSocketContext';

export default function ModalLayer() {
  const {
    activeRequest,
    requestCreated,
    requestTaken,
    requestAwarded,
    requestAccepted,
    clearRequest,
    acceptRequest,
    ignoreRequest,
  } = useServiceWSRequest();

  const {
    activeBooking,
    bookingCreated,
    bookingTaken,
    bookingAwarded,
    bookingAccepted,
    clearBooking,
    acceptBooking,
    ignoreBooking,
  } = useServiceWSBooking();

  if (
    !activeRequest &&
    !requestCreated &&
    !requestTaken &&
    !requestAwarded &&
    !requestAccepted &&
    !activeBooking &&
    !bookingCreated &&
    !bookingTaken &&
    !bookingAwarded &&
    !bookingAccepted
  ) {
    return null;
  }

  return (
    <>
      <RequestModal
        open={
          !!activeRequest ||
          !!requestCreated ||
          requestTaken ||
          requestAwarded ||
          requestAccepted
        }
        requestData={activeRequest}
        onOpenChange={clearRequest}
        actions={{
          accept: {
            onClick: () => acceptRequest(activeRequest._id),
          },
          ignore: {
            onClick: () => ignoreRequest(activeRequest._id),
          },
        }}
      />
      <BookingModal
        open={
          !!activeBooking ||
          !!bookingCreated ||
          bookingTaken ||
          bookingAwarded ||
          bookingAccepted
        }
        bookingData={activeBooking}
        onOpenChange={clearBooking}
        actions={{
          accept: {
            onClick: () => acceptBooking(),
          },
          ignore: {
            onClick: () => ignoreBooking(),
          },
        }}
      />
    </>
  );
}
