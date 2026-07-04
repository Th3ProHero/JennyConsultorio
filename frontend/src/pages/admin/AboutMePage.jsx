import { useState, useEffect } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useApi } from '../../hooks/useApi';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { User, MessageCircle, Save, CheckCircle, AlertCircle } from 'lucide-react';

const BIO_MAX = 350;
const WA_MAX = 20;

export default function AboutMePage() {
  const { data: dentists, loading } = useFetch(api.getAdminDentists);
  const { execute: updateDentist, loading: saving } = useApi();

  const [bio, setBio] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [toast, setToast] = useState(null); // { type: 'success'|'error', msg }

  // Populate form once data loads
  useEffect(() => {
    if (dentists && dentists.length > 0) {
      const jenny = dentists[0];
      setBio(jenny.bio ?? 'Odontóloga especialista apasionada por crear sonrisas hermosas y saludables. Te brindamos un trato cálido, honesto y con la mejor tecnología dental.');
      setWhatsappNumber(jenny.whatsappNumber ?? '+52 5511965133');
    }
  }, [dentists]);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async () => {
    if (!dentists || dentists.length === 0) return;
    const jenny = dentists[0];

    // Basic validation
    const waClean = whatsappNumber.replace(/\s/g, '');
    if (!/^\+?\d{10,20}$/.test(waClean)) {
      showToast('error', 'El número de WhatsApp debe tener entre 10 y 20 dígitos.');
      return;
    }
    if (bio.trim().length === 0) {
      showToast('error', 'La descripción no puede estar vacía.');
      return;
    }

    try {
      await updateDentist(api.updateDentist, jenny.id, {
        name: jenny.name,
        specialty: jenny.specialty,
        phone: jenny.phone,
        bio: bio.trim(),
        whatsappNumber: whatsappNumber.trim(),
      });
      showToast('success', '¡Cambios guardados! Se verán en el sitio de inmediato.');
    } catch (err) {
      showToast('error', 'Error al guardar: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
        <LoadingSpinner text="Cargando perfil..." />
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '560px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User size={20} style={{ color: 'var(--color-primary)' }} />
          About Me — Perfil Público
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
          Edita la presentación y el número de WhatsApp que aparecen en la página de inicio.
        </p>
      </div>

      {/* Bio Card */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'var(--color-primary-50)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <User size={18} style={{ color: 'var(--color-primary)' }} />
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text)' }}>Descripción / Bio</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Se muestra en la tarjeta expandible de la Dra. Jenny</p>
          </div>
        </div>

        <textarea
          id="about-bio-input"
          value={bio}
          onChange={(e) => {
            if (e.target.value.length <= BIO_MAX) setBio(e.target.value);
          }}
          rows={5}
          placeholder="Describe tu experiencia, especialidades y lo que hace especial tu consultorio..."
          className="input"
          style={{
            resize: 'vertical',
            minHeight: '110px',
            fontFamily: 'inherit',
            lineHeight: 1.6,
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.375rem' }}>
          <span style={{
            fontSize: '0.75rem',
            color: bio.length > BIO_MAX * 0.9 ? 'var(--color-warning, #f59e0b)' : 'var(--color-text-muted)'
          }}>
            {bio.length} / {BIO_MAX} caracteres
          </span>
        </div>
      </div>

      {/* WhatsApp Card */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'rgba(37, 211, 102, 0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <MessageCircle size={18} style={{ color: '#25D366' }} />
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--color-text)' }}>Número de WhatsApp</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Los clientes te contactarán a este número desde el botón verde flotante</p>
          </div>
        </div>

        <input
          id="about-whatsapp-input"
          type="tel"
          value={whatsappNumber}
          onChange={(e) => {
            if (e.target.value.length <= WA_MAX) setWhatsappNumber(e.target.value);
          }}
          placeholder="+52 5511965133"
          className="input"
        />
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.375rem' }}>
          Incluye el código de país, p.ej. <strong>+52</strong> para México. Sin espacios ni guiones al guardar.
        </p>
      </div>

      {/* Save Button */}
      <button
        id="about-save-btn"
        className="btn btn-primary"
        onClick={handleSave}
        disabled={saving}
        style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', gap: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {saving ? (
          <>Guardando...</>
        ) : (
          <>
            <Save size={18} />
            Guardar cambios
          </>
        )}
      </button>

      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 'calc(65px + 1.5rem + env(safe-area-inset-bottom) + 0.75rem)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: toast.type === 'success' ? 'var(--color-success, #10b981)' : 'var(--color-danger, #ef4444)',
            color: 'white',
            padding: '0.75rem 1.25rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            zIndex: 1000,
            whiteSpace: 'nowrap',
            animation: 'fade-in-up 0.25s ease',
          }}
        >
          {toast.type === 'success'
            ? <CheckCircle size={16} />
            : <AlertCircle size={16} />
          }
          {toast.msg}
        </div>
      )}
    </div>
  );
}
