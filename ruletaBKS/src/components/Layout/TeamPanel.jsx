// src/components/Layout/TeamPanel.jsx
// Columna de equipo: slots asignados y slots pendientes segun el orden de roles
import { useContext } from 'react';
import { GameContext } from '../../context/GameContext';
import PlayerCard from './PlayerCard';

export default function TeamPanel({ team, title }) {
  const { teams, activeRoles, isSpinning } = useContext(GameContext);

  const roster = teams[team];
  const isBlue = team === 'blue';

  // Los roles activos se reparten alternando: Azul toma los pares, Rojo los impares
  const teamRoles = activeRoles.filter((_, i) => (i % 2 === 0) === isBlue);
  const pendingRoles = teamRoles.slice(roster.length);
  const totalAssigned = teams.blue.length + teams.red.length;
  const isBlueTurn = teams.blue.length <= teams.red.length;
  const isTeamTurn = isBlueTurn === isBlue && totalAssigned < activeRoles.length;
  const totalSlots = roster.length + pendingRoles.length;

  const textColor = isBlue ? 'text-lol-blue' : 'text-lol-red';
  const accentBar = isBlue ? 'left-0 bg-lol-blue shadow-[0_0_12px_#0ac8b9]' : 'right-0 bg-lol-red shadow-[0_0_12px_#ff4655]';
  const panelTint = isBlue ? 'bg-linear-to-r from-lol-blue/10 via-lol-panel/70 to-lol-panel/30' : 'bg-linear-to-l from-lol-red/10 via-lol-panel/70 to-lol-panel/30';
  const placement = isBlue ? 'ml-[2vw] mr-2' : 'mr-[2vw] ml-2';

  return (
    <aside className={`w-[clamp(210px,23vw,360px)] shrink-0 ${placement} my-auto flex flex-col relative z-10`}>

      <div className={`flex items-end justify-between px-1 mb-3 ${isBlue ? '' : 'flex-row-reverse'}`}>
        <div className={`flex flex-col ${isBlue ? 'items-start' : 'items-end'}`}>
          <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-lol-muted">
            {isBlue ? 'Lado Azul' : 'Lado Rojo'}
          </span>
          <h2 className={`font-display text-[clamp(16px,1.7vw,24px)] font-bold uppercase tracking-[0.15em] whitespace-nowrap ${textColor} drop-shadow-[0_0_10px_currentColor]`}>
            {title}
          </h2>
        </div>
        <span className="font-display text-lg font-bold text-lol-goldMid tabular-nums">
          {roster.length}<span className="text-lol-goldDark">/{totalSlots}</span>
        </span>
      </div>

      <div className={`relative frame-gold-thin ${panelTint} shadow-[0_0_30px_rgba(0,0,0,0.7),inset_0_0_40px_rgba(0,0,0,0.6)]`}>
        <div className={`absolute inset-y-0 w-[3px] ${accentBar}`} />

        <div className="max-h-[calc(100vh-240px)] overflow-y-auto custom-scrollbar flex flex-col divide-y divide-lol-goldDeep/60">
          {totalSlots === 0 ? (
            <div className="h-[76px] flex items-center justify-center text-[11px] font-semibold uppercase tracking-[0.25em] text-lol-mutedDark">
              Sin roles asignados
            </div>
          ) : (
            <>
              {roster.map((player, index) => (
                <PlayerCard key={index} player={player} role={player.role} isBlue={isBlue} />
              ))}
              {pendingRoles.map((role, index) => (
                <PlayerCard
                  key={`pending-${role.id}`}
                  role={role}
                  isBlue={isBlue}
                  isPicking={isTeamTurn && index === 0}
                  isSpinning={isSpinning}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
