import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTimeAgo } from '@/utils/formatTimeAgo';

function getInitials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase() || '?';
}

function formatReviewDate(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(date);
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
              filled ? 'fill-slate-400 text-slate-400' : 'text-zinc-200'
            }
          />
        );
      })}
    </div>
  );
}

export function ReviewCard({ review, className }) {
  const reviewerName =
    review?.reviewer?.name || review?.reviewerName || 'Anonymous';
  const reviewerAvatar =
    review?.reviewer?.avatarUrl || review?.reviewerAvatarUrl || '';
  const createdAt = review?.createdAt || review?.updatedAt || '';
  const dateLabel = formatTimeAgo(createdAt);

  // todo: make this as modern as it can be
  return (
    <Card className={cn('border-none shadow-md', className)}>
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
            <div className="flex flex-col justify-between gap-1 w-full">
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
  );
}
