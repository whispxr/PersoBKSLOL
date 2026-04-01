// src/components/Roulette/RouletteCenter.jsx
import { useContext, useState } from 'react';
import { GameContext } from '../../context/GameContext';

export default function RouletteCenter() {
  const { 
    players, isSpinning, setIsSpinning, 
    playSound, assignWinner, 
    resetGame, copyTeamsToClipboard 
  } = useContext(GameContext);
  
  const [rotation, setRotation] = useState(0);

  const activePlayers = players.filter(p => p && p.trim() !== '');
  const numSlices = activePlayers.length > 0 ? activePlayers.length : 1;
  const sliceAngle = 360 / numSlices;

  const handleSpin = () => {
    if (isSpinning || activePlayers.length === 0) return;
    
    setIsSpinning(true);
    playSound('spin');

    const extraSpins = (Math.floor(Math.random() * 5) + 5) * 360; 
    const randomStop = Math.floor(Math.random() * 360);
    const newTargetRotation = rotation + extraSpins + randomStop;

    setRotation(newTargetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      
      const normalizedRotation = newTargetRotation % 360;
      const winningAngle = (360 - normalizedRotation) % 360; 
      
      const winnerIndex = Math.floor(winningAngle / sliceAngle);
      const winnerName = activePlayers[winnerIndex];
      
      playSound('lock_in', winnerName); 
      assignWinner(winnerName); 
      
    }, 6000);
  }; 

  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative">
      
      <div className="relative flex items-center justify-center mb-16 shadow-[0_0_80px_rgba(10,200,185,0.2)] rounded-full">
        
        <div className="absolute w-[390px] h-[390px] rounded-full border-4 border-[#c89b3c] shadow-[inset_0_0_15px_rgba(0,0,0,0.6)]" />
        
        <div 
          className="absolute top-[-15px] w-8 h-12 z-30 shadow-[0_0_15px_rgba(200,155,60,0.7)]" 
          style={{ 
            clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
            background: 'linear-gradient(to bottom, #f0e6d2 0%, #c89b3c 40%, #c89b3c 100%)',
            borderBottom: '2px solid #0ac8b9' // Pequeño brillo cian
          }} 
        />
        
        <div 
          className="w-[360px] h-[360px] rounded-full border-[6px] border-[#c89b3c] flex items-center justify-center shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0a1428] to-[#010a13]"
          style={{ 
            transform: `rotate(${rotation}deg)`, 
            transition: 'transform 6s cubic-bezier(0.25, 0.1, 0.15, 1)' 
          }}
        >
          <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,#c89b3c_0%_1px,transparent_1px_100%)] opacity-30" />
          
          <div className="absolute w-[320px] h-[320px] rounded-full border-2 border-[#c89b3c]/20" />
          <div className="absolute w-[280px] h-[280px] rounded-full border border-[#c89b3c]/10" />
          
          {activePlayers.length > 0 ? (
            activePlayers.map((player, index) => {
              const rotateAngle = index * sliceAngle;
              return (
                <div key={index} className="absolute top-0 w-full h-full" style={{ transform: `rotate(${rotateAngle}deg)` }}>
                  <div className="absolute top-0 left-1/2 w-[2px] h-1/2 bg-[#c89b3c]/40 -translate-x-1/2 origin-bottom" />
                  
                  <div 
                    className="absolute top-[25px] left-1/2 -translate-x-1/2 text-lol-goldLight font-bold tracking-widest text-sm drop-shadow-[0_0_2px_rgba(0,0,0,0.9)] whitespace-nowrap"
                    style={{ transform: `rotate(${sliceAngle / 2}deg)`, transformOrigin: '50% 155px' }}
                  >
                    {player}
                  </div>
                </div>
              );
            })
          ) : (
            <span className="relative z-10 text-lol-goldLight/50 text-center px-8 text-xs font-lol uppercase tracking-widest"></span>
          )}
        </div>

        <div className="absolute w-[110px] h-[110px] rounded-full bg-[#010a13] border-[6px] border-[#c89b3c] flex items-center justify-center z-20 shadow-[inset_0_0_30px_rgba(0,0,0,0.9),0_0_15px_rgba(10,200,185,0.3)]">
          <div className="absolute w-[90px] h-[90px] rounded-full border-2 border-[#c89b3c]/50" />
          <div className="absolute w-[80px] h-[80px] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-lol-blue/20 to-transparent" />
          
          <div className="relative z-30 text-7xl select-none filter drop-shadow-[0_0_10px_rgba(10,200,185,0.8)]" title="BKS Gorilla Mascot">
              🦍
          </div>
        </div>
      </div>

      <button
        onClick={handleSpin}
        disabled={isSpinning || activePlayers.length === 0}
        className="group relative px-12 py-4 bg-lol-gray border-2 border-lol-gold text-lol-goldLight font-bold text-xl uppercase tracking-widest overflow-hidden transition-all hover:border-lol-blue hover:text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(200,155,60,0.2)]"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-lol-blue/40 to-transparent translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
        <span className="relative z-10">{isSpinning ? 'Girando...' : 'Girar Ruleta'}</span>
      </button>

      <div className="flex gap-4 mt-8 relative z-10">
        <button 
          onClick={resetGame} 
          disabled={isSpinning} 
          className="flex items-center gap-2 px-6 py-2 bg-lol-bg border border-lol-red/40 text-lol-red/80 hover:bg-lol-red/10 hover:border-lol-red hover:text-lol-red rounded transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-widest font-bold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Reiniciar Partida
        </button>
        
        <button 
          onClick={copyTeamsToClipboard} 
          disabled={isSpinning} 
          className="flex items-center gap-2 px-6 py-2 bg-lol-bg border border-lol-blue/40 text-lol-blue/80 hover:bg-lol-blue/10 hover:border-lol-blue hover:text-lol-blue rounded transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-widest font-bold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
          </svg>
          Copiar a Discord
        </button>
      </div>
    </div>
  );
}