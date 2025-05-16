import { Tarefa } from "@/models/tarefaModel";
import { apiRequest } from "./api";

// Função para buscar todas as tarefas de um projeto
export async function getAllTasks(projetoId: number) {
  return apiRequest(`/tarefas/${projetoId}`, {
    method: "GET",
  });
}

// Função para criar uma nova tarefa para um projeto
export async function criarTarefaProjeto(
  projetoId: number,
  titulo: string,
  ordem_pendente: number
) {
  return apiRequest("/tarefas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projeto_id: projetoId, titulo, ordem_pendente }),
  });
}

// Função para atualizar uma tarefa específica
export async function atualizarTarefaProjeto(
  id: number,
  dadosAtualizados: Partial<Tarefa>
) {
  return apiRequest(`/tarefas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dadosAtualizados),
  });
}

// Função para atualizar ordem das tarefas
export async function atualizarOrdemTarefas(
  tarefas: { id: number; ordem_pendente?: number; ordem_concluida?: number }[]
) {
  return apiRequest(`/tarefas/atualizar-ordem`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tarefas),
  });
}

// Função para deletar uma tarefa
export async function deletarTarefaProjeto(id: number) {
  return apiRequest(`/tarefas/${id}`, {
    method: "DELETE",
  });
}
