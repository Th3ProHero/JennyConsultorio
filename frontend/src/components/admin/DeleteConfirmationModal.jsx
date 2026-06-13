import { AlertOctagon, X, Trash2 } from 'lucide-react';

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div 
        className="modal-content animate-fade-in-up" 
        onClick={e => e.stopPropagation()} 
        style={{ maxWidth: '400px', width: '90%', padding: '1.5rem', borderRadius: '1rem', textAlign: 'center' }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-1.5rem' }}>
          <button onClick={onClose} className="btn btn-outline" style={{ padding: '0.25rem', border: 'none' }}>
            <X size={20} />
          </button>
        </div>
        
        <div style={{ 
          width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-danger-light)', 
          color: 'var(--color-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', 
          margin: '0 auto 1.5rem' 
        }}>
          <AlertOctagon size={32} />
        </div>
        
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
          {title || "¿Estás completamente seguro?"}
        </h3>
        
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: '1.5' }}>
          {message || "Esta acción es irreversible. Se borrarán todos sus datos, incluyendo historial de citas y documentos adjuntos."}
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>
            Cancelar
          </button>
          <button 
            onClick={() => { onConfirm(); onClose(); }} 
            className="btn btn-danger" 
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            <Trash2 size={16} /> Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
