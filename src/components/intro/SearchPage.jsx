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
      <div className="flex-1 max-h-[calc(100dvh-6.7rem)] sticky top-[calc(var(--header-two-height))] overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          <ResizablePanel defaultSize={45} minSize={30} maxSize={80}>
            <div className="h-full overflow-hidden px-1">
              <MapResults />
            </div>
          </ResizablePanel>

          <ResizableHandle className="bg-gray-400 w-[3px]" />

          <ResizablePanel defaultSize={55} minSize={20} maxSize={70}>
            <div className="h-full overflow-y-auto px-6">
              <AppSearchResults />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
