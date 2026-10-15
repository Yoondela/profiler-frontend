import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getUserID } from '@/api/sync/SyncUser';

const emptyDetails = {
  about: '',
  otherSkills: '',
};

export default function PortfolioDetailsEditor() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [details, setDetails] = useState(emptyDetails);
  const [servicesOffered, setServicesOffered] = useState([]);
  const [newService, setNewService] = useState('');
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.email) return undefined;

    let active = true;
    const loadPortfolio = async () => {
      try {
        setStatus('loading');
        setError(null);
        const userId = await getUserID(getAccessTokenSilently, user.email);
        const token = await getAccessTokenSilently();
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/portfolios/${userId}/edits`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!active) return;

        setDetails({
          about: response.data.about || response.data.bio || '',
          otherSkills: (response.data.otherSkills || []).join(', '),
        });
        setServicesOffered(
          (response.data.servicesOffered || [])
            .filter(Boolean)
            .map((service) => service.name)
        );
        setStatus('ready');
      } catch (requestError) {
        if (!active) return;
        setError('Unable to load Portfolio details.');
        setStatus('error');
      }
    };

    loadPortfolio();
    return () => {
      active = false;
    };
  }, [getAccessTokenSilently, user?.email]);

  const updateField = (field) => (event) => {
    setDetails((current) => ({ ...current, [field]: event.target.value }));
  };

  const addService = () => {
    const serviceName = newService.trim();
    if (!serviceName || servicesOffered.includes(serviceName)) return;

    setServicesOffered((current) => [...current, serviceName]);
    setNewService('');
  };

  const removeService = (serviceName) => {
    setServicesOffered((current) =>
      current.filter((service) => service !== serviceName)
    );
  };

  const savePortfolioDetails = async (event) => {
    event.preventDefault();
    if (!user?.email) return;

    try {
      setStatus('saving');
      const userId = await getUserID(getAccessTokenSilently, user.email);
      const token = await getAccessTokenSilently();
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/portfolios/${userId}`,
        {
          about: details.about,
          otherSkills: details.otherSkills
            .split(',')
            .map((skill) => skill.trim())
            .filter(Boolean),
          servicesOffered,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus('ready');
      toast.success('Portfolio details updated.');
    } catch (requestError) {
      setStatus('ready');
      toast.error(
        requestError.response?.data?.message ||
          'Unable to update Portfolio details.'
      );
    }
  };

  if (!user?.email) return null;

  if (status === 'loading') {
    return (
      <p className="p-6 text-sm text-gray-500">Loading Portfolio details…</p>
    );
  }

  if (status === 'error') {
    return <p className="p-6 text-sm text-red-600">{error}</p>;
  }

  return (
    <section className="mx-auto max-w-2xl p-6">
      <h2 className="text-xl font-semibold text-gray-900">Portfolio</h2>
      <p className="mt-1 text-sm text-gray-500">
        These fields update your individual Portfolio, not your Company listing.
      </p>

      <form className="mt-6 space-y-4" onSubmit={savePortfolioDetails}>
        <label className="block text-sm font-medium text-gray-700">
          About
          <Textarea
            className="mt-1"
            value={details.about}
            onChange={updateField('about')}
          />
        </label>
        <div className="block text-sm font-medium text-gray-700">
          <label htmlFor="portfolio-services">Services offered</label>
          <div className="mt-1 flex gap-2">
            <Input
              id="portfolio-services"
              value={newService}
              onChange={(event) => setNewService(event.target.value)}
              placeholder="Add a service"
            />
            <Button type="button" onClick={addService}>
              Add
            </Button>
          </div>
          {servicesOffered.length > 0 ? (
            <ul className="mt-2 flex flex-wrap gap-2 text-sm font-normal">
              {servicesOffered.map((service) => (
                <li
                  className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-slate-800"
                  key={service}
                >
                  {service}
                  <button
                    aria-label={`Remove ${service}`}
                    className="font-semibold text-slate-600 hover:text-slate-900"
                    type="button"
                    onClick={() => removeService(service)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-xs font-normal text-gray-500">
              Add services that you personally offer.
            </p>
          )}
        </div>
        <label className="block text-sm font-medium text-gray-700">
          Other skills
          <Input
            className="mt-1"
            value={details.otherSkills}
            onChange={updateField('otherSkills')}
            placeholder="e.g. Landscaping, irrigation"
          />
        </label>
        <Button type="submit" disabled={status === 'saving'}>
          {status === 'saving' ? 'Saving…' : 'Save Portfolio details'}
        </Button>
      </form>
    </section>
  );
}
