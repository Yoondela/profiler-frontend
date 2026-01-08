import { Link } from 'react-router-dom';
import { useState } from 'react';
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
import { CloudUpload } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PortfolioGallery from '@/components/sub/view/portfolio/PortfolioGallery';

const PublicPortfolio = ({ portfolio }) => {
  return (
    <div className="provider-overview-card">
      <Card className="portfolio-intro border-none shadow-none">
        <div className="flex flex-col md:flex-row md:items-start md:gap-6">
          <CardContent className="md:flex md:flex-wrap md:gap-3 md:max-w-[100%]">
            <div className="flex flex-col bits w-full">
              <div className="address flex items-center gap-2">
                <Map min={20} />
                <p>{portfolio.address.formatted}</p>
              </div>

              <div className="categories flex items-start gap-2">
                <BriefcaseBusiness size={20} />
                <ul className="m-0 p-0 list-none flex flex-wrap gap-1">
                  {portfolio.servicesOffered.map((items, index) => (
                    <li key={index}>{items}</li>
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

          {/* Skills */}
          <div className="section skills">
            <h3>Other Skills</h3>
            <div className="skill-list">
              {portfolio?.otherSkills?.length ? (
                portfolio.otherSkills.map((skill, i) => (
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
