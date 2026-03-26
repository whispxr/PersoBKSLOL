// src/components/Layout/TeamPanel.jsx
import { useContext } from 'react';
import { GameContext } from '../../context/GameContext';
import PlayerCard from './PlayerCard'; 

export default function TeamPanel({ team, title }) {
  const { teams } = useContext(GameContext);
  
  const roster = teams[team];
  const isBlue = team === 'blue';
  
  const borderColor = isBlue ? 'border-lol-blue' : 'border-lol-red';
  const textColor = isBlue ? 'text-lol-blue' : 'text-lol-red';

  // --- MAGIA DE POSICIONAMIENTO ---
  // Separación dinámica de las orillas: Equipo Azul empuja desde la izquierda, Equipo Rojo desde la derecha.
  const marginPlacement = isBlue ? 'ml-12 mr-4' : 'mr-12 ml-4';

  return (
    // Cambiamos "h-full" por "h-[580px]" (altura perfecta para 5 jugadores) y añadimos "my-auto" para centrar
    <aside className={`w-[340px] shrink-0 h-[580px] ${marginPlacement} my-auto flex flex-col relative z-10`}>
      
      {/* Caja principal estilo League of Legends con fondo oscuro */}
      <div className={`flex-1 flex flex-col bg-lol-gray/90 border ${borderColor} rounded-sm relative shadow-[inset_0_0_50px_rgba(0,0,0,0.8),0_0_20px_rgba(0,0,0,0.6)] p-6`}>
        
        {/* --- MARCOS DORADOS METÁLICOS CONCÉNTRICOS --- */}
        <div className="absolute top-[10px] left-[10px] right-[10px] bottom-[10px] border border-lol-gold rounded-sm shadow-[0_0_3px_#c89b3c]"></div>
        
        {/* Esquinas doradas decorativas */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-lol-gold rounded-tl-sm -translate-x-[4px] -translate-y-[4px]"></div>
        <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-lol-gold rounded-tr-sm translate-x-[4px] -translate-y-[4px]"></div>
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-lol-gold rounded-bl-sm -translate-x-[4px] translate-y-[4px]"></div>
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-lol-gold rounded-br-sm translate-x-[4px] translate-y-[4px]"></div>

        {/* Borde concéntrico interior adicional para profundidad */}
        <div className="absolute top-[4px] left-[4px] right-[4px] bottom-[4px] border border-lol-goldLight/20 rounded-sm"></div>

        {/* Título del equipo */}
        <h2 className={`text-xl font-black uppercase tracking-[0.2em] text-center mb-6 ${textColor} drop-shadow-md`}>
          {title}
        </h2>

        {/* Contenedor de las tarjetas de jugadores */}
        <div className="flex-1 overflow-y-hidden space-y-3 relative z-10">
          {roster.length === 0 ? (
            <div className="text-sm text-center text-lol-goldLight/30 mt-10 italic">
              Esperando el sorteo...
            </div>
          ) : (
            roster.map((player, index) => (
              <PlayerCard key={index} player={player} isBlue={isBlue} />
            ))
          )}
        </div>
      </div>
    </aside>
  );
}