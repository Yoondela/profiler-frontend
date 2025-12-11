'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

export default function SearchResultCard({ provider, serviceLabel, actions }) {
  return (
    <Card className="border-none shadow-none rounded-lg p-0 gap-0 cursor-pointer bg-white hover:bg-blue-100 transition">
      {/* IMAGE */}
      <div className="w-full h-32 rounded-lg bg-gray-100 overflow-hidden">
        <img
          src={provider.logoUrl}
          alt={`${provider.name} logo`}
          className="w-full h-full object-cover"
        />
      </div>

      <CardHeader className="p-2 pb-0 gap-0">
        <CardTitle className="text-sm font-semibold capitalize truncate">
          {provider.company}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-2 pt-0">
        <p className="text-xs text-gray-500 truncate">{serviceLabel}</p>
      </CardContent>

      {actions && <CardFooter className="px-2 pt-0">{actions}</CardFooter>}
    </Card>
  );
}
