import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { useApi } from '../../hooks/useApi';
import { api } from '../../api/client';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { Plus, Trash2, CheckCircle, Circle, StickyNote } from 'lucide-react';

const CATEGORIES = [
  { id: 'GENERAL', label: 'Nota General', color: '#FEF3C7', border: '#FDE68A' },
  { id: 'PENDIENTES', label: 'Pendiente', color: '#FEE2E2', border: '#FECACA' },
  { id: 'COMPRAS', label: 'Por Comprar', color: '#D1FAE5', border: '#A7F3D0' }
];

export default function NotesPage() {
  const { data: notes, loading, refetch } = useFetch(api.getNotes);
  const { execute: createNote, loading: creating } = useApi();
  const { execute: updateNote } = useApi();
  const { execute: deleteNote } = useApi();

  const [newNoteText, setNewNoteText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('GENERAL');
  const [filter, setFilter] = useState('ALL');

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const categoryObj = CATEGORIES.find(c => c.id === selectedCategory);
    try {
      await createNote(api.createNote, {
        text: newNoteText,
        category: selectedCategory,
        color: categoryObj.color
      });
      setNewNoteText('');
      refetch();
    } catch (err) {
      alert("Error al crear la nota");
    }
  };

  const handleToggleCompleted = async (note) => {
    try {
      await updateNote(api.updateNote, note.id, { isCompleted: !note.isCompleted });
      refetch();
    } catch (err) {
      alert("Error al actualizar la nota");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta nota?")) {
      try {
        await deleteNote(api.deleteNote, id);
        refetch();
      } catch (err) {
        alert("Error al eliminar la nota");
      }
    }
  };

  const filteredNotes = notes?.filter(note => filter === 'ALL' || note.category === filter) || [];

  return (
    <div className="animate-fade-in pb-24 min-h-screen overflow-x-hidden">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text)' }}>
            Notas
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Pendientes, compras y notas del consultorio.
          </p>
        </div>
        <StickyNote size={28} color="var(--color-primary)" />
      </div>

      {/* Formulario para nueva nota */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <textarea
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            placeholder="Escribe una nueva nota..."
            className="input"
            rows="3"
            style={{ resize: 'none' }}
            required
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '0.4rem 0.75rem',
                    borderRadius: '1rem',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    background: selectedCategory === cat.id ? cat.color : 'transparent',
                    border: `1px solid ${selectedCategory === cat.id ? cat.border : 'var(--color-border)'}`,
                    color: 'var(--color-text)',
                    transition: 'all 0.2s'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <button type="submit" className="btn btn-primary" disabled={creating} style={{ padding: '0.5rem 1.5rem' }}>
              <Plus size={18} /> {creating ? 'Guardando...' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        <button onClick={() => setFilter('ALL')} className={`badge ${filter === 'ALL' ? 'bg-[var(--color-primary)] text-white' : ''}`} style={{ cursor: 'pointer' }}>
          Todas
        </button>
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setFilter(cat.id)} className={`badge ${filter === cat.id ? 'bg-[var(--color-text)] text-white' : ''}`} style={{ cursor: 'pointer' }}>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Muro de Notas */}
      {loading ? (
        <LoadingSpinner text="Cargando notas..." />
      ) : filteredNotes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
          <p>No hay notas en esta categoría.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          {filteredNotes.map(note => (
            <div
              key={note.id}
              className="card animate-fade-in-up"
              style={{
                background: note.color || '#FEF3C7',
                border: '1px solid rgba(0,0,0,0.05)',
                boxShadow: '2px 4px 10px rgba(0,0,0,0.05)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                opacity: note.isCompleted ? 0.7 : 1,
                position: 'relative'
              }}
            >
              <p style={{
                fontSize: '0.9375rem',
                color: 'var(--color-text)',
                lineHeight: 1.5,
                flex: 1,
                textDecoration: note.isCompleted ? 'line-through' : 'none',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {note.text}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '0.75rem' }}>
                <button
                  onClick={() => handleToggleCompleted(note)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: note.isCompleted ? 'var(--color-success)' : 'var(--color-text-muted)', fontSize: '0.8125rem', fontWeight: 600 }}
                >
                  {note.isCompleted ? <CheckCircle size={18} /> : <Circle size={18} />}
                  {note.isCompleted ? 'Completado' : 'Marcar'}
                </button>

                <button
                  onClick={() => handleDelete(note.id)}
                  style={{ color: 'var(--color-danger)', opacity: 0.7, padding: '0.25rem' }}
                  className="hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
