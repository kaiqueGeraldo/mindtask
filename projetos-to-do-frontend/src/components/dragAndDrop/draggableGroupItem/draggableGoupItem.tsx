import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Projeto } from "@/models/projetoModel";
import { useDroppable } from "@dnd-kit/core";
import { useContextMenu } from "@/hooks/useContextMenu";
import { updateGrupo } from "@/services/groupService";
import { useGroup } from "@/hooks/useGroup";
import { GroupHeader } from "./groupHeader";
import { GroupContent } from "./groupContent";

interface DraggableGroupItemProps {
  grupo: { id: number; nome: string; projetos: Projeto[] };
  projetos: Projeto[];
  isExpanded: boolean;
  toggleExpand: () => void;
}

export function DraggableGroupItem({
  grupo,
  projetos,
  isExpanded,
  toggleExpand,
}: DraggableGroupItemProps) {
  const {
    setNodeRef: setSortableRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `grupo-${grupo.id}`,
    data: { type: "grupo", grupo },
  });

  const { openMenu, grupoEmEdicao, setGrupoEmEdicao } = useContextMenu();
  const { fetchGrupos } = useGroup();

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: `grupo-drop-${grupo.id}`,
    data: { type: "grupo", grupo },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <>
      {grupoEmEdicao !== null && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => setGrupoEmEdicao(null)}
        />
      )}

      <div ref={setDroppableRef}>
        <div
          ref={setSortableRef}
          style={style}
          {...attributes}
          className={`relative rounded-lg mx-2 p-2 shadow-md backdrop-blur-md bg-white/5 border border-white/10 z-60 ${
            isDragging ? "ring-2 ring-blue-400" : ""
          }`}
          onContextMenu={(e) => {
            e.stopPropagation();
            openMenu(e, { type: "grupo", id: grupo.id, });
          }}
        >
          <GroupHeader
            grupo={grupo}
            isExpanded={isExpanded}
            toggleExpand={toggleExpand}
            grupoEmEdicao={grupoEmEdicao}
            setGrupoEmEdicao={setGrupoEmEdicao}
            listeners={listeners}
            attributes={attributes}
            onSalvar={(novoNome) => {
              updateGrupo(grupo.id, { nome: novoNome })
                .then(() => {
                  setGrupoEmEdicao(null);
                  fetchGrupos();
                })
                .catch((err) => console.error("Erro ao renomear grupo:", err));
            }}
          />

          <GroupContent
            isExpanded={isExpanded}
            projetos={projetos}
            containerId={`grupo-${grupo.id}`}
          />
        </div>
      </div>
    </>
  );
}
