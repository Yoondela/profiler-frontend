import { Spinner } from '@/components/ui/spinner';
import Navbar from '../sub/Navbar';

export function AppLoadingSpinner() {
  return (
    <div>
      <Navbar />

      <div className="flex items-center justify-center gap-4 h-screen">
        <Spinner className="size-8 text-blue-300" />
      </div>
    </div>
  );
}
