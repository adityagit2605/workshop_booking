const API_BASE = '/api';

async function getCsrfToken() {
  const res = await fetch(`${API_BASE}/auth/csrf/`, {
    credentials: 'include',
  });
  const data = await res.json();
  return data.csrfToken;
}

let csrfToken = null;

async function ensureCsrf() {
  if (!csrfToken) {
    csrfToken = await getCsrfToken();
  }
  return csrfToken;
}

async function apiRequest(endpoint, options = {}) {
  const { method = 'GET', body, headers = {} } = options;

  const config = {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (method !== 'GET' && method !== 'HEAD') {
    const token = await ensureCsrf();
    config.headers['X-CSRFToken'] = token;
  }

  if (body) {
    config.body = JSON.stringify(body);
  }

  const url = endpoint.startsWith('/') ? endpoint : `${API_BASE}/${endpoint}`;
  const response = await fetch(url, config);

  if (response.status === 403) {
    // Might be CSRF token expired, refresh and retry once
    csrfToken = null;
    const newToken = await ensureCsrf();
    config.headers['X-CSRFToken'] = newToken;
    const retryResponse = await fetch(url, config);
    return handleResponse(retryResponse);
  }

  return handleResponse(response);
}

async function handleResponse(response) {
  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(data?.error || data?.detail || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    
    // Global logging for non-auth errors
    if (response.status !== 401 && response.status !== 403) {
      console.warn(`[API Error] ${response.status} ${response.url}:`, data);
    }
    
    throw error;
  }

  return data;
}

// Auth APIs
export const auth = {
  login: (username, password) =>
    apiRequest('/api/auth/login/', { method: 'POST', body: { username, password } }),
  logout: () =>
    apiRequest('/api/auth/logout/', { method: 'POST' }),
  register: (formData) =>
    apiRequest('/api/auth/register/', { method: 'POST', body: formData }),
  currentUser: () =>
    apiRequest('/api/auth/user/'),
};

// Workshop APIs
export const workshops = {
  coordinatorStatus: () =>
    apiRequest('/api/workshops/coordinator/'),
  instructorStatus: () =>
    apiRequest('/api/workshops/instructor/'),
  propose: (data) =>
    apiRequest('/api/workshops/propose/', { method: 'POST', body: data }),
  accept: (id) =>
    apiRequest(`/api/workshops/${id}/accept/`, { method: 'POST' }),
  changeDate: (id, newDate) =>
    apiRequest(`/api/workshops/${id}/change-date/`, { method: 'POST', body: { new_date: newDate } }),
  details: (id) =>
    apiRequest(`/api/workshops/${id}/`),
  postComment: (id, comment, isPublic) =>
    apiRequest(`/api/workshops/${id}/comments/`, { method: 'POST', body: { comment, public: isPublic } }),
};

// Workshop Type APIs
export const workshopTypes = {
  list: (page = 1) =>
    apiRequest(`/api/workshop-types/?page=${page}`),
  details: (id) =>
    apiRequest(`/api/workshop-types/${id}/`),
  tnc: (id) =>
    apiRequest(`/api/workshop-types/${id}/tnc/`),
};

// Profile APIs
export const profile = {
  own: () =>
    apiRequest('/api/profile/'),
  update: (data) =>
    apiRequest('/api/profile/', { method: 'PUT', body: data }),
  view: (userId) =>
    apiRequest(`/api/profile/${userId}/`),
};

// Statistics APIs
export const statistics = {
  public: (params = '') =>
    apiRequest(`/api/statistics/public/${params ? '?' + params : ''}`),
  team: (teamId) =>
    apiRequest(`/api/statistics/team/${teamId ? teamId + '/' : ''}`),
};

export default apiRequest;
