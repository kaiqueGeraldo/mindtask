import { apiRequest } from "./api";

// Função para buscar todas as tecnologias
export async function getAllTechnology() {
  return apiRequest(`/tecnologias`, {
    method: "GET",
  });
}

// Função para atualizar tecnologias de um projeto
export async function atualizarTecnologiasProjeto(
  projetoId: number,
  tecnologiaIds: number[]
) {
  return apiRequest(`/tecnologias/${projetoId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tecnologiaIds }),
  });
}

// Função para deletar uma tecnologia
export async function deletarTecnologiaProjeto(
  projeto_id: number,
  tecnologia_id: number
) {
  return apiRequest(`/tecnologias/${projeto_id}/${tecnologia_id}`, {
    method: "DELETE",
  });
}
