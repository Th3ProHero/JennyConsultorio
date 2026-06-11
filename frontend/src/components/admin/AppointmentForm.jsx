import { useState, useEffect } from 'react';
import { X, Trash2, Calendar as CalIcon, Clock, AlertTriangle, CheckCircle, MapPin, Stethoscope, User, MessageCircle } from 'lucide-react';
import { api } from '../../api/client';
import { useFetch } from '../../hooks/useFetch';

export default function AppointmentForm({ appointment, selectedDate, selectedTime, onSave, onClose, onDelete, saving }) {
  const { data: patients } = useFetch(api.getPatients);
  const { data: services } = useFetch(api.getAdminServices);

  const [formData, setFormData] = useState({
    patientId: '',
    serviceId: '',
    clinic: 'Constitución 1917',
    date: selectedDate || new Date().toISOString().split('T')[0],
    time: selectedTime || '09:00',
    durationMinutes: 30,
    status: 'PENDING',
    notes: '',
    cost: 0
  });

  const isReadOnly = appointment?.status === 'COMPLETED' || appointment?.status === 'CANCELLED';

  useEffect(() => {
    if (appointment) {
      const d = new Date(appointment.scheduledDate);
      setFormData({
        patientId: appointment.patientId || '',
        serviceId: appointment.serviceId || '',
        clinic: appointment.clinic || 'Constitución 1917',
        date: d.toISOString().split('T')[0],
        time: d.toTimeString().slice(0, 5),
        durationMinutes: appointment.durationMinutes || 30,
        status: appointment.status || 'PENDING',
        notes: appointment.notes || '',
        cost: appointment.cost || 0
      });
    }
  }, [appointment]);

  const handleChange = (e) => {
    if (isReadOnly) return;
    const { name, value } = e.target;
    
    // Auto-fill cost and estimated duration when service changes
    if (name === 'serviceId') {
      const service = services?.find(s => s.id === parseInt(value));
      if (service) {
        setFormData(prev => ({ 
          ...prev, 
          [name]: value, 
          cost: service.basePrice,
          // Rough estimation: Cleanings/Consults ~30m, Whitening/Resins ~60m
          durationMinutes: (service.name.toLowerCase().includes('blanqueamiento') || service.name.toLowerCase().includes('resina') || service.name.toLowerCase().includes('carillas')) ? 60 : 30
        }));
        return;
      }
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isReadOnly) {
      onClose();
      return;
    }

    // Compose scheduledDate from date and time
    const scheduledDate = new Date(`${formData.date}T${formData.time}:00`).toISOString();
    
    // Find names
    const selectedPatient = patients?.find(p => p.id === parseInt(formData.patientId));
    const selectedService = services?.find(s => s.id === parseInt(formData.serviceId));

    onSave({
      ...formData,
      patientId: parseInt(formData.patientId),
      patientName: selectedPatient ? selectedPatient.name : 'Paciente',
      serviceId: parseInt(formData.serviceId),
      serviceName: selectedService ? selectedService.name : 'Servicio',
      durationMinutes: parseInt(formData.durationMinutes),
      cost: parseFloat(formData.cost),
      dentistId: 1, // Defaulting to Jenny F.
      dentistName: 'Jenny F.',
      scheduledDate
    });
  };

  const formatCurrency = (val) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val);

  const selectedPatientInfo = patients?.find(p => p.id === parseInt(formData.patientId));
  const patientPhone = selectedPatientInfo?.phone;

  const handleWhatsApp = () => {
    if (!patientPhone) return;
    const cleanPhone = patientPhone.replace(/\D/g, '');
    const serviceName = services?.find(s => s.id === parseInt(formData.serviceId))?.name || 'tu cita';
    const msg = `Hola ${selectedPatientInfo.name}, te escribimos de Jenny Dentista respecto a ${serviceName}.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 100 }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
          padding: '1.25rem', borderBottom: '1px solid var(--color-border)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>
              {appointment ? 'Detalles de la Cita' : 'Agendar Cita'}
            </h3>
            {isReadOnly && (
              <span className="badge" style={{ background: 'var(--color-surface-hover)' }}>Solo Lectura</span>
            )}
          </div>
          <button onClick={onClose} className="btn btn-outline" style={{ padding: '0.5rem', border: 'none' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                <User size={14}/> Paciente *
              </label>
              <select required name="patientId" value={formData.patientId} onChange={handleChange} className="input" disabled={isReadOnly}>
                <option value="">Selecciona un paciente...</option>
                {patients?.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                <MapPin size={14}/> Consultorio
              </label>
              <select name="clinic" value={formData.clinic} onChange={handleChange} className="input" disabled={isReadOnly}>
                <option value="Constitución 1917">Constitución 1917 (Iztapalapa)</option>
                <option value="Citlali">Citlali</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                <Stethoscope size={14}/> Procedimiento *
              </label>
              <select required name="serviceId" value={formData.serviceId} onChange={handleChange} className="input" disabled={isReadOnly}>
                <option value="">Selecciona servicio...</option>
                {services?.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({formatCurrency(s.basePrice)})</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                Costo Aplicado
              </label>
              <input required type="number" name="cost" value={formData.cost} onChange={handleChange} className="input" disabled={isReadOnly} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                <CalIcon size={14}/> Fecha *
              </label>
              <input required type="date" name="date" value={formData.date} onChange={handleChange} className="input" disabled={isReadOnly} />
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                <Clock size={14}/> Hora *
              </label>
              <input required type="time" name="time" value={formData.time} step="1800" onChange={handleChange} className="input" disabled={isReadOnly} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>Duración (min) *</label>
              <select required name="durationMinutes" value={formData.durationMinutes} onChange={handleChange} className="input" disabled={isReadOnly}>
                <option value="30">30 min</option>
                <option value="60">1 hr</option>
                <option value="90">1.5 hrs</option>
                <option value="120">2 hrs</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>Estado</label>
            <select name="status" value={formData.status} onChange={handleChange} className="input" disabled={isReadOnly}>
              <option value="PENDING">Agendada / Por Confirmar</option>
              <option value="CONFIRMED">Confirmada</option>
              <option value="TO_RESCHEDULE">Por Reagendar</option>
              <option value="COMPLETED">Completada</option>
              <option value="CANCELLED">Cancelada</option>
            </select>
            {formData.status === 'COMPLETED' && (
              <p style={{ fontSize: '0.75rem', color: 'var(--color-success)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <CheckCircle size={12}/> Al guardar como completada, alimentará las métricas y ya no será editable.
              </p>
            )}
            {formData.status === 'CANCELLED' && (
              <p style={{ fontSize: '0.75rem', color: 'var(--color-danger)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <AlertTriangle size={12}/> Al cancelar, liberará el espacio en la agenda.
              </p>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>Notas</label>
            <textarea name="notes" value={formData.notes} onChange={handleChange} className="input" rows="2" placeholder="Información adicional de la cita..." disabled={isReadOnly}></textarea>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {appointment && onDelete && !isReadOnly ? (
                <button type="button" onClick={() => onDelete(appointment.id)} className="btn btn-danger" style={{ padding: '0.625rem' }} title="Eliminar cita">
                  <Trash2 size={18} />
                </button>
              ) : null}
              {patientPhone && (
                <button type="button" onClick={handleWhatsApp} className="btn" style={{ padding: '0.625rem', background: '#25D366', color: 'white', border: 'none' }} title="Contactar por WhatsApp">
                  <MessageCircle size={18} /> <span className="hidden sm:inline" style={{ marginLeft: '0.5rem' }}>WhatsApp</span>
                </button>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" onClick={onClose} className="btn btn-outline" disabled={saving}>
                {isReadOnly ? 'Cerrar' : 'Cancelar'}
              </button>
              {!isReadOnly && (
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar Cita'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
