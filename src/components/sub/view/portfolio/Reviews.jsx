import { useEffect, useState } from 'react';
import { getReviews, createReview } from '@/api/sync/syncReviews';
import { useApiClient } from '@/api/useApiClient';
import { useUserContext } from '@/api/context/userContext';
import { ReviewCard } from './ReviewCard';
import { ReviewModal } from './ReviewModal';

export const Reviews = ({ providerId }) => {
  const [reviews, setReviews] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { userCtx } = useUserContext();
  const resolvedProviderId = providerId;
  const api = useApiClient();

  useEffect(() => {
    if (!resolvedProviderId) return;

    async function loadReviews() {
      const data = await getReviews(api, resolvedProviderId);
      const normalized = Array.isArray(data) ? data : data?.reviews || [];
      setReviews(normalized);
    }
    loadReviews();
  }, [api, resolvedProviderId]);

  const handleSubmitReview = async ({ rating, comment }) => {
    if (!userCtx || !rating || !comment) return;

    const reviewData = {
      providerId: resolvedProviderId,
      reviewerName: userCtx.name || userCtx.email, // assuming userCtx has name or email
      rating: Number(rating),
      comment,
    };

    try {
      await createReview(api, reviewData);
      // Reload reviews
      const data = await getReviews(api, resolvedProviderId);
      const normalized = Array.isArray(data) ? data : data?.reviews || [];
      setReviews(normalized);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error adding review:', error);
      // TODO: show error message
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <ReviewModal
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          disabled={!userCtx}
          onSubmit={handleSubmitReview}
        />
      </div>
      <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap">
        {reviews.map((review) => (
          <ReviewCard
            key={review?._id || review?.id}
            review={review}
            className="w-full lg:basis-[calc(33.333%-1rem)] lg:grow-0"
          />
        ))}
      </div>
    </div>
  );
};
