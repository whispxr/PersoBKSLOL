// src/App.jsx
import { useContext } from 'react';
import { GameContext } from './context/GameContext';
import Header from './components/Layout/Header';
import TeamPanel from './components/Layout/TeamPanel';
import RouletteCenter from './components/Roulette/RouletteCenter';
import SettingsModal from './components/Settings/SettingsModal';

export default function App() {
  const { isSettingsOpen } = useContext(GameContext);

  return (
    <div className="h-screen w-screen overflow-hidden bg-lol-bg text-lol-goldLight font-sans relative selection:bg-lol-blue selection:text-white uppercase tracking-widest text-xs">
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-lol-bg via-lol-bg/95 to-lol-bg opacity-30 z-0">
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%_1px,transparent_1px_100%)] opacity-10"></div>
      </div>

      <div className="flex flex-col h-full w-full relative z-10">
        
        <Header />

        <div className="flex-1 flex flex-row overflow-hidden">
          <TeamPanel team="blue" title="Equipo Azul" />
          
          <main className="flex-1 relative flex items-center justify-center border-x border-lol-border/30">
            <RouletteCenter />
          </main>

          <TeamPanel team="red" title="Equipo Rojo" />
        </div>
      </div>

      {isSettingsOpen && <SettingsModal />}
    </div>
  );
}