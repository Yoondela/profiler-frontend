import { fetchPublicPage } from '@/api/lookup/publicPageApi';
import { useNavigate } from 'react-router-dom';

export async function getPublicPage(providerId) {
  const navigate = useNavigate();
  try {
    const providerInfo = await fetchPublicPage(providerId);
    if (providerInfo) {
      navigate(`/providers/${providerId}/public`);
    }
  } catch (err) {
    console.error('Public page error:', err);
  }
}