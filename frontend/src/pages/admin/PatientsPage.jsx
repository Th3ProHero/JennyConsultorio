import { useState, useMemo } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useApi } from '../../hooks/useApi';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import PatientForm from '../../components/admin/PatientForm';
import { Search, UserPlus, Phone, Mail, AlertOctagon, CalendarCheck } from 'lucide-react';
import { getRelativeTime } from '../../utils/dateFormatter';

export default function PatientsPage() {
  const { data: patients, loading: loadingPatients, refetch: refetchPatients } = useFetch(api.getPatients);
  const { data: allAppointments, loading: loadingAppts, refetch: refetchAppts } = useFetch(api.getAllAppointments);
  
  const { execute: savePatient, loading: saving } = useApi();
  const { execute: deletePatient } = useApi();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const filteredPatients = patients?.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.phone?.includes(searchTerm)
  );

  const handleOpenModal = (patient = null) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedPatient(null);
    setIsModalOpen(false);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedPatient) {
        await savePatient(api.updatePatient, selectedPatient.id, formData);
      } else {
        await savePatient(api.createPatient, formData);
      }
      refetchPatients(); // Recargar la lista
      handleCloseModal();
    } catch (err) {
      alert("Error al guardar paciente: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePatient(api.deletePatient, id);
      refetchPatients();
      handleCloseModal();
    } catch (err) {
      alert("Error al eliminar paciente: " + err.message);
    }
  };

  // Pre-calcular la última cita completada para cada paciente
  const getLastAppointment = (patientId) => {
    if (!allAppointments) return null;
    const patientAppts = allAppointments.filter(a => a.patientId === patientId && a.status === 'COMPLETED');
    if (patientAppts.length === 0) return null;
    
    // Ordenar de más reciente a más antigua
    patientAppts.sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate));
    return patientAppts[0];
  };

  return (
    <div className="animate-fade-in pb-24 min-h-screen overflow-x-hidden">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)' }}>
            Pacientes
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Directorio y expedientes médicos.
          </p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn btn-primary" style={{ padding: '0.625rem' }}>
          <UserPlus size={18} /> <span className="hidden sm:inline" style={{ marginLeft: '0.5rem' }}>Nuevo</span>
        </button>
      </div>

      {/* Buscador */}
      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
        <input 
          type="text" 
          placeholder="Buscar por nombre o teléfono..." 
          className="input"
          style={{ paddingLeft: '2.5rem' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Lista de Pacientes */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {loadingPatients || loadingAppts ? (
          <LoadingSpinner text="Cargando pacientes..." />
        ) : filteredPatients && filteredPatients.length > 0 ? (
          filteredPatients.map(patient => {
            const lastAppt = getLastAppointment(patient.id);
            return (
            <div 
              key={patient.id} 
              onClick={() => handleOpenModal(patient)}
              className="card animate-fade-in-up" 
              style={{ 
                padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem',
                cursor: 'pointer',
                border: patient.isBlacklisted ? '1px solid var(--color-danger)' : '1px solid var(--color-border)',
                background: patient.isBlacklisted ? 'var(--color-danger-light)' : 'var(--color-surface)',
                opacity: patient.isBlacklisted ? 0.9 : 1
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    background: patient.isBlacklisted ? 'var(--color-danger)' : 'var(--color-primary-light)', 
                    color: patient.isBlacklisted ? 'white' : 'var(--color-primary-dark)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '1.125rem'
                  }}>
                    {patient.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="truncate" style={{ fontSize: '1rem', fontWeight: 700, color: patient.isBlacklisted ? '#991B1B' : 'var(--color-text)' }}>
                      {patient.name}
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: patient.isBlacklisted ? '#991B1B' : 'var(--color-text-muted)' }}>
                      Registrado: {new Date(patient.createdAt).toLocaleDateString('es-MX')}
                    </p>
                  </div>
                </div>
                
                {patient.isBlacklisted && (
                  <span className="badge badge-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <AlertOctagon size={14} /> Blacklist
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.25rem' }}>
                {patient.phone && (
                  <div className="truncate max-w-full" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: patient.isBlacklisted ? '#991B1B' : 'var(--color-text-muted)' }}>
                    <Phone size={14} style={{ flexShrink: 0 }} /> <span className="truncate">{patient.phone}</span>
                  </div>
                )}
                {patient.email && (
                  <div className="truncate max-w-full" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: patient.isBlacklisted ? '#991B1B' : 'var(--color-text-muted)' }}>
                    <Mail size={14} style={{ flexShrink: 0 }} /> <span className="truncate">{patient.email}</span>
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                {/* Preview alergias y padecimientos */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {patient.allergies && patient.allergies.toLowerCase() !== 'ninguna' && (
                    <span className="badge badge-danger" style={{ fontSize: '0.65rem' }}>
                      Alergia: {patient.allergies}
                    </span>
                  )}
                  {patient.insights && patient.insights.split(',').map((insight, idx) => {
                    const val = insight.trim();
                    if (!val) return null;
                    return (
                      <span key={idx} className="badge" style={{ fontSize: '0.65rem', background: 'var(--color-primary-light)', color: 'var(--color-primary-dark)' }}>
                        {val}
                      </span>
                    );
                  })}
                </div>
                
                {/* Last Appointment Indicator */}
                {lastAppt && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', background: 'var(--color-bg)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                    <CalendarCheck size={12} color="var(--color-success)" />
                    Última cita: <strong>{getRelativeTime(lastAppt.scheduledDate)}</strong>
                  </div>
                )}
              </div>
            </div>
            );
          })
        ) : (
          <div className="card" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-muted)' }}>No se encontraron pacientes.</p>
          </div>
        )}
      </div>

      {/* Modal de Formulario */}
      {isModalOpen && (
        <PatientForm 
          patient={selectedPatient} 
          allAppointments={allAppointments}
          onSave={handleSave} 
          onClose={handleCloseModal}
          onDelete={selectedPatient ? handleDelete : null}
          onApptUpdate={refetchAppts}
          saving={saving}
        />
      )}
    </div>
  );
}
