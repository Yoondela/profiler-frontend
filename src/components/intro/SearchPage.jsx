import SearchRibbon from './SearchRibbon';
import MapResults from './MapSearchResults';
import AppSearchResults from './AppSearchResults';
import { SearchContextProvider } from './context/context';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

export default function SearchPage() {
  return (
    <div>
      <SearchContextProvider>
        <SearchRibbon />
        <hr className="text-gray-100" />

        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          <ResizablePanel defaultSize={25}>
            <div className="flex h-full items-center justify-center p-6">
              <MapResults />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle className="bg-gray-400 w-px" />
          <ResizablePanel defaultSize={75}>
            <div className="flex h-full items-start justify-start px-6">
              <AppSearchResults />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </SearchContextProvider>
    </div>
  );
}
