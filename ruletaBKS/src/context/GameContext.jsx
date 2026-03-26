// src/context/GameContext.jsx
import { createContext, useState } from 'react';

import topIcon from '../assets/top.png';
import jungleIcon from '../assets/jungle.png';
import midIcon from '../assets/mid.png';
import adcIcon from '../assets/adc.png';
import supportIcon from '../assets/support.png';

import spinAudio from '../assets/spin.mp3';
import lockAudio from '../assets/lock.mp3';

const announcerVoices = import.meta.glob('../assets/invocadores/*.mp3', { eager: true });

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

export const GameProvider = ({ children }) => {
  const [players, setPlayers] = useState(Array(10).fill(''));
  const [roles, setRoles] = useState(defaultRoles);
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [teams, setTeams] = useState({ blue: [], red: [] });

  const playSound = (type, winnerName = null) => {
    try {
      if (type === 'spin') {
        const sound = new Audio(spinAudio);
        sound.volume = 0.2; 
        sound.play();
      } else if (type === 'lock_in') {
        const impact = new Audio(lockAudio);
        impact.volume = 0.4; 
        impact.play();

        if (winnerName) {
          const voiceModule = announcerVoices[`../assets/invocadores/${winnerName}.mp3`];
          if (voiceModule) {
            setTimeout(() => {
              const voiceSound = new Audio(voiceModule.default);
              voiceSound.volume = 1.0; 
              voiceSound.play();
            }, 300);
          }
        }
      }
    } catch (error) {
      console.error("Error al reproducir el sonido:", error);
    }
  };

  const updatePlayer = (index, name) => {
    const newPlayers = [...players];
    newPlayers[index] = name;
    setPlayers(newPlayers);
  };

  const toggleRoleActive = (id) => {
    setRoles(roles.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const reorderRoles = (startIndex, endIndex) => {
    const newRoles = Array.from(roles);
    const [removed] = newRoles.splice(startIndex, 1);
    newRoles.splice(endIndex, 0, removed);
    setRoles(newRoles);
  };

  const assignWinner = (winnerName) => {
    const activeRoles = roles.filter(r => r.active);
    const totalAssigned = teams.blue.length + teams.red.length;
    const assignedRole = activeRoles[totalAssigned];

    if (!assignedRole) {
      alert("¡Ya no hay más roles activos disponibles!");
      return;
    }

    const isBlueTurn = teams.blue.length <= teams.red.length;
    const teamColor = isBlueTurn ? 'blue' : 'red';

    setTeams(prev => ({
      ...prev,
      [teamColor]: [...prev[teamColor], { name: winnerName, role: assignedRole }]
    }));

    setPlayers(prev => {
      const newPlayers = [...prev];
      const indexToRemove = newPlayers.indexOf(winnerName);
      if (indexToRemove !== -1) newPlayers[indexToRemove] = '';
      return newPlayers;
    });
  };

  // --- NUEVA FUNCIÓN: REINICIAR ---
  const resetGame = () => {
    if(window.confirm("¿Estás seguro de reiniciar la partida? Se borrarán los equipos actuales.")) {
      setTeams({ blue: [], red: [] });
      setPlayers(Array(10).fill('')); // Vaciamos los inputs
    }
  };

  // --- NUEVA FUNCIÓN: COPIAR A DISCORD ---
  const copyTeamsToClipboard = async () => {
    let text = "**BKS**\n\n";
    
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
  };

  return (
    <GameContext.Provider value={{
      players, updatePlayer,
      roles, setRoles, toggleRoleActive, reorderRoles,
      isSettingsOpen, setIsSettingsOpen,
      isSpinning, setIsSpinning,
      teams, setTeams,
      playSound, assignWinner,
      resetGame, copyTeamsToClipboard 
    }}>
      {children}
    </GameContext.Provider>
  );
};