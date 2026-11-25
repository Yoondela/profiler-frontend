// src/utils/profileSync.js

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
export const fetchProfile = async (api, userEmail) => {
  if (!userEmail) return null;
  const res = await api.get(
    `/profiles/me/mail/${encodeURIComponent(userEmail)}`
  );
  return res.data.userAccount;
};

/** Update user profile */
export const updateProfile = async (api, userEmail, changes) => {
  if (!userEmail) throw new Error('No user email provided');
  const res = await api.patch(
    `/profiles/update-by-mail/${encodeURIComponent(userEmail)}`,
    changes
  );
  return res.data;
};
