import { Projeto } from "@/models/projetoModel";
import { Tarefa } from "@/models/tarefaModel";

export function getTarefaById(id: number, projetos: Projeto[]): { tarefa: Tarefa; projeto: Projeto } | null {
    for (const projeto of projetos) {
      const tarefa = projeto.tarefas.find((t) => t.id === id);
      if (tarefa) {
        return { tarefa, projeto };
      }
    }
    return null;
  }
  