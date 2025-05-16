"use client"

import { useState } from "react";
import { createProjeto } from "@/services/projectService";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";

export function useNewProject(
  grupoId?: number | null,
  onSuccess?: () => void,
  onClose?: () => void
) {
  const router = useRouter();
  const { user } = useUser();

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!nome.trim()) return;

    setLoading(true);
    try {
      const response = await createProjeto(user!.id, grupoId!, nome, descricao);
      const novoProjetoId = response.data.id;

      resetForm();
      onSuccess!();
      onClose!();
      router.push(`/projeto/${novoProjetoId}`);
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setNome("");
    setDescricao("");
  }

  return {
    nome,
    setNome,
    descricao,
    setDescricao,
    loading,
    resetForm,
    handleSubmit,
  };
}
