import { useState } from 'react';
import {
  Briefcase,
  CalendarDays,
  Clock3,
  MapPin,
  Plus,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useServiceBooking } from '@/components/request/contexts/ServiceBookingContext';
import { RequestDrawer } from '@/components/request/confirm/confirm';

export default function GetServicePanel({
  providerId,
  providerName,
  onCancel,
}) {
  const {
    setBookingType,
    setOwner,
    setUserService,
    setUserDate,
    setUserTime,
    setUserLocation,
    setServiceTasks,
    setNote,
  } = useServiceBooking();

  const [serviceTypes, setServiceTypes] = useState(['']);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [note, setNoteValue] = useState('');
  const [showConfirmDrawer, setShowConfirmDrawer] = useState(false);

  const MOCK_ADDRESS = {
    address:
      '1 Lower Long Street, Cape Town City Centre, Cape Town, 8001, South Africa',
    placeId: 'mock-place-id-001',
    lng: 18.4233,
    lat: -33.9154,
    geometry: {
      location: {
        lat: -33.9154,
        lng: 18.4233,
      },
    },
    addressComponents: [
      {
        long_name: '1',
        short_name: '1',
        types: ['street_number'],
      },
      {
        long_name: 'Lower Long Street',
        short_name: 'Lower Long St',
        types: ['route'],
      },
      {
        long_name: 'Cape Town City Centre',
        short_name: 'Cape Town City Centre',
        types: ['sublocality'],
      },
      {
        long_name: 'Cape Town',
        short_name: 'Cape Town',
        types: ['locality'],
      },
      {
        long_name: 'Western Cape',
        short_name: 'WC',
        types: ['administrative_area_level_1'],
      },
      {
        long_name: '8001',
        short_name: '8001',
        types: ['postal_code'],
      },
      {
        long_name: 'South Africa',
        short_name: 'ZA',
        types: ['country'],
      },
    ],
  };

  setBookingType('direct');
  setOwner(providerId);

  const updateServiceType = (index, value) => {
    setServiceTypes((prev) =>
      prev.map((item, itemIndex) => (itemIndex === index ? value : item))
    );
  };

  const addServiceType = () => {
    setServiceTypes((prev) => [...prev, '']);
  };

  const removeServiceType = (index) => {
    if (serviceTypes.length === 1) return;
    setServiceTypes((prev) =>
      prev.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const handleContinue = () => {
    const cleanedServiceTypes = serviceTypes
      .map((item) => item.trim())
      .filter(Boolean);

    if (!cleanedServiceTypes.length || !date || !time) {
      alert('Please complete all required fields before continuing.');
      return;
    }

    setUserService(cleanedServiceTypes.join(', '));
    setUserDate(date);
    setUserTime(time);
    setUserLocation(MOCK_ADDRESS);
    setServiceTasks(
      description.trim() ? { description: description.trim() } : {}
    );
    setNote(note.trim());
    setNoteValue(note.trim());
    setShowConfirmDrawer(true);
  };

  return (
    <section
      id="get-service-panel"
      className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
          Book this provider
        </p>
        <h3 className="mt-1 text-xl font-semibold text-gray-900">
          Request service from {providerName || 'this provider'}
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Add the details you want to send, then confirm from the drawer.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Service type <span className="text-red-500">*</span>
          </label>
          {serviceTypes.map((serviceType, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  value={serviceType}
                  onChange={(e) => updateServiceType(index, e.target.value)}
                  placeholder={`Service type ${index + 1}`}
                  className="pl-9"
                />
              </div>
              {serviceTypes.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 shrink-0"
                  onClick={() => removeServiceType(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="w-full border-dashed"
            onClick={addServiceType}
          >
            <Plus className="mr-2 h-4 w-4" /> Add service type
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Time <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Clock3 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Address <span className="text-red-500">*</span>
          </label>

          <div className="flex items-center rounded-md border bg-gray-50 px-3 py-3">
            <MapPin className="mr-3 h-4 w-4 shrink-0 text-gray-500" />
            <div>
              <p className="text-sm text-gray-900">{MOCK_ADDRESS.address}</p>
              <p className="text-xs text-gray-500">Development mock address</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Description
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add extra details about the job"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Note</label>
          <Textarea
            value={note}
            onChange={(e) => setNoteValue(e.target.value)}
            placeholder="You can leave a message for the provider"
            rows={3}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        <Button
          type="button"
          className="bg-black text-white hover:bg-gray-800"
          onClick={handleContinue}
        >
          Continue to confirm
        </Button>
      </div>

      <RequestDrawer
        mode="direct-booking"
        open={showConfirmDrawer}
        onOpenChange={setShowConfirmDrawer}
      />
    </section>
  );
}
