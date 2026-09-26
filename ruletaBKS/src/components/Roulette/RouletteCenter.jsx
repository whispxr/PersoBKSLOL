// src/components/Roulette/RouletteCenter.jsx
import { useContext, useState, useEffect } from 'react';
import { GameContext } from '../../context/GameContext';
import BksEmblem from '../Layout/BksEmblem';
import { ResetIcon, ClipboardIcon, AutoIcon, PauseIcon } from '../Layout/Icons';

const sliceColors = ['#0b2233', '#071522', '#0a1b2e'];

const tickMarks = Array.from({ length: 72 }, (_, i) => i * 5);

const MANUAL_SPIN_MS = 6000;
const AUTO_SPIN_MS = 2000;
const AUTO_PAUSE_MS = 1500;

export default function RouletteCenter() {
  const {
    players, isSpinning, setIsSpinning,
    isAutoSpinning, setIsAutoSpinning, isAnnouncing,
    activeRoles, teams, gameMode,
    playSound, assignWinner,
    resetGame, copyTeamsToClipboard
  } = useContext(GameContext);

  const [rotation, setRotation] = useState(0);
  const [spinMs, setSpinMs] = useState(MANUAL_SPIN_MS);

  const activePlayers = players.filter(p => p && p.trim() !== '');
  const numSlices = activePlayers.length > 0 ? activePlayers.length : 1;
  const sliceAngle = 360 / numSlices;
  const picksLeft = activeRoles.length - (teams.blue.length + teams.red.length);
  const canSpin = !isSpinning && activePlayers.length > 0 && picksLeft > 0;

  const startSpin = (durationMs) => {
    if (!canSpin) return;

    const isFast = durationMs < MANUAL_SPIN_MS;

    // Un pick de Rojo cierra el enfrentamiento con el Azul de la misma ronda.
    // 5v5 manual: "Versus" al girar; 1v1 y 5v5 auto: "Versus" justo antes del nombre del rival
    const isRedPick = teams.blue.length > teams.red.length;
    let versus = null;
    if (isRedPick) versus = gameMode === '5v5' && !isFast ? 'start' : 'end';
    const matchup = {
      isFirstPick: teams.blue.length + teams.red.length === 0,
      versus,
    };

    setIsSpinning(true);
    setSpinMs(durationMs);
    playSound('spin', null, matchup);

    const extraSpins = (Math.floor(Math.random() * 3) + (isFast ? 3 : 5)) * 360;
    const randomStop = Math.floor(Math.random() * 360);
    const newTargetRotation = rotation + extraSpins + randomStop;

    setRotation(newTargetRotation);

    setTimeout(() => {
      setIsSpinning(false);

      const normalizedRotation = newTargetRotation % 360;
      const winningAngle = (360 - normalizedRotation) % 360;

      const winnerIndex = Math.floor(winningAngle / sliceAngle);
      const winnerName = activePlayers[winnerIndex];

      playSound('lock_in', winnerName, matchup);
      assignWinner(winnerName);

      if (activePlayers.length <= 1 || picksLeft <= 1) setIsAutoSpinning(false);
    }, durationMs);
  };

  const handleSpin = () => startSpin(MANUAL_SPIN_MS);

  const toggleAuto = () => {
    if (isAutoSpinning) {
      setIsAutoSpinning(false);
      return;
    }
    setIsAutoSpinning(true);
    startSpin(AUTO_SPIN_MS);
  };

  // Encadena el siguiente giro tras una pausa para escuchar el lock-in y la voz
  useEffect(() => {
    if (!isAutoSpinning || !canSpin || isAnnouncing) return;
    const timer = setTimeout(() => startSpin(AUTO_SPIN_MS), AUTO_PAUSE_MS);
    return () => clearTimeout(timer);
  });

  let spinLabel = 'Girar Ruleta';
  if (isAutoSpinning) spinLabel = 'Auto en curso...';
  else if (isSpinning) spinLabel = 'Girando...';
  else if (picksLeft <= 0 && activePlayers.length > 0) spinLabel = 'Equipos completos';

  // Sector i ocupa [i*sliceAngle, (i+1)*sliceAngle] en sentido horario desde arriba
  const sliceBackground = activePlayers.length > 0
    ? `conic-gradient(from 0deg, ${activePlayers.map((_, i) => {
        const isLastOdd = activePlayers.length > 1 && activePlayers.length % 2 === 1 && i === activePlayers.length - 1;
        const color = isLastOdd ? sliceColors[2] : sliceColors[i % 2];
        return `${color} ${i * sliceAngle}deg ${(i + 1) * sliceAngle}deg`;
      }).join(', ')})`
    : 'radial-gradient(circle, #0a1428 0%, #010a13 100%)';

  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative gap-6 py-4">

      <div className="relative aspect-square" style={{ width: 'min(460px, 56vh, 94%)' }}>

        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-[spin_90s_linear_infinite] motion-reduce:animate-none" aria-hidden="true">
          <circle cx="50" cy="50" r="49.3" fill="none" stroke="#785a28" strokeWidth="0.25" />
          {tickMarks.map(deg => (
            <line
              key={deg}
              x1="50" y1="0.9" x2="50" y2={deg % 30 === 0 ? 3.4 : 2.1}
              stroke={deg % 30 === 0 ? '#c8aa6e' : '#785a28'}
              strokeWidth={deg % 30 === 0 ? 0.45 : 0.25}
              transform={`rotate(${deg} 50 50)`}
            />
          ))}
        </svg>

        <div className={`absolute inset-[5%] rounded-full wheel-glow ${isSpinning ? 'is-spinning' : ''}`} />

        <div
          className="absolute inset-[5%] rounded-full p-[1.6%]"
          style={{ background: 'conic-gradient(from 0deg, #785a28, #c8aa6e, #f0e6d2, #c8aa6e, #785a28, #463714, #785a28, #c8aa6e, #f0e6d2, #c8aa6e, #785a28, #463714, #785a28)' }}
        >
          <div className="w-full h-full rounded-full p-[0.8%] bg-lol-bg">
            <div
              className="w-full h-full rounded-full relative overflow-hidden"
              style={{
                background: sliceBackground,
                transform: `rotate(${rotation}deg)`,
                transition: `transform ${spinMs}ms cubic-bezier(0.25, 0.1, 0.15, 1)`
              }}
            >
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,transparent_45%,rgba(1,10,19,0.65)_100%)]" />
              <div className="absolute inset-[4%] rounded-full border border-lol-goldMid/15" />
              <div className="absolute inset-[34%] rounded-full border border-lol-goldMid/20" />

              {activePlayers.length > 1 && activePlayers.map((_, index) => (
                <div key={`div-${index}`} className="absolute inset-0" style={{ transform: `rotate(${index * sliceAngle}deg)` }}>
                  <div className="absolute top-0 left-1/2 w-px h-1/2 -translate-x-1/2 bg-linear-to-b from-lol-goldMid/80 via-lol-goldDark/50 to-transparent" />
                </div>
              ))}

              {activePlayers.map((player, index) => (
                <div
                  key={index}
                  className="absolute inset-0"
                  style={{ transform: `rotate(${index * sliceAngle + sliceAngle / 2}deg)` }}
                >
                  <div className="absolute top-[7%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rotate-45 bg-lol-goldMid shadow-[0_0_6px_#c8aa6e]" />
                    <span
                      className="max-h-[92px] overflow-hidden text-ellipsis whitespace-nowrap font-ui text-[13px] font-bold uppercase tracking-[0.14em] text-lol-goldLight drop-shadow-[0_0_3px_rgba(0,0,0,1)]"
                      style={{ writingMode: 'vertical-rl' }}
                    >
                      {player}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <svg viewBox="0 0 40 56" className="absolute top-[0.5%] left-1/2 -translate-x-1/2 w-[8%] z-30 drop-shadow-[0_0_8px_rgba(200,170,110,0.7)]" aria-hidden="true">
          <defs>
            <linearGradient id="pointer-gold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f0e6d2" />
              <stop offset="0.5" stopColor="#c8aa6e" />
              <stop offset="1" stopColor="#785a28" />
            </linearGradient>
          </defs>
          <path d="M2 2h36L20 54z" fill="url(#pointer-gold)" stroke="#463714" strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M20 10l6 8-6 8-6-8z" fill="#0ac8b9" stroke="#cdfafa" strokeWidth="0.8" />
        </svg>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[27%] aspect-square rounded-full p-[3px] z-20 bg-linear-to-b from-lol-goldLight via-lol-goldMid to-lol-goldDark shadow-[0_0_25px_rgba(0,0,0,0.9),0_0_18px_rgba(10,200,185,0.25)]">
          <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_50%_40%,#0a323c_0%,#010a13_70%)] flex items-center justify-center relative">
            <div className="absolute inset-[8%] rounded-full border border-lol-goldMid/40" />
            <div className={`absolute inset-[20%] rounded-full bg-lol-blue/20 blur-md transition-opacity duration-500 ${isSpinning ? 'opacity-100' : 'opacity-40'}`} />
            <BksEmblem className="relative w-[62%] h-[62%]" glow />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-stretch gap-3">
          <button
            onClick={handleSpin}
            disabled={!canSpin || isAutoSpinning}
            className={`btn-lockin h-16 min-w-[260px] px-10 text-lg ${isSpinning || isAutoSpinning ? 'is-spinning' : ''}`}
          >
            {spinLabel}
          </button>
          <button
            onClick={toggleAuto}
            disabled={!isAutoSpinning && !canSpin}
            className={`btn-hex h-16 w-[120px] flex-col gap-1 ${isAutoSpinning ? 'is-active' : ''}`}
            title="Girar automáticamente hasta completar los equipos"
          >
            {isAutoSpinning ? <PauseIcon className="w-4 h-4" /> : <AutoIcon className="w-5 h-5" />}
            {isAutoSpinning ? 'Detener' : 'Auto'}
          </button>
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-lol-muted">
          {activePlayers.length === 0
            ? 'Sin invocadores en el bombo'
            : `${activePlayers.length} ${activePlayers.length === 1 ? 'invocador' : 'invocadores'} en el bombo`}
        </span>
      </div>

      <div className="flex gap-3">
        <button
          onClick={resetGame}
          disabled={isSpinning || isAutoSpinning}
          className="btn-hex enabled:hover:text-lol-red"
        >
          <ResetIcon />
          Reiniciar Partida
        </button>

        <button
          onClick={copyTeamsToClipboard}
          disabled={isSpinning || isAutoSpinning}
          className="btn-hex enabled:hover:text-lol-hextech"
        >
          <ClipboardIcon />
          Copiar a Discord
        </button>
      </div>
    </div>
  );
}
