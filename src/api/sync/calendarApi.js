const BASE = 'http://localhost:3001/calendar/events';

export async function getEvents(start, end, companyId) {
  console.log(
    `Fetching events for companyId: ${companyId}, start: ${start}, end: ${end}`
  );
  const params = new URLSearchParams({
    companyId,
    start: start,
    end: end,
  });
  const res = await fetch(`${BASE}?${params}`);

  if (!res.ok) {
    throw new Error('Failed to fetch events');
  }

  return res.json();
}

export async function createEvent(event) {
  console.log('Creating Event:', event);
  const res = await fetch(BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });

  return res.json();
}

export async function updateEvent(id, updates) {
  console.log('Updating Event:', id, updates);
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  return res.json();
}

export async function deleteEvent(id) {
  await fetch(`${BASE}/${id}`, {
    method: 'DELETE',
  });
}
