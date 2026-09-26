// src/components/Layout/Header.jsx
// Barra superior: musica, titulo con fase actual del sorteo y acceso a configuracion
import { useContext, useState, useEffect, useRef } from 'react';
import { GameContext } from '../../context/GameContext';
import BksEmblem from './BksEmblem';
import { PlayIcon, PauseIcon, VolumeIcon, GearIcon } from './Icons';

import epicMusicFile from '../../assets/epic_music.mp3';

export default function Header() {
  const { setIsSettingsOpen, activeRoles, gameMode, teams, isSpinning, isAutoSpinning } = useContext(GameContext);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3); // Volumen inicial al 30%
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(epicMusicFile);
    audioRef.current.loop = true; // Que se repita infinitamente
    audioRef.current.volume = volume;

  return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error("El navegador bloqueó el autoplay. Haz clic de nuevo.", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const totalAssigned = teams.blue.length + teams.red.length;
  const nextRole = activeRoles[totalAssigned];
  const isBlueTurn = teams.blue.length <= teams.red.length;
  const turnTeam = isBlueTurn ? 'Equipo Azul' : 'Equipo Rojo';
  const turnColor = isBlueTurn ? 'text-lol-blue' : 'text-lol-red';

  let phaseTitle = 'Sorteo completado';
  if (!nextRole && totalAssigned === 0) phaseTitle = 'Sin roles activos';
  else if (nextRole && isAutoSpinning) phaseTitle = 'Sorteo automático';
  else if (nextRole && isSpinning) phaseTitle = 'Sorteando invocador';
  else if (nextRole) phaseTitle = 'Elige tu invocador';

  return (
    <header className="relative z-20 h-24 shrink-0 grid grid-cols-[1fr_auto_1fr] items-center px-8 bg-linear-to-b from-lol-bg via-lol-bg/90 to-lol-panel/40">

      <div className="flex items-center gap-5 justify-self-start">
        <button
          onClick={togglePlay}
          className={`btn-hex w-28 ${isPlaying ? 'is-active' : ''}`}
          title="Reproducir/Pausar Música Épica"
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
          {isPlaying ? 'Pausa' : 'Play'}
        </button>

        <div className="flex items-center gap-2.5 text-lol-goldMid">
          <VolumeIcon className="w-4 h-4" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="range-hex w-24"
            style={{ '--fill': `${volume * 100}%` }}
            aria-label="Volumen de la música"
          />
          <span className="w-8 text-[11px] font-semibold tabular-nums text-lol-muted">{Math.round(volume * 100)}</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1.5 px-6">
        <div className="flex items-center gap-3">
          <BksEmblem className="w-9 h-9" glow />
          <h1 className="font-display text-[26px] leading-none font-bold tracking-[0.18em] text-gold-gradient">
            BKS LoL Roulette
          </h1>
          <span className="px-2 py-0.5 border border-lol-goldDark bg-lol-bg/80 text-[10px] font-bold uppercase tracking-[0.2em] text-lol-goldMid whitespace-nowrap">
            {gameMode === '1v1' ? '1 vs 1' : '5 vs 5'}
          </span>
        </div>

        <div className="flex items-center gap-3 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.3em]">
          <span className="h-px w-10 bg-linear-to-r from-transparent to-lol-goldDark" />
          <span className="text-lol-goldLight/90">{phaseTitle}</span>
          {nextRole && (
            <>
              <span className="text-lol-goldDark">&#9670;</span>
              <span className={turnColor}>{turnTeam}</span>
              <span className="text-lol-muted">{nextRole.label}</span>
            </>
          )}
          <span className="h-px w-10 bg-linear-to-l from-transparent to-lol-goldDark" />
        </div>

        <div className="flex items-center gap-1.5" aria-label={`Pick ${Math.min(totalAssigned + 1, activeRoles.length)} de ${activeRoles.length}`}>
          {activeRoles.map((role, i) => {
            const pipColor = i % 2 === 0 ? 'bg-lol-blue border-lol-blue' : 'bg-lol-red border-lol-red';
            const isDone = i < totalAssigned;
            const isCurrent = i === totalAssigned;
            return (
              <span
                key={role.id}
                title={`${i + 1}. ${role.label}`}
                className={`w-2 h-2 rotate-45 border ${
                  isDone ? pipColor : isCurrent ? `${pipColor} pip-current` : 'border-lol-goldDark/70 bg-transparent'
                }`}
              />
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-self-end">
        <button
          onClick={() => setIsSettingsOpen(true)}
          disabled={isSpinning || isAutoSpinning}
          className="btn-hex"
          title="Configurar Partida"
        >
          <GearIcon className="w-4 h-4" />
          Configurar
        </button>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px bg-linear-to-r from-transparent via-lol-goldDark to-transparent" />
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-lol-bg border border-lol-goldMid" />
    </header>
  );
}
