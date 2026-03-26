// src/components/Layout/Header.jsx
import { useContext, useState, useEffect, useRef } from 'react';
import { GameContext } from '../../context/GameContext';

// Importamos la pista de música épica
import epicMusicFile from '../../assets/epic_music.mp3';

export default function Header() {
  const { setIsSettingsOpen } = useContext(GameContext);
  
  // Estados para el reproductor de música
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2); 
  const audioRef = useRef(null);


  useEffect(() => {
    audioRef.current = new Audio(epicMusicFile);
    audioRef.current.loop = true; 
    audioRef.current.volume = volume;

    // Limpieza al desmontar
    return () => {
      audioRef.current.pause();
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

  return (
    <header className="h-[80px] shrink-0 border-b-2 border-lol-gold/60 bg-lol-gray/90 flex items-center justify-between px-8 shadow-md shadow-lol-blue/10 relative z-10">
      
      {/* Espaciador invisible a la izquierda para mantener el título en el centro perfecto */}
      <div className="w-[250px]"></div> 
      
      {/* Título Central */}
      <h1 className="text-4xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-lol-goldLight via-lol-gold to-yellow-600 drop-shadow-sm">
        BKS LOL ROULETTE
      </h1>

      {/* Controles a la derecha */}
      <div className="flex items-center gap-4 w-[250px] justify-end">
        
        {/* PANEL DE MÚSICA */}
        <div className="flex items-center gap-3 bg-lol-bg/80 px-3 py-1.5 border border-lol-border rounded-md shadow-inner">
          <button 
            onClick={togglePlay}
            className="text-lol-gold hover:text-white transition-colors flex items-center justify-center w-6 h-6"
            title="Reproducir/Pausar Música Épica"
          >
            {isPlaying ? (
              // Icono Pause
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
              </svg>
            ) : (
              // Icono Play
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume} 
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 accent-lol-blue cursor-pointer h-1.5 bg-lol-gray rounded-lg appearance-none"
            title="Ajustar Volumen"
          />
        </div>

        {/* BOTÓN DE CONFIGURACIÓN */}
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="w-10 h-10 flex items-center justify-center bg-lol-bg border border-lol-gold/50 rounded hover:bg-lol-blue hover:text-lol-bg hover:border-lol-blue transition-all text-lol-goldLight text-xl shadow-md"
          title="Configurar Partida"
        >
          ⚙️
        </button>
      </div>
    </header>
  );
}