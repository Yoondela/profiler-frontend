'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton'; // shadcn default

export default function SearchResultSkeleton() {
  return (
    <Card className="border-none shadow-none rounded-lg p-0 gap-0 bg-white">
      {/* IMAGE */}
      <div className="w-full h-32 rounded-lg overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>

      <CardHeader className="p-2 pb-0 gap-0">
        <CardTitle>
          <Skeleton className="h-4 w-2/3" />
        </CardTitle>
      </CardHeader>

      <CardContent className="px-2 pt-0">
        <Skeleton className="h-3 w-1/2" />
      </CardContent>

      <CardFooter className="px-2 pt-0 flex gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </CardFooter>
    </Card>
  );
}
