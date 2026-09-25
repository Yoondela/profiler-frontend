import { MapPin, Star } from 'lucide-react';

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
          <div className="intro-map">
            <svg
              className="intro-map__roads"
              viewBox="0 0 500 500"
              focusable="false"
            >
              <path d="M-18 96C92 44 126 153 224 112s96-94 184-37 100 20 128 2" />
              <path d="M34 456c28-126 108-101 154-175s4-99 92-154 151 15 240-77" />
              <path d="M90-10c23 84 115 72 134 139s-33 95 36 142 148 4 233 74" />
              <path d="M-12 321c84-50 129-3 180-29s33-98 107-94 83 72 204 57" />
              <path d="M342-8c-31 93 41 123 17 203s-95 84-84 179 89 85 134 142" />
            </svg>
            <span className="intro-map__block intro-map__block--one" />
            <span className="intro-map__block intro-map__block--two" />
            <span className="intro-map__block intro-map__block--three" />
            <span className="intro-map__block intro-map__block--four" />
            <span className="intro-map__area">Near you</span>

            <span className="intro-map-pin intro-map-pin--one">
              <MapPin />
            </span>
            <span className="intro-map-pin intro-map-pin--two">
              <MapPin />
            </span>
            <span className="intro-map-pin intro-map-pin--three">
              <MapPin />
            </span>
            <span className="intro-map-pin intro-map-pin--four">
              <MapPin />
            </span>

            <div className="intro-provider-card intro-provider-card--one">
              <span className="intro-provider-card__avatar">BC</span>
              <span>
                <strong>Bright Cleaning</strong>
                <small>Woodstock · 1.2 km</small>
                <em>
                  <Star fill="currentColor" /> 4.9
                </em>
              </span>
            </div>
            <div className="intro-provider-card intro-provider-card--two">
              <span className="intro-provider-card__avatar intro-provider-card__avatar--green">
                GS
              </span>
              <span>
                <strong>Garden Studio</strong>
                <small>Observatory · 2.4 km</small>
                <em>
                  <Star fill="currentColor" /> 4.8
                </em>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Intro;
