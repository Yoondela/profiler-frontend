import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Plus,
  Trash2,
  MapPin,
  CalendarDays,
  Clock3,
  Briefcase,
} from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useApiClient } from '@/api/useApiClient';
import { createBooking } from '@/api/sync/SyncBooking';
import { getUserID } from '@/api/sync/SyncUser';

export default function GetServiceDrawer({ provider, open, onOpenChange }) {
  const api = useApiClient();
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  const [serviceTypes, setServiceTypes] = useState(['']);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [note, setNote] = useState('');
  const [clientId, setClientId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadClientId = async () => {
      if (!isAuthenticated || !user?.email) return;

      try {
        const id = await getUserID(getAccessTokenSilently, user.email);
        setClientId(id);
      } catch (err) {
        console.error('Unable to load client id for public booking', err);
      }
    };

    loadClientId();
  }, [isAuthenticated, user?.email, getAccessTokenSilently]);

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

  const resetForm = () => {
    setServiceTypes(['']);
    setDate('');
    setTime('');
    setAddress('');
    setDescription('');
    setNote('');
  };

  const handleConfirm = async () => {
    const cleanedServiceTypes = serviceTypes
      .map((item) => item.trim())
      .filter(Boolean);

    if (!cleanedServiceTypes.length || !date || !time || !address.trim()) {
      alert('Please complete all required fields before confirming.');
      return;
    }

    if (!clientId) {
      alert(
        'Your user profile is still loading. Please try again in a moment.'
      );
      return;
    }

    setSubmitting(true);

    try {
      const bookingPayload = {
        client: clientId,
        service: cleanedServiceTypes.join(', '),
        description: description.trim() || '',
        forDate: date,
        forTime: time,
        forAddress: {
          address: address.trim(),
          placeId: '',
          addressComponents: [],
        },
        note: note.trim() || '',
      };

      await createBooking(api, bookingPayload);
      alert('Booking successfully created!');
      resetForm();
      onOpenChange(false);
    } catch (err) {
      console.error('Booking failed', err);
      const message =
        err?.data?.message || err?.message || 'Something went wrong';
      alert(`Booking failed: ${message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} className="bg-white">
      <DrawerContent className="bg-white max-h-[90vh] overflow-y-auto">
        <DrawerHeader className="mt-3">
          <DrawerTitle>Book this provider</DrawerTitle>
          <DrawerDescription>
            Request a service from {provider?.user?.name || 'this provider'}.
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 pb-2 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Service type
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
              <label className="text-sm font-medium text-gray-700">Date</label>
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
              <label className="text-sm font-medium text-gray-700">Time</label>
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
            <label className="text-sm font-medium text-gray-700">Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter the service address"
                className="pl-9"
              />
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
              onChange={(e) => setNote(e.target.value)}
              placeholder="You can leave a message for the provider"
              rows={3}
            />
          </div>
        </div>

        <DrawerFooter>
          <div className="flex justify-center">
            <Button
              variant="outline"
              className="w-auto bg-black text-white cursor-pointer"
              onClick={handleConfirm}
              disabled={submitting || !clientId}
            >
              {submitting ? 'Sending...' : 'Confirm'}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
