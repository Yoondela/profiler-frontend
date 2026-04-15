import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

import { useCity } from './context/cityContext';

export default function CitySelector() {
  const { city, setCity, cities } = useCity();

  return (
    <Select
      modal={false}
      value={city.acr}
      onValueChange={(acr) => {
        const selected = cities.find((c) => c.acr === acr);
        setCity(selected);
      }}
    >
      <SelectTrigger className="h-[26px]!" modal={false}>
        <SelectValue placeholder="ZA">{city?.acr}</SelectValue>
      </SelectTrigger>

      <SelectContent
        position="popper"
        sideOffset={12}
        avoidCollisions={true}
        className="border-none bg-[white]"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        {...{ disableOutsidePointerEvents: false }}
      >
        {cities.map((c) => (
          <SelectItem key={c.acr} value={c.acr} className="hover:bg-blue-50">
            {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
