"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { Grupo } from "@/models/grupoModel";
import {
  getAllGrupos,
  updateGrupo,
  deleteGrupo,
} from "@/services/groupService";
import { useUser } from "@/hooks/useUser";

interface GroupContextType {
  grupos: Grupo[];
  setGrupos: React.Dispatch<React.SetStateAction<Grupo[]>>;
  fetchGrupos: () => Promise<void>;
  expandedGroups: number[];
  setExpandedGroups: React.Dispatch<React.SetStateAction<number[]>>;
  loading: boolean;
  error: string | null;
  renameGrupo: (id: number, nome: string) => Promise<void>;
  excluirGrupo: (id: number) => Promise<void>;
  toggleGrupoExpandido: (id: number, expandido: boolean) => Promise<void>;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export function GroupProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchGrupos() {
    if (!user) return;
    setLoading(true);
    try {
      const response = await getAllGrupos(user.id);
      const gruposOrdenados = response.data.sort(
        (a: Grupo, b: Grupo) => a.ordem - b.ordem
      );
      setGrupos(gruposOrdenados);

      const idsExpandido = gruposOrdenados
        .filter((g: Grupo) => g.expandido)
        .map((g: Grupo) => g.id);
      setExpandedGroups(idsExpandido);
    } catch (error: any) {
      console.error("Erro ao carregar grupos:", error);
      setError(error.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  async function renameGrupo(id: number, nome: string) {
    if (!user) return;
    try {
      await updateGrupo(id, { nome });
      fetchGrupos();
    } catch (error: any) {
      console.error("Erro ao renomear grupo:", error);
      setError(error.message || "Erro ao renomear grupo");
    }
  }

  async function toggleGrupoExpandido(id: number, expandido: boolean) {
    try {
      await updateGrupo(id, { expandido });
      fetchGrupos();
    } catch (error: any) {
      console.error("Erro ao atualizar estado expandido do grupo:", error);
    }
  }

  async function excluirGrupo(id: number) {
    if (!user) return;
    try {
      await deleteGrupo(id);
      fetchGrupos();
    } catch (error: any) {
      console.error("Erro ao excluir grupo:", error);
      setError(error.message || "Erro ao excluir grupo");
    }
  }

  useEffect(() => {
    if (user) {
      fetchGrupos();
    }
  }, [user]);

  return (
    <GroupContext.Provider
      value={{
        grupos,
        setGrupos,
        fetchGrupos,
        expandedGroups,
        setExpandedGroups,
        loading,
        error,
        renameGrupo,
        excluirGrupo,
        toggleGrupoExpandido,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
}

export function useGroupContext() {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error("useGroup deve ser usado dentro de um GroupProvider");
  }
  return context;
}
