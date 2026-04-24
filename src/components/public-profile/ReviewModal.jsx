import { useEffect, useMemo, useState } from 'react';
import { Star } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

function StarPicker({ value, onChange, max = 5 }) {
  const [hover, setHover] = useState(null);
  const displayValue = hover ?? value ?? 0;

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1;
        const filled = displayValue >= starValue;
        return (
          <button
            key={starValue}
            type="button"
            className="p-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
            aria-label={`${starValue} star`}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onChange(starValue)}
          >
            <Star
              size={22}
              className={
                filled ? 'fill-slate-500 text-slate-500' : 'text-zinc-200'
              }
            />
          </button>
        );
      })}
      <span className="ml-2 text-xs text-muted-foreground">
        {value ? 'Rating selected' : 'Select a rating'}
      </span>
    </div>
  );
}

export function ReviewModal({
  open,
  onOpenChange,
  onSubmit,
  disabled = false,
  triggerLabel = 'Add Review',
  title = 'Add a Review',
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const canSubmit = useMemo(
    () => rating >= 1 && comment.trim().length > 0,
    [rating, comment]
  );

  useEffect(() => {
    if (!open) {
      setRating(0);
      setComment('');
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (disabled || !canSubmit) return;
    await onSubmit({ rating, comment: comment.trim() });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="underline cursor-pointer hover:font-bold"
          disabled={disabled}
        >
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[white]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Rating</label>
            <StarPicker value={rating} onChange={setRating} />
          </div>

          <div>
            <label
              htmlFor="review-comment"
              className="block text-sm font-medium mb-2"
            >
              Comment
            </label>
            <Textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              required
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={disabled || !canSubmit}>
              Submit Review
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
