import React from 'react';

const PortfolioGallery = ({ imageUrls }) => {
  const images = [
    'public/gallery/annie-spratt-b4FxHY6h3cw-unsplash.jpg',
    'public/gallery/caroline-badran-0pgXqbEDyuY-unsplash.jpg',
    'public/gallery/chris-kursikowski-Js1SSug0Dpg-unsplash.jpg',
    'public/gallery/dmitry-spravko-B8dz9ewLqlM-unsplash.jpg',
    'public/gallery/eduard-pretsi-Tz90_upO5L0-unsplash.jpg',
    'public/gallery/josh-hild-npjYvz_s1QM-unsplash.jpg',
    'public/gallery/land-o-lakes-inc-SLgCDEqHav4-unsplash.jpg',
    'public/gallery/pascal-debrunner-VcegyWGqIHE-unsplash.jpg',
    'public/gallery/sergio-zhukov-AEev3Zh5V6k-unsplash.jpg',
  ];

  console.log("we're in masonry");
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 py-5 lg:py-8 gap-4">
      {imageUrls.map((src, index) => (
        <div key={index} className="mb-4 break-inside-avoid">
          <img src={src} className="w-full object-cover rounded-md" />
        </div>
      ))}
    </div>
  );
};

export default PortfolioGallery;
