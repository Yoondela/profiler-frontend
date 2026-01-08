'use client';

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

import { CircleSlash } from 'lucide-react';

export default function SearchEmpty() {
  return (
    <Empty className="text-gray-500">
      <EmptyHeader className="border border-dashed border-gray-100 p-25 rounded-lg">
        <EmptyMedia variant="icon">
          <CircleSlash className="text-gray-300" />
        </EmptyMedia>
        <EmptyTitle>Search</EmptyTitle>
        <EmptyDescription>Empty</EmptyDescription>
      </EmptyHeader>
      {/* <EmptyContent>
        <Button>Add data</Button>
      </EmptyContent> */}
    </Empty>
  );
}
