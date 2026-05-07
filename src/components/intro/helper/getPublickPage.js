// import { fetchPublicPage } from '@/api/lookup/publicPageApi';
// import { useNavigate } from 'react-router-dom';
// import { useApiClient } from '@/api/useApiClient';

// export async function getPublicPage(providerId) {
//   const api = useApiClient();
//   const navigate = useNavigate();
//   try {
//     const providerInfo = await fetchPublicPage(api, providerId);
//     if (providerInfo) {
//       navigate(`/providers/${providerId}/public`);
//     }
//   } catch (err) {
//     console.error('Public page error:', err);
//   }
// }
