import {
  Camera,
  CarFront,
  House,
  PartyPopper,
  Sparkles,
  Waves,
} from 'lucide-react';

const Intro = () => {
  return (
    <section className="intro-section">
      <div className="intro-content-wrapper">
        <div className="intro-content">
          <p className="intro-eyebrow">Trusted local professionals</p>
          <h1 className="title">Local services, all in one place.</h1>
          <div className="desc">
            <p>
              Find reliable help for your home, vehicle, and every occasion —
              from routine care to memorable events.
            </p>
          </div>
          <div className="intro-service-list" aria-label="Service groups">
            <span>Home care</span>
            <span>Vehicle care</span>
            <span>Events &amp; lifestyle</span>
          </div>
        </div>
        <div className="intro-visual" aria-hidden="true">
          <div className="intro-orb intro-orb--large"></div>
          <div className="intro-orb intro-orb--small"></div>
          <div className="intro-card intro-card--home">
            <House strokeWidth={1.8} />
          </div>
          <div className="intro-card intro-card--pool">
            <Waves strokeWidth={1.8} />
          </div>
          <div className="intro-card intro-card--car">
            <CarFront strokeWidth={1.8} />
          </div>
          <div className="intro-card intro-card--camera">
            <Camera strokeWidth={1.8} />
          </div>
          <div className="intro-card intro-card--event">
            <PartyPopper strokeWidth={1.8} />
          </div>
          <div className="intro-sparkle intro-sparkle--one">
            <Sparkles strokeWidth={1.6} />
          </div>
          <div className="intro-sparkle intro-sparkle--two">
            <Sparkles strokeWidth={1.6} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Intro;
