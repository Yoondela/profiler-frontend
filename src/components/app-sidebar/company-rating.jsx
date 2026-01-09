import { Star } from 'lucide-react';

export default function CompanyRating({ averageRating, reviewCount }) {
  return (
    <div>
      {averageRating && (
        <div className="flex hidden md:flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="w-3 h-3 fill-current text-gray-400" />
          <span>{averageRating.toFixed(1)}</span>
          {reviewCount && <span>({reviewCount})</span>}
        </div>
      )}
    </div>
  );
}
