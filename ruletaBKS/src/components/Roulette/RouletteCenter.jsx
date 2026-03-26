// src/components/Roulette/RouletteCenter.jsx
import { useContext, useState } from 'react';
import { GameContext } from '../../context/GameContext';

export default function RouletteCenter() {
  // 1. Traemos todo lo necesario del contexto, incluyendo la nueva función assignWinner
  const { players, isSpinning, setIsSpinning, playSound, assignWinner } = useContext(GameContext);
  
  // Guardamos la rotación acumulada para que la ruleta no vuelva a 0 en cada giro
  const [rotation, setRotation] = useState(0);

  // Filtramos los inputs vacíos para saber cuántos jugadores reales hay
  const activePlayers = players.filter(p => p && p.trim() !== '');
  const numSlices = activePlayers.length > 0 ? activePlayers.length : 1;
  const sliceAngle = 360 / numSlices;

  const handleSpin = () => {
    // Si ya está girando o no hay jugadores, no hacemos nada
    if (isSpinning || activePlayers.length === 0) return;
    
    setIsSpinning(true);
    playSound('spin');

    // 2. Lógica del giro: 
    // Damos entre 5 y 9 vueltas completas al azar + un ángulo aleatorio extra de parada
    const extraSpins = (Math.floor(Math.random() * 5) + 5) * 360; 
    const randomStop = Math.floor(Math.random() * 360);
    const newTargetRotation = rotation + extraSpins + randomStop;

    setRotation(newTargetRotation);

    // 3. Esperamos 6 segundos exactos (lo que dura la animación CSS) para dar el resultado
    setTimeout(() => {
      setIsSpinning(false);
      
      const normalizedRotation = newTargetRotation % 360;
      const winningAngle = (360 - normalizedRotation) % 360; 
      
      const winnerIndex = Math.floor(winningAngle / sliceAngle);
      const winnerName = activePlayers[winnerIndex];
      
      console.log(`¡Sorteo finalizado! Ganador: ${winnerName}`);
      
      // AHORA LE PASAMOS EL NOMBRE AL AUDIO
      playSound('lock_in', winnerName); 
      
      assignWinner(winnerName); 
      
    }, 6000);
  }; // <--- ¡ESTA ERA LA LLAVE QUE FALTABA!

  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative">
      
      {/* --- CONTENEDOR VISUAL DE LA RULETA --- */}
      <div className="relative flex items-center justify-center mb-16">
        
        {/* Puntero Indicador (Triángulo Rojo) */}
        <div 
          className="absolute top-[-10px] w-6 h-12 bg-lol-red z-30 shadow-[0_0_15px_rgba(255,70,85,0.8)]" 
          style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }} 
        />
        
        {/* El Disco de la Ruleta */}
        <div 
          className="w-[360px] h-[360px] rounded-full border-[8px] border-lol-border bg-lol-bg flex items-center justify-center shadow-[0_0_50px_rgba(10,200,185,0.15)] relative overflow-hidden"
          style={{ 
            transform: `rotate(${rotation}deg)`, 
            // <-- Cambiado a 6s para coincidir con el setTimeout
            transition: 'transform 6s cubic-bezier(0.25, 0.1, 0.15, 1)' 
          }}
        >
          {/* Fondo Texturizado Metálico */}
          <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,#010a13_0%,#1e2328_50%,#010a13_100%)] opacity-90" />
          
          {/* Renderizado de los Nombres de los Jugadores */}
          {activePlayers.length > 0 ? (
            activePlayers.map((player, index) => {
              const rotateAngle = index * sliceAngle;
              return (
                <div 
                  key={index} 
                  className="absolute top-0 w-full h-full"
                  style={{ transform: `rotate(${rotateAngle}deg)` }}
                >
                  {/* Línea dorada divisoria de la rebanada */}
                  <div className="absolute top-0 left-1/2 w-[2px] h-1/2 bg-lol-gold/30 -translate-x-1/2 origin-bottom" />
                  
                  {/* Texto del nombre */}
                  <div 
                    className="absolute top-[20px] left-1/2 -translate-x-1/2 text-lol-goldLight font-bold tracking-widest text-sm drop-shadow-md whitespace-nowrap"
                    style={{ 
                      // Centramos el texto en el medio de la rebanada
                      transform: `rotate(${sliceAngle / 2}deg)`, 
                      transformOrigin: '50% 160px' 
                    }}
                  >
                    {player}
                  </div>
                </div>
              );
            })
          ) : (
            // Mensaje por si la ruleta está vacía
            <span className="relative z-10 text-lol-goldLight/50 text-center px-8">
                
            </span>
          )}
        </div>

        {/* --- CENTRO ESTÁTICO DE LA RULETA (No gira) --- */}
        <div className="absolute w-[80px] h-[80px] rounded-full bg-lol-bg border-4 border-lol-gold flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] z-20">
          <span className="text-xl font-black text-lol-goldLight tracking-wider">BKS</span>
        </div>
      </div>

      {/* --- BOTÓN DE GIRAR --- */}
      <button
        onClick={handleSpin}
        disabled={isSpinning || activePlayers.length === 0}
        className="group relative px-12 py-4 bg-lol-gray border-2 border-lol-gold text-lol-goldLight font-bold text-xl uppercase tracking-widest overflow-hidden transition-all hover:border-lol-blue hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {/* Efecto hover tipo Hextech */}
        <div className="absolute inset-0 bg-gradient-to-t from-lol-blue/40 to-transparent translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
        <span className="relative z-10">{isSpinning ? 'Girando...' : 'Girar Ruleta'}</span>
      </button>

    </div>
  );
}