import { CheckSquare, Square, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useContextMenu } from "@/hooks/useContextMenu";
import { useTask } from "@/hooks/useTask";
import { EditableTitle } from "@/components/editableTitle";
import { Tarefa } from "@/models/tarefaModel";

interface TarefaItemProps {
  tarefa: Tarefa;
}

export function TarefaItem({ tarefa }: TarefaItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: tarefa.id.toString(),
      data: { type: "tarefa", tarefa },
    });

  const style = { transform: CSS.Transform.toString(transform), transition };

  const { openMenu, tarefaEmEdicao, setTarefaEmEdicao } = useContextMenu();
  const { handleSalvarEdicao, handleToggleFeito } = useTask();

  return (
    <li
      ref={setNodeRef}
      style={style}
      onContextMenu={(e) => {
        e.stopPropagation();
        openMenu(e, { type: "tarefa", id: tarefa.id });
      }}
      className={`flex items-center gap-3 p-3 rounded-md border relative select-none cursor-pointer ${
        tarefa.feito ? "bg-green-100/10 border-green-500" : "bg-white/5"
      }`}
    >
      <button
        onClick={() => {
          if (tarefaEmEdicao !== tarefa.id) {
            handleToggleFeito(tarefa.id);
          }
        }}
        className="text-white cursor-pointer"
      >
        {tarefa.feito ? <CheckSquare size={20} /> : <Square size={20} />}
      </button>

      <EditableTitle
        id={tarefa.id}
        valor={tarefa.titulo}
        maxLength={255}
        aoSalvar={(novo) => handleSalvarEdicao(tarefa.id, novo)}
        forcarEdicao={tarefaEmEdicao === tarefa.id}
        aoCancelarEdicao={() => setTarefaEmEdicao(null)}
        className="flex-1"
      />

      <button
        {...attributes}
        {...listeners}
        className="text-white/50 cursor-grab"
      >
        <GripVertical size={16} />
      </button>
    </li>
  );
}
