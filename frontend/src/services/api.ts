const isNative = window.hasOwnProperty('Capacitor') || (window as any).Capacitor;

// For native (Capacitor) apps, use the dev machine's LAN IP so both
// emulators and physical devices on the same network can reach the backend.
// For the web version, derive the URL from the current browser hostname.
const DEV_MACHINE_IP = '10.175.4.117';
const API_BASE_URL = isNative
  ? `http://${DEV_MACHINE_IP}:3001/api`
  : `http://${window.location.hostname}:3001/api`;

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('nyxen_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
}

export const api = {
  // Auth
  async login(username: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return handleResponse<{ token: string; user: any }>(res);
  },

  // Projects
  async getProjects() {
    const res = await fetch(`${API_BASE_URL}/projects`, { headers: getAuthHeaders() });
    return handleResponse<any[]>(res);
  },

  async getProject(id: string) {
    const res = await fetch(`${API_BASE_URL}/projects/${id}`, { headers: getAuthHeaders() });
    return handleResponse<any>(res);
  },

  // Image Analysis
  async uploadImages(files: File[]) {
    const formData = new FormData();
    files.forEach((f) => formData.append('images', f));
    const token = localStorage.getItem('nyxen_token');
    const res = await fetch(`${API_BASE_URL}/analysis/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    return handleResponse<any>(res);
  },

  async analyzeImages(imageIds: string[]) {
    const res = await fetch(`${API_BASE_URL}/analysis/analyze`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ imageIds }),
    });
    return handleResponse<any>(res);
  },

  // GPS Verification
  async verifyGPS(lat: number, lng: number, surveyNumber?: string) {
    const res = await fetch(`${API_BASE_URL}/gps/verify`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ latitude: lat, longitude: lng, surveyNumber }),
    });
    return handleResponse<any>(res);
  },

  // Land Registry
  async searchRegistry(surveyNumber: string, district?: string, state?: string) {
    const params = new URLSearchParams({ surveyNumber });
    if (district) params.append('district', district);
    if (state) params.append('state', state);
    const res = await fetch(`${API_BASE_URL}/registry/search?${params}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<any>(res);
  },

  // Nyxen
  async getNyxen(projectId: string) {
    const res = await fetch(`${API_BASE_URL}/nyxen/${projectId}`, { headers: getAuthHeaders() });
    return handleResponse<any>(res);
  },

  async updateNyxenEntry(projectId: string, entryId: string, data: any) {
    const res = await fetch(`${API_BASE_URL}/nyxen/${projectId}/entries/${entryId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  async exportNyxen(projectId: string, format: 'json' | 'csv') {
    const res = await fetch(`${API_BASE_URL}/nyxen/${projectId}/export?format=${format}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<any>(res);
  },

  // Audit
  async getAuditReport(projectId: string) {
    const res = await fetch(`${API_BASE_URL}/audit/${projectId}`, { headers: getAuthHeaders() });
    return handleResponse<any>(res);
  },

  // Dashboard Stats
  async getDashboardStats() {
    const res = await fetch(`${API_BASE_URL}/dashboard/stats`, { headers: getAuthHeaders() });
    return handleResponse<any>(res);
  },
};
