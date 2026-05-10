import { useState } from 'react';
import { createReview } from '@/api/sync/syncReviews';
import { useApiClient } from '@/api/useApiClient';
import { useUserContext } from '@/api/context/userContext';
import { ReviewCard } from './ReviewCard';
import { ReviewModal } from './ReviewModal';

export const Reviews = ({ providerId, providerName, reviews }) => {
  const [myReview, setMyReview] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  console.log('reviews in Reviews component', reviews);

  const { userCtx } = useUserContext();

  const api = useApiClient();

  const resolvedProviderId = providerId;

  const mergedReviews = myReview
    ? [myReview, ...reviews.filter((review) => review._id !== myReview._id)]
    : reviews;

  const handleSubmitReview = async ({ rating, comment }) => {
    if (!userCtx || !rating || !comment) return;

    const reviewData = {
      providerId: resolvedProviderId,
      reviewerName: userCtx.name || userCtx.email,
      rating: Number(rating),
      comment,
    };

    try {
      // backend should return created review
      const createdReview = await createReview(api, reviewData);

      setMyReview(createdReview);

      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  return (
    <div className="mt-18">
      {/* Reviews section */}

      <div className="mb-10">
        <h4>Client reviews</h4>

        <p className="w-full flex items-center justify-center">
          Each reviewer has had at least 2 experiences with {providerName}
        </p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap">
        {mergedReviews.map((review) => (
          <ReviewCard
            key={review?._id || review?.id}
            review={review}
            className="w-full lg:basis-[calc(33.333%-1rem)] lg:grow-0"
          />
        ))}
      </div>

      <div className="flex justify-start m-4">
        <ReviewModal
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          disabled={!userCtx}
          onSubmit={handleSubmitReview}
        />
      </div>
    </div>
  );
};
