import { Projeto } from "@/models/projetoModel";
import { updateProjeto } from "@/services/projectService";

export async function toggleFavoritoProjeto(
  projetoId: number,
  favoritoAtual: boolean,
  fetchProjetos: () => void,
  fetchGrupos: () => void
) {
  try {
    await updateProjeto(projetoId, { favorito: !favoritoAtual });
    fetchProjetos();
    fetchGrupos();
  } catch (err) {
    console.error("Erro ao favoritar projeto:", err);
  }
}

export function getContextMenuItems(
  type: "grupo" | "projeto" | "tarefa",
  item: number | Projeto,
  projetos: Projeto[]
) {
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const isProjeto = type === "projeto";
  const isGrupo = type === "grupo";

  const id = typeof item === "number" ? item : item.id;
  const grupoId = typeof item === "number" ? null : item.grupo_id;
  const favorite = typeof item === "number" ? null : item.favorito;
  const isFavorite = !!favorite;
  const isArchived = typeof item !== "number" && item.status === 3;

  const hasProjetos = isGrupo && projetos.some((p) => p.grupo_id === id);

  const common = [
    { label: `Renomear ${capitalize(type)}`, action: "rename" },
    isGrupo && hasProjetos
      ? { label: `Desagrupar Projetos`, action: "ungroup_projects" }
      : { label: `Excluir ${capitalize(type)}`, action: "delete" },
  ];

  const groupSpecific = [{ label: "Adicionar Projeto", action: "add_project" }];

  const projectSpecific = [
    {
      label: `${isFavorite ? "Remover dos Favoritos" : "Marcar como Favorito"}`,
      action: "favorite",
    },
    {
      label: `${isArchived ? "Desarquivar Projeto" : "Arquivar Projeto"}`,
      action: isArchived ? "unarchive_project" : "archive_project",
    },
    ...(isProjeto && grupoId !== null
      ? [{ label: "Remover do Grupo", action: "remove_project" }]
      : []),
  ];

  if (isGrupo) return [...groupSpecific, ...common];
  if (isProjeto) return [...projectSpecific, ...common];
  return common;
}
