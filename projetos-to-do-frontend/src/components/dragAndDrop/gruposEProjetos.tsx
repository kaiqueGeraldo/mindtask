import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { useGroup } from "@/hooks/useGroup";
import { useProject } from "@/hooks/useProject";
import { DraggableItem } from "./draggableItem";
import { DraggableGroupItem } from "./draggableGroupItem/draggableGoupItem";
import { DroppableSemGrupo } from "./droppableSemGrupo";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { Boxes, Folder, Inbox } from "lucide-react";

export function GruposEProjetos() {
  const { grupos } = useGroup();
  const { projetos } = useProject();
  const [isClient, setIsClient] = useState(false);

  const {
    activeItem,
    expandedGroups,
    toggleExpandGroup,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  } = useDragAndDrop();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const projetosSemGrupo = projetos.filter((p) => p.grupo_id === null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="flex flex-col gap-2">
        <div className="text-gray-400 font-bold ml-2">Grupos</div>
        <SortableContext
          items={grupos.map((g) => `grupo-${g.id}`)}
          strategy={verticalListSortingStrategy}
        >
          {grupos.length === 0 ? (
            <div className="flex items-center gap-2 px-4 py-2 text-sm text-white/50 mx-2 italic select-none border border-dashed border-white/20 rounded backdrop-blur-md bg-white/5">
              <Inbox className="w-4 h-4 text-white/40" />
              <span>Sem grupos aqui</span>
            </div>
          ) : (
            grupos.map((grupo) => {
              const projetosDoGrupo = projetos.filter(
                (p) => p.grupo_id === grupo.id
              );

              return (
                <DraggableGroupItem
                  key={grupo.id}
                  grupo={grupo}
                  projetos={projetosDoGrupo}
                  isExpanded={expandedGroups.includes(grupo.id)}
                  toggleExpand={() => toggleExpandGroup(grupo.id)}
                />
              );
            })
          )}
        </SortableContext>

        <div>
          <div className="text-gray-400 font-bold ml-2 mb-2">Projetos</div>
          <DroppableSemGrupo>
            <SortableContext
              items={projetosSemGrupo.map((p) => `projeto-${p.id}`)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col mx-2 space-y-2">
                {projetosSemGrupo.length === 0 ? (
                  <div className="flex items-center gap-2 px-4 py-2 text-sm text-white/50 italic select-none border border-dashed border-white/20 rounded backdrop-blur-md bg-white/5">
                    <Inbox className="w-4 h-4 text-white/40" />
                    <span>Sem projetos aqui</span>
                  </div>
                ) : (
                  projetosSemGrupo.map((projeto) => (
                    <DraggableItem
                      key={projeto.id}
                      projeto={projeto}
                      containerId="sem-grupo"
                    />
                  ))
                )}
              </div>
            </SortableContext>
          </DroppableSemGrupo>
        </div>
      </div>

      <DragOverlay>
        {activeItem?.type === "projeto" ? (
          // Projeto
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg shadow-md backdrop-blur-md bg-white/10 border border-white/20 text-white font-semibold cursor-grabbing">
            <Boxes className="w-4 h-4 text-white/70 shrink-0" />
            <span className="truncate whitespace-nowrap overflow-hidden">
              {activeItem.nome}
            </span>
          </div>
        ) : activeItem?.type === "grupo" ? (
          // Grupo
          <div className="flex items-center gap-2 px-4 py-2 rounded shadow-md backdrop-blur-md bg-white/10 border border-white/20 text-white font-semibold cursor-grabbing">
            <Folder className="w-5 h-5 text-blue-400 shrink-0" />
            <span className="truncate whitespace-nowrap overflow-hidden">
              {activeItem.nome}
            </span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
