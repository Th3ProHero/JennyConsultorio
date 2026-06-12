import { useState, useEffect } from 'react';
import { X, Trash2, AlertTriangle, Calendar, Clock, MapPin, Edit2 } from 'lucide-react';
import { getRelativeTime } from '../../utils/dateFormatter';

export default function PatientForm({ patient, allAppointments, onSave, onClose, onDelete, saving }) {
  const [activeTab, setActiveTab] = useState('datos');
  const [isEditing, setIsEditing] = useState(!patient);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    insights: '',
    allergies: '',
    isBlacklisted: false
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || '',
        phone: patient.phone || '',
        email: patient.email || '',
        insights: patient.insights || '',
        allergies: patient.allergies || '',
        isBlacklisted: patient.isBlacklisted || false
      });
      setIsEditing(false); // Reset to view mode when patient changes
    } else {
      setIsEditing(true);
    }
  }, [patient]);

  const handleChange = (e) => {
    if (!isEditing) return;
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEditing) return;
    onSave(formData);
  };

  const patientAppts = allAppointments ? allAppointments.filter(a => a.patientId === patient?.id) : [];
  
  const futureAppts = patientAppts.filter(a => ['PENDING', 'CONFIRMED', 'TO_RESCHEDULE'].includes(a.status))
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
    
  const pastAppts = patientAppts.filter(a => ['COMPLETED', 'CANCELLED'].includes(a.status))
    .sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate));

  const statusColors = {
    'COMPLETED': 'var(--color-success)',
    'CANCELLED': 'var(--color-text-muted)',
    'PENDING': 'var(--color-warning)',
    'CONFIRMED': 'var(--color-primary)',
    'TO_RESCHEDULE': '#8B5CF6'
  };

  const statusLabels = {
    'COMPLETED': 'Completada',
    'CANCELLED': 'Cancelada',
    'PENDING': 'Por Confirmar',
    'CONFIRMED': 'Confirmada',
    'TO_RESCHEDULE': 'Por Reagendar'
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 100 }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px', display: 'flex', flexDirection: 'column', height: '90vh' }}>
        
        {/* Header */}
        <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--color-border)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {patient ? (isEditing ? 'Editar Paciente' : 'Expediente del Paciente') : 'Nuevo Paciente'}
              </h3>
              {patient && (
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                  Registrado: {new Date(patient.createdAt).toLocaleDateString('es-MX')}
                </p>
              )}
            </div>
            <button onClick={onClose} className="btn btn-outline" style={{ padding: '0.5rem', border: 'none' }}>
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          {patient && (
            <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--color-border)' }}>
              <button 
                className={`tab ${activeTab === 'datos' ? 'active' : ''}`}
                onClick={() => setActiveTab('datos')}
              >
                Datos Personales
              </button>
              <button 
                className={`tab ${activeTab === 'historial' ? 'active' : ''}`}
                onClick={() => setActiveTab('historial')}
              >
                Historial de Citas
              </button>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem' }}>
          
          {/* TAB: DATOS PERSONALES */}
          <div style={{ display: activeTab === 'datos' ? 'block' : 'none' }}>
            <form id="patientForm" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>Nombre Completo *</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="input w-full" placeholder="Ej. Ana Sofía Morales" disabled={!isEditing} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-4">
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>Teléfono</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input w-full" placeholder="+52 ..." disabled={!isEditing} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>Correo Electrónico</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="input w-full" placeholder="correo@ejemplo.com" disabled={!isEditing} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>Alergias</label>
                <input type="text" name="allergies" value={formData.allergies} onChange={handleChange} className="input w-full" placeholder="Ej. Penicilina, Látex, o 'Ninguna'" disabled={!isEditing} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>Insights / Tratamientos Activos (separados por coma)</label>
                <input type="text" name="insights" value={formData.insights} onChange={handleChange} className="input w-full" placeholder="Ej. Brackets, Endodoncia, Seguimiento..." disabled={!isEditing} />
              </div>

              {/* Blacklist Toggle */}
              <div style={{ 
                marginTop: '0.5rem', padding: '1rem', borderRadius: 'var(--radius-md)',
                background: formData.isBlacklisted ? 'var(--color-danger-light)' : 'var(--color-bg)',
                border: `1px solid ${formData.isBlacklisted ? 'var(--color-danger)' : 'var(--color-border)'}`,
                display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'all 0.3s ease',
                opacity: !isEditing ? 0.7 : 1
              }}>
                <input 
                  type="checkbox" 
                  id="isBlacklisted" 
                  name="isBlacklisted" 
                  checked={formData.isBlacklisted} 
                  onChange={handleChange}
                  disabled={!isEditing}
                  style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--color-danger)' }}
                />
                <label htmlFor="isBlacklisted" style={{ flex: 1, cursor: isEditing ? 'pointer' : 'default' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: formData.isBlacklisted ? '#991B1B' : 'var(--color-text)' }}>
                      Añadir a Lista Negra
                    </span>
                    {formData.isBlacklisted && <AlertTriangle size={16} color="#991B1B" />}
                  </div>
                  <p style={{ fontSize: '0.75rem', color: formData.isBlacklisted ? '#991B1B' : 'var(--color-text-muted)' }}>
                    Marcar si es un paciente conflictivo o que no debe ser agendado.
                  </p>
                </label>
              </div>
            </form>
          </div>

          {/* TAB: HISTORIAL DE CITAS */}
          <div style={{ display: activeTab === 'historial' ? 'block' : 'none' }}>
            {patientAppts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
                <Calendar size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <p>Este paciente no tiene historial de citas.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* Próximas Citas */}
                {futureAppts.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                      Próximas Citas
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {futureAppts.map(appt => (
                        <div key={appt.id} className="card" style={{ padding: '1rem', borderLeft: `4px solid ${statusColors[appt.status]}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h5 style={{ fontWeight: 700, color: 'var(--color-text)' }}>{appt.serviceName}</h5>
                            <span className="badge" style={{ background: 'var(--color-bg)', color: statusColors[appt.status], border: `1px solid ${statusColors[appt.status]}` }}>
                              {statusLabels[appt.status]}
                            </span>
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.75rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                              <Calendar size={14} /> {getRelativeTime(appt.scheduledDate)}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                              <Clock size={14} /> {new Date(appt.scheduledDate).toTimeString().slice(0,5)}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                              <MapPin size={14} /> {appt.clinic}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Citas Previas */}
                {pastAppts.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                      Historial
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {pastAppts.map(appt => (
                        <div key={appt.id} className="card" style={{ padding: '1rem', background: 'var(--color-bg)', opacity: appt.status === 'CANCELLED' ? 0.7 : 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h5 style={{ fontWeight: 600, color: 'var(--color-text)' }}>{appt.serviceName}</h5>
                            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: statusColors[appt.status] }}>
                              {statusLabels[appt.status].toUpperCase()}
                            </span>
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                              <Calendar size={14} /> {getRelativeTime(appt.scheduledDate)} ({new Date(appt.scheduledDate).toLocaleDateString('es-MX')})
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        {activeTab === 'datos' && (
          <div style={{ padding: '1.25rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, background: 'var(--color-surface)' }}>
            {patient && onDelete ? (
              <button type="button" onClick={() => onDelete(patient.id)} className="btn btn-danger" style={{ padding: '0.625rem' }} title="Eliminar paciente">
                <Trash2 size={18} />
              </button>
            ) : <div />}
            
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {!isEditing && patient && (
                <button type="button" onClick={() => setIsEditing(true)} className="btn btn-primary">
                  <Edit2 size={18} /> <span className="hidden sm:inline" style={{ marginLeft: '0.5rem' }}>Editar Info</span>
                </button>
              )}
              {isEditing && (
                <>
                  <button type="button" onClick={() => patient ? setIsEditing(false) : onClose()} className="btn btn-outline" disabled={saving}>
                    Cancelar
                  </button>
                  <button type="submit" form="patientForm" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Guardando...' : 'Guardar Paciente'}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
