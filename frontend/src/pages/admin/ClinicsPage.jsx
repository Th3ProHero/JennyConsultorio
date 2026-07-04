import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useApi } from '../../hooks/useApi';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { MapPin, Plus, X, Save, Trash2, Navigation, Clock, ExternalLink } from 'lucide-react';

const EMPTY_FORM = { name: '', address: '', hours: '', mapUrl: '', sortOrder: 0 };

function ClinicModal({ clinic, onSave, onClose, onDelete, saving }) {
  const [form, setForm] = useState(
    clinic
      ? { name: clinic.name, address: clinic.address, hours: clinic.hours ?? '', mapUrl: clinic.mapUrl ?? '', sortOrder: clinic.sortOrder ?? 0 }
      : EMPTY_FORM
  );
  const [errors, setErrors] = useState({});

  const set = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'El nombre es obligatorio.';
    if (!form.address.trim()) errs.address = 'La dirección es obligatoria.';
    if (form.mapUrl && !/^https?:\/\/.+/.test(form.mapUrl.trim())) {
      errs.mapUrl = 'El enlace debe comenzar con http:// o https://';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSave(form);
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        padding: '0',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: 'var(--color-surface)',
          borderRadius: '20px 20px 0 0',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '92dvh',
          overflowY: 'auto',
          padding: '1.75rem 1.5rem 2.5rem',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.25)',
          animation: 'slide-up 0.25s ease',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'var(--color-primary-50)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <MapPin size={18} style={{ color: 'var(--color-primary)' }} />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--color-text)' }}>
              {clinic ? 'Editar Consultorio' : 'Nuevo Consultorio'}
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '0.25rem' }}>
            <X size={20} />
          </button>
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.375rem' }}>
              Nombre del consultorio *
            </label>
            <input
              id="clinic-name"
              type="text"
              className="input"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Ej: Consultorio Constitución"
              maxLength={150}
            />
            {errors.name && <p style={{ fontSize: '0.75rem', color: 'var(--color-danger, #ef4444)', marginTop: '0.25rem' }}>{errors.name}</p>}
          </div>

          {/* Address */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.375rem' }}>
              Dirección *
            </label>
            <textarea
              id="clinic-address"
              className="input"
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
              placeholder="Calle, colonia, alcaldía, CP, ciudad"
              rows={2}
              maxLength={300}
              style={{ resize: 'vertical', minHeight: '64px', fontFamily: 'inherit' }}
            />
            {errors.address && <p style={{ fontSize: '0.75rem', color: 'var(--color-danger, #ef4444)', marginTop: '0.25rem' }}>{errors.address}</p>}
          </div>

          {/* Hours */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.375rem' }}>
              <Clock size={13} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'text-bottom' }} />
              Horario
            </label>
            <input
              id="clinic-hours"
              type="text"
              className="input"
              value={form.hours}
              onChange={(e) => set('hours', e.target.value)}
              placeholder="Ej: Lunes a Viernes: Previa Cita"
              maxLength={150}
            />
          </div>

          {/* Map URL */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.375rem' }}>
              <Navigation size={13} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'text-bottom' }} />
              Link de Google Maps
            </label>
            <input
              id="clinic-mapurl"
              type="url"
              className="input"
              value={form.mapUrl}
              onChange={(e) => set('mapUrl', e.target.value)}
              placeholder="https://maps.app.goo.gl/..."
            />
            {errors.mapUrl && <p style={{ fontSize: '0.75rem', color: 'var(--color-danger, #ef4444)', marginTop: '0.25rem' }}>{errors.mapUrl}</p>}
            {form.mapUrl && !errors.mapUrl && (
              <a href={form.mapUrl} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: '0.75rem', color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                <ExternalLink size={12} /> Probar enlace
              </a>
            )}
          </div>

          {/* Sort Order */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '0.375rem' }}>
              Orden de aparición
            </label>
            <input
              id="clinic-sort"
              type="number"
              className="input"
              value={form.sortOrder}
              onChange={(e) => set('sortOrder', parseInt(e.target.value) || 0)}
              min={0}
              style={{ width: '100px' }}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
              Número menor aparece primero en la página.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '2rem' }}>
          <button
            id="clinic-save-btn"
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={saving}
            style={{ width: '100%', padding: '0.875rem', fontSize: '0.9375rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            {saving ? 'Guardando...' : <><Save size={16} /> Guardar consultorio</>}
          </button>

          {onDelete && (
            <button
              id="clinic-delete-btn"
              className="btn"
              onClick={() => onDelete(clinic.id)}
              disabled={saving}
              style={{
                width: '100%', padding: '0.75rem',
                background: 'var(--color-danger-light, #fee2e2)',
                color: 'var(--color-danger, #ef4444)',
                border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                fontWeight: 600, borderRadius: '10px', cursor: 'pointer'
              }}
            >
              <Trash2 size={16} /> Eliminar consultorio
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────
export default function ClinicsPage() {
  const { data: clinics, loading, refetch } = useFetch(api.getAdminClinics);
  const { execute: saveClinic, loading: saving } = useApi();
  const { execute: deleteClinic } = useApi();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState(null);

  const handleOpenModal = (clinic = null) => {
    setSelectedClinic(clinic);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedClinic(null);
    setIsModalOpen(false);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedClinic) {
        await saveClinic(api.updateClinic, selectedClinic.id, formData);
      } else {
        await saveClinic(api.createClinic, formData);
      }
      refetch();
      handleCloseModal();
    } catch (err) {
      alert('Error al guardar consultorio: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Eliminar este consultorio? Dejará de aparecer en la página de inicio.')) {
      try {
        await deleteClinic(api.deleteClinic, id);
        refetch();
        handleCloseModal();
      } catch (err) {
        alert('Error al eliminar: ' + err.message);
      }
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={20} style={{ color: 'var(--color-primary)' }} />
            Consultorios
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Administra las ubicaciones que aparecen en la página de inicio.
          </p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn btn-primary" style={{ padding: '0.625rem' }}>
          <Plus size={18} />
        </button>
      </div>

      {/* List */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {loading ? (
          <LoadingSpinner text="Cargando consultorios..." />
        ) : clinics && clinics.length > 0 ? (
          clinics.map(clinic => (
            <div
              key={clinic.id}
              onClick={() => handleOpenModal(clinic)}
              className="card animate-fade-in-up"
              style={{
                padding: '1.25rem', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', gap: '0.5rem',
                position: 'relative', overflow: 'hidden'
              }}
            >
              {/* Pink accent bar */}
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '4px', height: '100%',
                background: 'var(--color-accent-pink-light)'
              }} />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text)' }}>{clinic.name}</h3>
                </div>
                <span style={{
                  fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '99px',
                  background: 'var(--color-primary-50)', color: 'var(--color-primary-dark)', fontWeight: 600
                }}>
                  Orden #{clinic.sortOrder ?? 0}
                </span>
              </div>

              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', paddingLeft: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {clinic.address}
              </p>

              {clinic.hours && (
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', paddingLeft: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Clock size={12} /> {clinic.hours}
                </p>
              )}

              {clinic.mapUrl && (
                <p style={{ fontSize: '0.75rem', color: 'var(--color-primary)', paddingLeft: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <Navigation size={12} /> Enlace de Maps configurado
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="card" style={{ padding: '3rem 1rem', textAlign: 'center' }}>
            <MapPin size={32} style={{ color: 'var(--color-text-muted)', margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>No hay consultorios configurados.</p>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Toca el botón + para agregar el primero.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <ClinicModal
          clinic={selectedClinic}
          onSave={handleSave}
          onClose={handleCloseModal}
          onDelete={selectedClinic ? handleDelete : null}
          saving={saving}
        />
      )}
    </div>
  );
}
