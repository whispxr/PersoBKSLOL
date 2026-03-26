// src/components/Layout/PlayerCard.jsx
export default function PlayerCard({ player, isBlue }) {
  // Colores dinámicos dependiendo de si es equipo azul o rojo
  const borderColor = isBlue ? 'border-lol-blue' : 'border-lol-red';
  const textTitleColor = isBlue ? 'text-lol-blue' : 'text-lol-red';
  const cardBg = 'bg-lol-gray/80'; // El fondo oscuro es igual para ambos
  
  // ¡AQUÍ ESTÁ LA CORRECCIÓN! Usamos el color correcto para el resplandor interno
  const glowColor = isBlue ? 'bg-lol-blue' : 'bg-lol-red';
  
  // Efecto de resplandor intenso para el micrófono (PAM)
  const microphoneGlow = isBlue ? 'shadow-[0_0_20px_rgba(10,200,185,0.7),inset_0_0_15px_rgba(10,200,185,0.5)]' : 'shadow-[0_0_20px_rgba(255,70,85,0.7),inset_0_0_15px_rgba(255,70,85,0.5)]';

  // --- MAGIA CSS: POLÍGONO PARA CLIP-PATH (Forma Cóncava Hextech) ---
  const hexPath = 'polygon(12px 0, calc(100% - 12px) 0, calc(100% - 1px) 11px, calc(100% - 1px) calc(100% - 11px), calc(100% - 12px) calc(100% - 0.5px), 12px calc(100% - 0.5px), 1px calc(100% - 11px), 1px 11px)';

  return (
    <div className={`flex items-center justify-between p-4 relative h-[70px] overflow-hidden group`}>
      
      {/* 1. CAPA DE FONDO (Static con sombra) */}
      <div 
        className={`absolute inset-0 border border-t-0 ${borderColor} ${cardBg} shadow-[0_0_15px_rgba(0,0,0,0.6),inset_0_0_10px_rgba(0,0,0,0.8)] z-10`}
        style={{ clipPath: hexPath }}
      />
      
      {/* 2. MARCO METÁLICO DORADO (Static en relieve) */}
      <div 
        className="absolute top-[2px] left-[2px] right-[2px] bottom-[2px] border border-lol-gold/40 rounded-sm z-10"
        style={{ clipPath: hexPath }}
      />
      {/* 3. MARCO CREMA INTERIOR (Static sutil) */}
      <div 
        className="absolute top-[4px] left-[4px] right-[4px] bottom-[4px] border border-lol-goldLight/20 rounded-sm z-10"
        style={{ clipPath: hexPath }}
      />

      {/* DETALLE: LÍNEA DORADA SUTIL (Internal a la izquierda) */}
      <div className="absolute top-1/2 left-[58px] w-8 h-[1px] bg-lol-gold/20 -translate-y-1/2 transition-all group-hover:bg-lol-gold/40 z-10" />
      
      {/* Contenido principal (alineado a la izquierda) */}
      <div className="flex items-center gap-10 relative z-20">
        
        {/* Ícono del Rol (más limpio y dorado, como en tu imagen) */}
        <div className="w-12 h-12 flex items-center justify-center -translate-x-2">
          <img 
            src={player.role.icon} 
            alt={player.role.label} 
            className="w-full h-full object-contain filter drop-shadow-[0_0_2px_rgba(200,155,60,0.8)]" 
            title={player.role.label}
          />
        </div>
        
        {/* Info del Jugador (Tipografía estilizada Pro Draft, Uppercase) */}
        <div className="flex flex-col">
          {/* Título del Rol (mayúsculas, tracking-widest) */}
          <span className={`text-[10px] font-bold uppercase tracking-[0.2em] font-sans ${textTitleColor} drop-shadow-md`}>
            {player.role.label}
          </span>
          {/* Nombre del Jugador (mayúsculas y font sans limpia, como 'SPIKE') */}
          <span className="text-lg font-extrabold uppercase tracking-widest text-lol-goldLight/80 truncate w-[130px] font-sans drop-shadow-md">
            {player.name}
          </span>
        </div>
      </div>

      {/* --- 4. CAPA DE RESPLANDOR INTERNO (Static Cian/Rojo) --- */}
      {/* ¡Ajustada la opacidad para que se vea pro! */}
      <div className={`absolute inset-0 ${glowColor} blur-xl opacity-10 group-hover:opacity-30 transition-opacity z-0`} />

      {/* ÍCONO DE MICRÓFONO PROMINENTE (Como en image_8.png) */}
      <div className={`relative z-20 w-9 h-9 rounded-full border-2 border-lol-gold flex items-center justify-center text-lol-gold bg-lol-bg ${microphoneGlow} transition-all group-hover:border-lol-goldLight/50 group-hover:text-white`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 filter drop-shadow-[0_0_5px_rgba(200,155,60,0.8)]">
          <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Z" />
          <path d="M17 11a1 1 0 0 1 2 0 7 7 0 0 1-14 0 1 1 0 0 1 2 0 5 5 0 0 0 10 0ZM11 19v2H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-2a6.973 6.973 0 0 0 4-1.5 1 1 0 0 0-1.414-1.414A5.022 5.022 0 0 1 12 17a5.022 5.022 0 0 1-3.586-1.414A1 1 0 0 0 7 17.5 6.973 6.973 0 0 0 11 19Z" />
        </svg>
      </div>
    </div>
  );
}