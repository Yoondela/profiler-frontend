import { useState } from 'react';
import { usePortfolioContext } from '@/api/context/portfolioContext';
import { useBookings } from '@/api/context/bookingsContext';
import { respondToBooking } from '@/api/sync/actionsApi';
import { CalendarDays, Clock3, MapPin, Search, User } from 'lucide-react';

function ProviderPicker({ booking }) {
  const { portfolioDataCtx } = usePortfolioContext();
  const { replaceBooking } = useBookings();

  const members = portfolioDataCtx?.company?.members ?? [];

  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);

  const serviceId = booking.service._id;

  const assignable = members.filter((member) => {
    const services = member.servicesOffered ?? [];

    if (services.length === 0) return true;

    return services.some((s) => s._id.toString() === serviceId.toString());
  });

  const handleAccept = async () => {
    if (!selected) {
      alert('Please select a provider.');
      return;
    }

    try {
      setLoading(true);

      const updatedBooking = await respondToBooking(
        booking._id,
        'accept',
        selected
      );

      replaceBooking(updatedBooking);

      console.log('Booking accepted', updatedBooking);

      // later:
      // update booking context
      // close drawer
      // toast.success(...)
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message ?? 'Unable to accept booking.');
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    const confirmed = window.confirm('Decline this booking?');

    if (!confirmed) return;

    try {
      setLoading(true);

      const updatedBooking = await respondToBooking(booking._id, 'decline');

      replaceBooking(updatedBooking);

      console.log('Booking declined', updatedBooking);

      // later
      // remove booking from list
      // toast.success(...)
    } catch (err) {
      console.error(err);

      alert(err.response?.data?.message ?? 'Unable to decline booking.');
    } finally {
      setLoading(false);
    }
  };

  const assignedProvider = booking?.provider?.name;

  const preferred = assignable.find(
    (m) => m.user?._id.toString() === booking.preferedProvider?.toString()
  );

  const others = assignable.filter(
    (m) => m.user?._id.toString() !== booking.preferedProvider?.toString()
  );

  const filtered = others.filter((m) =>
    m.displayName.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="mt-4 overflow-hidden">
      <div className="flex flex-row-reverse">
        {/* LEFT PANEL */}

        <aside className="w-64 p-4">
          <h3 className="mb-3 font-semibold tracking-wide text-gray-500">
            Other Candidates
          </h3>

          {/* <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search provider..."
              className="w-full rounded-lg border bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-black"
            />
          </div> */}

          <div className="space-y-2">
            {filtered.map((member) => (
              <label
                key={member._id}
                className="flex cursor-pointer items-start gap-3 rounded-lg border bg-white p-3 transition hover:border-black"
              >
                <input
                  type="radio"
                  name={`assign-${booking._id}`}
                  checked={selected === member.user}
                  onChange={() => setSelected(member.user)}
                  className="mt-1"
                />

                <div>
                  <p className="font-medium">{member.displayName}</p>

                  <p className="text-xs text-gray-500">
                    {member.completedJobs} completed jobs
                  </p>
                </div>
              </label>
            ))}

            {filtered.length === 0 && (
              <p className="text-sm text-gray-500">No matching providers</p>
            )}
          </div>
        </aside>

        {/* MAIN PANEL */}

        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">{booking.service.name}</h2>

            <div className="mt-2 flex flex-wrap gap-5 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {booking.client.name}
              </div>

              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {new Date(booking.forDate).toLocaleDateString()}
              </div>

              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                {booking.forTime}
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {booking.forAddress.addressComponents.suburb ||
                  booking.forAddress.addressComponents.city}
              </div>
            </div>
          </div>

          {assignedProvider && (
            <div>
              <p>Assigned</p>
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
                <p className="font-semibold">{assignedProvider}</p>
              </div>
            </div>
          )}

          {preferred && !assignedProvider && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
              <p className="mb-2 text-xs tracking-wide text-blue-700">
                Preferred by client
              </p>

              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="radio"
                  name={`assign-${booking._id}`}
                  checked={selected === preferred.user}
                  onChange={() => setSelected(preferred.user)}
                />

                <div>
                  <p className="font-semibold">{preferred.displayName}</p>
                </div>
              </label>
            </div>
          )}

          <div className="mt-8 flex justify-end gap-3">
            <button
              onClick={handleDecline}
              disabled={loading || assignedProvider}
              className="rounded-lg border px-5 py-2.5 text-sm font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Decline
            </button>

            <button
              onClick={handleAccept}
              disabled={!selected || loading}
              className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Assigning...' : 'Accept Booking'}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export { ProviderPicker };
