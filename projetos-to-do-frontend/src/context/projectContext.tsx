"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { Projeto } from "@/models/projetoModel";
import {
  getAllProjetos,
  updateProjetoGrupo,
  updateProjeto,
  deleteProjeto,
} from "@/services/projectService";
import { useUser } from "@/hooks/useUser";
import { Tarefa } from "@/models/tarefaModel";

interface ProjectContextType {
  projetos: Projeto[];
  setProjetos: React.Dispatch<React.SetStateAction<Projeto[]>>;
  fetchProjetos: () => Promise<void>;
  loading: boolean;
  error: string | null;
  moveProjetoToGrupo: (
    projetoId: number,
    grupoId: number | null
  ) => Promise<void>;
  editProjeto: (id: number, dadosAtualizacao: EditProjetoData) => Promise<void>;
  excluirProjeto: (id: number) => Promise<void>;
  projetoSelecionado: Projeto | null;
  setProjetoSelecionado: React.Dispatch<React.SetStateAction<Projeto | null>>;
}

interface EditProjetoData {
  grupo_id?: number;
  nome?: string;
  descricao?: string;
  status?: number;
  favorito?: boolean;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [projetoSelecionado, setProjetoSelecionado] = useState<Projeto | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchProjetos() {
    if (!user) return;
    setLoading(true);
    try {
      const response = await getAllProjetos(user.id);

      const projetosOrdenados = response?.data
        .sort((a: Projeto, b: Projeto) => a.ordem - b.ordem)
        .map((projeto: Projeto) => {
          const tarefasPendentes = projeto.tarefas
            .filter((t: Tarefa) => !t.feito)
            .sort(
              (a: Tarefa, b: Tarefa) =>
                (a.ordem_pendente ?? 0) - (b.ordem_pendente ?? 0)
            );

          const tarefasConcluidas = projeto.tarefas
            .filter((t: Tarefa) => t.feito)
            .sort(
              (a: Tarefa, b: Tarefa) =>
                (a.ordem_concluida ?? 0) - (b.ordem_concluida ?? 0)
            );

          return {
            ...projeto,
            tarefasPendentes,
            tarefasConcluidas,
          };
        });

      setProjetos(projetosOrdenados);

      setProjetoSelecionado((projetoAnterior) =>
        projetoAnterior
          ? projetosOrdenados.find(
              (p: Projeto) => p.id === projetoAnterior.id
            ) ?? null
          : null
      );
    } catch (error: unknown) {
      console.error("Erro ao carregar projetos:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erro desconhecido");
      }
    } finally {
      setLoading(false);
    }
  }

  async function moveProjetoToGrupo(projetoId: number, grupoId: number | null) {
    try {
      await updateProjetoGrupo(projetoId, grupoId);
      fetchProjetos();
    } catch (error: unknown) {
      console.error("Erro ao mover projeto:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erro desconhecido");
      }
    }
  }

  async function editProjeto(id: number, dadosAtualizacao: EditProjetoData) {
    if (!user) return;
    try {
      await updateProjeto(id, dadosAtualizacao);
      fetchProjetos();
    } catch (error: unknown) {
      console.error("Erro ao editar projeto:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erro desconhecido");
      }
    }
  }

  async function excluirProjeto(id: number) {
    if (!user) return;
    try {
      await deleteProjeto(id);
      fetchProjetos();
    } catch (error: unknown) {
      console.error("Erro ao excluir projeto:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Erro desconhecido");
      }
    }
  }

  useEffect(() => {
    if (user) {
      fetchProjetos();
    }
  }, [user]);

  return (
    <ProjectContext.Provider
      value={{
        projetos,
        setProjetos,
        fetchProjetos,
        loading,
        error,
        moveProjetoToGrupo,
        editProjeto,
        excluirProjeto,
        projetoSelecionado,
        setProjetoSelecionado,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjectContext() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject deve ser usado dentro de um ProjectProvider");
  }
  return context;
}
