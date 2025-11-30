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

const PortfolioDetailsContainer = ({ provider }) => {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div className="provider-overview-card">
      <Card className="portfolio-intro border-none shadow-none">
        <div className="flex flex-col md:flex-row md:items-start md:gap-6">
          <CardContent className="md:flex md:flex-wrap md:gap-3 md:max-w-[50%]">
            <div className="bits w-full">
              <div className="address flex items-center gap-2">
                <Map size={20} />
                <p>{provider.address}</p>
              </div>

              <div className="categories flex items-start gap-2">
                <BriefcaseBusiness size={20} />
                <ul className="m-0 p-0 list-none flex flex-wrap gap-1">
                  {provider.servicesOffered.map((items, index) => (
                    <li key={index}>{items}</li>
                  ))}
                </ul>
              </div>

              <div className="completed-jobs flex items-center gap-2">
                <CircleCheckBig size={20} />
                <p>Completed jobs {provider.completedJobs}</p>
              </div>

              <div className="average-rating flex items-center gap-2">
                <ChartNoAxesCombined size={20} />
                <p>Average rating {provider.rating}</p>
              </div>

              <div className="became-provider flex items-center gap-2">
                <CalendarDays size={20} />
                <p>
                  Became provider in{' '}
                  {new Date(provider.becameProviderAt).toLocaleString(
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

          <CardContent className="md:flex-1">
            <div className="portfolio-for-user">
              <p className="font-bold">{provider.user.name}</p>
              <p className="text-sm">{provider.user.profile.bio}</p>
            </div>
          </CardContent>
        </div>
      </Card>

      <div className="info">
        <div className="card-header">
          <h2>About</h2>
          <PortfolioEditDialog provider={provider} className="">
            <div className="edit-portfolio">
              <Pencil size={17} className="cursor-pointer" />
            </div>
          </PortfolioEditDialog>
        </div>

        <div className="card-body">
          {/* About */}
          <div className="section bio">
            <p>{provider?.bio || 'About section is empty.'}</p>
          </div>

          {/* Skills */}
          <div className="section skills">
            <h3>Other Skills</h3>
            <div className="skill-list">
              {provider?.otherSkills?.length ? (
                provider.otherSkills.map((skill, i) => (
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
        {provider?.galleryPhotosUrls?.length ? (
          <div className="work-gallery">
            <PortfolioGallery
              imageUrls={provider.galleryPhotos.map((img) => img.url)}
            />
          </div>
        ) : (
          <div className="placeholder">
            <p>No featured work yet.</p>
          </div>
        )}
      </div>
      <div className="cta-section">
        <div className="border-t border-gray-300 w-[90%] mt-12 mb-11"></div>
        <p>is Available</p>
        <Button variant="outline">Book</Button>
      </div>
    </div>
  );
};

export default PortfolioDetailsContainer;
