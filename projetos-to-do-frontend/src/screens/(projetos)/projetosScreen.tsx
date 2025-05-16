"use client";

import { useEffect, useState } from "react";
import ListaProjetosBase from "@/layouts/listaProjetosBase";
import { useProject } from "@/hooks/useProject";
import { useGroup } from "@/hooks/useGroup";

export default function ProjetosScreen() {
  const { fetchProjetos, projetos } = useProject();
  const { fetchGrupos } = useGroup();

  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<number | null>(null);
  const [projetosFiltrados, setProjetosFiltrados] = useState(projetos);

  useEffect(() => {
    const filtrados = projetos.filter((projeto) => {
      const nomeMatch = projeto.nome
        .toLowerCase()
        .includes(busca.toLowerCase());
      const statusMatch =
        statusFiltro === null || projeto.status === statusFiltro;
      return nomeMatch && statusMatch;
    });
    setProjetosFiltrados(filtrados);
  }, [busca, statusFiltro, projetos]);

  return (
    <ListaProjetosBase
      titulo="Meus Projetos"
      projetos={projetosFiltrados}
      busca={busca}
      mostrarFiltroStatus={true}
      statusFiltro={statusFiltro}
      setStatusFiltro={setStatusFiltro}
      setBusca={setBusca}
      fetchProjetos={fetchProjetos}
      fetchGrupos={fetchGrupos}
    />
  );
}
