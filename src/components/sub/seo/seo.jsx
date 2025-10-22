import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title,
  description,
  keywords,
  image,
  url,
  robots = 'index, follow',
  type = 'website',
}) => {
  const defaultTitle =
    'HomeEase – Reliable Home Cleaning, Pool, Gardening & Babysitting Services';
  const defaultDescription =
    'HomeEase provides professional house cleaning, pool maintenance, gardening, and babysitting services you can trust. Keep your home spotless and stress-free with our experienced team.';
  const defaultKeywords =
    'home cleaning, pool cleaning, gardening, babysitting, home services, domestic help, house maintenance, cleaning company';
  const defaultImage = 'https://example.com/assets/homeease-preview.jpg';

  return (
    <Helmet>
      {/* Basic Meta */}
      <title>{title ? `${title} | HomeEase` : defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      <meta name="robots" content={robots} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />

      {/* Open Graph (Facebook, LinkedIn, WhatsApp) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title || defaultTitle} />
      <meta
        property="og:description"
        content={description || defaultDescription}
      />
      <meta property="og:image" content={image || defaultImage} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:site_name" content="HomeEase" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || defaultTitle} />
      <meta
        name="twitter:description"
        content={description || defaultDescription}
      />
      <meta name="twitter:image" content={image || defaultImage} />
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  robots: PropTypes.string,
  type: PropTypes.string,
};

export default SEO;
