import { useState, useEffect } from 'react';
import { X, Trash2, Tag } from 'lucide-react';

export default function ServiceForm({ service, onSave, onClose, onDelete, saving }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    originalPrice: '',
    isPromotion: false
  });

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || '',
        description: service.description || '',
        basePrice: service.basePrice || '',
        originalPrice: service.originalPrice || '',
        isPromotion: service.isPromotion || false
      });
    }
  }, [service]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      basePrice: parseFloat(formData.basePrice) || 0,
      originalPrice: formData.isPromotion && formData.originalPrice ? parseFloat(formData.originalPrice) : null
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
          padding: '1.25rem', borderBottom: '1px solid var(--color-border)' 
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>
            {service ? 'Editar Tratamiento' : 'Nuevo Tratamiento'}
          </h3>
          <button onClick={onClose} className="btn btn-outline" style={{ padding: '0.5rem', border: 'none' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>Nombre del Tratamiento *</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="input" placeholder="Ej. Limpieza Dental" />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem' }}>Descripción Corta</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="input" rows="2" placeholder="Describe brevemente el tratamiento..."></textarea>
          </div>

          {/* Promotion Toggle */}
          <div style={{ 
            marginTop: '0.5rem', padding: '1rem', borderRadius: 'var(--radius-md)',
            background: formData.isPromotion ? 'var(--color-primary-50)' : 'var(--color-bg)',
            border: `1px solid ${formData.isPromotion ? 'var(--color-primary)' : 'var(--color-border)'}`,
            display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'all 0.3s ease'
          }}>
            <input 
              type="checkbox" 
              id="isPromotion" 
              name="isPromotion" 
              checked={formData.isPromotion} 
              onChange={handleChange}
              style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--color-primary)' }}
            />
            <label htmlFor="isPromotion" style={{ flex: 1, cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: formData.isPromotion ? 'var(--color-primary-dark)' : 'var(--color-text)' }}>
                  Activar Promoción
                </span>
                {formData.isPromotion && <Tag size={16} color="var(--color-primary)" />}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Si se activa, el precio original aparecerá tachado para mostrar el descuento.
              </p>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            {formData.isPromotion && (
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--color-text-muted)' }}>Precio Anterior (Tachado)</label>
                <input required={formData.isPromotion} type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className="input" placeholder="$" step="0.01" />
              </div>
            )}
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.25rem', color: formData.isPromotion ? 'var(--color-success)' : 'var(--color-text)' }}>
                {formData.isPromotion ? 'Precio Actual (Promoción) *' : 'Precio del Tratamiento *'}
              </label>
              <input required type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} className="input" placeholder="$" step="0.01" />
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)' }}>
            {service && onDelete ? (
              <button type="button" onClick={() => onDelete(service.id)} className="btn btn-danger" style={{ padding: '0.625rem' }}>
                <Trash2 size={18} />
              </button>
            ) : <div />}
            
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" onClick={onClose} className="btn btn-outline" disabled={saving}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
