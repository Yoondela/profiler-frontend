import servicesCollage from '@/assets/images/create-account-services-collage-wide.png';

const TrustMark = ({ type }) => {
  const paths = {
    shield: (
      <>
        <path d="M12 3 5.5 6v5c0 4.2 2.8 8.1 6.5 10 3.7-1.9 6.5-5.8 6.5-10V6L12 3Z" />
        <path d="m9.3 12 1.8 1.8 3.8-4" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 7.5V12l3 2" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10.5c0 5.2-8 10-8 10s-8-4.8-8-10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10.5" r="2.5" />
      </>
    ),
  };

  return (
    <span className="create-account-marketing-panel__trust-icon">
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        {paths[type]}
      </svg>
    </span>
  );
};

export default function CreateAccountMarketingPanel() {
  return (
    <aside
      className="create-account-marketing-panel"
      aria-labelledby="exalt-panel-title"
    >
      <div className="create-account-marketing-panel__content">
        <p className="create-account-marketing-panel__brand">EXALT</p>
        <p className="create-account-marketing-panel__eyebrow">
          Trusted local professionals
        </p>
        <h2 id="exalt-panel-title">Local services, all in one place.</h2>
        <p className="create-account-marketing-panel__intro">
          Find reliable help for your home, vehicle, and every occasion — from
          routine care to memorable events.
        </p>

        <div className="create-account-marketing-panel__visual">
          <img
            src={servicesCollage}
            alt="Local professionals providing cleaning, gardening, vehicle care, and event photography."
          />
        </div>

        <ul className="create-account-marketing-panel__trust-list">
          <li>
            <TrustMark type="shield" />
            Verified professionals
          </li>
          <li>
            <TrustMark type="clock" />
            Flexible scheduling
          </li>
          <li>
            <TrustMark type="pin" />
            Discover services nearby
          </li>
        </ul>
      </div>
    </aside>
  );
}
