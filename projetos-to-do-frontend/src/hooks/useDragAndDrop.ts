"use client";

import { useCallback, useRef, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { useGroup } from "@/hooks/useGroup";
import { useProject } from "@/hooks/useProject";
import { updateOrdemGrupos } from "@/services/groupService";
import { updateOrdemProjetos } from "@/services/projectService";
import { Projeto } from "@/models/projetoModel";
import { Grupo } from "@/models/grupoModel";
import { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";

export function useDragAndDrop() {
  const {
    grupos,
    setGrupos,
    expandedGroups,
    toggleGrupoExpandido,
    setExpandedGroups,
  } = useGroup();
  const { projetos, setProjetos, moveProjetoToGrupo } = useProject();

  type ProjetoDragItem = Projeto & { type: "projeto" };
  type GrupoDragItem = Grupo & { type: "grupo" };

  type ActiveDragItem = ProjetoDragItem | GrupoDragItem;

  const [activeItem, setActiveItem] = useState<ActiveDragItem | null>(null);

  const expandTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const openedByHoverRef = useRef<Set<number>>(new Set());

  const toggleExpandGroup = async (grupoId: number) => {
    setExpandedGroups((prev) => {
      const isExpanded = prev.includes(grupoId);
      const novos = isExpanded
        ? prev.filter((id) => id !== grupoId)
        : [...prev, grupoId];

      toggleGrupoExpandido(grupoId, !isExpanded).catch((err) =>
        console.error("Erro ao atualizar estado expandido:", err)
      );

      return novos;
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current;

    if (data?.type === "projeto") {
      setActiveItem({ ...data.projeto, type: "projeto" });
    } else if (data?.type === "grupo") {
      setActiveItem({ ...data.grupo, type: "grupo" });
    } else {
      setActiveItem(null);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!active || !over) return;

    const activeItemData = active.data.current;
    const overItemData = over.data.current;
    if (!activeItemData || !overItemData) return;

    // Abrir grupo com hover
    if (activeItemData.type === "projeto" && overItemData.type === "grupo") {
      const grupoId = overItemData.grupo.id;

      if (expandTimeoutRef.current) {
        clearTimeout(expandTimeoutRef.current);
      }

      expandTimeoutRef.current = setTimeout(() => {
        setExpandedGroups((prev) => {
          if (!prev.includes(grupoId)) {
            openedByHoverRef.current.add(grupoId); // marcar como aberto por hover
            return [...prev, grupoId];
          }
          return prev;
        });
      }, 300);
    }
  };

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || !active) {
        setActiveItem(null);
        return;
      }

      const activeItemData = active.data.current;
      const overItemData = over.data.current;

      if (!activeItemData || !overItemData) {
        setActiveItem(null);
        return;
      }

      // Mover projeto
      if (activeItemData.type === "projeto") {
        const activeProjeto = activeItemData.projeto;

        // 1. Mover para grupo diferente
        if (overItemData.type === "grupo") {
          const newGrupoId = overItemData.grupo.id;
          if (activeProjeto.grupo_id !== newGrupoId) {
            await moveProjetoToGrupo(activeProjeto.id, newGrupoId);
          }
        }

        // 2. Remover de grupo
        if (
          overItemData.type === "sem-grupo" &&
          activeProjeto.grupo_id !== null
        ) {
          await moveProjetoToGrupo(activeProjeto.id, null);
        }

        // 3. Reordenar no mesmo grupo
        if (overItemData.type === "projeto") {
          const overProjeto = overItemData.projeto;
          if (activeProjeto.grupo_id === overProjeto.grupo_id) {
            const grupoId = activeProjeto.grupo_id;
            const projetosDoGrupo = projetos.filter(
              (p) => p.grupo_id === grupoId
            );

            const oldIndex = projetosDoGrupo.findIndex(
              (p) => p.id === activeProjeto.id
            );
            const newIndex = projetosDoGrupo.findIndex(
              (p) => p.id === overProjeto.id
            );

            if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
              const novosProjetosOrdenados = arrayMove(
                projetosDoGrupo,
                oldIndex,
                newIndex
              );
              const novosProjetos = [
                ...projetos.filter((p) => p.grupo_id !== grupoId),
                ...novosProjetosOrdenados,
              ];

              // Atualiza ordem visualmente
              setProjetos(novosProjetos);

              // Atualiza ordem no banco
              await updateOrdemProjetos(
                novosProjetosOrdenados.map((p, index) => ({
                  id: Number(p.id),
                  ordem: index,
                }))
              );
            }
          }
        }
      }

      // Reordenar grupos
      if (activeItemData.type === "grupo" && overItemData.type === "grupo") {
        const oldIndex = grupos.findIndex(
          (g) => g.id === activeItemData.grupo.id
        );
        const newIndex = grupos.findIndex(
          (g) => g.id === overItemData.grupo.id
        );

        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          const novosGrupos = arrayMove(grupos, oldIndex, newIndex);
          setGrupos(novosGrupos);

          await updateOrdemGrupos(
            novosGrupos.map((g, index) => {
              return {
                id: g.id,
                ordem: index,
              };
            })
          );
        }
      }

      // Fechar grupos abertos por hover (exceto o que recebeu o drop)
      const droppedOnGroupId =
        overItemData.type === "grupo"
          ? overItemData.grupo.id
          : overItemData.type === "projeto"
          ? overItemData.projeto.grupo_id
          : null;

      setExpandedGroups((prev) =>
        prev.filter(
          (id) => !openedByHoverRef.current.has(id) || id === droppedOnGroupId
        )
      );

      openedByHoverRef.current.clear();
      if (expandTimeoutRef.current) {
        clearTimeout(expandTimeoutRef.current);
      }

      setActiveItem(null);
    },
    [grupos, projetos, moveProjetoToGrupo, setGrupos, setProjetos]
  );

  return {
    activeItem,
    expandedGroups,
    toggleExpandGroup,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
