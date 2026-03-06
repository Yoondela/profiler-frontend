import RequestModal from './RequestModal';
import { useServiceWSRequest } from '@/api/context/ServiceRequestSocketContext';

export default function ModalLayer() {
  const { activeRequest, clearRequest, acceptRequest, ignoreRequest } =
    useServiceWSRequest();

  if (!activeRequest) return null;

  return (
    <RequestModal
      open={!!activeRequest}
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
