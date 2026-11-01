async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("eventHubToken");
  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`/api${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

// Event endpoints
export function getEvents(query = "") {
  const queryString = query ? (query.startsWith("?") ? query : `?${query}`) : "";
  return apiRequest(`/events${queryString}`);
}

export function getEventById(id) {
  return apiRequest(`/events/${id}`);
}

export function createEvent(eventData) {
  return apiRequest("/events", {
    method: "POST",
    body: JSON.stringify(eventData),
  });
}

export function updateEvent(id, eventData) {
  return apiRequest(`/events/${id}`, {
    method: "PUT",
    body: JSON.stringify(eventData),
  });
}

export function deleteEvent(id) {
  return apiRequest(`/events/${id}`, {
    method: "DELETE",
  });
}

// Auth endpoints
export function registerUser(userData) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export function loginUser(credentials) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function getCurrentUser() {
  return apiRequest("/auth/me");
}

// Registration endpoints
export function registerForEvent(eventId) {
  return apiRequest(`/registrations/${eventId}`, {
    method: "POST",
  });
}

export function getMyRegistrations() {
  return apiRequest("/registrations/my");
}

export function getAllRegistrations() {
  return apiRequest("/registrations/all");
}

export function getEventRegistrations(eventId) {
  return apiRequest(`/registrations/event/${eventId}`);
}

export function cancelRegistration(registrationId) {
  return apiRequest(`/registrations/${registrationId}`, {
    method: "DELETE",
  });
}

// Convenience object export
export const api = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerUser,
  loginUser,
  getCurrentUser,
  registerForEvent,
  getMyRegistrations,
  getAllRegistrations,
  getEventRegistrations,
  cancelRegistration,
};

export default api;
