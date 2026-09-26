// src/context/GameContext.jsx
import { createContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { playClip, preloadClip, stopClip } from './audioEngine';

import topIcon from '../assets/top.png';
import jungleIcon from '../assets/jungle.png';
import midIcon from '../assets/mid.png';
import adcIcon from '../assets/adc.png';
import supportIcon from '../assets/support.png';

import spinAudio from '../assets/spin.mp3';
import lockAudio from '../assets/lock.mp3';

const announcerVoices = import.meta.glob('../assets/invocadores/**/*.mp3', { eager: true });
const versusVoices = Object.values(import.meta.glob('../assets/versus/*.mp3', { eager: true })).map(m => m.default);

const getVoiceFor = (name) => {
  const voices = Object.keys(announcerVoices)
    .filter(path => {
      const parts = path.split('/');
      return parts[parts.length - 2].toLowerCase() === name.toLowerCase();
    })
    .map(path => announcerVoices[path].default);
  return voices.length > 0 ? voices[Math.floor(Math.random() * voices.length)] : null;
};

// Precarga todo al inicio para que ningun sonido tenga que descargarse al momento de sonar
[spinAudio, lockAudio, ...versusVoices, ...Object.values(announcerVoices).map(m => m.default)].forEach(preloadClip);

const VOICE_DELAY_MS = 100;

// Una sola variante de "Versus" por partida: se sortea de nuevo solo en el primer pick
const pickVersus = (ref, isNewGame = false) => {
  if (isNewGame || !ref.current) {
    ref.current = versusVoices[Math.floor(Math.random() * versusVoices.length)] ?? null;
  }
  return ref.current;
};

export const GameContext = createContext();

const defaultRoles = [
  { id: 'top1', label: 'Top 1', active: true, icon: topIcon },
  { id: 'top2', label: 'Top 2', active: true, icon: topIcon },
  { id: 'jg1', label: 'Jungla 1', active: true, icon: jungleIcon },
  { id: 'jg2', label: 'Jungla 2', active: true, icon: jungleIcon },
  { id: 'mid1', label: 'Mid 1', active: true, icon: midIcon },
  { id: 'mid2', label: 'Mid 2', active: true, icon: midIcon },
  { id: 'adc1', label: 'ADC 1', active: true, icon: adcIcon },
  { id: 'adc2', label: 'ADC 2', active: true, icon: adcIcon },
  { id: 'sup1', label: 'Support 1', active: true, icon: supportIcon },
  { id: 'sup2', label: 'Support 2', active: true, icon: supportIcon },
];

// En 1vs1 se sortean solo dos invocadores que se enfrentan en Mid
const duelRoles = [
  { id: 'duel1', label: 'Mid', active: true, icon: midIcon },
  { id: 'duel2', label: 'Mid', active: true, icon: midIcon },
];

export const GameProvider = ({ children }) => {
  const [players, setPlayers] = useState(Array(10).fill(''));
  const [originalPlayers, setOriginalPlayers] = useState(Array(10).fill(''));
  const [roles, setRoles] = useState(defaultRoles);
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isAutoSpinning, setIsAutoSpinning] = useState(false);
  const [gameMode, setGameMode] = useState('5v5');
  const [teams, setTeams] = useState({ blue: [], red: [] });
  const [isAnnouncing, setIsAnnouncing] = useState(false);
  const hasPlayersBeenSaved = useRef(false);
  const versusVoiceRef = useRef(null);

  const activeRoles = useMemo(
    () => (gameMode === '1v1' ? duelRoles : roles.filter(r => r.active)),
    [gameMode, roles]
  );

  // Guardar copia de jugadores cuando se cierra la configuración
  useEffect(() => {
    if (!isSettingsOpen && !hasPlayersBeenSaved.current) {
      setOriginalPlayers([...players]);
      hasPlayersBeenSaved.current = true;
    } else if (isSettingsOpen) {
      hasPlayersBeenSaved.current = false;
    }
  }, [isSettingsOpen, players]);

  // Reproduce varios audios uno tras otro (ej: "Samuel" -> "Versus" -> "Matute")
  const playSequence = useCallback(async (urls) => {
    setIsAnnouncing(true);
    for (const url of urls) {
      await playClip(url, 1.0);
    }
    setIsAnnouncing(false);
  }, []);

  // matchup.versus: 'start' = suena al girar (5v5 manual), 'end' = suena antes del nombre del rival (1v1 y 5v5 auto)
  const playSound = useCallback((type, winnerName = null, matchup = {}) => {
    if (type === 'spin') {
      playClip(spinAudio, 0.2);

      const versus = matchup.versus === 'start' ? pickVersus(versusVoiceRef) : null;
      if (versus) setTimeout(() => playClip(versus, 1.0), 200);
    } else if (type === 'lock_in') {
      stopClip(spinAudio);
      playClip(lockAudio, 0.4);

      if (matchup.isFirstPick) pickVersus(versusVoiceRef, true);
      const versus = matchup.versus === 'end' ? pickVersus(versusVoiceRef) : null;

      if (winnerName) {
        const winnerVoice = getVoiceFor(winnerName);

        if (winnerVoice && versus) {
          setIsAnnouncing(true);
          setTimeout(() => playSequence([versus, winnerVoice]), VOICE_DELAY_MS);
        } else if (winnerVoice) {
          setTimeout(() => playClip(winnerVoice, 1.0), VOICE_DELAY_MS);
        } else {
          console.log(`No voice lines found for ${winnerName}`);
        }
      }
    }
  }, [playSequence]);

  const updatePlayer = useCallback((index, name) => {
    setPlayers(prev => {
      const newPlayers = [...prev];
      newPlayers[index] = name;
      return newPlayers;
    });
  }, []);

  const toggleRoleActive = useCallback((id) => {
    setRoles(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  }, []);

  const reorderRoles = useCallback((startIndex, endIndex) => {
    setRoles(prev => {
      const newRoles = Array.from(prev);
      const [removed] = newRoles.splice(startIndex, 1);
      newRoles.splice(endIndex, 0, removed);
      return newRoles;
    });
  }, []);

  const assignWinner = useCallback((winnerName) => {
    setTeams(prevTeams => {
      const totalAssigned = prevTeams.blue.length + prevTeams.red.length;
      const assignedRole = activeRoles[totalAssigned];

      if (!assignedRole) {
        alert("¡Ya no hay más roles activos disponibles!");
        return prevTeams;
      }

      const isBlueTurn = prevTeams.blue.length <= prevTeams.red.length;
      const teamColor = isBlueTurn ? 'blue' : 'red';

      return {
        ...prevTeams,
        [teamColor]: [...prevTeams[teamColor], { name: winnerName, role: assignedRole }]
      };
    });

    setPlayers(prev => {
      const newPlayers = [...prev];
      const indexToRemove = newPlayers.indexOf(winnerName);
      if (indexToRemove !== -1) newPlayers[indexToRemove] = '';
      return newPlayers;
    });
  }, [activeRoles]);

  // REINICIAR
  const resetGame = useCallback(() => {
    if(window.confirm("¿Estás seguro de reiniciar la partida? Se borrarán los equipos actuales.")) {
      setIsAutoSpinning(false);
      setTeams({ blue: [], red: [] });
      setPlayers([...originalPlayers]);
      setIsSettingsOpen(false);
    }
  }, [originalPlayers]);

  // Cambiar de modo invalida los equipos ya sorteados
  const changeGameMode = useCallback((mode) => {
    if (mode === gameMode) return;
    setGameMode(mode);
    setIsAutoSpinning(false);
    if (teams.blue.length > 0 || teams.red.length > 0) {
      setTeams({ blue: [], red: [] });
      setPlayers([...originalPlayers]);
    }
  }, [gameMode, teams, originalPlayers]);

  // COPIAR DISCORD
  const copyTeamsToClipboard = useCallback(async () => {
    let text = gameMode === '1v1' ? "**BKS · 1vs1**\n\n" : "**BKS**\n\n";
    
    text += "🔵 **EQUIPO AZUL** 🔵\n";
    if(teams.blue.length === 0) text += "> *(Vacío)*\n";
    teams.blue.forEach(p => text += `> **${p.role.label}:** ${p.name}\n`);
    
    text += "\n🔴 **EQUIPO ROJO** 🔴\n";
    if(teams.red.length === 0) text += "> *(Vacío)*\n";
    teams.red.forEach(p => text += `> **${p.role.label}:** ${p.name}\n`);

    try {
      await navigator.clipboard.writeText(text);
      alert("¡Equipos copiados exitosamente! Ya puedes pegarlos en Discord.");
    } catch (err) {
      console.error('Error al copiar: ', err);
      alert("Hubo un error al copiar al portapapeles.");
    }
  }, [teams, gameMode]);

  return (
    <GameContext.Provider value={{
      players, updatePlayer,
      roles, setRoles, toggleRoleActive, reorderRoles, activeRoles,
      gameMode, changeGameMode,
      isSettingsOpen, setIsSettingsOpen,
      isSpinning, setIsSpinning,
      isAutoSpinning, setIsAutoSpinning,
      isAnnouncing,
      teams, setTeams,
      playSound, assignWinner,
      resetGame, copyTeamsToClipboard 
    }}>
      {children}
    </GameContext.Provider>
  );
};
