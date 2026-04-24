import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTimeAgo } from '@/utils/formatTimeAgo';
import { BookmarkIcon } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';

function getInitials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase() || '?';
}

function Stars({ rating = 0, max = 5, size = 16 }) {
  const safeRating = Math.max(0, Math.min(max, Number(rating) || 0));
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${safeRating} out of ${max} stars`}
    >
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1;
        const filled = safeRating >= starValue;
        return (
          <Star
            key={starValue}
            size={size}
            className={
              filled ? 'fill-amber-200 text-amber-200' : 'text-zinc-200'
            }
          />
        );
      })}
    </div>
  );
}

import { useState } from 'react';
import axios from 'axios';

export function ToggleIsFeatured({ review }) {
  const [isFeatured, setIsFeatured] = useState(review.isFeatured);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (loading) return;

    const next = !isFeatured;

    // 🔥 optimistic update
    setIsFeatured(next);
    setLoading(true);

    try {
      await axios.patch(`/api/reviews/provider/${review._id}/feature`, {
        isFeatured: next,
      });
    } catch (err) {
      // ❌ revert if failed
      setIsFeatured(!next);
      console.error(err);
      if (err.response?.status === 400) {
        alert('Maximum of 3 featured reviews allowed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Toggle
      pressed={isFeatured}
      onPressedChange={handleToggle}
      disabled={loading}
      aria-label="Toggle featured"
      size="sm"
      variant="accent"
    >
      <BookmarkIcon
        className={cn('transition', isFeatured && 'fill-foreground')}
      />
      Feature
    </Toggle>
  );
}

export function ReviewCard({ review, className }) {
  const reviewerName =
    review?.reviewer?.name || review?.reviewerName || 'Anonymous';
  const reviewerAvatar =
    review?.reviewer?.avatarUrl || review?.reviewerAvatarUrl || '';
  const createdAt = review?.createdAt || review?.updatedAt || '';
  const dateLabel = formatTimeAgo(createdAt);

  return (
    <div className={cn('relative', className)}>
      <div className="absolute -top-4 right-4 z-10">
        <ToggleIsFeatured review={review} />
      </div>
      <Card className="w-full border-none shadow-md">
        <CardContent className="p-4">
          <div className="grid grid-cols-[40px_1fr] gap-x-3">
            <div className="row-span-2">
              <Avatar className="size-10">
                <AvatarImage src={reviewerAvatar} alt={reviewerName} />
                <AvatarFallback className="text-xs">
                  {getInitials(reviewerName)}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex items-start justify-between gap-3 min-w-0">
              <div className="w-full">
                <div className="flex justify-between">
                  <p className="font-semibold text-sm text-zinc-900 truncate">
                    {reviewerName}
                  </p>
                  {dateLabel ? (
                    <span className="text-xs text-muted-foreground">
                      {dateLabel}
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center gap-2">
                  <Stars rating={review?.rating} />
                </div>
              </div>

              {review?.isFeatured ? (
                <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                  Featured
                </span>
              ) : null}
            </div>

            {review?.comment ? (
              <p className="col-start-2 mt-3 text-sm leading-relaxed text-zinc-700 whitespace-pre-wrap">
                {review.comment}
              </p>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
