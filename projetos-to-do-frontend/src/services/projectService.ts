import { Projeto } from "@/models/projetoModel";
import { apiRequest } from "./api";

// Função para buscar todos os projetos
export async function getAllProjetos(usuario_id: number) {
  return apiRequest(`/projetos/usuario/${usuario_id}`, {
    method: "GET",
  });
}

// Função para buscar projeto por id
export async function getProjetoPorId(id: number, usuario_id: number) {
  return apiRequest(`/projetos/${id}?usuarioId=${usuario_id}`, {
    method: "GET",
  });
}

// Função para criar um novo projeto
export async function createProjeto(
  usuario_id: number,
  grupo_id: number | null,
  nome: string,
  descricao: string
) {
  return apiRequest("/projetos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      usuario_id,
      grupo_id,
      nome,
      descricao,
    }),
  });
}

// Função para atualizar um projeto
export async function updateProjeto(
  id: number,
  dadosAtualizacao: Partial<Projeto>
) {
  return apiRequest(`/projetos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dadosAtualizacao),
  });
}

// Função para atualizar nome de um projeto
export async function updateNomeProjeto(id: number, nome: string) {
  return apiRequest(`/projetos/nome/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome }),
  });
}

// Função para atualizar o grupo de um projeto
export async function updateProjetoGrupo(id: number, grupo_id: number | null) {
  return apiRequest(`/projetos/grupo/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ grupo_id }),
  });
}

// Função para atualizar a ordem de um projeto
export async function updateOrdemProjetos(
  projetos: { id: number; ordem: number }[]
) {
  return apiRequest("/projetos/ordem", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projetos }),
  });
}

// Função para deletar um projeto
export async function deleteProjeto(id: number) {
  return apiRequest(`/projetos/${id}`, {
    method: "DELETE",
  });
}
