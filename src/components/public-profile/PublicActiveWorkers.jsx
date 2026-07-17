import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

import { usePublicPageStore } from './publicPageStore';

const getInitials = (name) => {
  const parts = name.split(' ').filter(Boolean);

  if (parts.length === 0) return 'M';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const PublicActiveWorkers = ({ members = [] }) => {
  const visibleMembers = Array.isArray(members) ? members.filter(Boolean) : [];

  const selectMember = usePublicPageStore((state) => state.selectMember);
  const toggleMember = usePublicPageStore((state) => state.toggleMember);

  if (!visibleMembers.length) return null;

  const previewMembers = visibleMembers.slice(0, 6);

  return (
    <div className="section members mt-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">Team members</h3>
        <span className="text-sm text-slate-500">{visibleMembers.length}</span>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {previewMembers.map((member, index) => (
              <Avatar
                key={member?._id || member?.user || index}
                className="h-20 w-20 border-2 border-blue-200"
              >
                <AvatarImage
                  src={member?.avatarUrl}
                  alt={member?.displayName}
                />
                <AvatarFallback>
                  {getInitials(member?.displayName)}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>

          {visibleMembers.length > previewMembers.length ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-sm font-medium text-slate-600">
              +{visibleMembers.length - previewMembers.length}
            </div>
          ) : null}
        </div>

        <ul className="space-y-2 cursor-pointer h-12 overflow-auto">
          {visibleMembers.map((member, index) => (
            <li
              key={member?._id || member?.user || index}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
              onClick={() => toggleMember(member)}
            >
              <Avatar className="h-7 w-7">
                <AvatarImage
                  src={member?.avatarUrl}
                  alt={member?.displayName}
                />
                <AvatarFallback className="bg-slate-200 text-xs text-slate-700">
                  {getInitials(member?.displayName)}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-slate-700">
                {member?.displayName}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PublicActiveWorkers;
