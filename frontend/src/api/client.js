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
    // Try to parse JSON error body from GlobalExceptionHandler
    let errorMsg = 'Error de conexión con el servidor';
    try {
      const text = await response.text();
      try {
        const errorJson = JSON.parse(text);
        errorMsg = errorJson.message || errorMsg;
      } catch {
        // Not JSON (e.g. HTML error page from proxy) — use a clean message
        if (response.status === 401 || response.status === 403) {
          sessionStorage.removeItem('jwtToken');
          window.location.href = '/';
          errorMsg = 'Sesión expirada. Por favor inicie sesión nuevamente.';
        } else if (response.status === 502) {
          errorMsg = 'El servidor no está disponible. Intente nuevamente.';
        } else {
          errorMsg = `Error ${response.status}: ${response.statusText || errorMsg}`;
        }
      }
    } catch {
      // Could not read response body at all
    }
    throw new Error(errorMsg);
  }
  
  // Si la respuesta es 204 No Content
  if (response.status === 204) return null;
  
  return response.json();
}

/**
 * Sends a multipart/form-data request. Used for file uploads.
 * Does NOT set Content-Type header — the browser sets it automatically with the boundary.
 */
async function fetchWithFormData(url, formData) {
  const token = sessionStorage.getItem('jwtToken');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    method: 'POST',
    headers,
    body: formData
  });

  if (!response.ok) {
    let errorMsg = 'Error al subir el archivo';
    try {
      const text = await response.text();
      try {
        const errorJson = JSON.parse(text);
        errorMsg = errorJson.message || errorMsg;
      } catch {
        if (response.status === 401 || response.status === 403) {
          sessionStorage.removeItem('jwtToken');
          window.location.href = '/';
          errorMsg = 'Sesión expirada. Por favor inicie sesión nuevamente.';
        } else if (response.status === 413) {
          errorMsg = 'El archivo excede el tamaño máximo permitido (15 MB).';
        } else {
          errorMsg = `Error ${response.status}: ${response.statusText || errorMsg}`;
        }
      }
    } catch {
      // Could not read response body
    }
    throw new Error(errorMsg);
  }

  if (response.status === 204) return null;
  return response.json();
}

/**
 * Fetches a binary blob (used for authenticated file serving).
 * Returns a Blob that can be turned into an object URL for rendering.
 */
async function fetchBlob(url) {
  const token = sessionStorage.getItem('jwtToken');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${url}`, { headers });
  if (!response.ok) throw new Error('Error al cargar el documento');
  return response.blob();
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

  // ── Patient Documents (Expediente Médico) ──
  uploadPatientDocument: (patientId, file, tag) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tag', tag);
    return fetchWithFormData(`/admin/patients/${patientId}/documents`, formData);
  },
  getPatientDocuments: (patientId) => fetchWithConfig(`/admin/patients/${patientId}/documents`),
  getPatientDocumentBlob: (docId) => fetchBlob(`/admin/documents/${docId}/file`),
  deletePatientDocument: (docId) => fetchWithConfig(`/admin/documents/${docId}`, { method: 'DELETE' }),
};
