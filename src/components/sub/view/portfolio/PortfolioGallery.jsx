import React from 'react';

const PortfolioGallery = ({ imageUrls }) => {
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
