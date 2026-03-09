import RequestModal from './RequestModal';
import { useServiceWSRequest } from '@/api/context/ServiceRequestSocketContext';

export default function ModalLayer() {
  const {
    activeRequest,
    requestTaken,
    requestAwarded,
    clearRequest,
    acceptRequest,
    ignoreRequest,
  } = useServiceWSRequest();

  if (!activeRequest && !requestTaken && !requestAwarded) return null;

  return (
    <RequestModal
      open={!!activeRequest || requestTaken || requestAwarded}
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
