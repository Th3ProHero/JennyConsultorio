// client.js
const BASE_URL = '/api';

async function fetchWithConfig(url, options = {}) {
  const token = sessionStorage.getItem('jwtToken');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers
  });
  
  if (!response.ok) {
    const errorMsg = await response.text();
    throw new Error(errorMsg || 'Error de conexión con el servidor');
  }
  
  // Si la respuesta es 204 No Content
  if (response.status === 204) return null;
  
  return response.json();
}

export const api = {
  // ── Public ──
  getPublicServices: () => fetchWithConfig('/public/services'),
  getPublicDentists: () => fetchWithConfig('/public/dentists'),
  
  // ── Admin Services (Tratamientos) ──
  getAdminServices: () => fetchWithConfig('/admin/services'),
  createService: (data) => fetchWithConfig('/admin/services', { method: 'POST', body: JSON.stringify(data) }),
  updateService: (id, data) => fetchWithConfig(`/admin/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteService: (id) => fetchWithConfig(`/admin/services/${id}`, { method: 'DELETE' }),

  // ── Dashboard ──
  getDashboard: (month, year) => {
    let query = '';
    if (month !== undefined && year !== undefined) {
      query = `?month=${month}&year=${year}`;
    }
    return fetchWithConfig(`/admin/dashboard${query}`);
  },

  // ── Patients ──
  getPatients: () => fetchWithConfig('/admin/patients'),
  createPatient: (data) => fetchWithConfig('/admin/patients', { method: 'POST', body: JSON.stringify(data) }),
  updatePatient: (id, data) => fetchWithConfig(`/admin/patients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deletePatient: (id) => fetchWithConfig(`/admin/patients/${id}`, { method: 'DELETE' }),

  // ── Appointments ──
  getAllAppointments: () => fetchWithConfig('/admin/appointments'),
  getAppointmentsByDate: (date) => fetchWithConfig(`/admin/appointments/date/${date}`),
  createAppointment: (data) => fetchWithConfig('/admin/appointments', { method: 'POST', body: JSON.stringify(data) }),
  updateAppointment: (id, data) => fetchWithConfig(`/admin/appointments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAppointment: (id) => fetchWithConfig(`/admin/appointments/${id}`, { method: 'DELETE' }),

  // ── Notes ──
  getNotes: () => fetchWithConfig('/admin/notes'),
  createNote: (data) => fetchWithConfig('/admin/notes', { method: 'POST', body: JSON.stringify(data) }),
  updateNote: (id, data) => fetchWithConfig(`/admin/notes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteNote: (id) => fetchWithConfig(`/admin/notes/${id}`, { method: 'DELETE' }),
};
