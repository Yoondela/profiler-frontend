import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import PortfolioEditDialog from '@/components/sub/view/portfolio/PortfolioEditPopover';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import {
  Map,
  BriefcaseBusiness,
  CircleCheckBig,
  ChartNoAxesCombined,
  CalendarDays,
  ChevronDown,
  Pencil,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CloudUpload } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PortfolioGallery from '@/components/sub/view/portfolio/PortfolioGallery';
import PublicActiveWorkers from './PublicActiveWorkers';
import { fetchGalleryImages } from '@/api/sync/SyncGallery';
import PublicOfficeHoursDisplay from './PublicOfficeHours';

function BadgeVariants() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
    </div>
  );
}

const PublicPortfolio = ({ data, availability }) => {
  console.log('data inside', data);

  const [isMiniCalendarOpen, setIsMiniCalendarOpen] = useState(false);

  const portfolio = data.provider;
  let company;
  if (data.company) {
    company = data.company;
  }

  console.log('_______', portfolio.workingHours);

  console.log(portfolio);
  return (
    <div className="provider-overview-card">
      <Card className="portfolio-intro border-none shadow-none bg-blue-50">
        <div className="flex flex-col md:flex-row md:items-start md:gap-6">
          <CardContent className="w-full md:flex md:flex-wrap md:gap-3 md:max-w-[100%]">
            <div className="flex flex-col bits w-full">
              <div className="address flex items-center gap-2">
                <Map min={20} />
                <p>{portfolio.address.suburb}</p>
                <p>{portfolio.address.city}</p>
              </div>

              <div className="categories flex items-start gap-2">
                <BriefcaseBusiness size={20} />
                <ul className="m-0 p-0 list-none flex flex-wrap gap-1">
                  {portfolio.servicesOffered.map((item, index) => (
                    <li key={index} className="flex items-center">
                      {index > 0 ? (
                        <span className="mr-1 text-xl" aria-hidden="true">
                          •
                        </span>
                      ) : null}
                      <span>{item?.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="completed-jobs flex items-center gap-2">
                <CircleCheckBig size={20} />
                <p>Completed jobs {portfolio.completedJobs}</p>
              </div>

              <div className="average-rating flex items-center gap-2">
                <ChartNoAxesCombined size={20} />
                <p>Average rating {portfolio.rating}</p>
              </div>

              <div className="became-provider flex items-center gap-2">
                <CalendarDays size={20} />
                <p>
                  Became provider in{' '}
                  {new Date(portfolio.becameProviderAt).toLocaleString(
                    'default',
                    {
                      month: 'long',
                      year: 'numeric',
                    }
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      <div className="info">
        <div className="card-header">
          <h2>About</h2>
        </div>

        <div className="card-body">
          {/* About */}
          <div className="section bio">
            <p>{portfolio?.about || 'About section is empty.'}</p>
          </div>

          {/* Workers */}
          {company && (
            <div>
              <PublicActiveWorkers members={company?.members} />
            </div>
          )}

          {/* Working Hours */}
          <div className="pb-12">
            <Collapsible
              defaultOpen={portfolio?.workingHours}
              open={isMiniCalendarOpen}
              onOpenChange={setIsMiniCalendarOpen}
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg px-2 py-3 text-left text-sm font-semibold text-slate-900 cursor-pointer transition hover:bg-slate-100">
                <span>Office hours</span>
                <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <div className="flex items-center justify-between rounded-md border px-4 py-2 text-sm">
                <span className="text-muted-foreground">
                  {availability?.day}
                </span>
                <span className="font-medium">{availability?.time}</span>
              </div>
              <CollapsibleContent className="mt-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <PublicOfficeHoursDisplay
                  workingHours={portfolio?.workingHours}
                />
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Skills */}
          <div className="section skills">
            <h3>Other Skills</h3>
            <div className="skill-list">
              {portfolio?.otherSkills?.length ? (
                portfolio.otherSkills.map((skill, i) => (
                  <Badge
                    key={i}
                    size={'lg'}
                    variant="outline"
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
        {portfolio?.galleryPhotos?.length ? (
          <div className="work-gallery">
            <PortfolioGallery
              imageUrls={portfolio.galleryPhotos.map((img) => img.url)}
            />
          </div>
        ) : (
          <div className="placeholder">
            <p>No featured work yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicPortfolio;
