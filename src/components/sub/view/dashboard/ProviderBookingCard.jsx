'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

export default function ProviderBookingCard({ booking, actions }) {
  return (
    <Card className="border rounded-xl shadow-sm bg-zinc-400">
      <CardHeader>
        <CardTitle className="text-lg font-semibold capitalize">
          {booking.serviceType}
        </CardTitle>
      </CardHeader>

      <CardContent className="text-sm space-y-1">
        <p>
          <strong>Client:</strong> {booking.client?.name || 'Unknown'}
        </p>
        <p>
          <strong>Description:</strong> {booking.description}
        </p>
        <p>
          <strong>Date:</strong>{' '}
          {new Date(booking.requestedAt).toLocaleString()}
        </p>
      </CardContent>

      {actions && (
        <CardFooter className="flex justify-end gap-2">{actions}</CardFooter>
      )}
    </Card>
  );
}
