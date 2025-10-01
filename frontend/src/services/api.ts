import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
  },
  register: async (userData: any) => {
    return api.post('/members', userData);
  }
};

// Member services
export const memberService = {
  getAll: () => api.get('/members'),
  getById: (id: number) => api.get(`/members/${id}`),
  create: (member: any) => api.post('/members', member),
  update: (id: number, member: any) => api.put(`/members/${id}`, member),
  updateVettingStatus: (id: number, status: string) => 
    api.patch(`/members/${id}/vetting?status=${status}`),
  assignPastor: (memberId: number, pastorId: number) => 
    api.patch(`/members/${memberId}/assign-pastor/${pastorId}`),
  getByVettingStatus: (status: string) => api.get(`/members/vetting/${status}`),
  getByPastor: (pastorId: number) => api.get(`/members/pastor/${pastorId}`)
};

// Pastor services
export const pastorService = {
  getAll: () => api.get('/pastors'),
  getById: (id: number) => api.get(`/pastors/${id}`),
  create: (pastor: any) => api.post('/pastors', pastor),
  getByChurchBranch: (branch: string) => api.get(`/pastors/branch/${branch}`),
  getByCountry: (countryCode: string) => api.get(`/pastors/country/${countryCode}`)
};

// Donation services
export const donationService = {
  getAll: () => api.get('/donations'),
  getById: (id: number) => api.get(`/donations/${id}`),
  create: (donation: any) => api.post('/donations', donation),
  getByMember: (memberId: number) => api.get(`/donations/member/${memberId}`),
  getByType: (type: string) => api.get(`/donations/type/${type}`),
  getByCampaign: (campaignCode: string) => api.get(`/donations/campaign/${campaignCode}`),
  getByDateRange: (startDate: string, endDate: string) => 
    api.get(`/donations/date-range?startDate=${startDate}&endDate=${endDate}`)
};

export default api;