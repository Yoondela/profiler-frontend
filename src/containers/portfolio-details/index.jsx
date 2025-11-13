import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Image } from 'lucide-react';

const PortfolioDetailsContainer = ({ provider }) => {
  
  
  
  return (
    <div className="provider-overview-card">
      <div className="card-header">
        <h2>About</h2>
      </div>

      <div className="card-body">
        {/* Bio */}
        <div className="section bio">
          <p>{provider?.bio || "This provider hasn’t added a bio yet."}</p>
        </div>

        {/* Skills */}
        <div className="section skills">
          <h3>Skills & Services</h3>
          <div className="skill-list">
            {provider?.skills?.length ? (
              provider.skills.map((skill, i) => (
                <Badge key={i} variant="secondary" className="skill-badge">
                  {skill}
                </Badge>
              ))
            ) : (
              <p className="muted">No skills added yet.</p>
            )}
          </div>
        </div>

        {/* Featured Work */}
        <div className="section featured-work">
          <h3>Featured Work</h3>
          {provider?.featuredWork?.length ? (
            <div className="work-gallery">
              {provider.featuredWork.map((work, i) => (
                <div key={i} className="work-item">
                  <img src={work.image} alt={work.title} />
                  <div className="overlay">
                    <span>{work.title}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="placeholder">
              <Image size={24} />
              <p>No featured work yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioDetailsContainer;
