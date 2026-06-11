let mockServices = [
  { id: 1, name: 'Limpieza Dental', description: 'Limpieza profesional con ultrasonido y pulido para eliminar sarro y manchas.', basePrice: 800, originalPrice: null, isPromotion: false },
  { id: 2, name: 'Blanqueamiento Dental', description: 'Blanqueamiento profesional con lámpara LED. Resultados visibles.', basePrice: 2500, originalPrice: 3500, isPromotion: true },
  { id: 3, name: 'Valoración Ortodoncia', description: 'Estudio inicial para brackets o alineadores.', basePrice: 500, originalPrice: null, isPromotion: false },
  { id: 4, name: 'Extracción Simple', description: 'Extracción de piezas dentales dañadas o muelas del juicio.', basePrice: 1200, originalPrice: null, isPromotion: false },
  { id: 5, name: 'Resina Estética', description: 'Eliminación de caries y colocación de resina del color del diente.', basePrice: 900, originalPrice: 1200, isPromotion: true },
  { id: 6, name: 'Carillas de Porcelana', description: 'Diseño de sonrisa permanente con carillas ultra delgadas.', basePrice: 5500, originalPrice: null, isPromotion: false },
  { id: 7, name: 'Cita de Seguimiento de Brackets', description: 'Ajuste mensual y cambio de ligas para tratamiento de ortodoncia.', basePrice: 600, originalPrice: null, isPromotion: false },
  { id: 8, name: 'Endodoncia Unirradicular', description: 'Tratamiento de conductos para salvar piezas dentales dañadas.', basePrice: 3500, originalPrice: null, isPromotion: false },
];

// Cargar desde localStorage para persistencia en demo
let mockPatients = JSON.parse(localStorage.getItem('mockPatients')) || [];

let mockAppointments = JSON.parse(localStorage.getItem('mockAppointments')) || [
  // Example data for today to test the calendar
  { id: 1, patientId: 1, patientName: 'Demo Patient', dentistName: 'Jenny F.', serviceId: 1, serviceName: 'Limpieza Dental', clinic: 'Constitución 1917', scheduledDate: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(), durationMinutes: 60, cost: 800, status: 'CONFIRMED', notes: '' },
  { id: 2, patientId: 1, patientName: 'Demo Patient', dentistName: 'Jenny F.', serviceId: 7, serviceName: 'Cita de Seguimiento de Brackets', clinic: 'Citlali', scheduledDate: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(), durationMinutes: 30, cost: 600, status: 'PENDING', notes: 'Posible empalme' }
];

const savePatients = () => localStorage.setItem('mockPatients', JSON.stringify(mockPatients));
const saveAppointments = () => localStorage.setItem('mockAppointments', JSON.stringify(mockAppointments));

export const api = {
  // ── Public ──
  getPublicServices: async () => {
    return new Promise(resolve => setTimeout(() => resolve([...mockServices]), 600));
  },
  
  // ── Admin Services (Tratamientos) ──
  getAdminServices: async () => {
    return new Promise(resolve => setTimeout(() => resolve([...mockServices].sort((a,b) => b.id - a.id)), 400));
  },
  createService: async (data) => {
    return new Promise(resolve => setTimeout(() => {
      const newService = {
        ...data,
        id: Math.max(0, ...mockServices.map(s => s.id)) + 1,
        isPromotion: data.isPromotion || false
      };
      mockServices.push(newService);
      resolve(newService);
    }, 400));
  },
  updateService: async (id, data) => {
    return new Promise((resolve, reject) => setTimeout(() => {
      const index = mockServices.findIndex(s => s.id === id);
      if (index === -1) return reject(new Error('Service not found'));
      mockServices[index] = { ...mockServices[index], ...data };
      resolve(mockServices[index]);
    }, 400));
  },
  deleteService: async (id) => {
    return new Promise((resolve, reject) => setTimeout(() => {
      const initialLength = mockServices.length;
      mockServices = mockServices.filter(s => s.id !== id);
      if (mockServices.length === initialLength) return reject(new Error('Service not found'));
      resolve();
    }, 400));
  },
  
  getPublicDentists: async () => {
    return new Promise(resolve => setTimeout(() => resolve([
      { id: 1, name: 'Jenny F.', specialty: 'Odontología General y Estética', phone: '+52 614 555 0101' }
    ]), 400));
  },

  // ── Dashboard ──
  getDashboard: async (month, year) => {
    return new Promise(resolve => setTimeout(() => {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const targetMonth = month !== undefined ? parseInt(month) : now.getMonth();
      const targetYear = year !== undefined ? parseInt(year) : now.getFullYear();

      const todayAppts = mockAppointments.filter(a => a.scheduledDate.startsWith(todayStr));
      
      let monthlyRevenue = 0;
      const serviceCounts = {};

      mockAppointments.forEach(a => {
        const d = new Date(a.scheduledDate);
        if (a.status === 'COMPLETED' && d.getMonth() === targetMonth && d.getFullYear() === targetYear) {
          monthlyRevenue += Number(a.cost || 0);
          serviceCounts[a.serviceName] = (serviceCounts[a.serviceName] || 0) + 1;
        }
      });

      const topServices = Object.entries(serviceCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([name, count]) => ({ name, count }));

      resolve({
        monthlyRevenue,
        todayAppointments: todayAppts.length,
        totalPatients: mockPatients.length,
        pendingAppointments: todayAppts.filter(a => a.status === 'PENDING').length,
        topServices,
        todaySchedule: todayAppts.sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
      });
    }, 500));
  },

  // ── Patients ──
  getPatients: async () => {
    return new Promise(resolve => setTimeout(() => resolve([...mockPatients].sort((a,b) => b.id - a.id)), 400));
  },
  createPatient: async (data) => {
    return new Promise(resolve => setTimeout(() => {
      const newPatient = {
        ...data,
        id: Math.max(0, ...mockPatients.map(p => p.id)) + 1,
        createdAt: new Date().toISOString(),
        isBlacklisted: data.isBlacklisted || false
      };
      mockPatients.push(newPatient);
      savePatients();
      resolve(newPatient);
    }, 400));
  },
  updatePatient: async (id, data) => {
    return new Promise((resolve, reject) => setTimeout(() => {
      const index = mockPatients.findIndex(p => p.id === id);
      if (index === -1) return reject(new Error('Patient not found'));
      mockPatients[index] = { ...mockPatients[index], ...data };
      savePatients();
      resolve(mockPatients[index]);
    }, 400));
  },
  deletePatient: async (id) => {
    return new Promise((resolve, reject) => setTimeout(() => {
      const initialLength = mockPatients.length;
      mockPatients = mockPatients.filter(p => p.id !== id);
      if (mockPatients.length === initialLength) return reject(new Error('Patient not found'));
      savePatients();
      resolve();
    }, 400));
  },

  // ── Appointments ──
  getAppointmentsByDate: async (date) => {
    return new Promise(resolve => setTimeout(() => {
      // Filter by date string (YYYY-MM-DD)
      const filtered = mockAppointments.filter(a => a.scheduledDate.startsWith(date));
      resolve(filtered);
    }, 400));
  },
  createAppointment: async (data) => {
    return new Promise(resolve => setTimeout(() => {
      const newAppt = {
        ...data,
        id: Math.max(0, ...mockAppointments.map(a => a.id)) + 1,
        status: data.status || 'PENDING'
      };
      mockAppointments.push(newAppt);
      saveAppointments();
      resolve(newAppt);
    }, 400));
  },
  updateAppointment: async (id, data) => {
    return new Promise((resolve, reject) => setTimeout(() => {
      const index = mockAppointments.findIndex(a => a.id === id);
      if (index === -1) return reject(new Error('Appointment not found'));
      mockAppointments[index] = { ...mockAppointments[index], ...data };
      saveAppointments();
      resolve(mockAppointments[index]);
    }, 400));
  },
  deleteAppointment: async (id) => {
    return new Promise((resolve, reject) => setTimeout(() => {
      const initialLength = mockAppointments.length;
      mockAppointments = mockAppointments.filter(a => a.id !== id);
      if (mockAppointments.length === initialLength) return reject(new Error('Appointment not found'));
      saveAppointments();
      resolve();
    }, 400));
  },
};
