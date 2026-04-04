import RequestModal from './RequestModal';
import { useServiceWSRequest } from '@/api/context/ServiceRequestSocketContext';

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

  if (
    !activeRequest &&
    !requestCreated &&
    !requestTaken &&
    !requestAwarded &&
    !requestAccepted
  ) {
    return null;
  }

  return (
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
  );
}
