import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ size = 'md', text = 'Cargando...' }) {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <Loader2
        className={`${sizes[size]} animate-spin`}
        style={{ color: 'var(--color-primary)' }}
      />
      {text && (
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {text}
        </p>
      )}
    </div>
  );
}
