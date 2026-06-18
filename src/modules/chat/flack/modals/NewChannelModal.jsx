'use client';

import React, { useMemo, useState } from 'react';

const DEFAULT_USERS = ['indigofox', 'skylineuser', 'brooklyn42'];

export function NewChannelModal({ open, onClose, onCreate }) {
  const [channelName, setChannelName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  const users = useMemo(
    () => DEFAULT_USERS.map((username) => ({ username, id: username })),
    []
  );

  const toggleUser = (userId) => {
    setSelectedUsers((current) =>
      current.includes(userId)
        ? current.filter((id) => id !== userId)
        : [...current, userId]
    );
  };

  const handleCreate = () => {
    console.log('HERE..:');
    console.log(channelName, selectedUsers);

    onCreate({
      channelName,
      selectedUsers,
    });
    // setChannelName('');
    // setSelectedUsers([]);
    // onClose?.();
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-3xl border border-zinc-700 bg-[white] p-6 shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between gap-4 pb-4">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Create new channel
            </h2>
            <p className="text-sm text-zinc-400">
              Add a name and invite users to the channel.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-sm text-zinc-300 hover:bg-zinc-800"
          >
            Close
          </button>
        </div>

        <div className="space-y-5">
          <label className="block text-sm font-medium text-zinc-200">
            Channel name
            <input
              type="text"
              value={channelName}
              onChange={(event) => setChannelName(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-white outline-none transition focus:border-zinc-500"
              placeholder="e.g. team-ideas"
            />
          </label>

          <div>
            <div className="mb-3 text-sm font-medium text-zinc-200">
              Add users
            </div>
            <div className="space-y-2 rounded-2xl border border-zinc-700 bg-zinc-900 p-3">
              {users.map((user) => (
                <label
                  key={user.id}
                  className="flex cursor-pointer items-center justify-between rounded-2xl border border-transparent bg-zinc-950 px-3 py-3 text-sm text-zinc-200 transition hover:border-zinc-600"
                >
                  <span>{user.username}</span>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleUser(user.id)}
                    className="h-4 w-4 rounded border-zinc-600 bg-zinc-800 text-indigo-500 focus:ring-indigo-500"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreate}
              disabled={!channelName.trim() || selectedUsers.length === 0}
              className="rounded-2xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-zinc-700 hover:bg-indigo-600"
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
