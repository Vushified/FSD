const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("eventHubToken");

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const url = API_BASE_URL ? `${API_BASE_URL}/api${path}` : `/api${path}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  let data = {};

  if (contentType.includes("application/json")) {
    data = await response.json().catch(() => ({}));
  } else {
    throw new Error(
      `Server returned ${response.status} (non-JSON). Please verify VITE_API_URL points to your live Render backend.`
    );
  }

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

// Existing event API
export function getEvents() {
  return apiRequest("/events");
}

// Register an account
export function registerUser(userData) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

// Login
export function loginUser(credentials) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

// Load the current authenticated user
export function getCurrentUser() {
  return apiRequest("/auth/me");
}

// Event Admin APIs
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
