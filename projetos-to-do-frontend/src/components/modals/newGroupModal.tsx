"use client";

import { Modal } from "../ui/modal";
import { useEffect, useState } from "react";
import { createGrupo } from "@/services/groupService";
import { useUser } from "@/hooks/useUser";
import Button from "../ui/button";

interface NewGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function NewGroupModal({
  isOpen,
  onClose,
  onSuccess,
}: NewGroupModalProps) {
  const { user } = useUser();
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setNome("");
    }
  }, [isOpen]);

  async function handleSubmit() {
    if (!nome.trim()) return;

    setLoading(true);
    try {
      await createGrupo(user!.id, nome);
      onSuccess();
      onClose();
      setNome("");
    } catch (error) {
      console.error("Erro ao criar grupo:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Novo Grupo">
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nome do grupo"
          autoFocus
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="border border-gray-300 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#051026] transition"
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Enter") handleSubmit();
          }}
        />

        <Button onClick={handleSubmit} isLoading={loading}>
          Criar Grupo
        </Button>
      </div>
    </Modal>
  );
}
