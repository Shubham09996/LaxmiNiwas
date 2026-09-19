const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('lxn_auth_token');
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const text = await res.text();
    let data;

    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { error: text || `HTTP error ${res.status}` };
    }
    
    if (!res.ok) {
      throw new Error(data.error || data.message || `HTTP error ${res.status}`);
    }
    
    return data;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Authentication
  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  getMe: () => request('/auth/me'),
  logout: () => request('/auth/logout', {
    method: 'POST'
  }),

  // 4 Stages and API Catalog
  getStages: () => request('/verify/stages'),
  
  // Test any API
  testApi: (apiId, inputParams = {}) => request('/verify/test', {
    method: 'POST',
    body: JSON.stringify({ apiId, inputParams })
  }),

  // Health
  getHealth: () => request('/health'),
};
