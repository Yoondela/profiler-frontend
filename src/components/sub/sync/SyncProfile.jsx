// src/utils/profileSync.js
import axios from 'axios';

/** Compare two flat objects and return changed fields */
export const diffShallow = (original, updated) => {
  const changes = {};
  Object.keys(updated || {}).forEach((k) => {
    if (updated[k] !== (original ? original[k] : undefined)) {
      changes[k] = updated[k];
    }
  });
  return changes;
};

/** Compare preferences (nested) and return changes */
export const diffPreferences = (original, updated) => {
  const changes = {};
  if (!original) original = {};

  if (
    updated.preferredContactMethod !==
    (original.preferredContactMethod ?? 'email')
  ) {
    changes.preferredContactMethod = updated.preferredContactMethod;
  }

  const origNotif = original.notificationSettings || {
    email: true,
    sms: false,
  };
  const updNotif = updated.notificationSettings || { email: true, sms: false };
  if (updNotif.email !== origNotif.email || updNotif.sms !== origNotif.sms) {
    changes.notificationSettings = updNotif;
  }

  const origAddresses = JSON.stringify(original.savedAddresses || []);
  const updAddresses = JSON.stringify(updated.savedAddresses || []);
  if (origAddresses !== updAddresses) {
    changes.savedAddresses = updated.savedAddresses || [];
  }

  return changes;
};

/** Fetch the user profile using email */
export const fetchProfile = async (userEmail) => {
  if (!userEmail) return null;
  const res = await axios.get(
    `http://localhost:3000/api/profiles/me/mail/${userEmail}`
  );
  return res.data.userAccount;
};

/** Update user profile */
export const updateProfile = async (userEmail, changes) => {
  if (!userEmail) throw new Error('No user email provided');
  const res = await axios.patch(
    `http://localhost:3000/api/profiles/update-by-mail/${userEmail}`,
    changes
  );
  return res.data;
};
