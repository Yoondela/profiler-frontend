
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

// EDIT
export const editStaffRole = async (companyId, staffId, role, password) => {
  if (!companyId || !staffId) throw new Error('Missing company or staff ID');

  const res = await axios.patch(
    `${API}/staff/${companyId}/staff/${staffId}/role`,
    {
      role,
      password,
    }
  );
  return res.data;
};

// DELETE
export const removeStaff = async (companyId, staffId, password) => {
  if (!companyId || !staffId) throw new Error('Missing company or staff ID');

  const res = await axios.delete(`${API}/staff/${companyId}/staff/${staffId}`, {
    data: { password },
  });
  return res.data;
};