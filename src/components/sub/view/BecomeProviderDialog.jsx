'use client';

import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Autocomplete } from '@react-google-maps/api';

export default function BecomeProviderDialog({ open, onOpenChange, onSubmit }) {
  const [company, setCompany] = useState('');
  const [autocomplete, setAutocomplete] = useState(null);
  const [address, setAddress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);

  const handlePlaceChanged = () => {
    if (!autocomplete) return;
    const place = autocomplete.getPlace();
    if (!place?.formatted_address) return;

    setAddress({
      formatted: place.formatted_address,
      placeId: place.place_id,
    });

    console.log('Selected address:', place.formatted_address);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Submitting provider info:', { company, address });

      if (!company.trim()) {
        alert('Company name is required');
        return;
      }

      if (!address) {
        alert('Please select a valid address from the dropdown');
        return;
      }

      await onSubmit({ company: company.trim(), address });
    } catch (error) {
      console.error('Error submitting provider info:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border shadow-lg sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Become a provider</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company name</Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Enter your company name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Work address</Label>
            {typeof window !== 'undefined' && window.google ? (
              <Autocomplete
                onLoad={(autocomplete) => setAutocomplete(autocomplete)}
                onPlaceChanged={handlePlaceChanged}
                options={{
                  types: ['address'],
                  componentRestrictions: { country: 'za' }, // Optional: restrict to a country
                }}
              >
                <Input
                  id="address"
                  ref={inputRef}
                  placeholder="Start typing your address"
                  required
                />
              </Autocomplete>
            ) : (
              <Input
                id="address"
                placeholder="Loading address autocomplete..."
                disabled
              />
            )}
          </div>

          {address && (
            <div className="p-2 bg-gray-50 rounded text-sm">
              <p className="font-medium">Selected address:</p>
              <p className="text-gray-600">{address.formatted}</p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Continue'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
