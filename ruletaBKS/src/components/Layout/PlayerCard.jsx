// src/components/Layout/PlayerCard.jsx
export default function PlayerCard({ player, isBlue }) {
  const borderColor = isBlue ? 'border-lol-blue' : 'border-lol-red';
  const textTitleColor = isBlue ? 'text-lol-blue' : 'text-lol-red';
  const cardBg = 'bg-lol-gray/80'; // El fondo oscuro es igual para ambos
  
  const glowColor = isBlue ? 'bg-lol-blue' : 'bg-lol-red';
  
  const microphoneGlow = isBlue ? 'shadow-[0_0_20px_rgba(10,200,185,0.7),inset_0_0_15px_rgba(10,200,185,0.5)]' : 'shadow-[0_0_20px_rgba(255,70,85,0.7),inset_0_0_15px_rgba(255,70,85,0.5)]';

  const hexPath = 'polygon(12px 0, calc(100% - 12px) 0, calc(100% - 1px) 11px, calc(100% - 1px) calc(100% - 11px), calc(100% - 12px) calc(100% - 0.5px), 12px calc(100% - 0.5px), 1px calc(100% - 11px), 1px 11px)';

  return (
    <div className={`flex items-center justify-between p-4 relative h-17.5verflow-hidden group`}>
      
      <div 
        className={`absolute inset-0 border border-t-0 ${borderColor} ${cardBg} shadow-[0_0_15px_rgba(0,0,0,0.6),inset_0_0_10px_rgba(0,0,0,0.8)] z-10`}
        style={{ clipPath: hexPath }}
      />
      
      <div 
        className="absolute top-0.5 left-0.5 right-0.5 bottom-0.5 border border-lol-gold/40 rounded-sm z-10"
        style={{ clipPath: hexPath }}
      />
      <div 
        className="absolute top-1 left-1 right-1 bottom-1 border border-lol-goldLight/20 rounded-sm z-10"
        style={{ clipPath: hexPath }}
      />

      <div className="absolute top-1/2 left-14.5 w-8 h-px bg-lol-gold/20 -translate-y-1/2 transition-all group-hover:bg-lol-gold/40 z-10" />
      
      <div className="flex items-center gap-10 relative z-20">
        
        <div className="w-12 h-12 flex items-center justify-center -translate-x-2">
          <img 
            src={player.role.icon} 
            alt={player.role.label} 
            className="w-full h-full object-contain filter drop-shadow-[0_0_2px_rgba(200,155,60,0.8)]" 
            title={player.role.label}
          />
        </div>
        
        <div className="flex flex-col">

          <span className={`text-[10px] font-bold uppercase tracking-[0.2em] font-sans ${textTitleColor} drop-shadow-md`}>
            {player.role.label}
          </span>
          <span className="text-lg font-extrabold uppercase tracking-widest text-lol-goldLight/80 truncate w-32.5 font-sans drop-shadow-md">
            {player.name}
          </span>
        </div>
      </div>

      <div className={`absolute inset-0 ${glowColor} blur-xl opacity-10 group-hover:opacity-30 transition-opacity z-0`} />

      <div className={`relative z-20 w-9 h-9 rounded-full border-2 border-lol-gold flex items-center justify-center text-lol-gold bg-lol-bg ${microphoneGlow} transition-all group-hover:border-lol-goldLight/50 group-hover:text-white`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 filter drop-shadow-[0_0_5px_rgba(200,155,60,0.8)]">
          <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Z" />
          <path d="M17 11a1 1 0 0 1 2 0 7 7 0 0 1-14 0 1 1 0 0 1 2 0 5 5 0 0 0 10 0ZM11 19v2H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-2a6.973 6.973 0 0 0 4-1.5 1 1 0 0 0-1.414-1.414A5.022 5.022 0 0 1 12 17a5.022 5.022 0 0 1-3.586-1.414A1 1 0 0 0 7 17.5 6.973 6.973 0 0 0 11 19Z" />
        </svg>
      </div>
    </div>
  );
}