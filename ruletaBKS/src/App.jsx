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
    <div className="h-screen w-screen overflow-hidden bg-rift text-lol-goldLight font-ui relative selection:bg-lol-blue/40 selection:text-white">

      <div className="absolute inset-0 bg-hex-pattern pointer-events-none" />
      <div className="absolute inset-y-0 left-0 w-1/3 bg-linear-to-r from-lol-blue/5 to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-1/3 bg-linear-to-l from-lol-red/5 to-transparent pointer-events-none" />

      <div className="flex flex-col h-full w-full relative z-10">

        <Header />

        <div className="flex-1 min-h-0 flex flex-row items-stretch overflow-hidden">
          <TeamPanel team="blue" title="Equipo Azul" />

          <main className="flex-1 min-w-0 relative flex items-center justify-center">
            <RouletteCenter />
          </main>

          <TeamPanel team="red" title="Equipo Rojo" />
        </div>

        <footer className="relative h-8 shrink-0 flex items-center justify-center">
          <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-lol-goldDark/60 to-transparent" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-lol-mutedDark">
            BKS Gaming · Sorteo de Invocadores
          </span>
        </footer>
      </div>

      {isSettingsOpen && <SettingsModal />}
    </div>
  );
}
