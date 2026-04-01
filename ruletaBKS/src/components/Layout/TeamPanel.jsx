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

  const marginPlacement = isBlue ? 'ml-12 mr-4' : 'mr-12 ml-4';

  return (
    <aside className={`w-85 shrink-0 h-145 ${marginPlacement} my-auto flex flex-col relative z-10`}>
      
      <div className={`flex-1 flex flex-col bg-lol-gray/90 border ${borderColor} rounded-sm relative shadow-[inset_0_0_50px_rgba(0,0,0,0.8),0_0_20px_rgba(0,0,0,0.6)] p-6`}>
        
        <div className="absolute top-2.5 left-2.5 right-2.5 bottom-[10px] border border-lol-gold rounded-sm shadow-[0_0_3px_#c89b3c]"></div>
        
        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-lol-gold rounded-tl-sm -translate-x-[4px] -translate-y-[4px]"></div>
        <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-lol-gold rounded-tr-sm translate-x-[4px] -translate-y-1"></div>
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-lol-gold rounded-bl-sm -translate-x-1 translate-y-1"></div>
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-lol-gold rounded-br-sm translate-x-[4px] translate-y-[4px]"></div>

        <div className="absolute top-[4px] left-[4px] right-[4px] bottom-[4px] border border-lol-goldLight/20 rounded-sm"></div>

        <h2 className={`text-xl font-black uppercase tracking-[0.2em] text-center mb-6 ${textColor} drop-shadow-md`}>
          {title}
        </h2>

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