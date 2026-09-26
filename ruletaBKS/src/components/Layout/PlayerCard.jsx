// src/components/Layout/PlayerCard.jsx
// Slot de invocador estilo seleccion de campeones (asignado o pendiente)
import { LockIcon } from './Icons';

export default function PlayerCard({ player = null, role, isBlue, isPicking = false, isSpinning = false }) {
  const isFilled = Boolean(player);
  const teamText = isBlue ? 'text-lol-blue' : 'text-lol-red';
  const direction = isBlue ? 'flex-row' : 'flex-row-reverse text-right';
  const filledTint = isBlue ? 'bg-linear-to-r from-lol-blue/15 to-transparent' : 'bg-linear-to-l from-lol-red/15 to-transparent';
  const pickingTint = isBlue ? 'bg-linear-to-r from-lol-blue/25 to-lol-blue/5 slot-picking-blue' : 'bg-linear-to-l from-lol-red/25 to-lol-red/5 slot-picking-red';
  const ringGlow = isBlue ? 'shadow-[0_0_14px_rgba(10,200,185,0.45)]' : 'shadow-[0_0_14px_rgba(255,70,85,0.45)]';

  let stateStyles = '';
  if (isFilled) stateStyles = `${filledTint} slot-lockin`;
  else if (isPicking) stateStyles = pickingTint;

  let subtitle = 'Esperando sorteo';
  if (isPicking) subtitle = isSpinning ? 'Sorteando...' : 'En turno';

  return (
    <div className={`relative h-[76px] flex items-center gap-3 px-3 xl:gap-4 xl:px-5 ${direction} ${stateStyles}`}>

      <div className={`relative shrink-0 w-11 h-11 xl:w-14 xl:h-14 rounded-full p-[2px] ${
        isFilled || isPicking ? `bg-linear-to-b from-lol-goldLight via-lol-goldMid to-lol-goldDark ${ringGlow}` : 'bg-linear-to-b from-lol-goldDark to-lol-goldDeep'
      }`}>
        <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_50%_35%,#0a323c_0%,#010a13_75%)] flex items-center justify-center">
          <img
            src={role.icon}
            alt={role.label}
            title={role.label}
            className={`w-6 h-6 xl:w-7 xl:h-7 object-contain ${isFilled || isPicking ? 'drop-shadow-[0_0_4px_rgba(200,170,110,0.9)]' : 'opacity-30 grayscale'}`}
          />
        </div>
      </div>

      <div className={`flex flex-col min-w-0 flex-1 ${isBlue ? 'items-start' : 'items-end'}`}>
        <span className={`whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.22em] ${isFilled || isPicking ? teamText : 'text-lol-mutedDark'}`}>
          {role.label}
        </span>
        {isFilled ? (
          <span className="max-w-full font-display text-base xl:text-lg font-bold uppercase tracking-[0.06em] text-lol-goldLight truncate">
            {player.name}
          </span>
        ) : (
          <span className={`max-w-full truncate text-xs xl:text-sm font-medium uppercase tracking-[0.16em] ${isPicking ? 'text-lol-goldLight/90' : 'text-lol-mutedDark/80'}`}>
            {subtitle}
          </span>
        )}
      </div>

      {isFilled && (
        <div className="shrink-0 hidden xl:flex items-center gap-1 px-2 py-1 border border-lol-goldDark/70 bg-lol-bg/70 text-lol-goldMid">
          <LockIcon className="w-2.5 h-2.5" />
          <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Fijado</span>
        </div>
      )}
    </div>
  );
}
