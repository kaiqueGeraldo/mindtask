import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Tarefa } from "@/models/tarefaModel";
import { TabBar } from "./tabBar";
import { TarefaList } from "./tarefaList";
import Button from "@/components/ui/button";
import { TarefaAdicionar } from "./tarefaAdicionar";
import { TarefaProvider } from "@/context/tarefaContext";
import { useTask } from "@/hooks/useTask";

interface ProjetoTarefasProps {
  projetoId: number;
  tarefas: Tarefa[];
  onChange: (tarefasAtualizadas: Tarefa[]) => void;
}

export function ProjetoTarefas({
  projetoId,
  tarefas,
  onChange,
}: ProjetoTarefasProps) {
  return (
    <TarefaProvider projetoId={projetoId} tarefas={tarefas} onChange={onChange}>
      <TarefasInner />
    </TarefaProvider>
  );
}

function TarefasInner() {
  const {
    tarefasVisiveis,
    pendentes,
    concluidas,
    tab,
    setTab,
    mostrarCampoAdicionar,
    setMostrarCampoAdicionar,
    handleDragEnd,
  } = useTask();

  const handleClickAdicionarTarefa = () => {
    setMostrarCampoAdicionar(!mostrarCampoAdicionar);
    setTab("pendentes");
  };

  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-lg p-4 rounded-2xl shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-white">Tarefas</h2>
        <Button onClick={handleClickAdicionarTarefa} className="w-1/2 md:w-1/4">
          {mostrarCampoAdicionar ? "Fechar" : "+ Adicionar tarefas"}
        </Button>
      </div>

      <TabBar
        active={tab}
        pendentesCount={pendentes.length}
        concluidasCount={concluidas.length}
        onSelect={setTab}
      />

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={({ active, over }) => {
          if (over) handleDragEnd(Number(active.id), Number(over.id));
        }}
      >
        <SortableContext
          items={tarefasVisiveis.map((t) => t.id.toString())}
          strategy={verticalListSortingStrategy}
        >
          <TarefaList tipo={tab} />
        </SortableContext>
      </DndContext>

      {mostrarCampoAdicionar && (
        <TarefaAdicionar onClose={() => setMostrarCampoAdicionar(false)} />
      )}
    </div>
  );
}
