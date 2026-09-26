// src/components/Settings/SettingsModal.jsx
import { useContext } from 'react';
import { GameContext } from '../../context/GameContext';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { CloseIcon, DragIcon } from '../Layout/Icons';

const FRIENDS_LIST = [
  "Shampa", "Samuel", "Leo", "Kaled", "Web", "Naika",
  "Yula", "Fadi", "Ficha", "Matute", "Potac", "Simon", "Lamoshca",
  "Lucas", "Kato","Pejerey", "Alonso"
];

export default function SettingsModal() {
  const { players, updatePlayer, roles, toggleRoleActive, reorderRoles, setIsSettingsOpen, gameMode, changeGameMode } = useContext(GameContext);
  const isDuel = gameMode === '1v1';

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    reorderRoles(result.source.index, result.destination.index);
  };

  const handleQuickAdd = (name) => {
    if (players.includes(name)) return; // Evitar que se agregue dos veces

    const firstEmptyIndex = players.findIndex(p => p.trim() === '');
    if (firstEmptyIndex !== -1) {
      updatePlayer(firstEmptyIndex, name);
    }
  };

  const filledCount = players.filter(p => p.trim() !== '').length;
  const activeOrder = Object.fromEntries(roles.filter(r => r.active).map((r, i) => [r.id, i]));

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-lol-bg/85 backdrop-blur-sm fade-in">
      <div className="relative w-[min(1000px,94vw)] max-h-[90vh] flex flex-col frame-gold bg-linear-to-b from-lol-panel to-lol-bg shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_40px_rgba(200,170,110,0.12)]">

        <span className="absolute -top-[5px] -left-[5px] w-2 h-2 rotate-45 bg-lol-goldMid" />
        <span className="absolute -top-[5px] -right-[5px] w-2 h-2 rotate-45 bg-lol-goldMid" />
        <span className="absolute -bottom-[5px] -left-[5px] w-2 h-2 rotate-45 bg-lol-goldMid" />
        <span className="absolute -bottom-[5px] -right-[5px] w-2 h-2 rotate-45 bg-lol-goldMid" />

        <div className="relative flex justify-between items-center px-7 py-5 border-b border-lol-goldDeep">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-lol-blue">Sala personalizada</span>
            <h2 className="font-display text-2xl font-bold uppercase tracking-[0.15em] text-gold-gradient">Configuración de Partida</h2>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="w-9 h-9 rounded-full flex items-center justify-center border-2 border-lol-goldDark bg-lol-bg text-lol-goldMid hover:border-lol-goldLight hover:text-lol-goldLight hover:shadow-[0_0_12px_rgba(200,170,110,0.4)] transition-all"
            title="Cerrar"
          >
            <CloseIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-5 px-7 pt-5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-lol-muted">Modo de juego</span>
          <div className="flex">
            {[
              { id: '5v5', label: '5 vs 5', hint: 'Equipos completos' },
              { id: '1v1', label: '1 vs 1', hint: 'Duelo en Mid' },
            ].map(mode => (
              <button
                key={mode.id}
                onClick={() => changeGameMode(mode.id)}
                className={`btn-hex w-40 flex-col gap-0.5 py-2 ${gameMode === mode.id ? 'is-active' : 'opacity-70 hover:opacity-100'}`}
              >
                <span className="font-display text-sm tracking-[0.2em]">{mode.label}</span>
                <span className="text-[9px] font-semibold tracking-[0.2em] text-lol-muted">{mode.hint}</span>
              </button>
            ))}
          </div>
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-lol-mutedDark">
            Cambiar de modo reinicia los equipos sorteados
          </span>
        </div>

        <div className="flex-1 min-h-0 flex flex-row gap-8 px-7 py-6 overflow-hidden h-[560px]">

          <section className="flex-1 min-w-0 flex flex-col overflow-y-auto pr-3 custom-scrollbar">
            <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-lol-goldDeep">
              <h3 className="font-display text-lg font-bold uppercase tracking-[0.15em] text-lol-goldLight">Invocadores</h3>
              <span className="text-xs font-semibold tracking-[0.2em] text-lol-muted tabular-nums">{filledCount} / {players.length}</span>
            </div>

            <div className="mb-5 p-3.5 border border-lol-goldDeep bg-lol-bg/60">
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-lol-muted mb-3">Roster BKS · Clic para añadir</p>
              <div className="flex flex-wrap gap-2">
                {FRIENDS_LIST.map(friend => {
                  const isAdded = players.includes(friend);
                  return (
                    <button
                      key={friend}
                      onClick={() => handleQuickAdd(friend)}
                      disabled={isAdded}
                      className={`px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] border transition-all ${
                        isAdded
                          ? 'border-lol-border/40 bg-transparent text-lol-mutedDark/60 line-through cursor-not-allowed'
                          : 'border-lol-blueDark/60 bg-lol-blueDeep/15 text-lol-hextech hover:bg-lol-blue/20 hover:border-lol-blue hover:shadow-[0_0_10px_rgba(10,200,185,0.35)] cursor-pointer'
                      }`}
                    >
                      {friend}
                    </button>
                  );
                })}
              </div>
            </div>

            <datalist id="friends-list">
              {FRIENDS_LIST.map(friend => <option key={friend} value={friend} />)}
            </datalist>

            <div className="space-y-2">
              {players.map((player, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="w-7 h-7 shrink-0 flex items-center justify-center">
                    <span className={`w-5 h-5 rotate-45 border flex items-center justify-center ${player ? 'border-lol-goldMid bg-lol-goldDeep/40' : 'border-lol-goldDeep'}`}>
                      <span className={`-rotate-45 text-[10px] font-bold tabular-nums ${player ? 'text-lol-goldLight' : 'text-lol-mutedDark'}`}>{index + 1}</span>
                    </span>
                  </span>
                  <input
                    type="text"
                    list="friends-list"
                    value={player}
                    onChange={(e) => updatePlayer(index, e.target.value)}
                    placeholder={`Invocador ${index + 1}`}
                    className="flex-1 min-w-0 bg-lol-bg/80 border border-lol-goldDeep px-3 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-lol-goldLight placeholder:text-lol-mutedDark placeholder:font-medium focus:outline-none focus:border-lol-goldMid focus:shadow-[0_0_10px_rgba(200,170,110,0.2)] transition-all"
                  />
                  {player && (
                    <button
                      onClick={() => updatePlayer(index, '')}
                      className="w-8 h-8 shrink-0 flex items-center justify-center text-lol-mutedDark hover:text-lol-red transition-colors"
                      title="Borrar jugador"
                    >
                      <CloseIcon className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          <div className="w-px bg-linear-to-b from-transparent via-lol-goldDeep to-transparent" />

          <section className="relative flex-1 min-w-0 flex flex-col overflow-hidden">
             <div className="flex items-baseline justify-between mb-4 pb-2 border-b border-lol-goldDeep">
               <h3 className="font-display text-lg font-bold uppercase tracking-[0.15em] text-lol-goldLight">Orden de Roles</h3>
               <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-lol-muted">
                 {isDuel ? 'No aplica en 1 vs 1' : 'Arrastra para ordenar'}
               </span>
             </div>

             {isDuel && (
               <div className="absolute inset-x-0 top-14 bottom-0 z-10 flex items-center justify-center bg-lol-bg/70">
                 <div className="frame-gold-thin bg-lol-panel px-6 py-5 text-center max-w-[80%]">
                   <p className="font-display text-base font-bold uppercase tracking-[0.15em] text-lol-goldLight mb-1">Duelo 1 vs 1</p>
                   <p className="text-xs font-medium uppercase tracking-[0.15em] text-lol-muted">
                     La ruleta saca dos invocadores: el primero va a <span className="text-lol-blue">Azul</span> y el segundo a <span className="text-lol-red">Rojo</span>. Se enfrentan en Mid.
                   </p>
                 </div>
               </div>
             )}

             <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="roles-list">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="flex-1 overflow-y-auto pr-3 space-y-1.5 custom-scrollbar">

                      {roles.map((role, index) => {
                        const order = activeOrder[role.id];
                        const isBlueSide = order !== undefined && order % 2 === 0;
                        return (
                          <Draggable key={role.id} draggableId={role.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`flex items-center justify-between gap-3 px-3 py-2 border select-none transition-colors ${
                                  snapshot.isDragging
                                    ? 'bg-lol-blueDeep/40 border-lol-blue shadow-[0_0_20px_rgba(10,200,185,0.35)]'
                                    : 'bg-lol-bg/70 border-lol-goldDeep hover:border-lol-goldDark'
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <DragIcon className="w-4 h-4 shrink-0 text-lol-mutedDark cursor-grab active:cursor-grabbing" />
                                  <span className={`w-9 h-9 shrink-0 rounded-full p-[1.5px] ${role.active ? 'bg-linear-to-b from-lol-goldMid to-lol-goldDark' : 'bg-lol-border/60'}`}>
                                    <span className="w-full h-full rounded-full bg-lol-bg flex items-center justify-center">
                                      <img src={role.icon} alt={role.label} className={`w-5 h-5 object-contain ${role.active ? '' : 'opacity-30 grayscale'}`} />
                                    </span>
                                  </span>
                                  <span className={`text-sm font-bold uppercase tracking-[0.15em] ${role.active ? 'text-lol-goldLight' : 'text-lol-mutedDark line-through'}`}>{role.label}</span>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                  {order !== undefined && (
                                    <span className={`flex items-center gap-1.5 px-2 py-0.5 border text-[10px] font-bold uppercase tracking-[0.2em] ${
                                      isBlueSide ? 'border-lol-blue/40 text-lol-blue bg-lol-blue/5' : 'border-lol-red/40 text-lol-red bg-lol-red/5'
                                    }`}>
                                      <span className="tabular-nums">#{order + 1}</span>
                                      {isBlueSide ? 'Azul' : 'Rojo'}
                                    </span>
                                  )}
                                  <input
                                    type="checkbox"
                                    checked={role.active}
                                    onChange={() => toggleRoleActive(role.id)}
                                    className="checkbox-hex"
                                    aria-label={`Activar ${role.label}`}
                                  />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}

                    </div>
                  )}
                </Droppable>
             </DragDropContext>
          </section>

        </div>

        <div className="flex items-center justify-between gap-6 px-7 py-4 border-t border-lol-goldDeep bg-lol-bg/60">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-lol-muted">
            {isDuel ? (
              <>Modo duelo: se sortean 2 invocadores, uno para <span className="text-lol-blue">Azul</span> y otro para <span className="text-lol-red">Rojo</span></>
            ) : (
              <>Los roles se reparten alternando <span className="text-lol-blue">Azul</span> y <span className="text-lol-red">Rojo</span> según este orden</>
            )}
          </p>
          <button onClick={() => setIsSettingsOpen(false)} className="btn-lockin h-12 px-8 text-sm shrink-0">
            Guardar y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
