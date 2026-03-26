// src/components/Layout/Header.jsx
import { useContext, useState, useEffect, useRef } from 'react';
import { GameContext } from '../../context/GameContext';

// Importamos la pista de música épica
import epicMusicFile from '../../assets/epic_music.mp3';

export default function Header() {
  const { setIsSettingsOpen } = useContext(GameContext);
  
  // Estados para el reproductor de música
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3); // Volumen inicial al 30%
  const audioRef = useRef(null);

  // Inicializamos el audio una sola vez cuando el componente carga
  useEffect(() => {
    audioRef.current = new Audio(epicMusicFile);
    audioRef.current.loop = true; // Que se repita infinitamente
    audioRef.current.volume = volume;

    // Limpieza al desmontar
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Efecto para actualizar el volumen en tiempo real al mover el slider
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Función para alternar Play/Pause
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

  return (
    // Header fijo con fondo profundo, borde dorado superior y sombra azul/cian
    <header className="h-[80px] shrink-0 border-t border-lol-gold bg-lol-bg/95 flex items-center justify-between px-8 shadow-md shadow-lol-blue/10 relative z-10">
      
      {/* Controles de la izquierda */}
      <div className="flex items-center gap-4 w-[250px] justify-start">
        <button 
          onClick={togglePlay}
          className={`px-4 py-2 bg-lol-gray border-2 text-xs font-black uppercase tracking-widest rounded transition-all shadow-sm w-24 ${
            isPlaying 
              ? 'border-lol-blue text-white shadow-[0_0_10px_rgba(10,200,185,0.4)]' 
              : 'border-lol-border/50 text-lol-gold hover:border-lol-blue hover:text-white'
          }`}
          title="Reproducir/Pausar Música Épica"
        >
          {isPlaying ? '⏸ PAUSA' : '▶ PLAY'}
        </button>
        
        {/* Volumen con brillo Cian */}
        <div className="flex items-center gap-2">
          <span className="text-lol-blue drop-shadow-[0_0_5px_rgba(10,200,185,0.8)]">🔊</span>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume} 
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 h-1.5 accent-lol-blue cursor-pointer bg-lol-gray rounded-lg appearance-none shadow-[0_0_10px_rgba(10,200,185,0.6)]" 
          />
        </div>
      </div>
      
      {/* Título Central y Logo del Gorila (Pro Draft Look) */}
      <div className="flex items-center gap-2">
        {/* Gorila Emoji detallado (Mascota BKS) */}
        <span className="text-5xl filter drop-shadow-[0_0_8px_rgba(200,155,60,0.8)]">🦍</span>
        <h1 className="text-4xl font-black tracking-[0.2em] text-lol-goldLight drop-shadow-md font-beaufort">
          BKS LOL ROULETTE
        </h1>
      </div>

      {/* Controles de la derecha */}
      <div className="flex items-center w-[250px] justify-end">
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="w-10 h-10 flex items-center justify-center bg-lol-gray border-2 border-lol-goldLight/20 rounded hover:bg-lol-gray hover:border-lol-blue transition-all text-lol-goldLight text-xl shadow-md"
          title="Configurar Partida"
        >
          ⚙️
        </button>
      </div>
    </header>
  );
}