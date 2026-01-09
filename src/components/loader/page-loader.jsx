import { Spinner } from '@/components/ui/spinner';

export function PageLoadingSpinner() {
  return (
    <div>
      <div className="flex items-center justify-center gap-4 h-screen">
        <Spinner className="size-8 text-blue-300" />
      </div>
    </div>
  );
}
