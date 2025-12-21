import SearchRibbon from './SearchRibbon';
import MapResults from './MapSearchResults';
import AppSearchResults from './AppSearchResults';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

export default function SearchPage() {
  return (
    <div className="h-[100dvh] flex flex-col">
      {/* Header */}
      <SearchRibbon />
      {/* Content area */}
      <div className="flex-1 max-h-[calc(100dvh-9rem)] sticky top-[var(--header-two-height)]">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          <ResizablePanel defaultSize={45}>
            <div className="h-full overflow-hidden p-6">
              <MapResults />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-gray-400 w-px" />

          <ResizablePanel defaultSize={55}>
            <div className="h-full overflow-y-auto px-6">
              <AppSearchResults />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
