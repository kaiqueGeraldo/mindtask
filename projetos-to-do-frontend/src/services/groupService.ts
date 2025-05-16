import { apiRequest } from "./api";

// Função para buscar todos os grupos
export async function getAllGrupos(usuario_id: number) {
  return apiRequest(`/grupos/${usuario_id}`, {
    method: "GET",
  });
}

// Função para criar um novo grupo
export async function createGrupo(usuario_id: number, nome: string) {
  return apiRequest("/grupos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario_id, nome }),
  });
}

// Função para atualizar um grupo
export async function updateGrupo(
  id: number,
  data: { nome?: string; expandido?: boolean }
) {
  return apiRequest(`/grupos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// Função para atualizar ordem de um grupo
export async function updateOrdemGrupos(
  grupos: { id: number; ordem: number }[]
) {
  return apiRequest("/grupos/ordem", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ grupos }),
  });
}

// Função para desagrupar todos os projetos de um grupo
export async function desagruparProjetos(grupoId: number) {
  return apiRequest(`/grupos/${grupoId}/desagrupar`, {
    method: "POST",
  });
}

// Função para deletar um grupo
export async function deleteGrupo(id: number) {
  return apiRequest(`/grupos/${id}`, {
    method: "DELETE",
  });
}
