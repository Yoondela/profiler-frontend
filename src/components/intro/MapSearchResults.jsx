import ServiceAreaMap from './ServiceAreaMap';
import { mockProviders } from '@/mock/providers';
import { useSearchContext } from './context/context';

export default function MapResults() {
  const { results, hoveredProviderId } = useSearchContext();
  console.log('Providers in MapResults:', results);
  console.log('Mock Providers in MapResults:', mockProviders);
  return (
    <div className="h-[500px] w-full">
      <ServiceAreaMap
        providers={results}
        hoveredProviderId={hoveredProviderId}
      />
    </div>
  );
}
