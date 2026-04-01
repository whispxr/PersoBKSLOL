// src/components/Settings/SettingsModal.jsx
import { useContext } from 'react';
import { GameContext } from '../../context/GameContext';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const FRIENDS_LIST = [
  "Shampa", "Samuel", "Leo", "Kaled", "Web", "Naika", 
  "Yula", "Fadi", "Ficha", "Matute", "Potac", "Simon", "Lamoshca",
  "Lucas", "Kato","Pejerey", "Alonso"
];

export default function SettingsModal() {
  const { players, updatePlayer, roles, toggleRoleActive, reorderRoles, setIsSettingsOpen } = useContext(GameContext);

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

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-[950px] max-h-[85vh] flex flex-col bg-lol-gray border-2 border-lol-gold rounded-lg shadow-[0_0_30px_rgba(200,155,60,0.15)] overflow-hidden">
        
        <div className="flex justify-between items-center p-4 border-b border-lol-border bg-lol-bg">
          <h2 className="text-2xl font-bold text-lol-gold tracking-widest uppercase">Configuración de Partida</h2>
          <button onClick={() => setIsSettingsOpen(false)} className="text-lol-red hover:text-white font-bold text-3xl transition-colors">&times;</button>
        </div>

        <div className="flex-1 flex flex-row p-6 gap-8 overflow-hidden h-[550px]">
          
          <div className="flex-1 flex flex-col overflow-y-auto pr-2 custom-scrollbar">
            <h3 className="text-xl text-lol-blue font-bold mb-4 uppercase border-b border-lol-border/50 pb-2">Jugadores</h3>
            
            <div className="mb-6 bg-lol-bg border border-lol-border p-3 rounded">
              <p className="text-xs text-lol-goldLight/50 mb-3 uppercase tracking-wider">Roster (Clic para añadir):</p>
              <div className="flex flex-wrap gap-2">
                {FRIENDS_LIST.map(friend => {
                  const isAdded = players.includes(friend);
                  return (
                    <button
                      key={friend}
                      onClick={() => handleQuickAdd(friend)}
                      disabled={isAdded}
                      className={`text-xs px-3 py-1.5 rounded font-bold transition-all ${
                        isAdded 
                          ? 'bg-lol-border/30 text-lol-goldLight/20 border-transparent cursor-not-allowed line-through' 
                          : 'bg-lol-gray border border-lol-blue text-lol-blue hover:bg-lol-blue hover:text-lol-bg cursor-pointer shadow-sm hover:shadow-lol-blue/50'
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

            <div className="space-y-3">
              {players.map((player, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-lol-goldLight/50 font-bold w-6 text-right">{index + 1}.</span>
                  <input
                    type="text"
                    list="friends-list"
                    value={player}
                    onChange={(e) => updatePlayer(index, e.target.value)}
                    placeholder={`Invocador ${index + 1}`}
                    className="flex-1 bg-lol-bg border border-lol-border rounded px-3 py-2 text-lol-goldLight focus:outline-none focus:border-lol-blue transition-all"
                  />
                  {player && (
                    <button 
                      onClick={() => updatePlayer(index, '')}
                      className="text-lol-red/50 hover:text-lol-red font-bold text-sm px-2"
                      title="Borrar jugador"
                    >
                      X
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
             <h3 className="text-xl text-lol-gold font-bold mb-4 uppercase border-b border-lol-border/50 pb-2">Orden de Roles (Arrastra)</h3>
             
             <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="roles-list">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                      
                      {roles.map((role, index) => (
                        <Draggable key={role.id} draggableId={role.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`flex items-center justify-between p-3 rounded border select-none transition-colors ${
                                snapshot.isDragging ? 'bg-lol-blue/20 border-lol-blue z-50 shadow-lg' : 'bg-lol-bg border-lol-border hover:border-lol-gold/50'
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <span className="text-xl text-lol-goldLight/30 cursor-grab active:cursor-grabbing hover:text-lol-gold">☰</span>
                                <img src={role.icon} alt={role.label} className="w-6 h-6 object-contain filter drop-shadow-md" />
                                <span className={`font-bold tracking-wide ${role.active ? 'text-lol-goldLight' : 'text-gray-600 line-through'}`}>{role.label}</span>
                              </div>
                              <input 
                                type="checkbox" 
                                checked={role.active} 
                                onChange={() => toggleRoleActive(role.id)} 
                                className="w-5 h-5 accent-lol-blue cursor-pointer"
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                    </div>
                  )}
                </Droppable>
             </DragDropContext>
          </div>

        </div>

        <div className="p-4 border-t border-lol-border bg-lol-bg flex justify-end">
          <button onClick={() => setIsSettingsOpen(false)} className="px-8 py-3 bg-lol-blue text-lol-bg font-bold uppercase tracking-wider rounded hover:bg-cyan-400 transition-colors shadow-lg shadow-lol-blue/20">
            Guardar y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}