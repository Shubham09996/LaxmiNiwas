const getApiBase = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL;
  if (envUrl && typeof envUrl === 'string') {
    const cleanUrl = envUrl.trim().replace(/\/+$/, '');
    return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
  }
  if (import.meta.env.PROD) {
    return 'https://laxminiwas.onrender.com/api';
  }
  return '/api';
};

const API_BASE = getApiBase();

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
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const targetUrl = `${API_BASE}${cleanEndpoint}`;
    const res = await fetch(targetUrl, config);
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

  // Stages and API Catalog
  getStages: () => request('/verify/stages'),
  
  // Real Verification APIs
  testApi: (apiId, inputParams = {}) => request('/verify/test', {
    method: 'POST',
    body: JSON.stringify({ apiId, inputParams })
  }),
  verifyPan: (payload) => request('/verify/pan', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  verifyDigiLocker: (payload) => request('/verify/aadhaar-digilocker-generate', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  verifyBank: (payload) => request('/verify/bank-account-verification', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  verifyCibil: (payload) => request('/verify/cibil-transunion-pdf', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  verifyGst: (payload) => request('/verify/test', {
    method: 'POST',
    body: JSON.stringify({ apiId: 'gst-advance', inputParams: payload })
  }),
  verifyMca: (payload) => request('/verify/test', {
    method: 'POST',
    body: JSON.stringify({ apiId: 'mca-company', inputParams: payload })
  }),

  // Dossiers
  getDossiers: (params = {}) => {
    const query = new URLSearchParams();
    if (params.type && params.type !== 'ALL') query.append('type', params.type);
    if (params.status && params.status !== 'ALL') query.append('status', params.status);
    if (params.search) query.append('search', params.search);
    const qs = query.toString();
    return request(`/dossiers${qs ? `?${qs}` : ''}`);
  },
  getDossierById: (id) => request(`/dossiers/${id}`),

  // Services Catalog
  getServices: () => request('/services'),

  // Metrics
  getMetrics: () => request('/metrics'),

  // API Keys
  getApiKeys: () => request('/api-keys'),
  createApiKey: (payload) => request('/api-keys', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  revokeApiKey: (id) => request(`/api-keys/${id}/revoke`, {
    method: 'POST'
  }),

  // Audit Logs
  getAuditLogs: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    const qs = query.toString();
    return request(`/audit${qs ? `?${qs}` : ''}`);
  },

  // Health
  getHealth: () => request('/health'),
};
