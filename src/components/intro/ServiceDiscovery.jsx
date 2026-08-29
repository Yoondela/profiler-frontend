import {
  BrushCleaning,
  Camera,
  CarFront,
  CookingPot,
  House,
  PartyPopper,
  Palette,
  Sparkles,
  Trees,
  Waves,
} from 'lucide-react';

const serviceGroups = [
  {
    title: 'Home & outdoor',
    services: [
      { name: 'Cleaning', Icon: BrushCleaning },
      { name: 'Gardening', Icon: Trees },
      { name: 'Pool cleaning', Icon: Waves },
      { name: 'Roof cleaning', Icon: House },
    ],
  },
  {
    title: 'Vehicle care',
    services: [{ name: 'Car wash', Icon: CarFront }],
  },
  {
    title: 'Events & lifestyle',
    services: [
      { name: 'Photography', Icon: Camera },
      { name: 'Makeup', Icon: Sparkles },
      { name: 'Décor', Icon: Palette },
      { name: 'Catering', Icon: CookingPot },
      { name: 'Celebrations', Icon: PartyPopper },
    ],
  },
];

export default function ServiceDiscovery() {
  return (
    <section className="service-discovery homepage-section" aria-labelledby="services-heading">
      <div className="homepage-section__inner">
        <div className="service-discovery__heading">
          <p className="homepage-eyebrow">Explore services</p>
          <h2 id="services-heading">Support for every part of life.</h2>
          <p>
            Discover local professionals for home care, vehicle care, and the
            moments worth celebrating.
          </p>
        </div>

        <div className="service-discovery__groups">
          {serviceGroups.map((group) => (
            <section key={group.title} className="service-group" aria-labelledby={`${group.title}-heading`}>
              <h3 id={`${group.title}-heading`}>{group.title}</h3>
              <ul className="service-group__list">
                {group.services.map(({ name, Icon }) => (
                  <li key={name} className="service-card">
                    <span className="service-card__icon" aria-hidden="true">
                      <Icon strokeWidth={1.8} />
                    </span>
                    <span>{name}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
