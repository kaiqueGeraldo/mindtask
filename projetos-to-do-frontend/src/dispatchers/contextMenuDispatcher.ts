import { Projeto } from "@/models/projetoModel";
import { deleteGrupo, desagruparProjetos } from "@/services/groupService";
import { updateProjeto, updateProjetoGrupo } from "@/services/projectService";
import {
  atualizarTarefaProjeto,
  deletarTarefaProjeto,
} from "@/services/taskService";
import { toggleFavoritoProjeto } from "@/utils/contextMenuUtils";
import { getTarefaById } from "@/utils/getByIdUtils";

export function dispatchContextAction(
  action: string,
  id: number,
  type: "grupo" | "projeto" | "tarefa",
  fetchProjetos: () => void,
  fetchGrupos: () => void,
  setNewProjectGroupId: (id: number) => void,
  setGrupoRetraido: (id: number, expandido: boolean) => void,
  setGrupoEmEdicao: (id: number | null) => void,
  setProjetoEmEdicao: (id: number | null) => void,
  setTarefaEmEdicao: (id: number | null) => void,
  projetos: Projeto[]
) {
  if (type === "grupo") {
    if (action === "add_project") {
      setNewProjectGroupId(id);
    } else if (action === "rename" && setGrupoEmEdicao) {
      setGrupoEmEdicao(id);
    } else if (action === "delete") {
      deleteGrupo(id)
        .then(() => {
          fetchProjetos();
          fetchGrupos();
        })
        .catch((err) => console.error("Erro ao excluir grupo:", err));
    } else if (action === "ungroup_projects") {
      desagruparProjetos(id)
        .then(() => {
          setGrupoRetraido(id, false);
          fetchProjetos();
          fetchGrupos();
        })
        .catch((err: unknown) => {
          console.error("Erro ao desagrupar projetos:", err);
        });
    }
  } else if (type === "projeto") {
    const projeto = projetos.find((p) => p.id === id);
    if (!projeto) return;

    if (action === "remove_project") {
      updateProjetoGrupo(id, null)
        .then(() => {
          fetchProjetos();
          fetchGrupos();
        })
        .catch((err: unknown) => {
          console.error("Erro ao remover projeto:", err);
        });
    } else if (action === "rename") {
      setProjetoEmEdicao(id);
    } else if (action === "favorite") {
      toggleFavoritoProjeto(id, projeto.favorito, fetchProjetos, fetchGrupos);
    } else if (action === "archive_project" || action === "unarchive_project") {
      const novoStatus = action === "archive_project" ? 3 : 0;

      updateProjeto(id, { status: novoStatus, favorito: false })
        .then(() => {
          fetchProjetos();
          fetchGrupos();
        })
        .catch((err: unknown) => {
          console.error(
            `Erro ao ${
              action === "archive_project" ? "arquivar" : "desarquivar"
            } projeto:`,
            err
          );
        });
    }
  } else if (type === "tarefa") {
    const resultado = getTarefaById(id, projetos);
    if (!resultado) return;

    const { tarefa } = resultado;

    if (action === "rename") {
      setTarefaEmEdicao(tarefa.id);
    } else if (action === "delete") {
      deletarTarefaProjeto(tarefa.id)
        .then(() => {
          fetchProjetos();
          fetchGrupos();
        })
        .catch((err) => console.error("Erro ao excluir tarefa:", err));
    } else if (action === "archive_task") {
      atualizarTarefaProjeto(tarefa.id, {})
        .then(() => {
          fetchProjetos();
        })
        .catch((err) => {
          console.error("Erro ao arquivar tarefa:", err);
        });
    }
  }
}
