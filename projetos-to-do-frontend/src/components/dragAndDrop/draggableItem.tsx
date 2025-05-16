import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Boxes, GripVertical, Star } from "lucide-react";
import { useContextMenu } from "@/hooks/useContextMenu";
import { EditableTitle } from "@/components/editableTitle";
import { updateNomeProjeto } from "@/services/projectService";
import { useProject } from "@/hooks/useProject";
import { useRouter } from "next/navigation";

interface DraggableItemProps {
  projeto: any;
  containerId: string;
}

export function DraggableItem({ projeto, containerId }: DraggableItemProps) {
  const {
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `projeto-${projeto.id}`,
    data: {
      type: "projeto",
      projeto,
      containerId,
      parentId: projeto.grupo_id ? `grupo-${projeto.grupo_id}` : null,
    },
  });

  const {
    openMenu,
    closeMenu,
    setProjetoParaExcluir,
    setConfirmandoExclusao,
    projetoEmEdicao,
    setProjetoEmEdicao,
  } = useContextMenu();

  const { fetchProjetos } = useProject();

  const router = useRouter();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg shadow-sm text-sm font-medium text-white bg-white/5 border border-white/10 backdrop-blur-md cursor-pointer select-none ${
        isDragging ? `ring-1 ring-white/50 cursor-grabbing` : ""
      }`}
      onContextMenu={(e) => {
        e.stopPropagation();
        openMenu(e, {
          type: "projeto",
          id: projeto.id,
          projeto,
          onDelete: () => {
            setProjetoParaExcluir(projeto);
            setConfirmandoExclusao(true);
            closeMenu();
          },
        });
      }}
    >
      <div
        className="flex items-center gap-2 min-w-0 flex-1"
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/projeto/${projeto.id}`);
        }}
        onPointerDown={(e) => {
          if (e.button === 0) {
            e.stopPropagation();
          }
        }}
      >
        <Boxes className="w-4 h-4 text-white/70 shrink-0" />
        <EditableTitle
          key={
            projetoEmEdicao === projeto.id
              ? `edit-${projeto.id}`
              : `normal-${projeto.id}`
          }
          id={projeto.id}
          valor={projeto.nome}
          aoSalvar={(novoNome) => {
            updateNomeProjeto(projeto.id, novoNome)
              .then(() => fetchProjetos())
              .catch((err) => console.error("Erro ao renomear projeto:", err));
          }}
          maxLength={255}
          forcarEdicao={projetoEmEdicao === projeto.id}
          aoCancelarEdicao={() => setProjetoEmEdicao(null)}
          className="w-full"
        />
      </div>

      <div {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical className="w-4 h-4 text-white/50" />
      </div>
    </div>
  );
}
