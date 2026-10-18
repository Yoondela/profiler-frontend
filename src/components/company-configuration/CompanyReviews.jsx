import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ReviewCard } from '@/components/public-profile/ReviewCard';
import {
  fetchCompanyReviews,
  updateCompanyReviewFeature,
} from '@/api/sync/syncReviews';

const MAX_FEATURED_REVIEWS = 3;

export default function CompanyReviews() {
  const { getAccessTokenSilently } = useAuth0();
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState('loading');
  const [updatingReviewId, setUpdatingReviewId] = useState(null);

  useEffect(() => {
    let active = true;

    const loadReviews = async () => {
      try {
        setStatus('loading');
        const token = await getAccessTokenSilently({
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        });
        const data = await fetchCompanyReviews(token);
        if (!active) return;
        setReviews(data.reviews || []);
        setStatus('ready');
      } catch (error) {
        if (!active) return;
        console.error('Failed to load company reviews', error);
        setStatus('error');
      }
    };

    loadReviews();
    return () => {
      active = false;
    };
  }, [getAccessTokenSilently]);

  const toggleFeatured = async (review) => {
    try {
      setUpdatingReviewId(review._id);
      const token = await getAccessTokenSilently({
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      });
      const data = await updateCompanyReviewFeature(
        review._id,
        !review.isFeatured,
        token
      );
      setReviews((current) =>
        current.map((item) =>
          item._id === data.review._id ? data.review : item
        )
      );
    } catch (error) {
      console.error('Failed to update featured company review', error);
      toast.error(
        error.response?.data?.message || 'Unable to update the featured review.'
      );
    } finally {
      setUpdatingReviewId(null);
    }
  };

  if (status === 'loading') {
    return <p className="p-6 text-sm text-gray-500">Loading reviews…</p>;
  }

  if (status === 'error') {
    return (
      <p className="p-6 text-sm text-red-600">
        Unable to load Company reviews.
      </p>
    );
  }

  return (
    <section className="mx-auto max-w-5xl p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Reviews</h2>
        <p className="mt-1 text-sm text-gray-500">
          Choose up to {MAX_FEATURED_REVIEWS} Company reviews to feature on the
          public page.
        </p>
      </div>

      {reviews.length === 0 ? (
        <p className="rounded-lg border border-dashed p-6 text-sm text-gray-500">
          No Company reviews yet.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-1">
          {reviews.map((review) => {
            const isUpdating = updatingReviewId === review._id;

            return (
              <div key={review._id} className="space-y-2">
                <ReviewCard review={review} />
                <Button
                  type="button"
                  variant={review.isFeatured ? 'secondary' : 'outline'}
                  size="sm"
                  disabled={isUpdating}
                  onClick={() => toggleFeatured(review)}
                >
                  <Star
                    className={
                      review.isFeatured ? 'fill-yellow-400 text-yellow-400' : ''
                    }
                  />
                  {review.isFeatured ? 'Featured' : 'Feature on public page'}
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
