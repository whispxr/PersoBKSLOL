// src/components/Layout/BksEmblem.jsx
// Emblema hextech de BKS (reemplaza la mascota en emoji)
import { useId } from 'react';

export default function BksEmblem({ className = 'w-12 h-12', glow = false }) {
  const id = useId();
  const goldId = `${id}-gold`;
  const coreId = `${id}-core`;

  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={goldId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0e6d2" />
          <stop offset="0.45" stopColor="#c8aa6e" />
          <stop offset="1" stopColor="#785a28" />
        </linearGradient>
        <radialGradient id={coreId} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#cdfafa" />
          <stop offset="0.5" stopColor="#0ac8b9" />
          <stop offset="1" stopColor="#005a82" />
        </radialGradient>
      </defs>
      <path d="M32 2L58 17v30L32 62 6 47V17z" fill="#010a13" stroke={`url(#${goldId})`} strokeWidth="2.5" />
      <path d="M32 9l20 11.5v23L32 55 12 43.5v-23z" fill="none" stroke="#c8aa6e" strokeOpacity="0.35" />
      <path d="M32 13v8M32 43v8M14.5 23l6.5 4M49.5 23l-6.5 4M14.5 41l6.5-4M49.5 41l-6.5-4" stroke="#c8aa6e" strokeOpacity="0.55" strokeWidth="1.2" />
      <path d="M32 18l12 14-12 14-12-14z" fill={`url(#${goldId})`} />
      <path d="M32 23l7.5 9L32 41l-7.5-9z" fill={`url(#${coreId})`} style={glow ? { filter: 'drop-shadow(0 0 4px #0ac8b9)' } : undefined} />
    </svg>
  );
}
