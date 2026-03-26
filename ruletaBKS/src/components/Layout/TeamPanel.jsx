// src/components/Layout/TeamPanel.jsx
import { useContext } from 'react';
import { GameContext } from '../../context/GameContext';

export default function TeamPanel({ team, title }) {
  const { teams } = useContext(GameContext);
  
  // Obtenemos el array de jugadores del equipo actual (blue o red)
  const roster = teams[team];
  
  const isBlue = team === 'blue';
  const textColor = isBlue ? 'text-lol-blue' : 'text-lol-red';
  const gradient = isBlue ? 'from-transparent to-lol-blue' : 'from-lol-red to-transparent';
  const cardBorder = isBlue ? 'border-lol-blue/30 hover:border-lol-blue' : 'border-lol-red/30 hover:border-lol-red';

  return (
    <aside className="w-[300px] shrink-0 h-full p-6 flex flex-col bg-lol-gray/30 backdrop-blur-sm relative border-x border-lol-border/20">
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradient} opacity-80`} />

      <h2 className={`text-2xl font-bold uppercase tracking-wider text-center mb-6 pb-2 border-b border-lol-border/60 ${textColor}`}>
        {title}
      </h2>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {roster.length === 0 ? (
          <div className="text-sm text-center text-lol-goldLight/30 mt-10 italic">
            Esperando el sorteo...
          </div>
        ) : (
          roster.map((player, index) => (
            <div 
              key={index} 
              className={`flex items-center gap-4 p-3 bg-lol-bg border-l-4 rounded shadow-md transition-all ${cardBorder} animate-fade-in-up`}
            >
              {/* Ícono del Rol */}
            <div className="bg-lol-gray w-10 h-10 flex items-center justify-center rounded-full border border-lol-gold/20 p-1.5">
            <img src={player.role.icon} alt={player.role.label} className="w-full h-full object-contain" />
            </div>
              
              {/* Info del Jugador */}
              <div className="flex flex-col">
                <span className={`text-xs font-bold uppercase tracking-widest text-lol-goldLight/50`}>
                  {player.role.label}
                </span>
                <span className="text-lg font-bold text-white drop-shadow-md truncate w-[160px]">
                  {player.name}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}