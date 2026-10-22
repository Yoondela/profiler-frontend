import { useEffect, useRef, useState } from 'react';
import { CalendarX } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import { updateVisibility } from '@/api/sync/SyncPortfolio';
import { usePortfolioContext } from '@/api/context/portfolioContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const MAX_TIMEOUT_DELAY = 2_147_483_647;

export default function HideServiceSection() {
  const [selectedDate, setSelectedDate] = useState('');
  const [pendingAction, setPendingAction] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => Date.now());
  const cancelButtonRef = useRef(null);
  const { getAccessTokenSilently } = useAuth0();
  const {
    portfolioDataCtx,
    setPortfolioDataCtx,
    visibilityLoading,
    visibilityError,
  } = usePortfolioContext();

  const hiddenUntil = portfolioDataCtx?.visibility?.hiddenUntil;
  const hiddenUntilTime = new Date(hiddenUntil).getTime();
  const isHidden = Boolean(hiddenUntil && hiddenUntilTime > currentTime);
  const isLoading = portfolioDataCtx === null || visibilityLoading;
  const isVisibilityUnavailable = Boolean(visibilityError);
  const now = new Date(currentTime);
  const minDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const selectedDateIsInvalid = Boolean(
    selectedDate && selectedDate <= minDate
  );

  useEffect(() => {
    const delay = hiddenUntilTime - Date.now();
    if (!Number.isFinite(hiddenUntilTime) || delay <= 0) return undefined;

    const timeoutId = window.setTimeout(
      () => setCurrentTime(Date.now()),
      Math.min(delay + 1, MAX_TIMEOUT_DELAY)
    );

    return () => window.clearTimeout(timeoutId);
  }, [currentTime, hiddenUntilTime]);

  function handleToggle() {
    if (isLoading || isVisibilityUnavailable || isSaving) return;
    if (!isHidden && selectedDateIsInvalid) return;

    if (isHidden) {
      setPendingAction({ action: 'restore' });
    } else if (selectedDate) {
      setPendingAction({ action: 'hideUntil', hiddenUntil: selectedDate });
    } else {
      setPendingAction({ action: 'hideNow' });
    }
  }

  async function confirmVisibilityChange() {
    if (!pendingAction) return;

    setIsSaving(true);
    try {
      const token = await getAccessTokenSilently({
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      });
      const response = await updateVisibility(pendingAction, token);
      setPortfolioDataCtx((previous) => ({
        ...previous,
        visibility: response.visibility,
      }));
      setPendingAction(null);
      toast.success('Visibility updated');
    } catch (error) {
      console.error('Failed to update visibility', error);
      toast.error(
        error.response?.data?.message || 'Failed to update visibility'
      );
    } finally {
      setIsSaving(false);
    }
  }

  const dialogMessage =
    pendingAction?.action === 'restore'
      ? 'This will make the service visible immediately.'
      : pendingAction?.action === 'hideUntil'
        ? `This will hide the service until ${selectedDate}.`
        : 'This will hide the service until its next opening time.';

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-semibold text-gray-900">
        Hide service visibility
      </h1>

      <p className="mt-1 text-sm text-gray-500">
        This hides the service from search, booking and request.
      </p>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <CalendarX className="h-5 w-5 text-gray-700" />
              <p className="text-sm font-medium text-gray-900">
                Hide service visibility
              </p>
            </div>

            <p className="mt-4 max-w-md text-sm text-gray-500">
              Turn this on to hide now until the next opening time, or choose a
              future date first.
            </p>
          </div>

          <button
            type="button"
            aria-label={
              isVisibilityUnavailable
                ? 'Service visibility unavailable'
                : isHidden
                  ? 'Restore service visibility'
                  : 'Hide service visibility'
            }
            aria-pressed={isVisibilityUnavailable ? undefined : isHidden}
            onClick={handleToggle}
            disabled={isLoading || isVisibilityUnavailable || isSaving}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:cursor-not-allowed disabled:opacity-50 ${
              isHidden && !isVisibilityUnavailable
                ? 'bg-blue-200'
                : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                isHidden && !isVisibilityUnavailable
                  ? 'translate-x-5'
                  : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <label htmlFor="visibility-until" className="text-sm text-gray-600">
            Hide until
          </label>
          <input
            id="visibility-until"
            type="date"
            min={minDate}
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            aria-invalid={selectedDateIsInvalid}
            aria-describedby={
              selectedDateIsInvalid ? 'visibility-date-error' : undefined
            }
            disabled={
              isHidden || isLoading || isVisibilityUnavailable || isSaving
            }
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-50"
          />
        </div>

        {selectedDateIsInvalid && (
          <p
            id="visibility-date-error"
            className="mt-2 text-sm text-red-600"
            role="alert"
          >
            Choose a date after today.
          </p>
        )}
      </div>

      {visibilityError && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {visibilityError}
        </p>
      )}

      <Dialog
        open={Boolean(pendingAction)}
        onOpenChange={(open) => {
          if (!open && !isSaving) setPendingAction(null);
        }}
      >
        <DialogContent
          className="bg-white"
          showCloseButton={false}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            cancelButtonRef.current?.focus();
          }}
        >
          <DialogHeader>
            <DialogTitle>Confirm visibility change</DialogTitle>
            <DialogDescription>{dialogMessage}</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3">
            <button
              ref={cancelButtonRef}
              type="button"
              onClick={() => setPendingAction(null)}
              disabled={isSaving}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmVisibilityChange}
              disabled={isSaving}
              className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-50"
            >
              {isSaving ? 'Updating...' : 'Confirm'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
