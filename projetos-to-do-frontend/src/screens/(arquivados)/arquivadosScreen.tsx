"use client";

import ListaProjetosBase from "@/layouts/listaProjetosBase";
import { useProject } from "@/hooks/useProject";
import { useGroup } from "@/hooks/useGroup";
import { useState } from "react";

export default function ArquivadosScreen() {
  const { projetos, fetchProjetos } = useProject();
  const { fetchGrupos } = useGroup();
  const [busca, setBusca] = useState("");

  const projetosArquivados = projetos.filter(
    (p) => p.status === 3 && p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <ListaProjetosBase
      titulo="Arquivados"
      projetos={projetosArquivados}
      busca={busca}
      setBusca={setBusca}
      fetchProjetos={fetchProjetos}
      fetchGrupos={fetchGrupos}
    />
  );
}
