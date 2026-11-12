import axios from 'axios';

export const sendInvite = async (invitingCompany, invitedPortfolio, token) => {
  if (!invitingCompany) throw new Error('No company provided');
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/invites/${invitingCompany}/invite`,
    {
      portfolioId: invitedPortfolio,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const respondToInvite = async (inviteId, action, token) => {
  if (!inviteId || !action) throw new Error('Information is missing');
  const res = await axios.patch(
    `${import.meta.env.VITE_API_URL}/invites/${inviteId}/respond`,
    {
      action: action,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  console.log('Responded to invite:', res.data);
  return res.data;
};

export const sendStaffInvite = async (invitingCompany, targetUser, token) => {
  if (!invitingCompany) throw new Error('No company provided');
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/invites/${invitingCompany}/staff/invite`,
    {
      targetUserId: targetUser,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const respondToStaffInvite = async (inviteId, action, token) => {
  if (!inviteId || !action) throw new Error('Information is missing');
  const res = await axios.patch(
    `${import.meta.env.VITE_API_URL}/invites/staff/${inviteId}/respond`,
    {
      action: action,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  console.log('Responded to invite:', res.data);
  return res.data;
};
