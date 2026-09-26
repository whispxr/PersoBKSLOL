// src/components/Layout/Icons.jsx
// Iconos SVG del cliente (reemplazan emojis y simbolos de texto)

export function PlayIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
      <path d="M4 2.5v11l9-5.5z" />
    </svg>
  );
}

export function PauseIcon({ className = 'w-3.5 h-3.5' }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
      <path d="M3.5 2.5h3v11h-3zM9.5 2.5h3v11h-3z" />
    </svg>
  );
}

export function VolumeIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden="true">
      <path d="M3 8h3l4-3.5v11L6 12H3z" fill="currentColor" stroke="none" />
      <path d="M13 7.5a3.5 3.5 0 0 1 0 5M15.2 5.3a6.6 6.6 0 0 1 0 9.4" strokeLinecap="round" />
    </svg>
  );
}

export function GearIcon({ className = 'w-5 h-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className} aria-hidden="true">
      <path strokeLinejoin="round" d="M10.3 2.8h3.4l.5 2.6 1.7.8 2.2-1.5 2.4 2.4-1.5 2.2.8 1.7 2.6.5v3.4l-2.6.5-.8 1.7 1.5 2.2-2.4 2.4-2.2-1.5-1.7.8-.5 2.6h-3.4l-.5-2.6-1.7-.8-2.2 1.5-2.4-2.4 1.5-2.2-.8-1.7-2.6-.5v-3.4l2.6-.5.8-1.7-1.5-2.2 2.4-2.4 2.2 1.5 1.7-.8z" />
      <path d="M12 8.5l3.5 3.5-3.5 3.5-3.5-3.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function CloseIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className} aria-hidden="true">
      <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" />
    </svg>
  );
}

export function DragIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
      <circle cx="5.5" cy="3.5" r="1.3" /><circle cx="10.5" cy="3.5" r="1.3" />
      <circle cx="5.5" cy="8" r="1.3" /><circle cx="10.5" cy="8" r="1.3" />
      <circle cx="5.5" cy="12.5" r="1.3" /><circle cx="10.5" cy="12.5" r="1.3" />
    </svg>
  );
}

export function ResetIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1" />
      <path d="M3.5 3.5v5h5" />
    </svg>
  );
}

export function ClipboardIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="5" y="4.5" width="14" height="17" />
      <path d="M9 3h6v3H9zM8.5 11h7M8.5 15h7" />
    </svg>
  );
}

export function AutoIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M20 12a8 8 0 0 1-13.7 5.6M4 12a8 8 0 0 1 13.7-5.6" />
      <path d="M17.7 2.5v4h-4M6.3 21.5v-4h4" />
      <path d="M10 8.5l5 3.5-5 3.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LockIcon({ className = 'w-3 h-3' }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
      <path d="M5 7V5a3 3 0 0 1 6 0v2h1v7H4V7zm1.5 0h3V5a1.5 1.5 0 0 0-3 0z" />
    </svg>
  );
}
