import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Camera, Trash2, AlertTriangle, X, ExternalLink, FileText, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { api } from '../../api/client';
import './PatientDossier.css';

// ─── Constants ───────────────────────────────────────────
const MAX_DOCUMENTS = 6;
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'application/pdf'];

const TAG_OPTIONS = [
  { key: 'RAYOS_X',        label: 'Rayos X',         icon: '🦷' },
  { key: 'RECETA_MEDICA',  label: 'Receta Médica',   icon: '📋' },
  { key: 'ESTUDIOS',       label: 'Estudios',        icon: '🔬' },
  { key: 'OTROS',          label: 'Otros',           icon: '📎' },
];

const TAG_COLORS = {
  RAYOS_X:        { bg: '#E0F4FF', color: '#023E8A', border: '#90E0EF' },
  RECETA_MEDICA:  { bg: '#D1FAE5', color: '#065F46', border: '#6EE7B7' },
  ESTUDIOS:       { bg: '#EDE9FE', color: '#5B21B6', border: '#C4B5FD' },
  OTROS:          { bg: '#F1F5F9', color: '#475569', border: '#CBD5E1' },
};

const TAG_LABELS = {
  RAYOS_X: 'Rayos X',
  RECETA_MEDICA: 'Receta Médica',
  ESTUDIOS: 'Estudios',
  OTROS: 'Otros',
};

const TAG_ICONS = {
  RAYOS_X: '🦷',
  RECETA_MEDICA: '📋',
  ESTUDIOS: '🔬',
  OTROS: '📎',
};

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ─── Component ──────────────────────────────────────────
export default function PatientDossier({ patientId }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [lightboxDoc, setLightboxDoc] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [error, setError] = useState(null);
  const [blobUrls, setBlobUrls] = useState({});
  const [deleting, setDeleting] = useState(false);

  const fileInputRef = useRef(null);

  // ─── Fetch Documents ────────────────────────────────────
  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      const docs = await api.getPatientDocuments(patientId);
      setDocuments(docs || []);
    } catch (err) {
      setError('Error al cargar documentos: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    if (patientId) fetchDocuments();
  }, [patientId, fetchDocuments]);

  // ─── Load Blob URLs for rendering (authenticated) ──────
  useEffect(() => {
    let cancelled = false;
    const loadBlobs = async () => {
      const urls = {};
      for (const doc of documents) {
        // Skip if already loaded
        if (blobUrls[doc.id]) {
          urls[doc.id] = blobUrls[doc.id];
          continue;
        }
        try {
          const blob = await api.getPatientDocumentBlob(doc.id);
          if (cancelled) return;
          urls[doc.id] = URL.createObjectURL(blob);
        } catch {
          // Silently skip failed thumbnails
        }
      }
      if (!cancelled) setBlobUrls(prev => ({ ...prev, ...urls }));
    };

    if (documents.length > 0) loadBlobs();

    return () => { cancelled = true; };
  }, [documents]);

  // ─── Cleanup blob URLs on unmount ──────────────────────
  useEffect(() => {
    return () => {
      Object.values(blobUrls).forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  // ─── File Selection ────────────────────────────────────
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset input so same file can be re-selected
    e.target.value = '';

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Tipo de archivo no permitido. Solo imágenes (JPEG, PNG, GIF, WebP, BMP) y PDF.');
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      setError('El archivo excede el límite de 15 MB.');
      return;
    }

    setError(null);
    setSelectedFile(file);
    setSelectedTag(null);

    // Create preview URL
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleCancelUpload = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setSelectedTag(null);
    setError(null);
  };

  // ─── Upload ────────────────────────────────────────────
  const handleUpload = async () => {
    if (!selectedFile || !selectedTag) return;

    try {
      setUploading(true);
      setError(null);
      await api.uploadPatientDocument(patientId, selectedFile, selectedTag);

      // Cleanup and refresh
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setSelectedFile(null);
      setPreviewUrl(null);
      setSelectedTag(null);
      await fetchDocuments();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  // ─── Delete ────────────────────────────────────────────
  const handleDelete = async (docId) => {
    try {
      setDeleting(true);
      await api.deletePatientDocument(docId);

      // Revoke blob URL
      if (blobUrls[docId]) {
        URL.revokeObjectURL(blobUrls[docId]);
        setBlobUrls(prev => {
          const copy = { ...prev };
          delete copy[docId];
          return copy;
        });
      }

      setDeleteConfirmId(null);
      if (lightboxDoc?.id === docId) setLightboxDoc(null);
      await fetchDocuments();
    } catch (err) {
      setError('Error al eliminar: ' + err.message);
    } finally {
      setDeleting(false);
    }
  };

  // ─── Open in New Tab ───────────────────────────────────
  const handleOpenNewTab = (doc) => {
    const url = blobUrls[doc.id];
    if (url) window.open(url, '_blank');
  };

  const isAtLimit = documents.length >= MAX_DOCUMENTS;

  // ─── Render ────────────────────────────────────────────
  return (
    <div>
      {/* Error Message */}
      {error && (
        <div className="dossier-error">
          <AlertTriangle size={16} />
          <span>{error}</span>
          <button onClick={() => setError(null)} aria-label="Cerrar error">×</button>
        </div>
      )}

      {/* ──── Upload Section ──── */}
      {!selectedFile ? (
        <div className="dossier-upload-area">
          <input
            ref={fileInputRef}
            type="file"
            id="dossier-file-input"
            accept="image/*,application/pdf"
            capture="environment"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
            disabled={isAtLimit}
          />
          <label
            htmlFor="dossier-file-input"
            className="dossier-upload-btn"
            style={isAtLimit ? { opacity: 0.45, cursor: 'not-allowed', background: 'var(--color-text-muted)', boxShadow: 'none' } : {}}
            onClick={e => { if (isAtLimit) e.preventDefault(); }}
          >
            <Camera size={22} />
            {isAtLimit ? 'Límite de 6 archivos alcanzado' : 'Añadir Documento'}
          </label>
          <p className="dossier-counter">{documents.length} de {MAX_DOCUMENTS} archivos</p>
        </div>
      ) : (
        /* ──── Preview + Tag Selection ──── */
        <div className="dossier-preview-area">
          <div className="dossier-preview-header">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="dossier-preview-img" />
            ) : (
              <div className="dossier-preview-pdf">
                <FileText size={28} />
                PDF
              </div>
            )}
            <div className="dossier-preview-info">
              <p className="dossier-preview-name">{selectedFile.name}</p>
              <p className="dossier-preview-size">{formatFileSize(selectedFile.size)}</p>
            </div>
            <button className="dossier-preview-close" onClick={handleCancelUpload} aria-label="Cancelar">
              <X size={20} />
            </button>
          </div>

          {/* Tag Pills */}
          <p className="dossier-tag-label">Selecciona una etiqueta:</p>
          <div className="dossier-tags">
            {TAG_OPTIONS.map(({ key, label, icon }) => {
              const isActive = selectedTag === key;
              const colors = TAG_COLORS[key];
              return (
                <button
                  key={key}
                  className={`dossier-tag-pill ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedTag(key)}
                  style={isActive ? {
                    background: colors.bg,
                    color: colors.color,
                    borderColor: colors.border
                  } : {}}
                >
                  {icon} {label}
                </button>
              );
            })}
          </div>

          {/* Upload Progress */}
          {uploading && (
            <div className="dossier-progress">
              <div className="dossier-progress-bar" />
            </div>
          )}

          {/* Actions */}
          <div className="dossier-actions">
            <button
              onClick={handleCancelUpload}
              className="btn btn-outline"
              disabled={uploading}
            >
              Cancelar
            </button>
            <button
              onClick={handleUpload}
              className="btn btn-primary"
              disabled={!selectedTag || uploading}
            >
              {uploading ? 'Subiendo...' : 'Subir Documento'}
            </button>
          </div>
        </div>
      )}

      {/* ──── Documents Gallery ──── */}
      {loading ? (
        <div className="dossier-empty">
          <div className="dossier-loading-pulse dossier-empty-icon" style={{ width: 48, height: 48 }} />
          <p>Cargando documentos...</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="dossier-empty">
          <ImageIcon size={48} className="dossier-empty-icon" />
          <p>No hay documentos o radiografías aún.</p>
        </div>
      ) : (
        <>
          <h4 className="dossier-section-title">
            Expediente Médico
            <span className="dossier-count-badge">{documents.length}</span>
          </h4>
          <div className="dossier-grid">
            {documents.map((doc, idx) => {
              const tagColors = TAG_COLORS[doc.tag] || TAG_COLORS.OTROS;
              const isImage = doc.mimeType?.startsWith('image/');
              return (
                <div
                  key={doc.id}
                  className="dossier-card animate-fade-in-up"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  {/* Thumbnail */}
                  <div className="dossier-card-img" onClick={() => {
                    if (!isImage && blobUrls[doc.id]) {
                      // PDFs open directly in a new tab (better mobile support)
                      window.open(blobUrls[doc.id], '_blank');
                    } else {
                      setLightboxDoc(doc);
                    }
                  }}>
                    {blobUrls[doc.id] ? (
                      isImage ? (
                        <img src={blobUrls[doc.id]} alt={doc.name} loading="lazy" />
                      ) : (
                        <div className="dossier-card-pdf">
                          <FileText size={36} />
                          PDF
                        </div>
                      )
                    ) : (
                      <div className="dossier-card-loading">
                        <div className="dossier-loading-pulse" />
                      </div>
                    )}
                  </div>

                  {/* Info Footer */}
                  <div className="dossier-card-info">
                    <div className="dossier-card-footer">
                      <span
                        className="dossier-tag-badge"
                        style={{
                          background: tagColors.bg,
                          color: tagColors.color,
                          borderColor: tagColors.border
                        }}
                      >
                        {TAG_ICONS[doc.tag] || '📎'} {TAG_LABELS[doc.tag] || 'Otros'}
                      </span>
                      <button
                        className="dossier-delete-btn"
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(doc.id); }}
                        aria-label="Eliminar documento"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <span className="dossier-card-date">{formatDate(doc.date)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ──── Lightbox (Fullscreen Viewer) — rendered via Portal to escape modal overflow ──── */}
      {lightboxDoc && createPortal(
        <div className="dossier-lightbox" onClick={() => setLightboxDoc(null)}>
          <div className="dossier-lightbox-header" onClick={e => e.stopPropagation()}>
            {/* Back Button */}
            <button
              className="dossier-lightbox-back-btn"
              onClick={() => setLightboxDoc(null)}
              aria-label="Volver"
            >
              <ArrowLeft size={20} />
              <span>Volver</span>
            </button>
            <div className="dossier-lightbox-actions">
              {lightboxDoc.mimeType?.startsWith('image/') && (
                <button
                  className="dossier-lightbox-open-btn"
                  onClick={() => handleOpenNewTab(lightboxDoc)}
                >
                  <ExternalLink size={16} /> Abrir
                </button>
              )}
              <button
                className="dossier-lightbox-close"
                onClick={() => setLightboxDoc(null)}
                aria-label="Cerrar visor"
              >
                <X size={22} />
              </button>
            </div>
          </div>
          <div className="dossier-lightbox-body" onClick={e => e.stopPropagation()}>
            {blobUrls[lightboxDoc.id] ? (
              <img
                src={blobUrls[lightboxDoc.id]}
                alt={lightboxDoc.name}
                className="dossier-lightbox-img"
              />
            ) : (
              <div className="dossier-loading-pulse" style={{ width: 60, height: 60 }} />
            )}
          </div>
          <div className="dossier-lightbox-info" onClick={e => e.stopPropagation()}>
            <span
              className="dossier-tag-badge"
              style={{
                background: (TAG_COLORS[lightboxDoc.tag] || TAG_COLORS.OTROS).bg,
                color: (TAG_COLORS[lightboxDoc.tag] || TAG_COLORS.OTROS).color,
                borderColor: (TAG_COLORS[lightboxDoc.tag] || TAG_COLORS.OTROS).border,
                fontSize: '0.7rem',
                padding: '0.2rem 0.5rem',
              }}
            >
              {TAG_ICONS[lightboxDoc.tag] || '📎'} {TAG_LABELS[lightboxDoc.tag] || 'Otros'}
            </span>
            <span className="dossier-lightbox-info-text">
              {lightboxDoc.name} · {formatDate(lightboxDoc.date)}
            </span>
          </div>
        </div>,
        document.body
      )}

      {/* ──── Delete Confirmation Modal — rendered via Portal ──── */}
      {deleteConfirmId && createPortal(
        <div className="dossier-delete-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="dossier-delete-dialog" onClick={e => e.stopPropagation()}>
            <AlertTriangle size={40} color="var(--color-warning)" />
            <h4>¿Eliminar documento?</h4>
            <p>Esta acción no se puede deshacer y el archivo no se podrá recuperar.</p>
            <div className="dossier-delete-dialog-actions">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="btn btn-outline"
                disabled={deleting}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="btn btn-danger"
                disabled={deleting}
              >
                {deleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
