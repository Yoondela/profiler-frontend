import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { Autocomplete } from '@react-google-maps/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { usePortfolioContext } from '@/api/context/portfolioContext';

const emptyDetails = {
  name: '',
  about: '',
  email: '',
  phone: '',
  otherSkills: '',
};

export default function CompanyDetailsEditor() {
  const { portfolioDataCtx } = usePortfolioContext();
  const { getAccessTokenSilently } = useAuth0();
  const [details, setDetails] = useState(emptyDetails);
  const [addressText, setAddressText] = useState('');
  const [savedAddressText, setSavedAddressText] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [servicesOffered, setServicesOffered] = useState([]);
  const [serviceSearch, setServiceSearch] = useState('');
  const [serviceSuggestions, setServiceSuggestions] = useState([]);
  const [serviceSearchError, setServiceSearchError] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const addressInputRef = useRef(null);

  const companyId =
    portfolioDataCtx?.portfolio?.type === 'company'
      ? portfolioDataCtx.portfolio.id
      : null;

  useEffect(() => {
    if (!companyId) return;

    let active = true;
    const loadCompany = async () => {
      try {
        setStatus('loading');
        setError(null);
        const token = await getAccessTokenSilently();
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/company/${companyId}/edits`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!active) return;

        setDetails({
          name: response.data.name || '',
          about: response.data.about || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          otherSkills: (response.data.otherSkills || []).join(', '),
        });
        const loadedAddress = response.data.address?.formatted || '';
        setAddressText(loadedAddress);
        setSavedAddressText(loadedAddress);
        setServicesOffered(
          (response.data.servicesOffered || [])
            .filter(Boolean)
            .map((service) => ({
              id: service._id,
              name: service.name,
            }))
        );
        setStatus('ready');
      } catch (requestError) {
        if (!active) return;
        setError('Unable to load company details.');
        setStatus('error');
      }
    };

    loadCompany();
    return () => {
      active = false;
    };
  }, [companyId, getAccessTokenSilently]);

  useEffect(() => {
    const query = serviceSearch.trim();
    if (query.length < 2) {
      setServiceSuggestions([]);
      setServiceSearchError(null);
      return undefined;
    }

    let active = true;
    const timeout = setTimeout(async () => {
      try {
        setServiceSearchError(null);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/search/services`,
          { params: { q: query } }
        );
        if (active) setServiceSuggestions(response.data);
      } catch (requestError) {
        if (!active) return;
        setServiceSuggestions([]);
        setServiceSearchError('Unable to search services.');
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timeout);
    };
  }, [serviceSearch]);

  if (!companyId) return null;

  const updateField = (field) => (event) => {
    setDetails((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleAddressChange = (event) => {
    setAddressText(event.target.value);
    setSelectedAddress(null);
  };

  const handlePlaceChanged = () => {
    if (!autocomplete) return;

    const place = autocomplete.getPlace();
    if (!place?.formatted_address) return;

    const lat = place.geometry?.location?.lat?.();
    const lng = place.geometry?.location?.lng?.();

    setSelectedAddress({
      formatted: place.formatted_address,
      placeId: place.place_id,
      addressComponents: place.address_components,
      ...(Number.isFinite(lat) && Number.isFinite(lng) && { lat, lng }),
    });
    setAddressText(place.formatted_address);
  };

  const addService = (service) => {
    setServicesOffered((current) => {
      if (current.some((selected) => selected.id === service.refId)) {
        return current;
      }
      return [...current, { id: service.refId, name: service.label }];
    });
    setServiceSearch('');
    setServiceSuggestions([]);
  };

  const removeService = (serviceId) => {
    setServicesOffered((current) =>
      current.filter((service) => service.id !== serviceId)
    );
  };

  const saveCompanyDetails = async (event) => {
    event.preventDefault();
    if (addressText !== savedAddressText && !selectedAddress) {
      toast.error(
        'Select an office address from the autocomplete suggestions.'
      );
      return;
    }

    try {
      setStatus('saving');
      const token = await getAccessTokenSilently();
      const updates = {
        name: details.name,
        about: details.about,
        email: details.email,
        phone: details.phone,
        otherSkills: details.otherSkills
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean),
        servicesOffered: servicesOffered.map((service) => service.id),
      };
      if (selectedAddress) updates.address = selectedAddress;

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/company/${companyId}/edits`,
        updates,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (selectedAddress) {
        setSavedAddressText(selectedAddress.formatted);
        setSelectedAddress(null);
      }
      setStatus('ready');
      toast.success('Company details updated.');
    } catch (requestError) {
      setStatus('ready');
      toast.error(
        requestError.response?.data?.message ||
          'Unable to update company details.'
      );
    }
  };

  if (status === 'loading') {
    return (
      <p className="p-6 text-sm text-gray-500">Loading company details…</p>
    );
  }

  if (status === 'error') {
    return <p className="p-6 text-sm text-red-600">{error}</p>;
  }

  return (
    <section className="mx-auto max-w-2xl p-6">
      <h2 className="text-xl font-semibold text-gray-900">Company details</h2>
      <p className="mt-1 text-sm text-gray-500">
        These fields update your Company listing only, not your individual
        Portfolio.
      </p>

      <form className="mt-6 space-y-4" onSubmit={saveCompanyDetails}>
        <label className="block text-sm font-medium text-gray-700">
          Company name
          <Input
            className="mt-1"
            value={details.name}
            onChange={updateField('name')}
            required
          />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          About
          <Textarea
            className="mt-1"
            value={details.about}
            onChange={updateField('about')}
          />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Email
          <Input
            className="mt-1"
            type="email"
            value={details.email}
            onChange={updateField('email')}
          />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Phone
          <Input
            className="mt-1"
            value={details.phone}
            onChange={updateField('phone')}
          />
        </label>
        <div className="block text-sm font-medium text-gray-700">
          <label htmlFor="company-services">Services offered</label>
          <Input
            id="company-services"
            className="mt-1"
            value={serviceSearch}
            onChange={(event) => setServiceSearch(event.target.value)}
            placeholder="Search services to add"
          />
          {serviceSearchError ? (
            <p className="mt-1 text-xs font-normal text-red-600">
              {serviceSearchError}
            </p>
          ) : null}
          {serviceSuggestions.length > 0 ? (
            <ul className="mt-1 overflow-hidden rounded-md border border-gray-200 bg-white text-sm font-normal shadow-sm">
              {serviceSuggestions.map((service) => (
                <li key={service.refId}>
                  <button
                    className="w-full px-3 py-2 text-left hover:bg-gray-50"
                    type="button"
                    onClick={() => addService(service)}
                  >
                    {service.label}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          {servicesOffered.length > 0 ? (
            <ul className="mt-2 flex flex-wrap gap-2 text-sm font-normal">
              {servicesOffered.map((service) => (
                <li
                  className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-slate-800"
                  key={service.id}
                >
                  {service.name}
                  <button
                    aria-label={`Remove ${service.name}`}
                    className="font-semibold text-slate-600 hover:text-slate-900"
                    type="button"
                    onClick={() => removeService(service.id)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-xs font-normal text-gray-500">
              Search for a service to add it to your Company.
            </p>
          )}
        </div>
        <div className="block text-sm font-medium text-gray-700">
          <label htmlFor="company-office-address">Office address</label>
          {typeof window !== 'undefined' && window.google ? (
            <Autocomplete
              onLoad={setAutocomplete}
              onPlaceChanged={handlePlaceChanged}
              options={{
                types: ['address'],
                componentRestrictions: { country: 'za' },
              }}
            >
              <Input
                id="company-office-address"
                ref={addressInputRef}
                className="mt-1"
                value={addressText}
                onChange={handleAddressChange}
                placeholder="Start typing your office address"
              />
            </Autocomplete>
          ) : (
            <Input
              id="company-office-address"
              className="mt-1"
              disabled
              placeholder="Loading address autocomplete…"
            />
          )}
          <p className="mt-1 text-xs font-normal text-gray-500">
            Select an address from the suggestions to update it.
          </p>
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
          {status === 'saving' ? 'Saving…' : 'Save company details'}
        </Button>
      </form>
    </section>
  );
}
