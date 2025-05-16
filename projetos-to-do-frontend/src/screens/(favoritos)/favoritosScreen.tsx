"use client";

import ListaProjetosBase from "@/layouts/listaProjetosBase";
import { useProject } from "@/hooks/useProject";
import { useGroup } from "@/hooks/useGroup";
import { useState } from "react";

export default function FavoritosScreen() {
  const { projetos, fetchProjetos } = useProject();
  const { fetchGrupos } = useGroup();
  const [busca, setBusca] = useState("");

  const projetosFavoritos = projetos.filter(
    (p) => p.favorito && p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <ListaProjetosBase
      titulo="Favoritos"
      projetos={projetosFavoritos}
      busca={busca}
      setBusca={setBusca}
      fetchProjetos={fetchProjetos}
      fetchGrupos={fetchGrupos}
    />
  );
}
