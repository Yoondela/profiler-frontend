import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ReviewCard } from './ReviewCard';

export default function ReviewCarousel({ reviews = [] }) {
  return (
    <Carousel opts={{ align: 'start', loop: false }} className="w-full px-5">
      <CarouselContent className="p-10">
        {reviews.map((review, idx) => (
          <CarouselItem
            key={review?._id || review?.id || idx}
            className="basis-full md:basis-1/2 lg:basis-1/3"
          >
            <ReviewCard review={review} className="w-full" />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

