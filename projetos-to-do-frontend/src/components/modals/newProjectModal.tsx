"use client";

import { Modal } from "../ui/modal";
import Button from "../ui/button";
import { useNewProject } from "@/hooks/useNewProject";
import { useEffect } from "react";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  grupoId: number | null;
}

export function NewProjectModal({
  isOpen,
  onClose,
  onSuccess,
  grupoId,
}: NewProjectModalProps) {
  const {
    nome,
    setNome,
    descricao,
    setDescricao,
    loading,
    handleSubmit,
    resetForm,
  } = useNewProject(grupoId, onSuccess, onClose);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Criar Novo Projeto">
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nome do projeto"
          autoFocus
          value={nome}
          maxLength={50}
          onChange={(e) => setNome(e.target.value)}
          className="border border-gray-300 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#051026] transition"
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Enter") handleSubmit();
          }}
        />
        <textarea
          placeholder="Descrição do projeto (Opcional)"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={3}
          maxLength={500}
          className="border border-gray-300 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#051026] transition resize-none"
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Enter") handleSubmit();
          }}
        />
        <Button onClick={handleSubmit} isLoading={loading}>
          Criar Projeto
        </Button>
      </div>
    </Modal>
  );
}
