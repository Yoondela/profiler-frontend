'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { usePortfolioContext } from '@/api/context/portfolioContext';

export function NewChannelModal({ open, onClose, onCreate }) {
  const [channelName, setChannelName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const { companyId } = usePortfolioContext();

  useEffect(() => {
    if (!open || !companyId) return;

    let canceled = false;

    const fetchParticipants = async () => {
      setLoading(true);

      try {
        const res = await axios.get(`/api/company/${companyId}/participants`);

        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.participants || [];

        console.log('Fetched participants:', data);

        if (canceled) return;

        const mapped = data
          .filter((participant) => participant.flackId)
          .map((participant) => ({
            flackId: participant.flackId,
            username:
              participant.username ||
              participant.name ||
              participant.displayName ||
              participant.email ||
              'Unknown User',
            avatarUrl: participant.avatarUrl,
            role: participant.role,
          }));

        setUsers(mapped);
      } catch (err) {
        console.error('Failed to load participants', err);

        if (!canceled) {
          setUsers([]);
        }
      } finally {
        if (!canceled) {
          setLoading(false);
        }
      }
    };

    fetchParticipants();

    return () => {
      canceled = true;
    };
  }, [open, companyId]);

  useEffect(() => {
    if (!open) {
      setChannelName('');
      setSelectedUsers([]);
    }
  }, [open]);

  const toggleUser = (flackId) => {
    setSelectedUsers((current) =>
      current.includes(flackId)
        ? current.filter((id) => id !== flackId)
        : [...current, flackId]
    );
  };

  const handleCreate = () => {
    console.log('Creating channel:', {
      channelName,
      selectedUsers,
    });

    onCreate({
      channelName: channelName.trim(),
      selectedUsers,
    });
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-3xl border border-zinc-700 bg-white p-6 shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between gap-4 pb-4">
          <div>
            <h2 className="text-xl font-semibold text-zinc-900">
              Create new channel
            </h2>

            <p className="text-sm text-zinc-500">
              Add a name and invite users to the channel.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-sm text-zinc-700 hover:bg-zinc-100"
          >
            Close
          </button>
        </div>

        <div className="space-y-5">
          <label className="block text-sm font-medium text-zinc-700">
            Channel name
            <input
              type="text"
              value={channelName}
              onChange={(event) => setChannelName(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none transition focus:border-zinc-500"
              placeholder="e.g. Project Alpha"
            />
          </label>

          <div>
            <div className="mb-3 text-sm font-medium text-zinc-700">
              Add users
            </div>

            <div className="space-y-2 rounded-2xl border border-zinc-300 bg-zinc-50 p-3">
              {loading && (
                <div className="text-sm text-zinc-500">
                  Loading participants...
                </div>
              )}

              {!loading && users.length === 0 && (
                <div className="text-sm text-zinc-500">
                  No participants found.
                </div>
              )}

              {!loading &&
                users.map((user) => (
                  <label
                    key={user.flackId}
                    className="flex cursor-pointer items-center justify-between rounded-2xl border border-transparent bg-white px-3 py-3 text-sm text-zinc-800 transition hover:border-zinc-300"
                  >
                    <div className="flex items-center gap-3">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.username}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-zinc-300" />
                      )}

                      <div>
                        <div>{user.username}</div>

                        {user.role && (
                          <div className="text-xs text-zinc-500">
                            {user.role}
                          </div>
                        )}
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.flackId)}
                      onChange={() => toggleUser(user.flackId)}
                      className="h-4 w-4 rounded border-zinc-400"
                    />
                  </label>
                ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleCreate}
              disabled={!channelName.trim() || selectedUsers.length === 0}
              className="rounded-2xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-zinc-400"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewChannelModal;
