'use client';

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

import { Scroll } from 'lucide-react';

export default function ResultsEmpty() {
  return (
    <Empty className="text-gray-500">
      <EmptyHeader className="border border-dashed border-gray-100 p-25 rounded-lg">
        <EmptyMedia variant="icon">
          <Scroll className="text-gray-300" />
        </EmptyMedia>
        <EmptyTitle>No data</EmptyTitle>
        <EmptyDescription>No data found</EmptyDescription>
      </EmptyHeader>
      {/* <EmptyContent>
        <Button>Add data</Button>
      </EmptyContent> */}
    </Empty>
  );
}
