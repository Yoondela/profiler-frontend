import axios from 'axios';

export const sendInvite = async (
  invitingCompany,
  invitingUser,
  invitedPortfolio
) => {
  if (!invitingCompany) throw new Error('No user email provided');
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/invites/${invitingCompany}/invite`,
    {
      portfolioId: invitedPortfolio,
      invitedBy: invitingUser,
    }
  );
  return res.data;
};

export const respondToInvite = async (inviteId, action) => {
  if (!inviteId || !action) throw new Error('Information is missing');
  const res = await axios.patch(
    `${import.meta.env.VITE_API_URL}/invites/${inviteId}/respond`,
    {
      action: action,
    }
  );
  console.log('Responded to invite:', res.data);
  return res.data;
};
