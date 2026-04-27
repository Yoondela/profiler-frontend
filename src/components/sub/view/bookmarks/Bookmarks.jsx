import { getBookmarks, removeBookmark } from '@/api/sync/syncBookmarks';
import { useApiClient } from '@/api/useApiClient';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

function normalizeBookmark(item) {
  const provider = item?.provider || item?.Provider || item;
  const providerId = provider?.providerId;
  const ownerId = provider?.owner;
  const providerName =
    provider?.name || provider?.company?.name || provider?.user?.name || 'Unknown Provider';
  const primaryImage =
    provider?.primaryImage ||
    provider?.logoUrl ||
    provider?.bannerUrl ||
    provider?.image ||
    provider?.images?.[0]?.url ||
    provider?.images?.[0];
  const about = provider?.about || provider?.bio || provider?.description || '';

  return {
    raw: item,
    provider,
    providerId,
    ownerId,
    providerName,
    primaryImage,
    about,
  };
}

function extractBookmarks(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.bookmarks)) return data.bookmarks;
  if (Array.isArray(data?.saved)) return data.saved;
  if (Array.isArray(data?.providers)) return data.providers;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export default function Bookmarks() {
  const api = useApiClient();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const res = await getBookmarks(api);
        const list = extractBookmarks(res).map(normalizeBookmark);
        if (!cancelled) setBookmarks(list);
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Failed to load bookmarks');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [api]);

  const handleOpenProvider = (ownerId) => {
    console.log('Opening provider', ownerId);
    if (!ownerId) return;
    navigate(`/providers/${ownerId}/public`);
  };

  const handleRemove = async (providerId) => {
    if (!providerId) return;
    setRemovingId(providerId);
    setError('');
    try {
      await removeBookmark(api, providerId);
      setBookmarks((prev) => prev.filter((b) => b.providerId !== providerId));
    } catch (err) {
      setError(err?.message || 'Failed to remove bookmark');
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="w-full px-4 md:px-8 py-6">
      <div className="text-lg font-semibold text-foreground">Bookmarks</div>
      <div className="h-4" />

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : error ? (
        <div className="text-sm text-destructive">{error}</div>
      ) : bookmarks.length === 0 ? (
        <div className="text-sm text-muted-foreground">No bookmarks.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {bookmarks.map((b) => (
            <Card key={b.providerId || b.providerName} className="py-0 border-none shadow-none">
              <div className="flex gap-4 p-4">
                <button
                  type="button"
                  onClick={() => handleOpenProvider(b.ownerId)}
                  className="flex flex-1 gap-4 text-left"
                >
                  <div className="h-40 w-40 shrink-0 overflow-hidden rounded-md bg-muted">
                    {b.primaryImage ? (
                      <img
                        src={b.primaryImage}
                        alt={b.providerName}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="h-full w-full grid place-items-center text-xs text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="truncate text-base font-semibold text-foreground">
                        {b.providerName}
                      </div>
                      {b.providerId ? (
                        <div className="shrink-0 text-xs text-muted-foreground">
                          {b.targetType}
                        </div>
                      ) : null}
                    </div>
                    {b.about ? (
                      <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {b.about}
                      </div>
                    ) : (
                      <div className="mt-1 text-sm text-muted-foreground">
                        No description.
                      </div>
                    )}
                  </div>
                </button>

                <div className="shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(b.providerId)}
                    disabled={!b.providerId || removingId === b.providerId}
                    title="Remove bookmark"
                    aria-label="Remove bookmark"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
