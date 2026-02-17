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

export default function BecomeCompanyDialog({ open, onClose, onSubmit }) {
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
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!company.trim()) {
      alert('Company name is required');
      return;
    }

    if (!address) {
      alert('Please select a valid address');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        name: company.trim(),
        address,
      });
      onClose();
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white border shadow-lg sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>List service as a company</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company name</Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Mkhize Plumbing Services"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Work address</Label>

            {typeof window !== 'undefined' && window.google ? (
              <Autocomplete
                onLoad={setAutocomplete}
                onPlaceChanged={handlePlaceChanged}
                options={{
                  types: ['address'],
                  componentRestrictions: { country: 'za' },
                }}
              >
                <Input
                  id="address"
                  ref={inputRef}
                  placeholder="Start typing your address"
                />
              </Autocomplete>
            ) : (
              <Input disabled placeholder="Loading address…" />
            )}
          </div>

          {address && (
            <div className="rounded bg-gray-50 p-2 text-sm">
              <p className="font-medium">Selected address</p>
              <p className="text-gray-600">{address.formatted}</p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Continue'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
