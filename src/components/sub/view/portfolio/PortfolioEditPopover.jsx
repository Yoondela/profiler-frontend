'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, CloudUpload } from 'lucide-react';
import Spinner from '@/components/sub/LoadingSpinner';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useAuth0 } from '@auth0/auth0-react';
import { getUserID } from '@/api/sync/SyncUser';
import { toast } from 'sonner'; // or use your project's toast
import { Autocomplete } from '@react-google-maps/api';

const PortfolioEditDialog = ({ provider, children }) => {
  // --- open / saving ---
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadError, setLoadError] = useState(null);

  // --- local editable fields with safe defaults ---
  const [address, setAddress] = useState('');
  const [savedAddress, setSavedAddress] = useState('');
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [about, setAbout] = useState('');
  const [services, setServices] = useState([]);
  const [otherSkills, setOtherSkills] = useState([]);

  const [newService, setNewService] = useState('');
  const [newSkill, setNewSkill] = useState('');

  const { user, getAccessTokenSilently } = useAuth0();

  // Load the owner's Portfolio rather than the Company-first display projection.
  useEffect(() => {
    if (!open) return undefined;
    if (!user?.email) {
      setLoadError('Unable to load Portfolio details.');
      return undefined;
    }

    let active = true;
    const loadPortfolio = async () => {
      try {
        setLoadingDetails(true);
        setLoadError(null);
        const userId = await getUserID(getAccessTokenSilently, user?.email);
        const token = await getAccessTokenSilently();
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/portfolios/${userId}/edits`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!active) return;

        const loadedAddress = response.data.address?.formatted || '';
        setAddress(loadedAddress);
        setSavedAddress(loadedAddress);
        setAbout(response.data.about || response.data.bio || '');
        setServices(
          (response.data.servicesOffered || [])
            .filter(Boolean)
            .map((service) => service.name)
        );
        setOtherSkills(response.data.otherSkills || []);
      } catch (err) {
        if (!active) return;
        setLoadError('Unable to load Portfolio details.');
      } finally {
        if (active) setLoadingDetails(false);
      }
    };

    loadPortfolio();
    return () => {
      active = false;
    };
  }, [open, user?.email, getAccessTokenSilently]);

  // ---------------------- Drag & Drop ---------------------- //
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const updated = Array.from(otherSkills);
    const [moved] = updated.splice(result.source.index, 1);
    updated.splice(result.destination.index, 0, moved);
    setOtherSkills(updated);
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
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
    setAddress(place.formatted_address);
  };

  // ---------------------- API Request ---------------------- //
  const updatePortfolioRequest = async (userId, changes, token) => {
    console.log('uploading portfolio');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await axios.patch(
      `${import.meta.env.VITE_API_URL}/portfolios/${userId}`,
      changes,
      { headers }
    );
    return res.data;
  };

  // ---------------------- SAVE HANDLER ---------------------- //
  const handleSave = async () => {
    console.log('before the update');
    if (!user?.email) {
      toast.error('Missing user information.');
      return;
    }
    if (address !== savedAddress && !selectedAddress) {
      toast.error('Select an address from the autocomplete suggestions.');
      return;
    }
    console.log('before the update 2........');

    setSaving(true);
    try {
      const payload = {
        address: selectedAddress || undefined,
        about,
        servicesOffered: services,
        otherSkills,
      };

      console.log('before the update 3.......');

      const token = await getAccessTokenSilently();
      if (!token) throw new Error('Authentication is required');
      console.log('before the update 4.............');

      // Acquire a stable userId for your backend. getUserID should return the id your backend expects.
      const userId = await getUserID(getAccessTokenSilently, user?.email);

      console.log('just before the update');

      await updatePortfolioRequest(userId, payload, token);

      if (selectedAddress) {
        setSavedAddress(selectedAddress.formatted);
        setSelectedAddress(null);
      }

      toast.success('Portfolio updated!');
      setOpen(false);
    } catch (err) {
      console.error('Portfolio update failed', err);
      if (err.response?.status === 401) {
        toast.error('Please sign in again before editing your portfolio.');
      } else if (err.response?.status === 403) {
        toast.error('You do not have permission to edit this portfolio.');
      } else if (err.message === 'Authentication is required') {
        toast.error('Please sign in again before editing your portfolio.');
      } else {
        toast.error('Failed to update portfolio.');
      }
    } finally {
      setSaving(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="">
        {children ? (
          children
        ) : (
          <div
            className={`cursor-pointer flex items-center gap-2 ${!provider ? 'opacity-40 pointer-events-none' : ''}`}
            title={!provider ? 'Loading…' : 'Edit portfolio'}
          >
            <Pencil className="w-5 h-5" />
          </div>
        )}
      </DialogTrigger>

      <DialogContent className="w-full pb-7 space-y-4 bg-[white] rounded-xl h-full mt-[3rem]">
        <DialogHeader className="p-0 m-0">
          <DialogTitle className="p-0 m-0">
            <p className="text-lg font-semibold">Edit Portfolio</p>
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[399px] w-full overflow-y-auto">
          {loadError ? (
            <p className="text-sm text-red-600">{loadError}</p>
          ) : null}
          {/* Address */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Address</label>
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
                  value={address}
                  onChange={handleAddressChange}
                  placeholder="Start typing your address"
                />
              </Autocomplete>
            ) : (
              <Input disabled placeholder="Loading address autocomplete…" />
            )}
            <p className="text-xs text-gray-500">
              Select an address from the suggestions to update it.
            </p>
          </div>

          {/* About */}
          <div className="space-y-1">
            <label className="text-sm font-medium">About</label>
            <Textarea
              rows={3}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Short description about yourself"
            />
          </div>

          {/* Services Offered */}
          <div>
            <label className="text-sm font-medium">Services Offered</label>

            <div className="flex gap-2 my-2">
              <Input
                placeholder="Add service"
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
              />
              <Button
                size="sm"
                onClick={() => {
                  const val = newService.trim();
                  if (!val) return;
                  // avoid duplicates
                  setServices((prev) =>
                    prev.includes(val) ? prev : [...prev, val]
                  );
                  setNewService('');
                }}
              >
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {services.map((item, index) => (
                <Badge
                  key={`service-${index}-${item}`}
                  className="cursor-pointer"
                  onClick={() =>
                    setServices((prev) => prev.filter((s) => s !== item))
                  }
                >
                  {item} ✕
                </Badge>
              ))}
            </div>
          </div>

          {/* Skills with Drag & Drop */}
          <div>
            <label className="text-sm font-medium">Skills</label>

            <div className="flex gap-2 my-2">
              <Input
                placeholder="Add skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
              />
              <Button
                size="sm"
                onClick={() => {
                  const val = newSkill.trim();
                  if (!val) return;
                  setOtherSkills((prev) =>
                    prev.includes(val) ? prev : [...prev, val]
                  );
                  setNewSkill('');
                }}
              >
                Add
              </Button>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="skillsList" direction="horizontal">
                {(provided) => (
                  <div
                    className="flex flex-wrap gap-2"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {otherSkills.map((skill, index) => (
                      <Draggable
                        key={`skill-${index}-${skill}`}
                        draggableId={`skill-${index}-${skill}`}
                        index={index}
                      >
                        {(draggableProvided) => (
                          <div
                            ref={draggableProvided.innerRef}
                            {...draggableProvided.draggableProps}
                            {...draggableProvided.dragHandleProps}
                          >
                            <Badge className="cursor-move">{skill}</Badge>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
        <DialogFooter className="p-0 m-0">
          {/* Save */}
          <Button
            className="w-full flex items-center gap-2"
            onClick={handleSave}
            disabled={saving || loadingDetails || Boolean(loadError)}
          >
            {saving ? (
              <>
                <Spinner />
                Saving...
              </>
            ) : (
              <>
                <CloudUpload className="w-4 h-4" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PortfolioEditDialog;
