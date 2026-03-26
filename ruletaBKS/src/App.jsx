// src/App.jsx
import { useContext } from 'react';
import { GameContext } from './context/GameContext';
import Header from './components/Layout/Header';
import TeamPanel from './components/Layout/TeamPanel';
import RouletteCenter from './components/Roulette/RouletteCenter';
import SettingsModal from './components/Settings/SettingsModal'; // <-- IMPORTANTE

export default function App() {
  const { isSettingsOpen } = useContext(GameContext);

  return (
    <div className="h-screen w-screen overflow-hidden bg-lol-bg text-lol-goldLight font-sans selection:bg-lol-blue selection:text-white relative">
      <div className="flex flex-col h-full w-full">
        
        <Header />

        <div className="flex-1 flex flex-row overflow-hidden">
          <TeamPanel team="blue" title="Equipo Azul" />
          
          <main className="flex-1 relative flex items-center justify-center bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-[#0a1428] to-lol-bg border-x border-lol-border/50 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]">
            <RouletteCenter />
          </main>

          <TeamPanel team="red" title="Equipo Rojo" />
        </div>
      </div>

      {/* Aquí renderizamos el Modal si está abierto */}
      {isSettingsOpen && <SettingsModal />} 
    </div>
  );
}