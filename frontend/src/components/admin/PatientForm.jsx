import { useState, useEffect } from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';

export default function PatientForm({ patient, onSave, onClose, onDelete, saving }) {
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
    }
  }, [patient]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
          padding: '1.25rem', borderBottom: '1px solid var(--color-border)' 
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>
            {patient ? 'Editar Paciente' : 'Nuevo Paciente'}
          </h3>
          <button onClick={onClose} className="btn btn-outline" style={{ padding: '0.5rem', border: 'none' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.25rem', paddingBottom: '6rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>Nombre Completo *</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="input w-full" placeholder="Ej. Ana Sofía Morales" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-4">
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>Teléfono</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input w-full" placeholder="+52 ..." />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>Correo Electrónico</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="input w-full" placeholder="correo@ejemplo.com" />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>Alergias</label>
            <input type="text" name="allergies" value={formData.allergies} onChange={handleChange} className="input w-full" placeholder="Ej. Penicilina, Látex, o 'Ninguna'" />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>Insights / Tratamientos Activos (separados por coma)</label>
            <input type="text" name="insights" value={formData.insights} onChange={handleChange} className="input w-full" placeholder="Ej. Brackets, Endodoncia, Seguimiento..." />
          </div>

          {/* Blacklist Toggle */}
          <div style={{ 
            marginTop: '0.5rem', padding: '1rem', borderRadius: 'var(--radius-md)',
            background: formData.isBlacklisted ? 'var(--color-danger-light)' : 'var(--color-bg)',
            border: `1px solid ${formData.isBlacklisted ? 'var(--color-danger)' : 'var(--color-border)'}`,
            display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'all 0.3s ease'
          }}>
            <input 
              type="checkbox" 
              id="isBlacklisted" 
              name="isBlacklisted" 
              checked={formData.isBlacklisted} 
              onChange={handleChange}
              style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--color-danger)' }}
            />
            <label htmlFor="isBlacklisted" style={{ flex: 1, cursor: 'pointer' }}>
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

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
            {patient && onDelete ? (
              <button type="button" onClick={() => onDelete(patient.id)} className="btn btn-danger" style={{ padding: '0.625rem' }}>
                <Trash2 size={18} />
              </button>
            ) : <div />}
            
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" onClick={onClose} className="btn btn-outline" disabled={saving}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar Paciente'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
