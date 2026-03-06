import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
import { useServiceWSRequest } from '@/api/context/ServiceRequestSocketContext';

const getAddress = (requestData) => {
  if (!requestData || typeof requestData !== 'object') {
    return 'Address not provided';
  }

  if (typeof requestData.address === 'string' && requestData.address.trim()) {
    return requestData.address;
  }

  const addressObject =
    requestData.address && typeof requestData.address === 'object'
      ? requestData.address
      : requestData.location && typeof requestData.location === 'object'
        ? requestData.location
        : null;

  if (!addressObject) {
    return 'Address not provided';
  }

  const parts = [
    addressObject.street,
    addressObject.suburb,
    addressObject.city,
    addressObject.state,
    addressObject.postalCode,
    addressObject.country,
  ].filter(Boolean);

  return parts.length ? parts.join(', ') : 'Address not provided';
};

export default function RequestModal({
  open,
  onOpenChange,
  requestData,
  actions = {},
  // timeoutSeconds = 120, // how long provider has to respond
}) {
  const [progress, setProgress] = useState(100);

  const { requestTaken } = useServiceWSRequest();

  const clientName = requestData?.client?.name || 'Unknown user';
  const serviceName = requestData?.service?.name || 'Unknown service';
  const address = getAddress(requestData);

  const acceptAction = actions.accept || {};
  const ignoreAction = actions.ignore || {};
  const timeoutSeconds = requestData?.pingTimeInSeconds || 30;

  useEffect(() => {
    if (!open || requestTaken) return;

    setProgress(100);

    const totalTime = timeoutSeconds * 1000;
    const start = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const percentage = Math.max(100 - (elapsed / totalTime) * 100, 0);

      setProgress(percentage);

      if (percentage <= 0) {
        clearInterval(interval);
        ignoreAction.onClick?.();
        onOpenChange(false);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [open, requestTaken]);

  const handleAccept = () => {
    acceptAction.onClick?.();
    onOpenChange(false);
  };

  const handleIgnore = () => {
    ignoreAction.onClick?.();
    open(false);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader className="items-center text-center">
          <AlertDialogTitle className="flex w-full justify-center">
            {requestTaken ? 'Request taken' : 'New request'}
          </AlertDialogTitle>

          <AlertDialogDescription className="space-y-2 text-sm text-foreground">
            {requestTaken ? (
              <p className="flex items-center jusctify-center w-full text-center">
                Another provider has already accepted this request.
              </p>
            ) : (
              <>
                <p>
                  <span className="font-medium">User:</span> {clientName}
                </p>
                <p>
                  <span className="font-medium">Service:</span> {serviceName}
                </p>
                <p>
                  <span className="font-medium">Address:</span> {address}
                </p>
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <p className="text-xs text-muted-foreground text-center">
          {Math.ceil((progress / 100) * timeoutSeconds)}s remaining
        </p>
        {/* Countdown Progress */}
        <Progress
          value={progress}
          className="w-full h-1 [&>[data-slot=progress-indicator]]:bg-blue-400 bg-blue-100"
        />

        <AlertDialogFooter className="justify-center sm:justify-center">
          {requestTaken ? (
            <AlertDialogAction onClick={() => onOpenChange(false)}>
              Close
            </AlertDialogAction>
          ) : (
            <>
              <AlertDialogCancel
                onClick={handleIgnore}
                disabled={ignoreAction.disabled}
              >
                {ignoreAction.label || 'Ignore'}
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={handleAccept}
                disabled={acceptAction.disabled}
              >
                {acceptAction.label || 'Accept'}
              </AlertDialogAction>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
