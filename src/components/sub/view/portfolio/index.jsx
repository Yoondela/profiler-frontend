import PortfolioEditDialog from '@/components/sub/view/portfolio/PortfolioEditPopover';
import {
  Map,
  BriefcaseBusiness,
  CircleCheckBig,
  ChartNoAxesCombined,
  CalendarDays,
  Pencil,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import PortfolioGallery from '@/components/sub/view/portfolio/PortfolioGallery';
import { ReviewCard } from './ReviewCard';

const PortfolioDetailsContainer = ({ provider }) => {
  const portfolio = provider?.portfolio ?? provider;
  const company = provider?.company ?? portfolio?.company ?? null;
  const address = portfolio?.address ?? {};
  const servicesOffered = Array.isArray(portfolio?.servicesOffered)
    ? portfolio.servicesOffered
    : [];
  const otherSkills = Array.isArray(portfolio?.otherSkills)
    ? portfolio.otherSkills
    : [];
  const galleryPhotos = Array.isArray(portfolio?.galleryPhotos)
    ? portfolio.galleryPhotos
    : [];
  const reviews = Array.isArray(portfolio?.review)
    ? portfolio.review
    : Array.isArray(portfolio?.reviews)
      ? portfolio.reviews
      : [];

  const displayName =
    company?.name ||
    portfolio?.name ||
    portfolio?.user?.name ||
    provider?.user?.name ||
    'Unknown Provider';

  const bioText =
    portfolio?.about ||
    portfolio?.bio ||
    portfolio?.user?.profile?.bio ||
    provider?.user?.profile?.bio ||
    '';

  return (
    <div className="provider-overview-card">
      <Card className="portfolio-intro border-none shadow-none">
        <div className="flex flex-col md:flex-row md:items-start md:gap-6">
          <CardContent className="md:flex md:flex-wrap md:gap-3 md:max-w-[50%]">
            <div className="bits w-full flex">
              <div className="address flex items-center gap-2">
                <Map size={20} />
                <p>{address?.suburb}</p>
                <p>{address?.city}</p>
              </div>

              <div className="categories flex items-start gap-2">
                <BriefcaseBusiness size={20} />
                <ul className="m-0 p-0 list-none flex flex-wrap gap-1">
                  {servicesOffered.map((items, index) => (
                    <li key={index}>{items}</li>
                  ))}
                </ul>
              </div>

              <div className="completed-jobs flex items-center gap-2">
                <CircleCheckBig size={20} />
                <p>Completed jobs {portfolio?.completedJobs ?? 0}</p>
              </div>

              <div className="average-rating flex items-center gap-2">
                <ChartNoAxesCombined size={20} />
                <p>Average rating {portfolio?.rating ?? 0}</p>
              </div>

              <div className="became-provider flex items-center gap-2">
                <CalendarDays size={20} />
                <p>
                  Became provider in{' '}
                  {portfolio?.becameProviderAt
                    ? new Date(portfolio.becameProviderAt).toLocaleString(
                        'default',
                        {
                          month: 'long',
                          year: 'numeric',
                        }
                      )
                    : '—'}
                </p>
              </div>
            </div>
          </CardContent>

          {/* <CardContent className="md:flex-1">
            <div className="portfolio-for-user">
              <p className="font-bold">{displayName}</p>
              {bioText ? <p className="text-sm">{bioText}</p> : null}
            </div>
          </CardContent> */}
        </div>
      </Card>

      <div className="info">
        <div className="card-header">
          <h2>About</h2>
          <PortfolioEditDialog provider={portfolio} className="">
            <div className="edit-portfolio">
              <Pencil size={17} className="cursor-pointer" />
            </div>
          </PortfolioEditDialog>
        </div>

        <div className="card-body">
          {/* About */}
          <div className="section bio">
            <p>
              {portfolio?.about || portfolio?.bio || 'About section is empty.'}
            </p>
          </div>

          {/* Skills */}
          <div className="section skills">
            <h3>Other Skills</h3>
            <div className="skill-list">
              {otherSkills.length ? (
                otherSkills.map((skill, i) => (
                  <Badge
                    key={i}
                    size={22}
                    variant="secondary"
                    className="skill-badge"
                  >
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="muted">No skills added yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Featured Work */}
      <div className="section featured-work max-w-[100%]">
        <h4>Featured Work</h4>
        {galleryPhotos.length ? (
          <div className="work-gallery">
            <PortfolioGallery imageUrls={galleryPhotos.map((img) => img.url)} />
          </div>
        ) : (
          <div className="placeholder">
            <p>No featured work yet.</p>
          </div>
        )}
      </div>

      {/* Reviews */}
      <div className="section reviews max-w-[100%]">
        <h4>Client reviews</h4>
        {reviews.length ? (
          <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap">
            {reviews.map((review, idx) => (
              <ReviewCard
                key={review?._id || review?.id || idx}
                review={review}
                className="w-full lg:basis-[calc(33.333%-1rem)] lg:grow-0"
              />
            ))}
          </div>
        ) : (
          <div className="placeholder">
            <p>No reviews yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioDetailsContainer;
