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
}) {
  const [progress, setProgress] = useState(100);
  const [closingCountdown, setClosingCountdown] = useState(null);

  const { requestAccepted, requestTaken, requestAwarded } =
    useServiceWSRequest();

  const clientName = requestData?.client?.name || 'Unknown user';
  const serviceName = requestData?.service?.name || 'Unknown service';
  const address = getAddress(requestData);

  const acceptAction = actions.accept || {};
  const ignoreAction = actions.ignore || {};
  const ignoreOnClick = ignoreAction.onClick;
  const timeoutSeconds = requestData?.pingTimeInSeconds || 30;

  // Request response timer
  useEffect(() => {
    if (!open || requestTaken || requestAwarded || requestAccepted) return;

    setProgress(100);
    setClosingCountdown(null);

    const totalTime = timeoutSeconds * 1000;
    const start = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const percentage = Math.max(100 - (elapsed / totalTime) * 100, 0);

      setProgress(percentage);

      if (percentage <= 0) {
        clearInterval(interval);
        ignoreOnClick?.();
        onOpenChange(false);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [
    open,
    requestTaken,
    requestAwarded,
    requestAccepted,
    timeoutSeconds,
    ignoreOnClick,
    onOpenChange,
  ]);

  // Closing countdown when request taken
  useEffect(() => {
    if (!requestTaken || !open) return;

    setClosingCountdown(6);

    const interval = setInterval(() => {
      setClosingCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onOpenChange(false);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [requestTaken, open, onOpenChange]);

  // Closing countdown when request awarded
  useEffect(() => {
    if (!requestAwarded || !open) return;

    setClosingCountdown(3);

    const interval = setInterval(() => {
      setClosingCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onOpenChange(false);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [requestAwarded, open, onOpenChange]);

  const handleAccept = () => {
    acceptAction.onClick?.();
  };

  const handleIgnore = () => {
    ignoreAction.onClick?.();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader className="items-center text-center">
          <AlertDialogTitle className="flex w-full justify-center">
            {requestAwarded
              ? 'Request awarded'
              : requestAccepted
                ? 'Request Accepted'
                : requestTaken
                  ? ''
                  : 'New request'}
          </AlertDialogTitle>

          <AlertDialogDescription asChild>
            <div className="space-y-2 text-sm text-foreground w-full">
              {requestAwarded ? (
                <div className="text-center space-y-2">
                  <div className="text-green-600 font-medium">
                    ✓ You got this request
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Preparing job details...
                  </div>
                </div>
              ) : requestAccepted ? (
                <div className="text-center space-y-2">
                  <div className="text-green-600 font-medium">
                    ✓ "-Provider-" accepted this request
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Preparing details...
                  </div>
                </div>
              ) : requestTaken ? (
                <div className="flex items-center justify-center w-full">
                  <div className="text-xl font-bold text-gray-600">
                    Request Taken
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <div>
                    <span className="font-medium">User:</span> {clientName}
                  </div>
                  <div>
                    <span className="font-medium">Service:</span> {serviceName}
                  </div>
                  <div>
                    <span className="font-medium">Address:</span> {address}
                  </div>
                </div>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {!requestTaken && !requestAwarded && !requestAccepted && (
          <>
            <p className="text-xs text-muted-foreground text-center">
              {Math.ceil((progress / 100) * timeoutSeconds)}s remaining
            </p>

            <Progress
              value={progress}
              className="w-full h-1 [&>[data-slot=progress-indicator]]:bg-blue-400 bg-blue-100"
            />
          </>
        )}

        <AlertDialogFooter className="justify-center sm:justify-center">
          {!requestTaken && !requestAwarded && !requestAccepted && (
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
