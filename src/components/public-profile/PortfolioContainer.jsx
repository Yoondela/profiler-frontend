// import { useParams } from 'react-router-dom';
// import { fetchPublicPage } from '@/api/lookup/publicPageApi';
// import { useEffect, useState } from 'react';
// import PublicPortfolio from './PublicPortfolio';
// import PortfolioHeader from '../sub/view/portfolio/PortfolioHeader';

// export default function PortfolioContainer(
//     bannerUrl,
//     logoUrl,
//     providerName,
//     averageRating,
//     reviewCount,
//     portfolio
// ) {

//   useEffect(() => {
//     if (!portfolio) {
//       return <div className="p-4">Loading…</div>;
//     }
//   }, [portfolio]);

//     return (
//         <div className="portfolio-container">
//             <PortfolioHeader
//                 bannerUrl={bannerUrl}
//                 logoUrl={logoUrl}
//                 providerName={providerName}
//                 averageRating={averageRating}
//                 reviewCount={reviewCount}
//             />
//             <PublicPortfolio
//                 portfolio={portfolio}
//             />
//         </div>
//     );
// }
