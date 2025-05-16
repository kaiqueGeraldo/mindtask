"use client";

import { useState, useEffect } from "react";
import {
  atualizarTecnologiasProjeto,
  getAllTechnology,
} from "@/services/technologyService";
import { Tecnologia } from "@/models/tecnologiaModel";

export function useTecnologias() {
  const [loading, setLoading] = useState(false);
  const [tecnologiasDisponiveis, setTecnologiasDisponiveis] = useState<
    Tecnologia[]
  >([]);

  useEffect(() => {
    getAllTechnology()
      .then((res) => setTecnologiasDisponiveis(res?.data))
      .catch((err) => console.error("Erro ao buscar tecnologias:", err));
  }, []);

  const salvarTecnologias = async ({
    projetoId,
    tecnologiaIds,
    onSuccess,
    onClose,
  }: {
    projetoId: number;
    tecnologiaIds: number[];
    onSuccess: () => void;
    onClose: () => void;
  }) => {
    try {
      setLoading(true);
      await atualizarTecnologiasProjeto(projetoId, tecnologiaIds);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao salvar tecnologias:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    tecnologiasDisponiveis,
    salvarTecnologias,
  };
}
