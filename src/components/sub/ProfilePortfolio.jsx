import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useUserContext } from '@/api/context/userContext';
import useProviderPortfolio from '@/hooks/useProviderPortfolio';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { NavLink } from 'react-router-dom';

export default function ProfilePortfolio() {
  const { user, isAuthenticated } = useAuth0();
  const { userAccountCtx, avatarUrlCtx } = useUserContext();
  const {
    portfolio,
    loading: portfolioLoading,
    error,
  } = useProviderPortfolio();

  // Nothing to show if user is not authenticated and there is no portfolio
  if (!isAuthenticated && !portfolio) return null;

  const account = userAccountCtx || null;
  const profile = account?.profile || null;
  const displayName = account?.user?.name || user?.name || 'User';
  const avatarSrc =
    avatarUrlCtx || profile?.avatarUrl || account?.profile?.avatarUrl || null;

  return (
    <section className="profile-portfolio-section mt-12 mb-8 max-w-4xl mx-auto px-4">
      {/* User profile card */}
      {account && (
        <div className="mb-6 bg-white rounded-md shadow-sm p-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              {avatarSrc ? (
                <AvatarImage src={avatarSrc} />
              ) : (
                <AvatarFallback>
                  {(displayName || 'U').slice(0, 2)}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{displayName}</h3>
              <p className="text-sm text-muted-foreground">
                {profile?.bio || 'No bio provided.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Company portfolio card */}
      {portfolioLoading && <div className="p-4">Loading portfolio...</div>}
      {error && (
        <div className="p-4 text-red-500">Error loading portfolio.</div>
      )}
      {portfolio && (
        <NavLink to="/provider-page">
          <div className="flex items-center gap-4 bg-white rounded-md shadow-sm p-4">
            <div className="h-20 w-20 flex-shrink-0">
              <img
                src={portfolio.logoUrl}
                alt={`${portfolio.company} logo`}
                className="h-20 w-20 object-cover rounded"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">{portfolio.company}</h4>
              <p className="text-sm text-muted-foreground">
                {portfolio.tagline ||
                  portfolio.description ||
                  'No description.'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                {portfolio.rating
                  ? `Rating: ${portfolio.rating.toFixed(1)}`
                  : 'No rating'}
              </div>
            </div>
          </div>
        </NavLink>
      )}
    </section>
  );
}
